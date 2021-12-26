import { Box, List, ListItem, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { QueryGuard } from '../components/Guards'
import { useGetCardGames } from '../dataLayer/queries'

const Home: NextPage = () => {
  const gameListQuery = useGetCardGames()

  return (
    <>
    <Box m={5}>
      <Typography variant="h1" align="center">Card Game Database</Typography>
    </Box>
    <Box m={10}>
      <QueryGuard {...gameListQuery}>
        {(gameList) => (
          <List>
            {gameList.map((game, idx) => (
              <ListItem key={idx}>
                <Typography>{game.name}</Typography>
              </ListItem>
            ))}
          </List>
        )}
      </QueryGuard>
    </Box>
    </>
  )
}

export default Home
