<h1 align='center'><a href='https://overextended.github.io/oxmysql/'>Documentation</a></h2>


### Introduction
Oxmysql is an alternative to the unmaintained mysql-async/ghmattimysql resources, utilising [node-mysql2](https://github.com/sidorares/node-mysql2) rather than [mysqljs](https://github.com/mysqljs/mysql).  

There are several incompatibilities in the provided API, meaning we cannot guarantee 100% success when using a "drag-and-drop" mentality.  
Resources can continue utilising `@mysql-async/lib/MySQL.lua` (or use `@oxmysql` instead), allowing functions to be called the same way.  

For more information regarding the use of queries, refer to the documentation linked above.

### v2.0.0
This release aims to clean up internal code and remove redundant function calls that were slowing down query executions. Furthermore, export names have been changed to more accurately describe their usage.  
- lib/MySQL.lua is now the _preferred_ method of interacting with oxmysql
- Removed `fetch` entirely (it was deprecated months ago)
- Renamed `execute` to `query`, as that is the function being utilised in mysql2
- Renamed all standard exports, i.e. `query_callback, scalar_callback`
- Renamed all "sync" exports to accurately describe them, i.e. `query_async, scalar_async`
Since the JS ScRT supports [async_retval](https://github.com/citizenfx/fivem/pull/975/files) there's no longer a need for a Lua "sync wrapper".  

### Features
- Support for URI connection strings and semicolon separated values
- Asynchronous queries utilising mysql2/promises connection pool
- Lua promises provide improved performance for "sync" functions
- Support for placeholder values (named and unnamed) to improve query speed and increase security against SQL injection
- Improved error checking when placeholders and parameters do not match

### Usage
```lua
MySQL.Async.fetchAll('SELECT * from users WHERE identifier = ?', {identifier}), function(result)

end)
CreateThread(function()
    local result = MySQL.Sync.fetchAll('SELECT * from users WHERE identifier = ?', {identifier})
end)
```
```js
exports.oxmysql.query_async('SELECT * from users WHERE identifier = ?', [identifier]).then((result) => {

})
(async() => {
  const result = await exports.oxmysql.query_async('SELECT * from users WHERE identifier = ?', [identifier])
})()
```

### Placeholders
This allows queries to be properly prepared and escaped, as well as improve query times for frequently accessed queries.  
The following lines are equivalent.

```
"SELECT group FROM users WHERE identifier = ?", {identifier}  
"SELECT group FROM users WHERE identifier = :identifier", {identifier = identifier}  
"SELECT group FROM users WHERE identifier = @identifier", {['@identifier'] = identifier}
```  

You can also use the following syntax when you are uncertain about the column to select.

```
"SELECT ?? FROM users WHERE identifier = ?", {column, identifier}  
instead of using  
"SELECT "..column.." FROM users WHERE identifier = ?", {identifier}
```  
