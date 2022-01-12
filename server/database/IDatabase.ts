import { CardGame, Review, CardType, ReportOne, ReportTwo } from "../types";

export interface IDatabase {

  isDBReady(): Promise<boolean>;
  populateDB(): Promise<boolean>;

  getCardGames(): Promise<Array<CardGame> | undefined>;
  getCardGame(id: number): Promise<CardGame | undefined>
  getCardTypes(): Promise<Array<CardType> | undefined>;
  getReportOne():Promise<Array<ReportOne> | undefined>;
  getReportTwo():Promise<Array<ReportTwo> | undefined>;
  
  insertCardGame(cardGame: CardGame): Promise<boolean>;
  insertReview(cardGameId:number, review:Review): Promise<boolean>;
}