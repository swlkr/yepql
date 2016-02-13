var mssql = require("mssql");

var database = {
  query(connectionString, query, params, callback) {
    var connection = new mssql.Connection(connectionString, (connectionError) => {
      if(connectionError) {
        mssql.close();
        callback(connectionError, []);
        return;
      }

      var request = new mssql.Request(connection);

      // Attach the input params to the request
      for(var key in params) {
        request.input(key, params[key]);
      }

      request.query(query, (queryError, rows) => {
        callback(queryError, rows || []);
      });
    });

    mssql.on('error', callback);
  }
};

module.exports = database;
