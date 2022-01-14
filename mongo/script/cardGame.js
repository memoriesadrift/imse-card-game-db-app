db = new Mongo().getDB("card-game");

db.createCollection("cardGame", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "cardType", "description"],
      properties: {
        name: {
          bsonType: "string",
          description: "the name of the card game"
        },
        cardType: {
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
        },
        description: {
          bsonType: "string",
          description: "the description of the card game"
        },
        verification: {
          bsonType: "object",
          required: ["comment", "timestamp", "verifiedByAdmin"],
          properties: {
            comment: {
              bsonType: "string",
              description: "verification comment from the admin",
            },
            timestamp: {
              bsonType: "timestamp",
              description: "the creation timestamp of the verification"
            },
            verifiedByAdmin: {
              bsonType: "string",
              description: "the username of the admin who verified this card game"
            }
          }
        }
      }
    }
  }
});