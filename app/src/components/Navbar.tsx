import React from 'react'
import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="uk-navbar-container uk-navbar-transparent" uk-navbar="">
            <div className="uk-navbar-center">
                <ul className="uk-navbar-nav">
                    <li className="uk-active"><Link href="/"><a>Home</a></Link></li>
                    <li><Link href="/games"><a>Card Games</a></Link></li>
                    <li><Link href="/game/add"><a>Add Game</a></Link></li>
                    <li><Link href="/login"><a>Log In</a></Link></li>
                </ul>
            </div>
        </nav>
    )
}
