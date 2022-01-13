import { CardGame, Review, CardType } from "../types";

export interface IDatabase {

  isDBReady(): Promise<boolean>;
  populateDB(): Promise<boolean>;

  getCardGames(): Promise<Array<CardGame> | undefined>;
  getCardGame(id: number): Promise<CardGame | undefined>;
  getCardTypes(): Promise<Array<CardType> | undefined>;
  
  insertCardGame(cardGame: CardGame): Promise<boolean>;
  insertReview(cardGameId:number, review:Review): Promise<boolean>;
}