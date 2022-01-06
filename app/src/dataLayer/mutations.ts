import { useMutation } from "react-query"
import { baseUri } from "."
import { CardGame } from "../types"

// TODO: maybe do something with responses

export const usePopulateDatabase = () => {
    return useMutation('populateDatabase', async () => {
        fetch(`${baseUri}/populate`)
    })
}

export const useAddGame = () => {
    return useMutation('addGame', async (cardGame: CardGame) => {
       fetch(`${baseUri}/migrate`)
    })
}
