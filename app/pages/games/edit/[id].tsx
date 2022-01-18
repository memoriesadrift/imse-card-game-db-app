import React, { useState } from 'react'
import {useClientRouter} from 'use-client-router'
import UpdateGame from '../../../src/components/crud/UpdateGame'
import { QueryGuard } from '../../../src/components/Guards'
import Navbar from '../../../src/components/Navbar'
import { useGetCardGame } from '../../../src/dataLayer'

export default function EditGame() {
    const router = useClientRouter()
    const {id} = router.query

    const cardGameQuery = useGetCardGame(id as string)

    return (
        <>
            <Navbar />
            <QueryGuard {...cardGameQuery}>
            {(cardGame) => (<UpdateGame {...{cardGame}} />)}
            </QueryGuard>
        </>
    )
}
