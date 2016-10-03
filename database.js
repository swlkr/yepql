function deriveDatabase(driver) {
  if(!driver) {
    return null;
  }

  var keys = Object.keys(driver);

  // Figure out a better way to determine which
  // database is being called
  if(keys.indexOf("DRIVERS") !== -1) {
    return "mssql";
  }

  return "pg";
}

function mssqlQuery(mssql, connectionString, query, params, callback) {
  var connection = new mssql.Connection(connectionString, (error) => {
    if(error) {
      connection.close();
      callback(error, []);
      return;
    }

    var request = new mssql.Request(connection);

    // Attach the input params to the request
    for(var key in params) {
      var value = params[key];

      // TODO Move query prep to separate pure function
      if(Array.isArray(value)) {
        for(var i = 0; i !== value.length; i++) {
          request.input(key + i, value[i]);
        }

        var newKey = value.map((v, i) => "@" + key + i).join(",");
        query = query.replace("@" + key, newKey);
      } else {
        request.input(key, value);
      }
    }

    request.query(query, (queryError, rows) => {
      callback(queryError, rows || []);
      connection.close();
    });
  });

  mssql.on("error", callback);
}

function pgQuery(pg, connectionString, query, params, callback) {
  pg.connect(connectionString, function(error, client, done) {
    if(error) {
      callback(error);
      return;
    }

    client.query(query, params, function(queryError, result) {
      done();

      if(queryError) {
        callback(queryError, []);
        return;
      }

      callback(null, result.rows || []);
    });
  });
}

module.exports = {
  query(driver, connectionString, query, params, callback) {
    var db = deriveDatabase(driver);

    switch(db) {
      case "mssql":
        mssqlQuery(driver, connectionString, query, params, callback);
        break;
      case "pg":
        pgQuery(driver, connectionString, query, params, callback);
        break;
      default:
        callback("Sorry, but your driver couldn't be determined from your connection string.");
        break;
    }
  }
};
