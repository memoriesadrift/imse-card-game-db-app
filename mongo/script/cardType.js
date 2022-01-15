db = new Mongo().getDB("card-game");

db.createCollection("cardType", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "wikipediaLink"],
      properties: {
        name: {
          bsonType: "string",
          description: "the name of the card type"
        },
        wikipediaLink: {
          bsonType: "string",
          description: "the link to the wikipedia articel of the specific card type"
        }
      }
    }
  }
});