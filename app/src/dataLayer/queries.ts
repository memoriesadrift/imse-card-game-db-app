import { useQuery } from "react-query"
import { CardGame, CardType } from "../types"
import { baseUri } from "./constants"
import { parseCardGame } from "./utils"

export const useGetCardGames = () => {
    return useQuery('card-games', async (): Promise<Array<CardGame>> => {
        const uri = `${baseUri}/games`
        const response = await fetch(uri).then((res) => res.json())

        return response.map((rawRes: any) => parseCardGame(rawRes))
    })
}

export const useGetCardGame = (id: number | undefined) => {
    return useQuery('card-game', async (): Promise<CardGame | undefined> => {
        if (id === undefined) return undefined
        const uri = `${baseUri}/games/${id}`
        const response = await fetch(uri).then((res) => res.json())

        return parseCardGame(response)
    })
}
