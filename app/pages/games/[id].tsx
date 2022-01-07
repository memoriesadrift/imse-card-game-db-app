import React from 'react'
import { useClientRouter } from 'use-client-router'
import { QueryGuard } from '../../src/components/Guards'
import Navbar from '../../src/components/Navbar'
import CardGameCard from '../../src/components/visual/CardGameCard'
import { useGetCardGame } from '../../src/dataLayer'

export default function Game() {
    const router = useClientRouter()
    const {id} = router.query
    
    const cardGameQuery = useGetCardGame(parseInt(id as string))

    return (
        <>
            <Navbar />
            <h1 className="uk-heading-medium uk-text-center">{`Game ${id}`}</h1>
            <QueryGuard {...cardGameQuery}>
                {(game) => (<CardGameCard {...{game}}/>)}
            </QueryGuard>
        </>
    )
}
