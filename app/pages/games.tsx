import type { NextPage } from 'next'
import { QueryGuard } from '../src/components/Guards'
import Navbar from '../src/components/navbar'
import { useGetCardGames } from '../src/dataLayer/queries'

const Games: NextPage = () => {
  const gameListQuery = useGetCardGames()

  return (
    <>
      <Navbar />
      <h1 className="uk-heading-medium uk-text-center">Home</h1>
      <QueryGuard {...gameListQuery}>
        {(gameList) => (
          <ul className='uk-list'>
            {gameList.map((game, idx) => (
              <li key={idx}>
                {game.name}
              </li>
            ))}
          </ul>
        )}
      </QueryGuard>
    </>
  )
}

export default Games
