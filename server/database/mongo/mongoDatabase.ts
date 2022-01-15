import { CardGame, CardType, User, ReportOne, ReportTwo, Review } from "../../types";
import { IDatabase } from "../IDatabase";
import { Db, Document, MongoClient, ObjectId, OptionalId } from 'mongodb';

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

    if(!result.acknowledged) {
      console.log("Something went wrong when inserting card types into mongo!");
      return false;
    }

    await this.client.close();
    return true;
  }

  async insertCardGames(cardGames: CardGame[]):Promise<boolean> {
    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return false;
    }


    const mongoList = cardGames.map(cardGame => {
      const verification = !cardGame.verification ? undefined : {
        comment: cardGame.verification.comment,
        timestamp: cardGame.verification.timestamp,
        verifiedByAdmin: cardGame.verification.verifiedByAdmin
      };
      return {
        _id: cardGame.id as ObjectId,
        name: cardGame.name,
        cardType: {
          name: cardGame.cardType.name,
          wikipediaLink: cardGame.cardType.wikipediaLink
        },
        description: cardGame.description,
        verification: verification
      }
    });

    const result =  await this.client.db(this.database).collection('cardGame').insertMany(mongoList);

    if(!result.acknowledged) {
      console.log("Something went wrong when inserting card types into mongo!");
      return false;
    }


    await this.client.close();
    return true;
  }

  async insertReviews(reviews: Review[]):Promise<boolean> {
    try {
      await this.client.connect();
    } catch(e: unknown) {
      console.log('connection failed');
      return false;
    }

    const mongoList = reviews.map(review => {
      return {
        cardGameID: review.cardGameId,
        leftBy: review.leftByUser,
        reviewText: review.text,
        rating: review.rating,
        creationTimestamp: review.timestamp
      }
    });

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

    const numberArr: number[] = [1];
    if (typeof(favorites) === typeof(numberArr)) {
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

    this.client.close();
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

    console.log(id);
    const objId = new ObjectId(id);
    console.log(objId);

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
    console.log(res)

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


  getReportOne(): Promise<ReportOne[] | undefined> {
    throw new Error("Method not implemented.");
  }
  getReportTwo(): Promise<ReportTwo[] | undefined> {
    throw new Error("Method not implemented.");
  }
  updateCardGame(cardGame: CardGame): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  insertCardGame(cardGame: CardGame): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  insertReview(cardGameId: number, review: Review): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  
}