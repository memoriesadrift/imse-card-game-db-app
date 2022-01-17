db = new Mongo().getDB("card-game");

db.createCollection("user", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        username: {
          bsonType: "string",
          description: "the username of the user",
          required: true
        },
        passwordHash: {
          bsonType: "string",
          description: "hashed and salted password",
          required: true
        },
        email: {
          bsonType: "string",
          description: "email of the user",
          required: true
        },
        birthday: {
          bsonType: "date",
          description: "the date the user was born",
          required: true
        },
        favorites: {
          bsonType: "array",
          required: true,
          items: {
            bsonType: "objectId",
            description: "the id of the favorited card game"
          }
        },
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

db.user.createIndex({"username":1}, {unique:true});