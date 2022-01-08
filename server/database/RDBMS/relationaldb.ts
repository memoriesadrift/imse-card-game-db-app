import fs from 'fs';
//const mysql = require('mysql2/promise');
import mysql from 'mysql2/promise';

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
    console.log("oh istenem");
    return undefined;
  }
}

const pickRandomElement = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const isDbReady = async () => {
  const con = await connect();
  if (con == undefined) {
    console.log("Failed to create connection to db");
    return false;
  }
  
  console.log("moment of truth");
  try {
    await con.connect();
    console.log("connection successful");
    return true;
  } catch (e: unknown) {
    console.log("connection to db failed");
    return false;
  }
}

export const populateDb = async () => {

  const con = await connect();
  if (con == undefined) {
    console.log("Failed to create db connection");
    return;
  }

  // insert users
  const dataUsers = fs.readFileSync('./data/users.json', 'utf8');
  const users = JSON.parse(dataUsers);

  let usernamesUnusedForAdmin = [];
  for (const user of users) {
    usernamesUnusedForAdmin.push(user["username"]);

    con.query('INSERT INTO User VALUES (?, ?, ?, ?)', [user["username"], user["password"], user["email"], user["birthday"]]);
  }
  const usernames = [...usernamesUnusedForAdmin];

  // insert admins
  const dataAdmin = fs.readFileSync('./data/admins.json', 'utf-8');
  const admins = JSON.parse(dataAdmin);

  let adminUsernames = [];
  for (const admin of admins) {
    const userIdx = Math.floor(Math.random() * usernamesUnusedForAdmin.length);
    const username = usernamesUnusedForAdmin[userIdx];

    usernamesUnusedForAdmin.splice(userIdx, 1); // remove the promoted user to not pick him again
    
    const promotedBy = Math.random() > 0.5 ? pickRandomElement(adminUsernames) : null;
    
    adminUsernames.push(username);

    con.query('INSERT INTO Admin VALUES (?, ?, ?, ?)', [username, admin["realname"], admin["profiledescription"], promotedBy]);
  }
  
  // insert cardTypes
  const cardTypeData = fs.readFileSync('./data/cardTypes.json', 'utf-8');
  const cardTypes = JSON.parse(cardTypeData);

  for (const cardType of cardTypes) {
    con.query('INSERT INTO CardType(Name, WikipediaLink) VALUES (?, ?)', [cardType["name"], cardType["wikipediaLink"]]);
  }

  // insert cardGames
  const cardGamesData = fs.readFileSync('./data/cardGames.json', 'utf-8');
  const cardGames = JSON.parse(cardGamesData);

  // assume MAX ID will be the highest current inserted => +1 = start ID of the inserted
  
  const maxIDQuery = await con.execute('SELECT MAX(ID) AS max_id FROM CardGame');
  const {maxIDQueryResult} = (maxIDQuery[0] as mysql.RowDataPacket[])[0];
  const minID = maxIDQueryResult || 1;

  let maxID = minID - 1;
  for (const cardGame in cardGames) {
    con.query('INSERT INTO CardGame(Name, Description, CardTypeID) VALUES (?, ?, ?)', [cardGames[cardGame]["name"], cardGames[cardGame]["description"], cardGames[cardGame]["cardType"]]);
    maxID += 1;
  }

  // insert verifiedCardGames
  const verifiedCardGamesData = fs.readFileSync('./data/verifiedCardGames.json', 'utf-8');
  const verifiedCardGames = JSON.parse(verifiedCardGamesData);

  let usedCardGameIDs: number[] = []
  for (const verifiedCardGame of verifiedCardGames) {
    let cardGameID;
    do {
      cardGameID = Math.floor(Math.random() * (maxID - minID) + minID);
      //console.log(cardGameID);
    } while (usedCardGameIDs.includes(cardGameID));
    usedCardGameIDs.push(cardGameID);

    const verifiedBy = pickRandomElement(adminUsernames);
    con.query('INSERT INTO VerifiedCardGame(ID, Comment, VerifiedBy) VALUES (?, ?, ?)', [cardGameID, verifiedCardGame["comment"], verifiedBy]);
  }

  // insert reviews
  const reviewsData = fs.readFileSync('./data/reviews.json', 'utf-8');
  const reviews = JSON.parse(reviewsData);

  for (const review of reviews) {
    const cardGameID = pickRandomElement(usedCardGameIDs);
    const username = pickRandomElement(usernames);

    con.query('INSERT INTO Review(CardGameID, LeftBy, ReviewText, Rating) VALUES (?, ?, ?, ?)', [cardGameID, username, review['reviewText'], review['rating']]);
  }

  // insert favorites
  const FAVORITES_COUNT = 500;

  for (let i = 0; i < FAVORITES_COUNT; ++i) {
    const username = pickRandomElement(usernames);
    const cardGameID = Math.floor(Math.random() * (maxID - minID) + minID);

    try {
      con.query('INSERT INTO favorites VALUES (?, ?)', [username, cardGameID]);
    } catch (e: unknown) {
      --i; // repeat the for loop iteration if insertion failed (= pair already inserted)
    }
  }
}
