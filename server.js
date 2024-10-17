const dotenv = require('dotenv') // require package
dotenv.config() // Loads the environment variables from .env file
const express = require('express')
const mongoose = require('mongoose') // require package
const methodOverride = require('method-override')
const morgan = require('morgan')
const path = require('path')

const app = express()

//////////////////////////////////////////////////////
///////////////      MODELS    ///////////////////////
//////////////////////////////////////////////////////
const Fruit = require('./models/fruit.js')

//////////////////////////////////////////////////////
///////////////     MIDDLEWARE     ///////////////////
//////////////////////////////////////////////////////
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, "public")))

//////////////////////////////////////////////////////
///////////////     DB CONNECTION    /////////////////
//////////////////////////////////////////////////////
// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI)
// log connection status to terminal on start
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name} 🍒`)
})

//////////////////////////////////////////////////////
///////////////     ROUTES     ///////////////////////
//////////////////////////////////////////////////////
// GET homepage
app.get('/', async (req, res) => {
  res.render('index.ejs')
})

// GET /fruits (Read - Index)
app.get('/fruits', async (req, res) => {
  const allFruits = await Fruit.find({})
  //   pass the fruits data from our database to the EJS file by passing { fruits: allFruits }
  res.render('fruits/index.ejs', { fruits: allFruits })
})

// GET /fruits/new (New form)
app.get('/fruits/new', (req, res) => {
  res.render('fruits/new.ejs')
})

// DELETE /fruits/:fruitId (Delete)
app.delete('/fruits/:fruitId', async (req, res) => {
  await Fruit.findByIdAndDelete(req.params.fruitId)
  res.redirect('/fruits')
})

// GET /fruits/:fruitId (Read - Show)
app.get('/fruits/:fruitId', async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId)
  res.render('fruits/show.ejs', { fruit: foundFruit })
})

// POST /fruits (Create)
app.post('/fruits', async (req, res) => {
  //   convert this "on" or undefined value to a Boolean
  const formData = req.body
  if (req.body.isReadyToEat === 'on') {
    formData.isReadyToEat = true
  } else {
    formData.isReadyToEat = false
  }

  //   Create fruit in database
  await Fruit.create(formData)

  //   redirect the user back to the form page
  res.redirect('/fruits')
})

// GET /fruits/:fruitId/edit
app.get('/fruits/:fruitId/edit', async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId)
  console.log(foundFruit)
  res.render('fruits/edit.ejs', { fruit: foundFruit })
})

app.put('/fruits/:fruitId', async (req, res) => {
  //   convert this "on" or undefined value to a Boolean
  const formData = req.body
  if (req.body.isReadyToEat === 'on') {
    formData.isReadyToEat = true
  } else {
    formData.isReadyToEat = false
  }
  await Fruit.findByIdAndUpdate(req.params.fruitId, formData)
  res.redirect(`/fruits/${req.params.fruitId}`)
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})

//
