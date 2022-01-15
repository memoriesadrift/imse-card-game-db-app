import { CardGame, Review, CardType, ReportOne, ReportTwo, User } from "../types";

export interface IDatabase {

  isDBReady(): Promise<boolean>;
  populateDB(): Promise<boolean>;

  getCardGames(): Promise<Array<CardGame> | undefined>;
  getCardGame(id: number): Promise<CardGame | undefined>
  getCardTypes(): Promise<Array<CardType> | undefined>;
  getUserNames(): Promise<any[] | undefined>;
  getReportOne():Promise<Array<ReportOne> | undefined>;
  getReportTwo():Promise<Array<ReportTwo> | undefined>;
  
  updateCardGame(cardGame: CardGame): Promise<boolean>;

  insertCardGame(cardGame: CardGame): Promise<boolean>;
  insertReview(cardGameId:number, review:Review): Promise<boolean>;
}