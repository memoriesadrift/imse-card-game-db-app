import React from 'react'

type LeaveReviewProps = {
    gameId: number,
}

export default function LeaveReview({gameId: number}: LeaveReviewProps) {
    return (
        <div>
            <div className='uk-card uk-card-default uk-width-1-2@m uk-align-center'>
                <div className='uk-card-body'>
                    <form className="uk-form-horizontal uk-margin-medium">
                        <div className="uk-margin">
                            <label className="uk-form-label" htmlFor="form-horizontal-text">Rating</label>
                            <select className="uk-select">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                            </select>
                        </div>
                        <div className="uk-margin">
                            <label className="uk-form-label" htmlFor="form-horizontal-select">Review Body</label>
                            <div className="uk-form-controls uk-margin">
                                <textarea className="uk-textarea" rows={5} placeholder="Write your review here."/>
                            </div>
                        </div>
                    </form>
                    <div className="uk-flex uk-flex-center">
                        <button 
                            className="uk-button uk-button-default uk-button-large" 
                            onClick={async () => {/*await addGame.mutateAsync(game)*/}}
                        >
                            Submit
                        </button>  
                    </div>
                </div>
            </div>
            
        </div>
    )
}
