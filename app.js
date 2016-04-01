var fs       = require("fs");
var path     = require("path");
var database = require("./database");

function makeQuery(file) {
  var query = fs.readFileSync(file, "utf8");

  return function(connectionString, parameters) {
    return new Promise((resolve, reject) => {
      database.query(connectionString, query, parameters, (error, rows) => {
        if(error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }

  return func;
}

function makeQueries(dir) {
  var queryArray = fs
  .readdirSync(dir)
  .filter(f => f.endsWith(".sql"))
  .map((filename) => {
    var parts = path.parse(filename);
    return {
      name: parts.name,
      absolutePath: path.join(dir, filename)
    };
  })
  .map((file) => {
    var obj = {};

    obj[file.name] = makeQuery(file.absolutePath);

    return obj;
  });

  return Object.assign.apply(Object, queryArray);
}

module.exports = { makeQuery, makeQueries }
