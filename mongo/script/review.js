db = new Mongo().getDB("card-game");

db.createCollection("review", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        cardGameID: { bsonType: "objectId", required: true },
        leftBy: {bsonType: "string", required: true },
        reviewText: { bsonType: "string", required: true },
        rating: { bsonType: "number", required: true },
        creationTimestamp: { bsonType: "timestamp", required: true }
      }
    }
  }
});

db.createIndex({"cardGameID": 1})