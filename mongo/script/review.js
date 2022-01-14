db = new Mongo().getDB("card-game");

db.createCollection("review", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["cardGameID", "leftBy", "reviewText", "rating", "creatinTimestamp"],
      properties: {
        cardGameID: { bsonType: "objectId" },
        leftBy: {bsonType: "string" },
        reviewText: { bsonType: "string" },
        rating: { bsonType: "number" },
        creationTimestamp: { bsonType: "timestamp" }
      }
    }
  }
});