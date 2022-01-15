import { CardGame, CardType, User, ReportOne, ReportTwo, Review } from "../../types";
import { IDatabase } from "../IDatabase";
import { Db, Document, MongoClient, ObjectId, OptionalId } from 'mongodb';
import { deflateRawSync } from "zlib";

export class MongoDatabase implements IDatabase {

  private username = 'ise-editor';
  private password = 'ise-password';
  private database = 'card-game';

  private uri = `mongodb://${this.username}:${this.password}@ise-mongo`;
  private client = new MongoClient(this.uri);

  async purgeDatabase() {
    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return false;
    }

    await this.client.db(this.database).collection('cardGame').deleteMany({});
    await this.client.db(this.database).collection('cardType').deleteMany({});
    await this.client.db(this.database).collection('review').deleteMany({});
    await this.client.db(this.database).collection('user').deleteMany({});

    await this.client.close();
    return true;
  }

  async insertCardTypes(cardTypes: CardType[]): Promise<boolean> {
    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return false;
    }

    const mongoListings = cardTypes.map((cardType) => {
      return {name: cardType.name, wikipediaLink: cardType.wikipediaLink}
    });

    const result =  await this.client.db(this.database).collection('cardType').insertMany(mongoListings);

    await this.client.close();

    if(!result.acknowledged) {
      console.log("Something went wrong when inserting card types into mongo!");
      return false;
    }

    return true;
  }

  private extractCardGame(cardGame: CardGame, id?: ObjectId | undefined) {
    const verification = !cardGame.verification ? undefined : {
      comment: cardGame.verification.comment,
      timestamp: cardGame.verification.timestamp,
      verifiedByAdmin: cardGame.verification.verifiedByAdmin
    };
    return {
      _id: id,
      name: cardGame.name,
      cardType: {
        name: cardGame.cardType.name,
        wikipediaLink: cardGame.cardType.wikipediaLink
      },
      description: cardGame.description,
      verification: verification
    }
  }

  async insertCardGames(cardGames: CardGame[]):Promise<boolean> {
    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return false;
    }


    const mongoList = cardGames.map(cardGame => this.extractCardGame(cardGame, cardGame.id as ObjectId));

    const result =  await this.client.db(this.database).collection('cardGame').insertMany(mongoList);

    await this.client.close();

    if(!result.acknowledged) {
      console.log("Something went wrong when inserting card types into mongo!");
      return false;
    }

    return true;
  }

  private extractReview(review:Review) {
    return {
      cardGameID: review.cardGameId,
      leftBy: review.leftByUser,
      reviewText: review.text,
      rating: review.rating,
      creationTimestamp: review.timestamp
    };
  }

  async insertReviews(reviews: Review[]):Promise<boolean> {
    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return false;
    }

    const mongoList = reviews.map(review => this.extractReview(review));

    const result =  await this.client.db(this.database).collection('review').insertMany(mongoList);

    await this.client.close();
    return true;
  }

  private extractFavorites(favorites: number[] | ObjectId[] | undefined): ObjectId[] {
    if (!favorites) {
      return [];
    }

    if (favorites.length == 0) {
      return [];
    }

    const ret = favorites as ObjectId[];

    return ret;
  }

  async insertUsers(users: User[]):Promise<boolean> {
    for (const user of users) {
      if (!user.favorites) {
        return false;
      }
    }

    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return false;
    }

    const mongoList = users.map(user => {
      return {
        username: user.username,
        passwordHash: user.passwordHash,
        email: user.email,
        birthday: user.birthday,
        favorites: this.extractFavorites(user.favorites)
      }
    });

    const result =  await this.client.db(this.database).collection('user').insertMany(mongoList);

    await this.client.close();
    return true;
  }


  async isDBReady(): Promise<boolean> {
    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return false;
    }

    await this.client.close();
    return true;

  }

  /**
   * This method is not implemented for the mongoDatabase
   * @returns false
   */
  async populateDB(): Promise<boolean> {
    return false;
  }


  async getCardGames(): Promise<CardGame[] | undefined> {
    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return undefined;
    }

    const res = await this.client.db(this.database).collection('cardGame').find().toArray();

    this.client.close();
    return  res.map(document => {
      return {
        id: document._id,
        name: document.name,
        cardType: document.cardType,
        description: document.description,
        reviews: [],
        verification: !document.verification ? undefined : document.verification
      };
    });
  }


  async getCardGame(id: string): Promise<CardGame | undefined> {

    const objId = new ObjectId(id);

    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return undefined;
    }

    const res = await this.client.db(this.database).collection('cardGame').aggregate([
      {$match:{_id: objId}},
      {$lookup: {from: 'review', localField: '_id', foreignField:'cardGameID', as:'reviews'}} 
    ]).toArray();//findOne({_id: objId});

    this.client.close();

    if (!res[0]) {
      return undefined;
    }

    return {
      id: res[0]._id,
      name: res[0].name,
      cardType: res[0].cardType,
      description: res[0].description,
      reviews: res[0].reviews,
      verification: !res[0].verification ? undefined : res[0].verification
    };
  }
  
  async getCardTypes(): Promise<CardType[] | undefined> {
    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return undefined;
    }

    const res = await this.client.db(this.database).collection('cardType').find().toArray();

    this.client.close();
    return  res.map(document => {
      return {
        id: document._id,
        name: document.name,
        wikipediaLink: document.wikipediaLink
      };
    });
  }

  async getUserNames(): Promise<any[] | undefined> {
    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return undefined;
    }

    const res = await this.client.db(this.database).collection('user').find().map(document => {
      return {username: document.username};
    }).toArray();

    this.client.close();
    return  res;
  }


  async getReportOne(): Promise<ReportOne[] | undefined> {
    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return undefined;
    }

    const today = Date.now();
    const thirtyDaysAgo = new Date(today - 1000 * 60 * 60 * 24 * 30);
    console.log(thirtyDaysAgo);
    const res = await this.client.db(this.database).collection('review').aggregate([
      {$match: {creationTimestamp: {$gte: thirtyDaysAgo}}},
      {$lookup: {from: 'cardGame', localField: 'cardGameID', foreignField:'_id', as:'cardGame'}},
      {$group: {_id: '$cardGame.cardType.name', reviewCount: {$count: {}}}},
      {$sort: {reviewCount: -1}}
    ]).toArray();

    this.client.close();

    if (!res) {
      return undefined;
    }

    return res.map(report => ({
      cardTypeName: report._id[0], // id is an array now
      reviewCount: report.reviewCount
    }));

  }
  async getReportTwo(): Promise<ReportTwo[] | undefined> {

    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return undefined;
    }

    const today = Date.now();
    const thirteenYearsAgo = new Date(today - 1000 * 60 * 60 * 24 * 365.25 * 13);
    const eighteenYearsAgo = new Date(today - 1000 * 60 * 60 * 24 * 365.25 * 18)
    
    console.log(thirteenYearsAgo);
    console.log(eighteenYearsAgo);

    const res = await this.client.db(this.database).collection('user').aggregate([
      {$match: {birthday: {
        $gte: eighteenYearsAgo,
        $lte: thirteenYearsAgo
      }}},
      {$unwind: {path: '$favorites'}},
      {$lookup: {from: 'cardGame', localField: 'favorites', foreignField:'_id', as:'cardGame'}},
      {$match: {"cardGame.verification": {$exists: true}}},
      {$group: {_id: '$cardGame.name', userCount: {$count: {}}}},
      {$sort: {userCount: -1}}
    ]).toArray();


    this.client.close();

    if (!res) {
      return undefined;
    }

    return res.map(report => ({
      cardGameName: report._id[0], // id is an array now
      userCount: report.userCount
    }));
    
  }

  async updateCardGame(cardGame: CardGame): Promise<boolean> {
    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return false;
    }

    const res = await this.client.db(this.database).collection('cardGame').updateOne({_id: cardGame.id as ObjectId}, this.extractCardGame(cardGame));

    await this.client.close();

    if(!res.acknowledged) {
      console.log("Something went wrong when inserting card types into mongo!");
      return false;
    }
    
    return true;
  }
  
  async insertCardGame(cardGame: CardGame): Promise<boolean> {
    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return false;
    }

    const res = await this.client.db(this.database).collection('cardGame').insertOne(this.extractCardGame(cardGame));

    await this.client.close();

    if(!res.acknowledged) {
      console.log("Something went wrong when inserting card types into mongo!");
      return false;
    }
    
    return true;
  }


  async insertReview(cardGameId: string, review: Review): Promise<boolean> {
    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return false;
    }

    const objId = new ObjectId(cardGameId);

    const userFound = await this.client.db(this.database).collection('user').findOne({name: review.leftByUser});
    const cardGameFound = await this.client.db(this.database).collection('cardGame').findOne({_id: cardGameId});

    review.cardGameId = objId;
    const res = await this.client.db(this.database).collection('review').insertOne(this.extractReview(review));

    await this.client.close();

    if(!res.acknowledged) {
      console.log("Something went wrong when inserting card types into mongo!");
      return false;
    }
    
    return true;
  }
  
}