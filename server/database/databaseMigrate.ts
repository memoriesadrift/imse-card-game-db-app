import { MongoDatabase } from "./mongo/mongoDatabase.js";
import { RelationalDb } from "./RDBMS/relationaldb.js";


export async function migrateDatabase(): Promise<boolean> {
  const relationalDb = new RelationalDb(); 
  const mongoDb = new MongoDatabase();

  // card types
  const cardTypes = await relationalDb.getCardTypes();

  if (!cardTypes) {
    console.log("Failed to retrieve card types from rdbms");
    return false;
  }

  await mongoDb.insertCardTypes(cardTypes);

  // review
  const reviews = await relationalDb.getReviews();
  
  if (!reviews) {
    console.log("Failed to retrieve reviews from rdbms");
    return false;
  }

  await mongoDb.insertReviews(reviews);

  // users
  const users = await relationalDb.getUsers();

  if (!users) {
    console.log("Failed to retrieve users from rdbms");
    return false;
  }

  await mongoDb.insertUsers(users);

  return true;
}