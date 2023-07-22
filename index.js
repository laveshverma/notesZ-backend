const ConnectToMongo = require("./db");
const express = require('express')
var cors = require('cors') 


ConnectToMongo();

const app = express()
const port = 5000

app.use(cors())
app.options('*', cors())
app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
});
app.use(express.json())
// Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`NotesZ Backend listening on port ${port}`)
})

