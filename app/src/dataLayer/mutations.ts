import { useMutation } from "react-query"
import { baseUri } from "."
import { CardGame, PartialReview } from "../types"

export const usePopulateDatabase = () => {
    return useMutation('populateDatabase', async () => {
        const res = await fetch(`${baseUri}/populate`).then((response) => response.json())
        if (!res.success) throw Error('Population unsuccessful!')
        return res
    })
}

export const useMigrateDatabase = () => {
    return useMutation('migrateDatabase', async () => {
        const res = await fetch(`${baseUri}/migrate`).then((response) => response.json())
        if (!res.success) throw Error('Migration unsuccessful!')
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
        if (!response.success) throw Error('Addition unsuccessful!')
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
    forGameId: string,
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
