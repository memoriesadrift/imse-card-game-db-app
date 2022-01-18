import { verify } from "crypto";
import { ObjectId } from "mongodb";
import { CardGame, Review } from "../../types";

export function extractCardGame(cardGame: CardGame, id?: ObjectId | undefined) {
  if (!cardGame.verification) {
    return {
      _id: id,
      name: cardGame.name,
      cardType: {
        name: cardGame.cardType.name,
        wikipediaLink: cardGame.cardType.wikipediaLink
      },
      description: cardGame.description,
    }
  }

  const verification = !cardGame.verification ? undefined : {
    comment: cardGame.verification.comment,
    timestamp: cardGame.verification.timestamp,
    verifiedByAdmin: cardGame.verification.verifiedByAdmin
  };

  return {
    _id: id,
    name: cardGame.name,
    cardType: {
      name: cardGame.cardType.name,
      wikipediaLink: cardGame.cardType.wikipediaLink
    },
    description: cardGame.description,
    verification: verification
  }
}

export function extractReview(review:Review) {
  return {
    cardGameID: review.cardGameId,
    leftBy: review.leftByUser,
    reviewText: review.text,
    rating: review.rating,
    creationTimestamp: !review.timestamp ? Date.now() : review.timestamp
  };
}

export function extractFavorites(favorites: number[] | ObjectId[] | undefined): ObjectId[] {
  if (!favorites) {
    return [];
  }

  if (favorites.length == 0) {
    return [];
  }

  const ret = favorites as ObjectId[];

  return ret;
}
