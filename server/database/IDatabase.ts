
interface IDatabase {

  isDBReady(): Promise<boolean>;
  populateDB(): Promise<void>;

}