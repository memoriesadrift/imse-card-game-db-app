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

  let usernames = [];
  for (const user of users) {
    usernames.push(user["username"]);

    con.query('INSERT INTO User VALUES (?, ?, ?, ?)', [user["username"], user["password"], user["email"], user["birthday"]]);
  }

  // insert admins
  const dataAdmin = fs.readFileSync('./data/admins.json', 'utf-8');
  const admins = JSON.parse(dataAdmin);

  let adminUsernames = [];
  for (const admin of admins) {
    const userIdx = Math.floor(Math.random() * usernames.length);
    const username = usernames[userIdx];

    usernames.splice(userIdx, 1); // remove the promoted user to not pick him again
    
    const promotedBy = Math.random() > 0.5 ? adminUsernames[Math.floor(Math.random() * adminUsernames.length)] : null;
    
    adminUsernames.push(username);

    con.query('INSERT INTO Admin VALUES (?, ?, ?, ?)', [username, admin["realname"], admin["profiledescription"], promotedBy]);
  }
  
  // insert cardTypes
  const cardTypeData = fs.readFileSync('./data/cardTypes.json', 'utf-8');
  const cardTypes = JSON.parse(cardTypeData);

  for (const cardType of cardTypes) {
    con.query('INSERT INTO CardType(Name, WikipediaLink) VALUES (?, ?)', [cardType["name"], cardType["wikipediaLink"]]);
  }

  // insert caredGames
  const cardGamesData = fs.readFileSync('./data/cardGames.json', 'utf-8');
  const cardGames = JSON.parse(cardGamesData);

  // assume MAX ID will be the highest current inserted => +1 = start ID of the inserted
  
  //HELP :(
  const maxIDQuery = await con.execute('SELECT MAX(ID) AS max_id FROM CardGame');
  console.log(maxIDQuery);
  console.log("-----------");
  console.log(maxIDQuery[0]);
  console.log("-----------");
  console.log(maxIDQuery[1]);
  //const test = maxIDQuery[1].;

  /*
  const minID = maxIDQuery == null ? 1;

  console.log(minID);
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaa");

  let maxID = minID - 1;
  for (const cardGame in cardGames) {
    con.query('INSERT INTO CardGame(Name, Description, CardTypeID) VALUES (?, ?, ?)', [cardGames[cardGame]["name"], cardGames[cardGame]["description"], cardGames[cardGame]["cardType"]]);
    maxID += 1;
  }

  console.log(minID);
  console.log(maxID);

  // for whatever reason this does not work.
  // const maxID = minID + cardGames.length();

  // insert verifiedCardGames
  // TODO: THIS DOES NOT WORK! THE MINID QUERIED FROM THE PREVIOUS STATEMENT IS IN AN ASSYNC STATEMENT SO IT IS NOT SET YET
  // I DONT KNOW HOW TO SOLVE THIS YET. THE QUERY STATEMENT MAY BE WRONG AS WELL
  /*
  const verifiedCardGamesData = fs.readFileSync('./data/verifiedCardGames.json', 'utf-8');
  const verifiedCardGames = JSON.parse(verifiedCardGamesData);

  let usedCardGameIDs = []
  for (const verifiedCardGame in verifiedCardGames) {
    let cardGameID;
    do {
      cardGameID = Math.floor(Math.random() * (maxID - minID) + minID);
      //console.log(cardGameID);
    } while (usedCardGameIDs.includes(cardGameID));
    usedCardGameIDs.push(cardGameID);

    const verifiedBy = adminUsernames[Math.floor(Math.random() * adminUsernames.length)];
    con.query('INSERT INTO VerifiedCardGame(ID, Description, VerifiedBy) VALUES (?, ?, ?)', [cardGameID, verifiedCardGames[verifiedCardGame]["description"], ])
  }
  */

}
