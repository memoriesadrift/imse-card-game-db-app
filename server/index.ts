// TODO: Upgrade to TS
import express, { json } from 'express';
import { convertCardGame, convertReview } from './converters.js';
import { migrateDatabase } from './database/databaseMigrate.js';
import { IDatabase } from './database/IDatabase.js';
import { MongoDatabase } from './database/mongo/mongoDatabase.js';
const app = express()
import {RelationalDb} from "./database/RDBMS/relationaldb.js";

const port = 8080

app.use(json()) // enable JSON parsing in request body, for POST requests

let database:IDatabase = new RelationalDb();


// Set headers for each request
app.use((req, res, next) => {
  // Allow requests from client
  res.setHeader('Access-Control-Allow-Origin', 'https://localhost')
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
  next()
})

// DB Strategy
app.get('/api/strategy', (_req, res) => {
  res.send('none')
})

// generate db entries
app.get('/api/populate', async (_req, res) => {

  const populateSuccessful = await database.populateDB();

  if (populateSuccessful) {
    res.status(200).send({"success": true});
  } else {
    res.status(500).send({"success": false});
  }
});

app.get('/api/migrate', async (_req, res) => {
  const success = await migrateDatabase();

  if (success) {
    database = new MongoDatabase()
    res.status(200).send({"success": true});
  } else {
    res.status(400).send({"success": false});
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
 
  const id = req.params.id;
  
  const cardGame = await database.getCardGame(id);
  console.log(cardGame);
  if (!cardGame) {
    res.status(500).send({});
  } else {
    res.status(200).send(cardGame);
  }
});

// Add game
app.post('/api/games', async (req, res) => {

  const cardGame = convertCardGame(req.body);

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
app.put('/api/games/:id', async (req, res) => {

  const id = parseInt(req.params.id)
  const cardGame = convertCardGame(req.body);

  if (!cardGame || !cardGame.id || id !== cardGame.id) {
    res.status(422).send({"success":false});
    return;
  }

  const updateSuccessful = await database.updateCardGame(cardGame);
  if (!updateSuccessful) {
    res.status(422).send({"success":false});
    return;
  }

  res.status(200).send({"success":true});
})

// Get card types
app.get('/api/cardtypes', async (_req, res) => {
  const cardTypes = await database.getCardTypes();
  if (!cardTypes) {
    res.status(422).send({"success":false});
    return;
  }

  res.status(200).send(cardTypes);
});


// POST review
app.post('/api/games/review/:id', async (req, res) => {
  const id = req.params.id

  const review = convertReview(req.body);
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
  

// Reports
app.get('/api/reports/1', async (req, res) => {
  const reportOne = await database.getReportOne();

  if (!reportOne) {
    res.status(500).send({"success":false});
    return;
  }

  res.status(200).send({"success":true, report: reportOne});
});

app.get('/api/reports/2', async (req, res) => {
  const reportTwo = await database.getReportTwo();

  if (!reportTwo) {
    res.status(500).send({"success":false});
    return;
  }
  
  res.status(200).send({"success":true, report: reportTwo});
});

// Get Users
app.get('/api/users', async (req, res) => {
  const users = await database.getUserNames();

  if(!users){
    res.status(500).send({"success":false});
  }

  res.status(200).send(users);
});

// test if db works
app.get('/db', async (req, res) => {
  const databaseReady = await database.isDBReady();
  if (databaseReady) {
    res.status(200).send("Connected!");
  } else {
    res.status(500).send("DB connection failed");
  }
});

app.listen(port, () => console.log(`Listening on port ${port}...`))
