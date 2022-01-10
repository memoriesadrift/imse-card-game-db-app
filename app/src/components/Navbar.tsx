import React from 'react'
import Link from 'next/link'
import { addGame, games, home, login, reports } from '../utils/links'

export default function Navbar() {
    return (
        <nav className="uk-navbar-container uk-navbar-transparent" uk-navbar="">
            <div className="uk-navbar-center">
                <ul className="uk-navbar-nav">
                    <li className="uk-active"><Link href={home}><a>Home</a></Link></li>
                    <li><Link href={games}><a>Card Games</a></Link></li>
                    <li><Link href={addGame}><a>Add Game</a></Link></li>
                    <li><Link href={reports}><a>Reports</a></Link></li>
                    <li><Link href={login}><a>Log In</a></Link></li>
                </ul>
            </div>
        </nav>
    )
}
