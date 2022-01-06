import React from 'react'
import { useAddCardGame } from '../../dataLayer/mutations'

export default function CreateGame() {
    const addGame = useAddCardGame()

    return (
        <div className='uk-card uk-card-default uk-width-1-2@m uk-align-center'>
            <div className='uk-card-body'>
                <form className="uk-form-horizontal uk-margin-medium">
                    <div className="uk-margin">
                        <label className="uk-form-label" htmlFor="form-horizontal-text">Name</label>
                        <div className="uk-form-controls">
                            <input className="uk-input" id="form-horizontal-text" type="text" placeholder="What's the name of your card game?"/>
                        </div>
                    </div>

                    <div className="uk-margin">
                        <label className="uk-form-label" htmlFor="form-horizontal-select">Card Type</label>
                        <div className="uk-form-controls">
                            <select className="uk-select" id="form-horizontal-select">
                                <option>French-suited playing cards</option>
                                <option>Other (specify in description)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="uk-margin">
                        <label className="uk-form-label" htmlFor="form-horizontal-select">Description</label>
                        <div className="uk-form-controls uk-margin">
                            <textarea className="uk-textarea" rows={5} placeholder="Describe your card game..."/>
                        </div>
                    </div>
                </form>
                <button className="uk-button uk-button-danger uk-button-large" onClick={async () => {/*await addGame.mutateAsync(game)*/}}>Delete</button>  
            </div>
        </div>
    )
}
