const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

const options = {
  ssl: true,
  tls: true,
};

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://<yourDBUser>:<password>@cluster0.ajqdph4.mongodb.net/?retryWrites=true&w=majority", // MongoDB URI
    options
  )
    .then((client) => {
      console.log("database connected.....!!!!!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  } else {
    throw "No Database found";
  }
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
