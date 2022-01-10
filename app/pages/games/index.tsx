import type { NextPage } from 'next'
import { QueryGuard } from '../../src/components/Guards'
import Navbar from '../../src/components/Navbar'
import CardGameListCard from '../../src/components/visual/CardGameListCard'
import { useGetCardGames } from '../../src/dataLayer'

const Games: NextPage = () => {
  const gameListQuery = useGetCardGames()

  return (
    <>
      <Navbar />
      <h1 className="uk-heading-medium uk-text-center">Games</h1>
      <QueryGuard {...gameListQuery}>
        {(gameList) => (
          <ul className='uk-list'>
            {gameList.map((game, idx) => (
              <li key={idx}>
                <CardGameListCard game={game} />
              </li>
            ))}
          </ul>
        )}
      </QueryGuard>
    </>
  )
}

export default Games
