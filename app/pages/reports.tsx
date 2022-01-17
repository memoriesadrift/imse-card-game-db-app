import React, { useState } from 'react'
import { QueryGuard } from '../src/components/Guards'
import Navbar from '../src/components/Navbar'
import CardGameListCard from '../src/components/visual/CardGameListCard'
import CardTypeListCard from '../src/components/visual/CardTypeListCard'
import ReportOneCard from '../src/components/visual/ReportOneCard'
import ReportTwoCard from '../src/components/visual/ReportTwoCard'
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
                <button 
                    className="uk-button uk-button-large" 
                    onClick={() => {
                        setShowReportOne(!showReportOne)
                        setShowReportTwo(false)
                    }}
                >
                    Show most reviewed card types
                </button>
                <button 
                    className="uk-button uk-button-large"
                    onClick={() => {
                        setShowReportTwo(!showReportTwo)
                        setShowReportOne(false)
                    }}
                >
                    Show most popular card games for teens
                </button>
            </div>
            {showReportOne && (
            <QueryGuard {...reportOneQuery}>
                {(report) => (
                    <div>
                        <h3 className="uk-margin-top uk-flex uk-flex-center">Most Reviewed Card Types</h3>
                        <ul className="uk-list">
                            {report.map((reportItem, index) => (
                            <li key={index}>
                                <ReportOneCard {...{reportItem, index}} />
                            </li>
                            ))}
                        </ul>
                    </div>
                )}
            </QueryGuard>
            )}
            {showReportTwo && (
            <QueryGuard {...reportTwoQuery}>
                {(report) => (
                    <div>
                        <h3 className="uk-margin-top uk-flex uk-flex-center">Most Popular Card Games for Teen Users</h3>
                        <ul className="uk-list">
                            {report.map((reportItem, index) => (
                            <li key={index}>
                                <ReportTwoCard {...{reportItem, index}} />
                            </li>
                            ))}
                        </ul>
                    </div>
                )}
            </QueryGuard>
            )}
        </div>
    )
}
