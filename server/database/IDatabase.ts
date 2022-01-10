
interface IDatabase {

  isDBReady(): Promise<boolean>;
  populateDB(): void;

}