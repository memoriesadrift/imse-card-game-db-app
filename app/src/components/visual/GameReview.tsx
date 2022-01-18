import React from 'react'
import { Review } from '../../types'

type GameReviewProps = {
    review: Review
}

export default function GameReview({review}: GameReviewProps) {
    return (
        <div>
            {[...Array(review.rating).keys()].map((_n, idx) => <span key={idx} uk-icon='icon: star' />)}
            <p>By: {review.leftByUser}</p>
            <p>{review.text}</p>
            <p>Date: {new Date(review.timestamp).toDateString()}</p>
        </div>
    )
}
