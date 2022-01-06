import { assert } from 'console'
import React from 'react'
import {useClientRouter} from 'use-client-router'
import { QueryGuard } from '../../../src/components/Guards'
import Navbar from '../../../src/components/Navbar'
import { useGetCardGame } from '../../../src/dataLayer'

export default function EditGame() {
    const router = useClientRouter()
    const {id} = router.query

    const onSubmit = () => {}
    
    const cardGameQuery = useGetCardGame(parseInt(id as string))

    return (
        <>
            <Navbar />
            <h1 className="uk-heading-medium uk-text-center">{`Game ${id}`}</h1>
            <QueryGuard {...cardGameQuery}>
            {(cardGame) => (
                <div className="uk-card uk-card-default uk-margin uk-text-center uk-width-1-2@m uk-align-center">
                    <div>
                        <div className="uk-card-body">
                            <h3 className="uk-card-title"> {cardGame.name} </h3>
                            <form className="uk-form-stacked" {...{onSubmit}}>
                                <div className="uk-margin">
                                    <label className="uk-form-label" htmlFor="form-stacked-text">Name</label>
                                    <div className="uk-form-controls">
                                        <input className="uk-input" id="form-stacked-text" type="text" name="customerName" placeholder="Loading..." onChange={(event) => null} ></input>
                                    </div>
                                </div>

                                <div className="uk-margin">
                                    <label className="uk-form-label" htmlFor="form-stacked-text">Description</label>
                                    <div className="uk-form-controls">
                                        <textarea className="uk-input" id="form-stacked-text" name="customerName" placeholder="Loading..." onChange={(event) => null} ></textarea>
                                    </div>
                                </div>

                                <div className="uk-margin"> 
                                    <input className="uk-input uk-width-auto@s uk-text-center" type="submit" value="Update" />
                                </div>
                            </form>

                            <button className="uk-button uk-button-danger uk-button-large" onClick={() => {}}>Delete</button>  

                        </div>
                    </div>
                </div>
            )}
            </QueryGuard>
        </>
    )
}
