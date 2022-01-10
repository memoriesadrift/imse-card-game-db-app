import React, { useState } from 'react'
import { QueryGuard } from '../src/components/Guards'
import Navbar from '../src/components/Navbar'
import CardGameListCard from '../src/components/visual/CardGameListCard'
import CardTypeListCard from '../src/components/visual/CardTypeListCard'
import { useGetMostReviewedCardTypes, useGetPopularCardGamesForTeens } from '../src/dataLayer'

export default function Reports() {
    const [showReportOne, setShowReportOne] = useState(false)
    const [showReportTwo, setShowReportTwo] = useState(false)

    const reportOneQuery = useGetMostReviewedCardTypes()
    const reportTwoQuery = useGetPopularCardGamesForTeens()

    return (
        <div>
            <Navbar/>
            <h1 className="uk-heading-medium uk-text-center">Reports</h1>
            <div className='uk-flex uk-flex-center uk-button-group'>
                <button className="uk-button uk-button-large" onClick={() => setShowReportOne(!showReportOne)}>Show most reviewed card types</button>  
                <button className="uk-button uk-button-large" onClick={() => setShowReportTwo(!showReportTwo)}>Show most popular card games for teens</button>  
            </div>
            <QueryGuard {...reportOneQuery}>
                {(cardTypeList) => (
                    <ul className='uk-list'>
                        {cardTypeList.map((cardType, idx) => (
                        <li key={idx}>
                            <CardTypeListCard {...{cardType}} reviewNumber={0} />
                        </li>
                        ))}
                    </ul>
                )}
            </QueryGuard>
            <QueryGuard {...reportTwoQuery}>
                {(gameList) => (
                    <ul className='uk-list'>
                        {gameList.map((game, idx) => (
                        <li key={idx}>
                            <h4>{`Rank #${idx+1}`}</h4>
                            <CardGameListCard game={game} />
                        </li>
                        ))}
                    </ul>
                )}
            </QueryGuard>
        </div>
    )
}
