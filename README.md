# yepql - Javascript & SQL rethought

Yepql is a javascript library for _using_ SQL.

It is __heavily__ inspired by [yesql](https://github.com/krisajenkins/yesql)

## Install

```bash
$ npm i -S yepql
```

## Driver

You'll need a database driver

|Database|`npm install --save` package|
|---|---|
|PostgreSQL|pg|
|SQL Server|mssql|


## Use
```sql
-- get-users-by-id.sql

select *
from Users
where Users.ID = @ID
```

```javascript
// db.js
var mssql = require("mssql");
var yepql = require("yepql")(mssql);

var getUsersByID = yepql.makeQuery("./get-users-by-id.sql");

module.exports = { getUsersByID };
```

```javascript
// env.js
module.exports = {
  connectionString: process.env.CONNECTION_STRING || "Server=localhost,1433;Database=database;User Id=username;Password=password;Encrypt=true";
}
```

```javascript
var db = require("./db");
var env = require("./env");

db
.getUsersByID(env.connectionString, { ID: 1 })
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
