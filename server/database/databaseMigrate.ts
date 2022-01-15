import { MongoDatabase } from "./mongo/mongoDatabase.js";
import { RelationalDb } from "./RDBMS/relationaldb.js";


export async function migrateDatabase(): Promise<boolean> {
  const relationalDb = new RelationalDb(); 
  const mongoDb = new MongoDatabase();

  // card types
  console.log("migrating card types");
  const cardTypes = await relationalDb.getCardTypes();

  if (!cardTypes) {
    console.log("Failed to retrieve card types from rdbms");
    return false;
  }

  await mongoDb.insertCardTypes(cardTypes);

  // card games
  console.log("migrating card games");
  const cardGames = await relationalDb.getCardGames();

  if (!cardGames) {
    console.log("Failed to retrieve card types from rdbms");
    return false;
  }

  await mongoDb.insertCardGames(cardGames);

  // review
  console.log("migrating reviews");
  const reviews = await relationalDb.getReviews();
  
  if (!reviews) {
    console.log("Failed to retrieve reviews from rdbms");
    return false;
  }

  await mongoDb.insertReviews(reviews);

  // users
  console.log("migrating users");
  const users = await relationalDb.getUsers();

  if (!users) {
    console.log("Failed to retrieve users from rdbms");
    return false;
  }

  await mongoDb.insertUsers(users);

  return true;
}