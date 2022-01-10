import { Console } from 'console';
import fs, { truncate } from 'fs';
import mysql from 'mysql2/promise';
import { CardGame, Review, CardType, Verification } from '../../types';
import { IDatabase } from '../IDatabase'

export class RelationalDb implements IDatabase {
  
  private HOST = "ise-mysql";
  private USER = "ise-editor";
  private PASSWORD = "ise-password";
  private DATABASE = "card-game";


  private pool: mysql.Pool | undefined = undefined;
  /**
   * Establishes a connection with the database.
   * @returns the connection object or undefined if failed to connect
   */
  private connect = async () => {
    if (this.pool) {
      return this.pool;
    }

    try {
      this.pool = await mysql.createPool({
        host: this.HOST,
        user: this.USER,
        password: this.PASSWORD,
        database: this.DATABASE
      });
      return this.pool;
    } catch (e: unknown) {
      return undefined;
    }
  }
  
  private pickRandomElement = (arr: any[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
  }


  /**
   * Deletes all data, from all rows of the databse.
   * @returns void
   */
  private resetDb = async () => {
    const con = await this.connect();
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


  /**
   * Uses the files in tha ./data folder to populate the database. This operation may take a while to execute.
   * @returns void
   */
  private insertDataIntoDb = async () => {
  
    const con = await this.connect();
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
      
      const promotedBy = Math.random() > 0.5 ? this.pickRandomElement(adminUsernames) : null;
      
      adminUsernames.push(username);
  
      await con.query('INSERT INTO Admin VALUES (?, ?, ?, ?)', [username, admin["realname"], admin["profiledescription"], promotedBy]);
    }
    
    // insert cardTypes
    console.log("Inserting card types")
    const cardTypeData = fs.readFileSync('./data/cardTypes.json', 'utf-8');
    const cardTypes = JSON.parse(cardTypeData);
  
    let cardTypeId:{ [key: string]: number } = {};
    for (const cardType of cardTypes) {
      const cardTypeRes = await con.query('INSERT INTO CardType(Name, WikipediaLink) VALUES (?, ?)', [cardType["name"], cardType["wikipediaLink"]]);
      cardTypeId[cardType["name"]] = (cardTypeRes as mysql.RowDataPacket[])[0].insertId
    }
  
    // insert cardGames
    console.log("Inserting card games");
    const cardGamesData = fs.readFileSync('./data/cardGames.json', 'utf-8');
    const cardGames = JSON.parse(cardGamesData);
    const cardGameDescriptionsData = fs.readFileSync('./data/cardGameDescriptions.json', 'utf-8');
    const cardGameDescriptions = JSON.parse(cardGameDescriptionsData);
  
    let minID;
    let maxID = 0;
    let first = true;
    for (const cardGameIdx in cardGames) {
      const myCardTypeId = cardTypeId[cardGames[cardGameIdx]["cardType"][0]];
  
      const cardGameRes = await con.query('INSERT INTO CardGame(Name, Description, CardTypeID) VALUES (?, ?, ?)', [cardGames[cardGameIdx]["cardGame"],
          cardGameDescriptions[cardGameIdx]["description"], myCardTypeId]);
  
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
  
      const verifiedBy = this.pickRandomElement(adminUsernames);
      await con.query('INSERT INTO VerifiedCardGame(ID, Comment, VerifiedBy) VALUES (?, ?, ?)', [cardGameID, verifiedCardGame["comment"], verifiedBy]);
    }
  
    // insert reviews
    console.log("Inserting reviews");
    const reviewsData = fs.readFileSync('./data/reviews.json', 'utf-8');
    const reviews = JSON.parse(reviewsData);
  
    for (const review of reviews) {
      const cardGameID = this.pickRandomElement(usedCardGameIDs);
      const username = this.pickRandomElement(usernames);
  
      await con.query('INSERT INTO Review(CardGameID, LeftBy, ReviewText, Rating) VALUES (?, ?, ?, ?)', [cardGameID, username, review['reviewText'], review['rating']]);
    }
  
    // insert favorites
    console.log("Inserting favorites");
    const FAVORITES_COUNT = 500;
  
    for (let i = 0; i < FAVORITES_COUNT; ++i) {
      const username = this.pickRandomElement(usernames);
      const cardGameID = Math.floor(Math.random() * (maxID - minID) + minID);
  
      try {
        await con.query('INSERT INTO favorites VALUES (?, ?)', [username, cardGameID]);
      } catch (e: unknown) {
        --i; // repeat the for loop iteration if insertion failed (= pair already inserted)
      }
    }
  
    console.log("Finnished inserting");
  }
  
  /**
   * Used to query whether a connection the Db can be established or not
   * @returns true if a connection to a Db is possible, false if not
   */
  isDBReady = async () => {
    const pool = await this.connect();
    if (pool == undefined) {
      console.log("Failed to create connection to db");
      return false;
    }
    
    try {
      const con = await pool.getConnection();
      await con.connect();
      console.log("connection successful");
      con.destroy();
      return true;
    } catch (e: unknown) {
      console.log("connection to db failed");
      return false;
    }
  }
  
  /**
   * Resets the Db and populates it with sample data.
   * If an error occurs during the insertion, the database is emptied again.
   * @returns void
   */
  async populateDB() {
    await this.resetDb();

    try {
      await this.insertDataIntoDb();
    } catch (e: unknown) {
      console.log("Encountered error when inserting data: ");
      console.log(e);
      await this.resetDb();
      return false;
    }
  
    return true;
  }

  async getCardGames(): Promise<CardGame[] | undefined>  {
    const con = await this.connect();
    if (!con) {
      console.log("Error retrieving connection!");
      return undefined;
    }

    const cardGamesRes = await con.query(`SELECT CardGame.ID AS CardGameID,
     CardGame.Name AS CardGameName,
     Description, CardTypeID,
     CardType.ID AS CardTypeID,
     CardType.Name AS CardTypeName,
     VerifiedCardGame.ID AS VerifiedCardGameID,
     Comment, CreationTimestamp, VerifiedBy,
     WikipediaLink FROM CardGame LEFT JOIN CardType ON CardGame.CardTypeID = CardType.ID
     LEFT JOIN VerifiedCardGame ON CardGame.ID = VerifiedCardGame.ID`);

    const cardGames = (cardGamesRes[0] as mysql.RowDataPacket[]);

    let cardGameObjs: CardGame[] = [];
    for (const cardGame of cardGames) {
      let cardGameObj:CardGame = {} as CardGame;
      cardGameObj.id = cardGame.CardGameID;
      cardGameObj.name = cardGame.CardGameName;
      cardGameObj.description = cardGame.Description;
      cardGameObj.cardType = {
        id: cardGame.CardTypeID,
        name: cardGame.CardTypeName,
        wikipediaLink: cardGame.WikipediaLink
      };

      const reviewsRes = await con.query('SELECT * FROM Review WHERE CardGameID = ?', [cardGame.CardGameID]);
      const reviews = (reviewsRes[0] as mysql.RowDataPacket[]);
      
      cardGameObj.reviews = reviews.map((review):Review => {
        return {
          id: review.ID, 
          text: review.ReviewText, 
          rating: review.Rating,
          timestamp: review.CreationTimestamp,
          leftByUser: review.LeftBy
        }
      });

      if (cardGame.VerifiedCardGameID != null) {
        cardGameObj.verification = {
          comment: cardGame.Comment,
          timestamp: cardGame.CreationTimestamp,
          verifiedByAdmin: cardGame.VerifiedBy
        };
      }

      cardGameObjs.push(cardGameObj);
    }

    return cardGameObjs;
  }

  async getCardGame(id: number): Promise<CardGame | undefined>  {
    const con = await this.connect();
    if (!con) {
      console.log("Error retrieving connection!");
      return undefined;
    }

    const cardGamesRes = await con.query(`SELECT OneCardGame.ID AS CardGameID,
     OneCardGame.Name AS CardGameName,
     Description, CardTypeID,
     CardType.ID AS CardTypeID,
     CardType.Name AS CardTypeName,
     VerifiedCardGame.ID AS VerifiedCardGameID,
     Comment, CreationTimestamp, VerifiedBy,
     WikipediaLink 
     FROM (SELECT * FROM CardGame WHERE ID = ?) AS OneCardGame 
     LEFT JOIN CardType ON OneCardGame.CardTypeID = CardType.ID
     LEFT JOIN VerifiedCardGame ON OneCardGame.ID = VerifiedCardGame.ID`, [id]);

    const cardGame = (cardGamesRes[0] as mysql.RowDataPacket[])[0];
    if (!cardGame) {
      return undefined;
    }

    let cardGameObj:CardGame = {} as CardGame;
    cardGameObj.id = cardGame.CardGameID;
    cardGameObj.name = cardGame.CardGameName;
    cardGameObj.description = cardGame.Description;
    cardGameObj.cardType = {
      id: cardGame.CardTypeID,
      name: cardGame.CardTypeName,
      wikipediaLink: cardGame.WikipediaLink
    };

    const reviewsRes = await con.query('SELECT * FROM Review WHERE CardGameID = ?', [cardGame.CardGameID]);
    const reviews = (reviewsRes[0] as mysql.RowDataPacket[]);
    
    cardGameObj.reviews = reviews.map((review):Review => {
      return {
        id: review.ID, 
        text: review.ReviewText, 
        rating: review.Rating,
        timestamp: review.CreationTimestamp,
        leftByUser: review.LeftBy
      }
    });

    if (cardGame.VerifiedCardGameID != null) {
      cardGameObj.verification = {
        comment: cardGame.Comment,
        timestamp: cardGame.CreationTimestamp,
        verifiedByAdmin: cardGame.VerifiedBy
      };
    }

    return cardGameObj;
  }

}