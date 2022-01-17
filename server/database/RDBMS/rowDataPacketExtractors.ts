import mysql from 'mysql2/promise';
import { CardGame, CardType, ReportOne, ReportTwo, Review, User } from '../../types';


export function extractUser(data: mysql.RowDataPacket):User | undefined {
  return {
    username: data.Username,
    passwordHash: data.PasswordHash,
    email: data.Email,
    birthday: data.Birthday,
    favorites: [] // needs to be set outside of this function as it needs to be querried separately
  };
}



export function extractReview(data: mysql.RowDataPacket): Review {
  return {
    id: data.ID,
    cardGameId: data.CardGameID,
    text: data.ReviewText, 
    rating: data.Rating,
    timestamp: data.CreationTimestamp,
    leftByUser: data.LeftBy
  }
}

export function extractCardGame(cardGameRowData: mysql.RowDataPacket, reviewRowData: mysql.RowDataPacket[]): CardGame {
  let cardGameObj:CardGame = {} as CardGame;
  cardGameObj.id = cardGameRowData.CardGameID;
  cardGameObj.name = cardGameRowData.CardGameName;
  cardGameObj.description = cardGameRowData.Description;
  cardGameObj.cardType = {
    id: cardGameRowData.CardTypeID,
    name: cardGameRowData.CardTypeName,
    wikipediaLink: cardGameRowData.WikipediaLink
  };
  
  cardGameObj.reviews = reviewRowData.map((review):Review => extractReview(review));

  if (cardGameRowData.VerifiedCardGameID != null) {
    cardGameObj.verification = {
      comment: cardGameRowData.Comment,
      timestamp: cardGameRowData.CreationTimestamp,
      verifiedByAdmin: cardGameRowData.VerifiedBy
    };
  }
  
  return cardGameObj;
}

export function extractCardType(data: mysql.RowDataPacket):CardType {
  return {
    id: data.ID,
    name: data.Name,
    wikipediaLink: data.WikipediaLink
  };
}

export function extractReportOne(data:mysql.RowDataPacket):ReportOne {
  const cardTypeName = data.CardTypeName;
  const reviewCount = data.ReviewCount;

  return {...{cardTypeName, reviewCount}};
}

export function extractReportTwo(data:mysql.RowDataPacket):ReportTwo {
  const cardGameName = data.CardGameName;
  const userCount = data.UserCount;

  return {...{cardGameName, userCount}};
}