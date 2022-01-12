// TODO: Upgrade to TS
import express, { json } from 'express';
import { convertCardGame, convertReview } from './converters.js';
const app = express()
import {RelationalDb} from "./database/RDBMS/relationaldb.js";

const port = 8080

app.use(json()) // enable JSON parsing in request body, for POST requests

const database = new RelationalDb();


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
app.get('/api/populate', async (_req, res) => {
  if (await database.populateDB()) {
    res.status(200).send({"success": true});
  } else {
    res.status(500).send({"success": false});
  }
});

// List games
app.get('/api/games', async (_req, res) => {
  const cardGames = await database.getCardGames();
  
  if (!cardGames) {
    res.status(500).send({});
  } else {
    res.status(200).send(cardGames);
  }
})

// Get single game
app.get('/api/games/:id', async (req, res) => {
  const cardGame = await database.getCardGame(parseInt(req.params.id));
  if (!cardGame) {
    res.status(500).send({});
  } else {
    res.status(200).send(cardGame);
  }
});

// Add game
app.post('/api/games', async (req, res) => {

  const cardGame = convertCardGame(req.body.cardGame);

  if (!cardGame) {
    console.log("Converting card game failed!");
    res.status(422).send({"success":false});
    return;
  }

  if (!await database.insertCardGame(cardGame)) {
    console.log("Inserting card game into DB failed");
    res.status(422).send({"success":false});
  }

  console.log("card game successfuly inserted");
  res.status(200).send({"success":true});
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

  // Update
  const newGame = {...game, name: req.body.name, description: req.body.description}
  testGames = testGames.filter((game) => game.id !== id)
  testGames.push(newGame)

  res.send(newGame)
})


// POST review
app.post('/api/games/review/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  const review = convertReview(req.body.review);
  if (!review) {
    console.log("Converting review failed!");
    res.status(422).send({"success":false});
    return;
  }

  if (!await database.insertReview(id, review)) {
    console.log("Inserting review failed");
    res.status(422).send({"success":false});
    return;
  }

  console.log("Insertin review successful");
  res.status(200).send({"success":true});
});

// test if db works
app.get('/db', async (req, res) => {
  if (await database.isDBReady()) {
    res.status(200).send("Connected!");
  } else {
    res.status(500).send("DB connection failed");
  }
});

app.listen(port, () => console.log(`Listening on port ${port}...`))
