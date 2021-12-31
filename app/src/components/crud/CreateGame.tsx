import React from 'react'

export default function CreateGame() {
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

                    <div className="uk-margin">
                        <div className="uk-form-label">Radio</div>
                        <div className="uk-form-controls uk-form-controls-text">
                            <label><input className="uk-radio" type="radio" name="radio1"/> Option 01</label><br/>
                            <label><input className="uk-radio" type="radio" name="radio1"/> Option 02</label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}