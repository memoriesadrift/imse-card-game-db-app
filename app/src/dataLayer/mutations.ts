import { useMutation } from "react-query"
import { baseUri } from "."
import { CardGame, Review } from "../types"

// TODO: maybe do something with responses

export const usePopulateDatabase = () => {
    return useMutation('populateDatabase', async () => {
        fetch(`${baseUri}/populate`)
    })
}

export const useMigrateDatabase = () => {
    return useMutation('migrateDatabase', async () => {
       fetch(`${baseUri}/migrate`)
    })
}

export const useAddCardGame = () => {
    return useMutation('addCardGame', async (game: CardGame) => {
        const response = await fetch(
            `${baseUri}/games`,
            {
                method: 'POST',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(game)
            }
        )
        return response.json()
    })
}

type LeaveReviewParams = {
    review: Review,
    forGameId: number,
}

export const useLeaveReview = () => {
    return useMutation('leaveReview', async ({review, forGameId}: LeaveReviewParams) => {
        const response = await fetch(
            `${baseUri}/reviews/${forGameId}`,
            {
                method: 'POST',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(review)
            }
        )
        return response.json()
    })
}
