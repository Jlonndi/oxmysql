fx_version 'cerulean'
game 'common'

name 'oxmysql'
description 'Database wrapper for FiveM utilising node-mysql2 offering improved performance and security.'
version '2.0.0'
url 'https://github.com/overextended/oxmysql'
author 'overextended'

dependencies {
	'/server:5053'
}

server_scripts {
	'dist/server/**/*.js',
}

provide 'mysql-async'