import React, { useState } from 'react'
import { buildNewCardGameObject, cardTypeFromName } from '../../dataLayer'
import { useAddCardGame } from '../../dataLayer/mutations'
import { CardType } from '../../types'
import { onChangeWrapper } from '../../utils'
import { MutationGuard } from '../Guards'

export default function CreateGame() {
    const addGame = useAddCardGame()
    // const cardTypes = useGetCardTypes()

    const [gameName, setGameName] = useState('')
    const [description, setDescription] = useState('')
    const [rawCardType, setRawCardType] = useState('')

    const submit = async () => {
        const cardType: CardType = cardTypeFromName(rawCardType)
        const newGame = buildNewCardGameObject(gameName, description, cardType)

        await addGame.mutateAsync(newGame)
    }

    return (
        <div className='uk-card uk-card-default uk-width-1-2@m uk-align-center'>
            <div className='uk-card-body'>
                <form className="uk-form-horizontal uk-margin-medium">
                    <div className="uk-margin">
                        <label className="uk-form-label" htmlFor="form-horizontal-text">Name</label>
                        <div className="uk-form-controls">
                            <input 
                                className="uk-input"
                                id="form-horizontal-text"
                                type="text"
                                placeholder="What's the name of your card game?"
                                onChange={(event) => onChangeWrapper(event, setGameName)}
                                value={gameName}
                                />
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
                            <textarea
                            className="uk-textarea" 
                            rows={5} 
                            placeholder="Describe your card game..."
                            onChange={(event) => onChangeWrapper(event, setDescription)}
                            value={description}
                            />
                        </div>
                    </div>
                </form>
                <div className="uk-flex uk-flex-center">
                    <button
                        className="uk-button uk-button-default uk-button-large"
                        onClick={async () => await submit()}
                    >
                        Submit
                    </button>  
                </div>
                <MutationGuard {...addGame}/>
            </div>
        </div>
    )
}
