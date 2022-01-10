import React from 'react'
import { useClientRouter } from 'use-client-router'
import LeaveReview from '../../../src/components/crud/LeaveReview'
import Navbar from '../../../src/components/Navbar'

export default function ReviewGame() {
    const router = useClientRouter()
    const {id} = router.query
    
    return (
        <div>
            <Navbar />
            <h1 className="uk-heading-medium uk-text-center">{`New Review for Game ${id}`}</h1>
            <LeaveReview gameId={parseInt(id as string)} />
        </div>
    )
}
