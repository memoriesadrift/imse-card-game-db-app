import fs, { truncate } from 'fs';
//const mysql = require('mysql2/promise');
import mysql from 'mysql2/promise';
import { ReadableStreamDefaultController } from 'stream/web';
import { fileURLToPath } from 'url';

// establish db connection

const connect = async () => {
  try {
    const con = await mysql.createConnection({
      host: "ise-mysql",
      user: "ise-editor",
      password: "ise-password",
      database: "card-game"
    });
    return con;
  } catch (e: unknown) {
    return undefined;
  }
}

const pickRandomElement = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
}

const truncateDb = async () => {
  const con = await connect();
  if (con == undefined) {
    console.log("Failed to create db connection");
    return;
  }

  console.log("Deleting Rows from tables");

  await con.query("DELETE FROM User");
  await con.query("DELETE FROM Admin");
  await con.query("DELETE FROM CardType");
  await con.query("ALTER TABLE CardType AUTO_INCREMENT=1")
  await con.query("DELETE FROM CardGame");
  await con.query("DELETE FROM VerifiedCardGame");
  await con.query("DELETE FROM Review");
  await con.query("DELETE FROM favorites");
}


export const isDbReady = async () => {
  const con = await connect();
  if (con == undefined) {
    console.log("Failed to create connection to db");
    return false;
  }
  
  try {
    await con.connect();
    console.log("connection successful");
    return true;
  } catch (e: unknown) {
    console.log("connection to db failed");
    return false;
  }
}

const dbInsertion =async () => {
  
  const con = await connect();
  if (con == undefined) {
    console.log("Failed to create db connection");
    return;
  }

  // insert users
  console.log("Inserting users");
  const dataUsers = fs.readFileSync('./data/users.json', 'utf8');
  const users = JSON.parse(dataUsers);

  let usernamesUnusedForAdmin = [];
  for (const user of users) {
    usernamesUnusedForAdmin.push(user["username"]);

    await con.query('INSERT INTO User VALUES (?, ?, ?, ?)', [user["username"], user["password"], user["email"], user["birthday"]]); 
  }
  const usernames = [...usernamesUnusedForAdmin];

  // insert admins
  console.log("Inserting admins")
  const dataAdmin = fs.readFileSync('./data/admins.json', 'utf-8');
  const admins = JSON.parse(dataAdmin);

  let adminUsernames = [];
  for (const admin of admins) {
    const userIdx = Math.floor(Math.random() * usernamesUnusedForAdmin.length);
    const username = usernamesUnusedForAdmin[userIdx];

    usernamesUnusedForAdmin.splice(userIdx, 1); // remove the promoted user to not pick him again
    
    const promotedBy = Math.random() > 0.5 ? pickRandomElement(adminUsernames) : null;
    
    adminUsernames.push(username);

    await con.query('INSERT INTO Admin VALUES (?, ?, ?, ?)', [username, admin["realname"], admin["profiledescription"], promotedBy]);
  }
  
  // insert cardTypes
  console.log("Inserting card types")
  const cardTypeData = fs.readFileSync('./data/cardTypes.json', 'utf-8');
  const cardTypes = JSON.parse(cardTypeData);

  for (const cardType of cardTypes) {
    await con.query('INSERT INTO CardType(Name, WikipediaLink) VALUES (?, ?)', [cardType["name"], cardType["wikipediaLink"]]);
  }

  // insert cardGames
  console.log("Inserting card games");
  const cardGamesData = fs.readFileSync('./data/cardGames.json', 'utf-8');
  const cardGames = JSON.parse(cardGamesData);

  let minID;
  let maxID = 0;
  let first = true;
  for (const cardGame in cardGames) {
    const cardGameRes = await con.query('INSERT INTO CardGame(Name, Description, CardTypeID) VALUES (?, ?, ?)', [cardGames[cardGame]["name"], cardGames[cardGame]["description"], cardGames[cardGame]["cardType"]]);
    if (first) {
      minID = (cardGameRes as mysql.RowDataPacket[])[0].insertId;
      maxID = minID - 1;
      first = false;
    }

    maxID += 1;
  }

  // insert verifiedCardGames
  console.log("Inserting verified card games");
  const verifiedCardGamesData = fs.readFileSync('./data/verifiedCardGames.json', 'utf-8');
  const verifiedCardGames = JSON.parse(verifiedCardGamesData);

  let usedCardGameIDs: number[] = []
  for (const verifiedCardGame of verifiedCardGames) {
    let cardGameID;
    do {
      cardGameID = Math.floor(Math.random() * (maxID - minID) + minID);
    } while (usedCardGameIDs.includes(cardGameID));
    usedCardGameIDs.push(cardGameID);

    const verifiedBy = pickRandomElement(adminUsernames);
    await con.query('INSERT INTO VerifiedCardGame(ID, Comment, VerifiedBy) VALUES (?, ?, ?)', [cardGameID, verifiedCardGame["comment"], verifiedBy]);
  }

  // insert reviews
  console.log("Inserting reviews");
  const reviewsData = fs.readFileSync('./data/reviews.json', 'utf-8');
  const reviews = JSON.parse(reviewsData);

  for (const review of reviews) {
    const cardGameID = pickRandomElement(usedCardGameIDs);
    const username = pickRandomElement(usernames);

    await con.query('INSERT INTO Review(CardGameID, LeftBy, ReviewText, Rating) VALUES (?, ?, ?, ?)', [cardGameID, username, review['reviewText'], review['rating']]);
  }

  // insert favorites
  console.log("Inserting favorites");
  const FAVORITES_COUNT = 500;

  for (let i = 0; i < FAVORITES_COUNT; ++i) {
    const username = pickRandomElement(usernames);
    const cardGameID = Math.floor(Math.random() * (maxID - minID) + minID);

    try {
      await con.query('INSERT INTO favorites VALUES (?, ?)', [username, cardGameID]);
    } catch (e: unknown) {
      --i; // repeat the for loop iteration if insertion failed (= pair already inserted)
    }
  }

  console.log("Finnished inserting");
}

export const populateDb = async () => {
  await truncateDb();

  try {
    await dbInsertion();
  } catch (e: unknown) {
    console.log("Encountered error when inserting data: ");
    console.log(e);
    await truncateDb();
    return false;
  }

  return true;
}
