import React, { useState } from 'react'
import { buildNewPartialReviewObject, useUsers } from '../../dataLayer'
import { useLeaveReview } from '../../dataLayer/mutations'
import { Username } from '../../types'
import { onChangeWrapper } from '../../utils'
import { MutationGuard, QueryGuard } from '../Guards'

type LeaveReviewProps = {
    gameId: number,
}

export default function LeaveReview({gameId}: LeaveReviewProps) {
    const leaveReview = useLeaveReview()
    const usersQuery = useUsers()

    const [rating, setRating] = useState(1)
    const [reviewText, setReviewText] = useState('')
    const [user, setUser] = useState('')

    const submit = async () => {
        try {
         await leaveReview.mutateAsync(
            {
                review: buildNewPartialReviewObject(rating, reviewText, user as Username),
                forGameId: gameId
            })
        } catch (error) {}
    }

    return (
        <QueryGuard {...usersQuery}>
            {(users) => (
                <div className='uk-card uk-card-default uk-width-1-2@m uk-align-center'>
                    <div className='uk-card-body'>
                        <form className="uk-form-horizontal uk-margin-medium">
                            <div className="uk-margin">
                                <label className="uk-form-label" htmlFor="form-horizontal-text">Rating</label>
                                <select 
                                    className="uk-select"
                                    defaultValue={rating}
                                    onChange={(event) => setRating(parseInt(event.target.value))}
                                >
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                    <option value={6}>6</option>
                                    <option value={7}>7</option>
                                    <option value={8}>8</option>
                                    <option value={9}>9</option>
                                    <option value={10}>10</option>
                                </select>
                            </div>
                            <div className="uk-margin">
                                <label className="uk-form-label" htmlFor="form-horizontal-text">User</label>
                                <select 
                                    className="uk-select"
                                    defaultValue={rating}
                                    onChange={(event) => setUser(event.target.value)}
                                >
                                    {users.map((user) => (
                                        <option key={user} value={user}>{user}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="uk-margin">
                                <label className="uk-form-label" htmlFor="form-horizontal-select">Review Body</label>
                                <div className="uk-form-controls uk-margin">
                                    <textarea
                                        onChange={(event) => onChangeWrapper(event, setReviewText)}
                                        className="uk-textarea"
                                        rows={5}
                                        placeholder="Write your review here."
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="uk-flex uk-flex-center">
                            <button 
                                className="uk-button uk-button-default uk-button-large" 
                                onClick={async () => await submit()}
                            >
                                Leave Review
                            </button>  
                        </div>
                        <MutationGuard {...leaveReview}/>
                    </div>
                </div>
            )}
        </QueryGuard>
    )
}
