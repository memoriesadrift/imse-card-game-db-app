// TODO: Upgrade to TS
import express, { json } from 'express';
const app = express()
import { populateDb, isDbReady } from "./database/RDBMS/relationaldb.js";

const port = 8080

app.use(json()) // enable JSON parsing in request body, for POST requests



let testGames = [
  {
    id: 1,
    name: 'Joker',
    description: 'A fun party game.',
    cardType: {
      id: 1,
      name: 'French-suited playing cards',
      wikipediaLink: 'https://en.wikipedia.org/wiki/French-suited_playing_cards',
    },
    reviews: [
      {
        id: 1,
        text: 'I love how simple, yet complex this game is.',
        rating: 10,
        timestamp: 1387430922,
        leftByUser: 'johnny101',
      },
    ],
  },
  {
    id: 2,
    name: 'Poker',
    description: 'A casino favourite.',
    cardType: {
      id: 1,
      name: 'French-suited playing cards',
      wikipediaLink: 'https://en.wikipedia.org/wiki/French-suited_playing_cards',
    },
    verification: {
      comment: 'Classic. Approved.',
      timestamp: 1387430022,
      verifiedByAdmin: 'admin',
    },
    reviews: [
      {
        id: 1,
        text: 'I love all the layers this game has. Thrilling!',
        rating: 10,
        timestamp: 1420476577,
        leftByUser: 'angela1512',
      },
      {
        id: 2,
        text: 'You will be able to focus consistently, as long as you maintain placidity.',
        rating: 10,
        timestamp: 1387496002,
        leftByUser: 'seth9u52',
      },
    ],
  },
  {
    id: 3,
    name: 'Texas Hold \'em Poker',
    description: 'A spin on a casion classic.',
    cardType: {
      id: 1,
      name: 'French-suited playing cards',
      wikipediaLink: 'https://en.wikipedia.org/wiki/French-suited_playing_cards',
    },
    reviews: [],
  },
]

/*
// TODO: Extract validation logic
const gameSchema = object({
  name: string().max(20).required(),
  description: string().min(1),
})*/

// Set headers for each request
app.use((req, res, next) => {
  // Allow requests from client
  res.setHeader('Access-Control-Allow-Origin', '*')

  next()
})

// DB Strategy
app.get('/api/strategy', (_req, res) => {
  res.send('none')
})

// generate db entries
app.get('/api/populate', (_req, res) => {
  populateDb();
  res.send(":)");
});

// List games
app.get('/api/games', (_req, res) => {
  res.send(testGames)
})

// Add game
app.post('/api/games', (req, res) => {
  //const {error, value} = gameSchema.validate(req.body)

  const newGame = {
    id: testGames.length + 1,
    name: req.body.name,
    description: req.body.description || 'No description.',
    reviews: [],
  }
  res.send(newGame)
})

// Update Game
app.put('/api/games/:id', (req, res) => {
  // Lookup
  const id = parseInt(req.params.id)
  const game = testGames.find((game) => game.id === id)

  if (!game) {
    res.status(404).send('The game with the given ID could not be found.')
    return
  }

  /*
  // Validate
  const {error} = gameSchema.validate(req.body)

  if (error) {
    res.status(400).send(error)
    return
  }*/

  // Update
  const newGame = {...game, name: req.body.name, description: req.body.description}
  testGames = testGames.filter((game) => game.id !== id)
  testGames.push(newGame)

  res.send(newGame)
})

// Get single game
app.get('/api/games/:id', (req, res) => {
  // TODO: validate input properly
  const id = parseInt(req.params.id)
  const game = testGames.find((game) => game.id === id)

  res.status(game ? 200 : 404).send(game || 'The game with the given ID could not be found.')
})

// test if db works
app.get('/db', async (req, res) => {
  if (await isDbReady()) {
    res.send("Connected!");
  } else {
    res.send("DB connection failed");
  }
});

app.listen(port, () => console.log(`Listening on port ${port}...`))
