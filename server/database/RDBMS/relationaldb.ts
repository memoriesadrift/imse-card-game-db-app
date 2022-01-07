const mysql = require('mysql2');
const fs = require('fs');

// establish db connection
const con = mysql.createConnection({
  host: "ise-mysql",
  user: "ise-editor",
  password: "ise-password",
  database: "card-game"
});


exports.isDbReady = function() {
  let success;
  con.connect(function(err) {
    if (err) {     
      success = false;
      return false;
    }
    success = true;
    return true;
  });
  
  return success;
}

exports.populateDb = function() {
  // insert users
  let usernames = [];

  const dataUsers = fs.readFileSync('./data/users.json', 'utf8');

  const users = JSON.parse(dataUsers);

  for (const user in users) {
    usernames.push(users[user]["username"]);
    console.log(users[user]["username"]);

    // use the ? notation to escape the values. Prevents sql injection.
    con.query('INSERT INTO User VALUES (?, ?, ?, ?)', [users[user]["username"], users[user]["password"], users[user]["email"], users[user]["birthday"]]);
  }

  // insert admins
  const dataAdmin = fs.readFileSync('./data/admins.json', 'utf-8');

  const admins = JSON.parse(dataAdmin);
  let adminUsernames = [];
  for (const admin in admins) {
    const userIdx = Math.floor(Math.random() * usernames.length);
    const username = usernames[userIdx];
    usernames.splice(userIdx, 1);
    
    const promotedBy = Math.random() > 0.5 ? adminUsernames[Math.floor(Math.random() * adminUsernames.length)] : null;
    adminUsernames.push(username);

    con.query('INSERT INTO Admin VALUES (?, ?, ?, ?)', [username, admins[admin]["realname"], admins[admin]["profiledescription"], promotedBy]);
  }
  
  // insert cardTypes
  const cardTypeData = fs.readFileSync('./data/cardTypes.json', 'utf-8');
  const cardTypes = JSON.parse(cardTypeData);

  for (const cardType in cardTypes) {
    con.query('INSERT INTO CardType(Name, WikipediaLink) VALUES (?, ?)', [cardTypes[cardType]["name"], cardTypes[cardType]["wikipediaLink"]]);
  }

  // insert caredGames
  const cardGamesData = fs.readFileSync('./data/cardGames.json', 'utf-8');
  const cardGames = JSON.parse(cardGamesData);

  // assume MAX ID will be the highest current inserted => +1 = start ID of the inserted
  let minID;
  con.query('SELECT MAX(ID) FROM CardGame', (err, res) => {
    if (err) {
      console.log(err);
      return;
    }

    if (res == null) {
      minID = 1;
      return;
    }
    minID = res + 1;
  });

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