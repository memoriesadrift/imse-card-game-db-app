import { useQuery } from "react-query"
import { CardGame, CardType } from "../types"
import { baseUri } from "./constants"
import { parseCardGame, parseCardType } from "./utils"

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

export const useGetCardTypes = () => {
    return useQuery('card-types', async (): Promise<Array<CardType>> => {
        const uri = `${baseUri}/cardtypes`
        const response = await fetch(uri).then((res) => res.json())

        return response.map((rawCardType: any) => parseCardType(rawCardType))
    })
}
// Reporting

export const useGetMostReviewedCardTypes =  () => {
    return useQuery('most-reviewed-card-type', async (): Promise<Array<CardType>> => {
        const uri = `${baseUri}/reports/1`
        const response = await fetch(uri).then((res) => res.json())

        return response.map((rawRes: any) => parseCardType(rawRes))
    })
}

export const useGetPopularCardGamesForTeens = () => {
    return useQuery('most-popular-games-for-teens', async (): Promise<Array<CardGame>> => {
        const uri = `${baseUri}/reports/2`
        const response = await fetch(uri).then((res) => res.json())

        return response.map((rawRes: any) => parseCardGame(rawRes))
    })
}
