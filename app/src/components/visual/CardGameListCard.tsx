import Link from 'next/link'
import React from 'react'
import { CardGame } from '../../types'

type CardGameListCardProps = {
    game: CardGame,
}

export default function CardGameListCard({game}: CardGameListCardProps) {
    return (
        <div className="uk-card uk-card-default uk-width-1-2@m uk-align-center">
            <div className="uk-card-header">
                <div className="uk-grid-small uk-flex-middle" uk-grid>
                    <div className="uk-width-expand">
                        <h3 className="uk-card-title uk-margin-remove-bottom">{game.name}</h3>
                        <p className="uk-text-meta uk-margin-remove-top">{game.verification ? 'Verified' : 'Unverified'}</p>
                    </div>
                </div>
            </div>
            <div className="uk-card-body">
                <p>{game.description}</p>
                <p>{`${game.reviews.length || 'No'} review${game.reviews.length === 1 ? '' : 's'}`}</p>
            </div>
            <div className="uk-card-footer">
                <Link href={`game/${game.id}`}><a className="uk-button uk-button-text">Read Reviews</a></Link>
            </div>
        </div>
    )
}
