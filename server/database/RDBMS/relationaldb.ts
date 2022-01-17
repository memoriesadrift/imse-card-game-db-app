import fs from 'fs';
import mysql from 'mysql2/promise';
import { CardGame, Review, CardType, Verification, ReportOne, ReportTwo, User } from '../../types';
import { IDatabase } from '../IDatabase'
import { extractCardGame, extractCardType, extractReportOne, extractReportTwo, extractReview, extractUser } from './rowDataPacketExtractors';

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
      this.pool = mysql.createPool({
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

  private async getConnection(): Promise<mysql.Pool> {
    const con = await this.connect();
    if (con == undefined) {
      console.log("Failed to create db connection");
      throw "Failed to create db connection"
    }

    return con;

  }


  /**
   * Uses the files in tha ./data folder to populate the database. This operation may take a while to execute.
   * @returns void
   */
  private insertDataIntoDb = async () => {
    
    const con = await this.getConnection()
  
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
  
    // simulate that the first 20% of the card games are much more likely to get a review
    // should result in more interesting data for the reviews
    const popularGames = usedCardGameIDs.splice(0, 20);

    for (const review of reviews) {
      const reviewPopulargame = Math.random() <= 0.75;
      
      const cardGameID = this.pickRandomElement(reviewPopulargame ? popularGames : usedCardGameIDs);
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
    
    let pool;
    try {
      pool = await this.getConnection();
    } catch (e: unknown) {
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
    try {
      await this.resetDb();
    } catch (e: unknown) {
      return false;
    }

    try {
      await this.insertDataIntoDb();
    } catch (e: unknown) {
      console.log("Encountered error when inserting data: ");
      console.log(e);
      try {
        await this.resetDb();
      } catch (e: unknown) {}
      return false;
    }
  
    return true;
  }

  async getCardGames(): Promise<CardGame[] | undefined>  {
    let con;
    try {
      con = await this.getConnection()
    } catch(e: unknown) {
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
      const reviewsRes = await con.query('SELECT * FROM Review WHERE CardGameID = ?', [cardGame.CardGameID]);
      const reviews = (reviewsRes[0] as mysql.RowDataPacket[]);

      const cardGameObj = extractCardGame(cardGame, reviews);

      cardGameObjs.push(cardGameObj);
    }

    return cardGameObjs;
  }

  async getCardGame(id: number): Promise<CardGame | undefined>  {
    let con;
    try {
      con = await this.getConnection()
    } catch(e: unknown) {
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

    const reviewsRes = await con.query('SELECT * FROM Review WHERE CardGameID = ?', [cardGame.CardGameID]);
    const reviews = (reviewsRes[0] as mysql.RowDataPacket[]);

    return extractCardGame(cardGame, reviews);;
  }

  private async isCardTypeSaved(cardType:CardType):Promise<boolean> {
    let con;
    try {
      con = await this.getConnection()
    } catch(e: unknown) {
      return false;
    }

    const queryRes = await con.query('SELECT * FROM CardType WHERE ID=?', [cardType.id]);
    const cardTypeQueried = (queryRes[0] as mysql.RowDataPacket[])[0];
    
    if (!cardTypeQueried) {
      console.log("the passed CardType ID did not match any ID saved in the DB");
      return false;
    }
    return true;
  }


  async insertCardGame(cardGame:CardGame):Promise<boolean> {

    if (!this.isCardTypeSaved(cardGame.cardType)) {
      return false;
    }

    let con;
    try {
      con = await this.getConnection()
    } catch(e: unknown) {
      return false;
    }

    try {
      await con.query('INSERT INTO CardGame(Name, Description, CardTypeId) VALUES (?, ?, ?)', [cardGame.name, cardGame.description, cardGame.cardType.id]);
    } catch (e: unknown) {
      console.log("Inserting the CardGame failed");
      return false;
    }
    
    return true;

  }
  
  async insertReview(cardGameId: number, review: Review): Promise<boolean> {
    let con;
    try {
      con = await this.getConnection()
    } catch(e: unknown) {
      return false;
    }

    try {
      await con.query('INSERT INTO Review(CardGameID, LeftBy, ReviewText, Rating) VALUES (?, ?, ?, ?)', [cardGameId, review.leftByUser, review.text, review.rating]);
    } catch (e: unknown) {
      console.log("Inserting new Review failed");
      return false;
    }

    return true;
  }

  async getCardTypes(): Promise<CardType[] | undefined> {
    let con;
    try {
      con = await this.getConnection()
    } catch(e: unknown) {
      return undefined;
    }

    const queryRes = await con.query('SELECT * FROM CardType');
    const cardTypesRes = (queryRes[0] as mysql.RowDataPacket[]);

    return cardTypesRes.map(data => extractCardType(data));
  }

  async updateCardGame(cardGame: CardGame): Promise<boolean> {
    let con;
    try {
      con = await this.getConnection()
    } catch(e: unknown) {
      return false;
    }

    try {
      await con.query('UPDATE CardGame SET Name = ?, Description = ?, CardTypeId = ? WHERE ID=?', [cardGame.name, cardGame.description, cardGame.cardType.id, cardGame.id]);
    } catch (e: unknown) {
      console.log("Updating card game failed");
      return false;
    }

    return true;
  }

  private reportOneQuery = `SELECT CardType.Name AS CardTypeName, COUNT(RecentReview.ID) as ReviewCount FROM 
    CardGame
    LEFT JOIN CardType ON CardGame.CardTypeID = CardType.ID
    CROSS JOIN (SELECT * FROM Review
      WHERE Review.CreationTimestamp > (SELECT TIMESTAMP(DATE_SUB(NOW(), INTERVAL 30 day))))
      AS RecentReview ON RecentReview.CardGameID = CardGame.ID 
    GROUP BY CardType.Name ORDER BY COUNT(Review.ID) DESC;`;

  async getReportOne(): Promise<ReportOne[] | undefined> {
    let con;
    try {
      con = await this.getConnection()
    } catch(e: unknown) {
      return undefined;
    }

    const queryRes = await con.query(this.reportOneQuery);
    const reportOneRaw = (queryRes[0] as mysql.RowDataPacket[]);

    return reportOneRaw.map((data) => extractReportOne(data));
  }

  private reportTwoQuery = `SELECT CardGame.Name AS CardGameName, COUNT(Teens.Username) as UserCount FROM
    VerifiedCardGame
    LEFT JOIN CardGame ON VerifiedCardGame.ID=CardGame.ID
    LEFT JOIN favorites ON CardGame.ID = favorites.CardGameID
    CROSS JOIN (SELECT * FROM User WHERE User.Birthday > (SELECT DATE(DATE_SUB(NOW(), INTERVAL 18 year)))
      AND User.Birthday < (SELECT TIMESTAMP(DATE_SUB(NOW(), INTERVAL 13 year)))) AS Teens ON Teens.Username = favorites.UserID
    GROUP BY CardGame.Name ORDER BY COUNT(Teens.Username) DESC;`

  
  async getReportTwo(): Promise<ReportTwo[] | undefined> {
    let con;
    try {
      con = await this.getConnection()
    } catch(e: unknown) {
      return undefined;
    }

    const queryRes = await con.query(this.reportTwoQuery);
    const reportTwoRaw = (queryRes[0] as mysql.RowDataPacket[]);

    return reportTwoRaw.map((data) => extractReportTwo(data));
  }

  private async addFavoritesToUsers(user: User):Promise<boolean> {
    let con;
    try {
      con = await this.getConnection()
    } catch(e: unknown) {
      return false;
    }
    
    try {
      const queryRes = await con.query('SELECT CardGameID FROM favorites WHERE UserID=?', [user.username]);
      const favorites = (queryRes[0] as mysql.RowDataPacket[]);
      user.favorites = favorites.map(favorite => favorite.CardGameID);
    } catch (e: unknown) {
      return false;
    }
    return true;
  }

  private async getFullUser(data: mysql.RowDataPacket): Promise<User | undefined> {
    const user = extractUser(data);
    if (!user) {
      return undefined;
    }

    await this.addFavoritesToUsers(user);
    return user;
  }

  async getUserNames(): Promise<any[] | undefined> {
    let con;
    try {
      con = await this.getConnection()
    } catch(e: unknown) {
      return undefined;
    }

    const queryRes = await con.query('SELECT Username FROM User');
    const usersRes = (queryRes[0] as mysql.RowDataPacket[]);

    return usersRes.map(data => {
      return {username: data.Username}
    });
  }

  async getUsers(): Promise<User[] | undefined> {
    let con;
    try {
      con = await this.getConnection()
    } catch(e: unknown) {
      return undefined;
    }

    const queryRes = await con.query('SELECT * FROM User');
    const usersRes = (queryRes[0] as mysql.RowDataPacket[]);

    const ret = [];
    for (const user of usersRes) {
      const typedUser = await this.getFullUser(user)
      if (!typedUser) {
        return undefined;
      }
      ret.push(typedUser);
    }
    return ret;
  }

  async getReviews(): Promise<Review[] | undefined> {
    let con;
    try {
      con = await this.getConnection()
    } catch(e: unknown) {
      return undefined;
    }

    const queryRes = await con.query(`SELECT * FROM Review`);
    const reviewRes = (queryRes[0] as mysql.RowDataPacket[]);

    return reviewRes.map(data => extractReview(data));
  }
}