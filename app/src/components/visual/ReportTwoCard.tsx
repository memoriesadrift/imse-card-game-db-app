import React from 'react'
import { ReportTwo } from '../../types'

type ReportTwoCardProps = {
    reportItem: ReportTwo,
    index: number,
}

export default function ReportTwoCard({reportItem, index}: ReportTwoCardProps) {
    return (
        <div className="uk-card uk-card-default uk-width-1-2@m uk-align-center uk-margin-medium-bottom">
            <div className="uk-card-header">
                <div className="uk-grid-small uk-flex-middle" uk-grid>
                    <div className="uk-width-expand">
                        <h3 className="uk-card-title uk-margin-remove-bottom">{`Place #${index + 1}`}</h3>
                    </div>
                </div>
            </div>
            <div className="uk-card-body">
                <h4 className="uk-margin-remove-bottom">{reportItem.cardGameName}</h4>
                <p>{`${reportItem.userCount || 'No'} users${reportItem.userCount === 1 ? '' : 's'}`}</p>
            </div>
        </div>
    )
}
