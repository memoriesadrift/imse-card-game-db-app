import { CardType, Review, WebLink, Verification } from "../types"

export const parseCardType = (json: any) => {
    const cardType: {cardType: CardType} = {
        cardType: {
            name: json.name,
            id: json.id,
            wikipediaLink: json.wikipediaLink as WebLink,
        }
    }

    return cardType
}

export const parseCardGame = (json: any) =>  {
    const baseObj = {
        id: parseInt(json.id),
        name: json.name,
        description: json.description,
    }

    const cardType: {cardType: CardType} = {
        cardType: {
            name: json.cardType.name,
            id: json.cardType.id,
            wikipediaLink: json.cardType.wikipediaLink as WebLink,
        }
    }

    const reviews: {reviews: Array<Review>} = {
        reviews: json.reviews.map((rawReview: any): Review => {
            return {
                id: parseInt(rawReview.id),
                text: rawReview.text,
                rating: parseInt(rawReview.rating),
                timestamp: parseInt(rawReview.timestamp),
                leftByUser: rawReview.leftByUser,
            }
        }),
    }

    const verification: {verification?: Verification} = json.verification ? {
        verification: {
            comment: json.verification.comment,
            timestamp: parseInt(json.verification.timestamp),
            verifiedByAdmin: json.verification.verifiedByAdmin,
        },
    } : {}

    return {...baseObj, ...cardType, ...reviews, ...verification}
}