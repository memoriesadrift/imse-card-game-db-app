import Link from 'next/link'
import React from 'react'
import { CardGame } from '../../types'
import { reviewGame } from '../../utils/links'
import GameReview from './GameReview'

type CardGameListCardProps = {
    game: CardGame,
}

export default function CardGameCard({game}: CardGameListCardProps) {
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
            </div>
            <div className="uk-card-body">
                <p>{game.description}</p>
                <h4 className="uk-margin-remove-bottom">Reviews</h4>
                <hr />
                {game.reviews.map((review, idx) => (
                    <>
                        <GameReview key={idx} {...{review}} />
                        <hr className='uk-divider-small' />
                    </>
                ))}
            </div>
            <div className="uk-card-footer">
                <Link href={reviewGame(game.id)}><a className="uk-button uk-button-text">Leave a Review</a></Link>
            </div>
        </div>
    )
}
