import Link from 'next/link'
import React from 'react'
import { CardType } from '../../types'

type CardTypeListCardProps = {
    cardType: CardType,
    reviewNumber: number,
}

export default function CardGameListCard({cardType, reviewNumber}: CardTypeListCardProps) {
    return (
        <div className="uk-card uk-card-default uk-width-1-2@m uk-align-center uk-margin-medium-bottom">
            <div className="uk-card-header">
                <div className="uk-grid-small uk-flex-middle" uk-grid>
                    <div className="uk-width-expand">
                        <h3 className="uk-card-title uk-margin-remove-bottom">{cardType.name}</h3>
                        <Link href={cardType.wikipediaLink}><a className="uk-text-meta uk-margin-remove-top">Find out more on Wikipedia</a></Link>
                    </div>
                </div>
            </div>
            <div className="uk-card-body">
                <p>{`This card type totalled ${reviewNumber} review${reviewNumber === 1 ? '' : 's'}.`}</p>
            </div>
        </div>
    )
}
