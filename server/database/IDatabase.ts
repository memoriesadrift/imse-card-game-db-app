import { CardGame } from "../types";

export interface IDatabase {

  isDBReady(): Promise<boolean>;
  populateDB(): Promise<boolean>;

  getCardGames(): Promise<Array<CardGame> | undefined>;


}