import { CardGame, CardType, User, ReportOne, ReportTwo, Review } from "../../types";
import { IDatabase } from "../IDatabase";
import { Document, MongoClient, ObjectId, OptionalId } from 'mongodb';
import { number } from "joi";

export class MongoDatabase implements IDatabase {

  private username = 'ise-editor';
  private password = 'ise-password';
  private database = 'card-game';

  private uri = `mongodb://${this.username}:${this.password}@ise-mongo`;
  private client = new MongoClient(this.uri);

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
      const doc:OptionalId<Document> = {
        _id: user.username, // why is this not working :(
        passwordHash: user.passwordHash,
        email: user.email,
        birthday: user.birthday,
        favorites: this.extractFavorites(user.favorites)
      }
      return doc;
    });

    const result =  await this.client.db(this.database).collection('user').insertMany(mongoList);

    await this.client.close();
    return true;
  }


  isDBReady(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  populateDB(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getCardGames(): Promise<CardGame[] | undefined> {
    throw new Error("Method not implemented.");
  }
  getCardGame(id: number): Promise<CardGame | undefined> {
    throw new Error("Method not implemented.");
  }
  getCardTypes(): Promise<CardType[] | undefined> {
    throw new Error("Method not implemented.");
  }
  getUserNames(): Promise<any[] | undefined> {
    throw new Error("Method not implemented.");
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