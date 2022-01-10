
export interface IDatabase {

  isDBReady(): Promise<boolean>;
  populateDB(): Promise<boolean>;

}