
import { URL, CardGame, CardType } from "./types";


export function convertCardType(data:any):CardType|undefined {
  const id:number|undefined = data.id;
  const nameRaw:string|undefined = data.name;
  const wikipediaLink:URL|undefined = data.wikipediaLink;

  if (!id || !nameRaw || !wikipediaLink) {
    return undefined;
  }

  const name = nameRaw.trim();

  if (id < 0 || name.length === 0 || wikipediaLink.length === 0) {
    return undefined;
  }

  return {...{id, name, wikipediaLink}};
}

export function convertCardGame(data:any):CardGame|undefined {
  const nameRaw:string|undefined = data.name;
  const descriptionRaw:string|undefined = data.description;
  const cardType = convertCardType(data.cardType)

  if (!nameRaw || !descriptionRaw || !cardType) {
    return undefined;
  }

  const name = nameRaw.trim();
  const description = descriptionRaw.trim();

  if (name.length === 0 || description.length === 0) {
    return undefined;
  }

  return {...{name, cardType, description}, reviews: []};
}

