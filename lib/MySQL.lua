local Store = {}

local function safeArgs(query, parameters, cb, transaction)
	if type(query) == 'number' then query = Store[query] end
	if transaction then
		assert(type(query) == 'table', ('A table was expected for the transaction, but instead received %s'):format(query))
	else
		assert(type(query) == 'string', ('A string was expected for the query, but instead received %s'):format(query))
	end
	if cb then
		assert(type(cb) == 'function', ('A callback function was expected, but instead received %s'):format(cb))
	end
	local type = parameters and type(parameters)
	if type and type ~= 'table' and type ~= 'function' then
		assert(nil, ('A %s was expected, but instead received %s'):format(cb and 'table' or 'function', parameters))
	end
	return query, parameters, cb
end

local promise = promise
local oxmysql = exports.oxmysql
local GetCurrentResourceName = GetCurrentResourceName()
local Citizen_Await = Citizen.Await

local function Await(fn, query, parameters)
	local p = promise.new()
	oxmysql[fn](nil, query, parameters, function(result)
		p:resolve(result)
	end, GetCurrentResourceName)
	return Citizen_Await(p)
end

local MySQL = {}
--- Results will be returned to a callback function without halting the execution of the current thread.
MySQL.Async = {}
--- The current thread will yield until the query has resolved, returning results to a variable.
MySQL.Sync = {}

---@param query string
---@param cb? function
---@return number result
--- returns the id used to reference a stored query string
function MySQL.Async.store(query, cb)
	assert(type(query) == 'string', 'The SQL Query must be a string')
	local store = #Store+1
	Store[store] = query
	cb(store)
end

---@param query string
---@return number result
--- returns the id used to reference a stored query string
function MySQL.Sync.store(query)
	assert(type(query) == 'string', 'The SQL Query must be a string')
	local store = #Store+1
	Store[store] = query
	return store
end

---@param query string
---@param parameters? table|function
---@param cb? function
---@return number result
--- returns number of affected rows
function MySQL.Async.execute(query, parameters, cb)
	query, parameters, cb = safeArgs(query, parameters, cb)
	oxmysql:update(query, parameters, cb, GetCurrentResourceName)
end

---@param query string
---@param parameters? table
---@return number result
--- returns number of affected rows
function MySQL.Sync.execute(query, parameters)
	return Await('update', safeArgs(query, parameters))
end

---@param query string
---@param parameters? table|function
---@param cb? function
---@return table result
--- returns array of matching rows or result data
function MySQL.Async.fetchAll(query, parameters, cb)
	query, parameters, cb = safeArgs(query, parameters, cb)
	oxmysql:execute(query, parameters, cb, GetCurrentResourceName)
end

---@param query string
---@param parameters? table
---@return table result
--- returns array of matching rows or result data
function MySQL.Sync.fetchAll(query, parameters)
	return Await('execute', safeArgs(query, parameters))
end

---@param query string
---@param parameters? table|function
---@param cb? function
---@return any result
--- returns value of the first column of a single row
function MySQL.Async.fetchScalar(query, parameters, cb)
	query, parameters, cb = safeArgs(query, parameters, cb)
	oxmysql:scalar(query, parameters, cb, GetCurrentResourceName)
end

---@param query string
---@param parameters? table
---@return any result
--- returns value of the first column of a single row
function MySQL.Sync.fetchScalar(query, parameters)
	return Await('scalar', safeArgs(query, parameters))
end

---@param query string
---@param parameters? table|function
---@param cb? function
---@return table result
--- returns table containing key value pairs
function MySQL.Async.fetchSingle(query, parameters, cb)
	query, parameters, cb = safeArgs(query, parameters, cb)
	oxmysql:single(query, parameters, cb, GetCurrentResourceName)
end

---@param query string
---@param parameters? table
---@return table result
--- returns table containing key value pairs
function MySQL.Sync.fetchSingle(query, parameters)
	return Await('single', safeArgs(query, parameters))
end

---@param query string
---@param parameters? table|function
---@param cb? function
---@return number result
--- returns the insert id of the executed query
function MySQL.Async.insert(query, parameters, cb)
	query, parameters, cb = safeArgs(query, parameters, cb)
	oxmysql:insert(query, parameters, cb, GetCurrentResourceName)
end

---@param query string
---@param parameters? table
---@return number result
--- returns the insert id of the executed query
function MySQL.Sync.insert(query, parameters)
	return Await('insert', safeArgs(query, parameters))
end

---@param queries table
---@param parameters? table|function
---@param cb? function
---@return boolean result
--- returns true when the transaction has succeeded
function MySQL.Async.transaction(queries, parameters, cb)
	queries, parameters, cb = safeArgs(queries, parameters, cb, true)
	oxmysql:transaction(queries, parameters, cb, GetCurrentResourceName)
end

---@param queries table
---@param parameters? table
---@return boolean result
--- returns true when the transaction has succeeded
function MySQL.Sync.transaction(queries, parameters)	
	return Await('transaction', safeArgs(queries, parameters, false, true))
end

---@param query string
---@param parameters table|function
---@param cb? function
---@return any result
--- Utilises a separate function to execute queries more efficiently. The return type will differ based on the query submitted.  
--- Parameters must be provided as an array of tables, ie.  
--- ```lua
--- MySQL.Async.prepare('SELECT * FROM users WHERE lastname = ?', {{'Dunak'}, {'Linden'}, {'Luke'}})
--- ````
--- When selecting a single row the result will match fetchSingle, or a single column will match fetchScalar.
function MySQL.Async.prepare(query, parameters, cb)
	oxmysql:prepare(query, parameters, cb, GetCurrentResourceName)
end

---@param query string
---@param parameters table|function
---@return any result
--- Utilises a separate function to execute queries more efficiently. The return type will differ based on the query submitted.  
--- Parameters must be provided as an array of tables, ie.  
--- ```lua
--- MySQL.Sync.prepare('SELECT * FROM users WHERE lastname = ?', {{'Dunak'}, {'Linden'}, {'Luke'}})
--- ````
--- When selecting a single row the result will match fetchSingle, or a single column will match fetchScalar.
function MySQL.Sync.prepare(query, parameters)
	return Await('prepare', safeArgs(query, parameters))
end

function MySQL.ready(cb)
	CreateThread(function()
		repeat
			Wait(50)
		until GetResourceState('oxmysql') == 'started'
		cb()
	end)
end

_ENV.MySQL = MySQL
