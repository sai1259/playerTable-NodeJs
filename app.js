const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const app = express()
app.use(express.json())
const dbpath = path.join(__dirname, 'cricketTeam.db')
module.exports = app
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Runnig at http://localhost/3000')
    })
  } catch (e) {
    console.log(`DB Error ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

//Getting Array of Players API 1

app.get('/players/', async (request, response) => {
  const {playerName} = request.params
  const getPlayersQuery = `
    SELECT
      *
    FROM
      cricket_team;
    OREDER BY
      '${playerName}' DESC`

  const playersArray = await db.all(getPlayersQuery)
  response.send(playersArray)
})

//API 2

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const playerQuery = `
      INSERT INTO 
        cricket_team (player_name, jersey_number, role)
      VALUES
        (
          '${playerName}',
          '${jerseyNumber}',
          '${role}'
        );`
  await db.run(playerQuery)
  response.send('Player Added to Team')
})

//API 3

app.get('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
    SELECT 
      *
    FROM
      cricket_team
    WHERE
      player_id = ${playerId};`

  const player = await db.get(getPlayerQuery)
  response.send({player})
})

//API 4

app.put('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updateQueryParameter = `
    UPDATE
      cricket_team
    SET
      player_name = '${playerName}',
      jersey_number = '${jerseyNumber}',
      role = '${role}'
    WHERE
      player_id = '${playerId}';`
  await db.run(updateQueryParameter)
  response.send('Player Details Updated')
})

//API 5

app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `
      DELETE FROM
        cricket_team
      WHERE
        player_id = '${playerId}';`
  await db.run(deletePlayerQuery)
  response.send('Player Removed')
})
