import { useMutation } from "react-query"
import { baseUri } from "."
import { CardGame, PartialReview } from "../types"

// TODO: maybe do something with responses

export const usePopulateDatabase = () => {
    return useMutation('populateDatabase', async () => {
        const res = fetch(`${baseUri}/populate`).then((response) => response.json())
        return res
    })
}

export const useMigrateDatabase = () => {
    return useMutation('migrateDatabase', async () => {
        const res = fetch(`${baseUri}/migrate`).then((response) => response.json())
        return res
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
        ).then((res) => res.json())
        return response
    })
}

export const useUpdateCardGame = () => {
    return useMutation('updateCardGame', async (game: CardGame) => {
        const response = await fetch(
            `${baseUri}/games/${game.id}`,
            {
                method: 'PUT',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(game)
            }
        ).then((res) => res.json())
        if (!response.success) throw Error('Update unsuccessful!')
        return response
    })
}

type LeaveReviewParams = {
    review: PartialReview,
    forGameId: number,
}

export const useLeaveReview = () => {
    return useMutation('leaveReview', async ({review, forGameId}: LeaveReviewParams) => {
        const response = await fetch(
            `${baseUri}/games/review/${forGameId}`,
            {
                method: 'POST',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(review)
            }
        ).then((res) => res.json())
        if (!response.success) throw Error('Update unsuccessful!')
        return response
    })
}
