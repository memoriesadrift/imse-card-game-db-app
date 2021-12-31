import React from 'react'
import {useClientRouter} from 'use-client-router'
import Navbar from '../../src/components/navbar'

export default function Game() {
    const router = useClientRouter()
    const {id} = router.query
    return (
        <>
            <Navbar />
            <h1 className="uk-heading-medium uk-text-center">{`Game ${id}`}</h1>
        </>
    )
}
