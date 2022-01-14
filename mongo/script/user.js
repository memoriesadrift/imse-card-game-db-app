db = new Mongo().getDB("card-game");

db.createCollection("user", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "passwordHash", "email", "birhtday", "favorites", /*"latestReviews"*/],
      properties: {
        _id: {
          bsonType: "string",
          description: "the username of the user"
        },
        passwordHash: {
          bsonType: "string",
          description: "hashed and salted password"
        },
        email: {
          bsonType: "string",
          description: "email of the user"
        },
        birthday: {
          bsonType: "date",
          description: "the date the user was born"
        },
        favorites: {
          bsonType: "array",
          items: {
            bsonType: "objectId",
            description: "the id of the favorited card game"
          }
        }/*,
        latestReviews: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["cardGameID", "reviewText", "rating", "creatinTimestamp"],
            properties: {
              cardGameID: { bsonType: "objectId" },
              reviewText: { bsonType: "string" },
              rating: { bsonType: "number" },
              creationTimestamp: { bsonType: "timestamp" }
            }
          }
        }*/,
        admin: {
          bsonType: "objectId",
          required: ["realName", "profileDescription"],
          properties: {
            realName: {
              bsonType: "string",
              description: "the real name of the admin"
            },
            profileDescription: {
              bsonType: "string",
              description: "a short description of the profile"
            },
            promotedBy: {
              bsonType: "string",
              description: "the username of the admin who promoted this admin"
            }
          }
        }
      }
    }
  }
});