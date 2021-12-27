import { useQuery } from "react-query"
import { CardGame, Review } from "../types"

export const useGetCardGames = () => {
    return useQuery('card-games', async (): Promise<Array<CardGame>> => {
        // TODO: Extract to environment variable
        
	const uri = 'http://localhost:8080/api/games'
        const response = await fetch(uri).then((res) => res.json())

        return response.map((rawRes: any) => {
            const baseObj = {
                id: parseInt(rawRes.id),
                name: rawRes.name,
                description: rawRes.description,
            }

            const reviews = {
                reviews: rawRes.reviews.map((rawReview: any): Review => {
                    return {
                        id: parseInt(rawReview.id),
                        text: rawReview.text,
                        rating: parseInt(rawReview.rating),
                        timestamp: parseInt(rawReview.timestamp),
                        leftByUser: rawReview.leftByUser,
                    }
                }),
            }

            const verification = rawRes.verification ? {
                verification: {
                    comment: rawRes.verification.comment,
                    timestamp: parseInt(rawRes.verification.timestamp),
                    verifiedByAdmin: rawRes.verification.verifiedByAdmin,
                },
            } : {}

            return {...baseObj, ...reviews, ...verification}
        })
    })
}
