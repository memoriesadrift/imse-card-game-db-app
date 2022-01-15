import React, { useState } from 'react'
import { buildNewCardGameObject, cardTypeFromJSONString, cardTypeToJSONString, useGetCardTypes } from '../../dataLayer'
import { useUpdateCardGame } from '../../dataLayer/mutations'
import { CardGame, CardType } from '../../types'
import { onChangeWrapper } from '../../utils'
import { MutationGuard, QueryGuard } from '../Guards'

type UpdateGameProps = {
    cardGame: CardGame
}

export default function UpdateGame({cardGame}: UpdateGameProps) {
    const updateGame = useUpdateCardGame()
    const cardTypesQuery = useGetCardTypes()

    const [gameName, setGameName] = useState(cardGame.name)
    const [description, setDescription] = useState(cardGame.description)
    const [rawCardType, setRawCardType] = useState(cardTypeToJSONString(cardGame.cardType))

    const submit = async () => {
        const cardType: CardType = cardTypeFromJSONString(rawCardType)
        const newGame = buildNewCardGameObject(gameName, description, cardType, cardGame.id)
        console.log('posting game:')
        console.log(JSON.stringify(newGame))

        try {
            await updateGame.mutateAsync(newGame)
        } catch (error) {}
    }

    return (
        <QueryGuard {...cardTypesQuery}>
            {(cardTypes) => (
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
                                    <select
                                        className="uk-select"
                                        id="form-horizontal-select"
                                        defaultValue={rawCardType}
                                        onChange={(event) => setRawCardType(event.target.value)}
                                    >
                                        {cardTypes.map((cardType) => (
                                            <option value={cardTypeToJSONString(cardType)} key={cardType.id}>{cardType.name}</option>
                                        ))}
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
                                Update
                            </button>  
                        </div>
                        <MutationGuard {...updateGame}/>
                    </div>
                </div>
            )}
        </QueryGuard>
    )
}
