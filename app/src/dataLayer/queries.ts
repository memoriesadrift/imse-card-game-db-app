import { useQuery } from "react-query"
import { CardGame, CardType, Review, URL, Verification } from "../types"
import { baseUri } from "./constants"
import { parseCardGame } from "./utils"

export const useGetCardGames = () => {
    return useQuery('card-games', async (): Promise<Array<CardGame>> => {
        const uri = `${baseUri}/games`
        const response = await fetch(uri).then((res) => res.json())

        return response.map((rawRes: any) => parseCardGame(rawRes))
    })
}

export const useGetCardGame = (id: number) => {
    return useQuery('card-game', async (): Promise<CardGame> => {
        const uri = `${baseUri}/game/${id}`
        const response = await fetch(uri).then((res) => res.json())

        return parseCardGame(response)
    })
}
