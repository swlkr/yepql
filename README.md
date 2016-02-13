# yepql - Javascript & SQL Server rethought

Yepql is a javascript library for _using_ TSQL.

It is __heavily__ inspired by [yesql](https://github.com/krisajenkins/yesql)

## Dependencies

- [mssql](https://github.com/patriksimek/node-mssql)

## Install

```bash
$ npm i -S yepql
```

## Use
```sql
-- get-users-by-id.sql

select *
from Users
where Users.ID = @ID
```

```javascript
// db.js
var yepql = require("yepql");

var getUsersByID = yepql.makeQuery("./get-users-by-id.sql");

module.exports = { getUsersByID };
```

```javascript
// config.js
var config = {};

config.connectionString = process.env.CONNECTION_STRING ||  "Server=localhost,1433;Database=database;User Id=username;Password=password;Encrypt=true";

module.exports = config;
```

```javascript
var db = require("./db");
var config = require("./config");

db
.getUsersByID(config.connectionString, { ID: 1 })
.then((rows) => {
  /*
    rows === [{
      ID: 1,
      Username: 'username',
      Email: 'email@example.com',
      ...
    }]
  */
})
.catch(/* handle error */)
```

## Have a lot of sql files?
```sql
-- sql/getUsersByID.sql

select *
from Users
where Users.ID = @ID
```

```sql
-- sql/getUsersByEmail.sql

select *
from Users
where Users.Email = @Email
```

```javascript
// db.js
var yepql = require("yepql");

var queries = yepql.makeQueries("./sql");

/*
  queries === {
    getUsersByID: function(connectionString, params),
    getUsersByEmail: function(connectionString, params)
  }
*/

module.exports = queries;
```
