import Link from 'next/link'
import React from 'react'
import { CardGame } from '../../types'
import { game as gameLink } from '../../utils/links'

type CardGameListCardProps = {
    game: CardGame,
}

export default function CardGameListCard({game}: CardGameListCardProps) {
    return (
        <div className="uk-card uk-card-default uk-width-1-2@m uk-align-center uk-margin-medium-bottom">
            <div className="uk-card-header">
                <div className="uk-grid-small uk-flex-middle" uk-grid>
                    <div className="uk-width-expand">
                        <h3 className="uk-card-title uk-margin-remove-bottom">{game.name}</h3>
                        <p className="uk-text-emphasis uk-text-meta uk-margin-remove-bottom uk-margin-remove-top">{game.verification ? 'Verified' : 'Unverified'}</p>
                        <Link href={game.cardType.wikipediaLink}><a className="uk-text-meta uk-margin-remove-top">{`Uses ${game.cardType.name}`}</a></Link>
                    </div>
                </div>
                <div className='uk-position-right uk-padding'>
                    <Link href={`/games/edit/${game.id}`}>
                        <a uk-icon="icon: pencil; ratio: 1.5"/>
                    </Link>
                </div>
            </div>
            <div className="uk-card-body">
                <p>{game.description}</p>
                <p>{`${game.reviews.length || 'No'} review${game.reviews.length === 1 ? '' : 's'}`}</p>
            </div>
            <div className="uk-card-footer">
                <Link href={gameLink(game.id)}><a className="uk-button uk-button-text">Read Reviews</a></Link>
            </div>
        </div>
    )
}
