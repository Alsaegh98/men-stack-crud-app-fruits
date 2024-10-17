const mongoose = require('mongoose')  //import the mongoose library


// define the schema for our fruit model
const fruitSchema = new mongoose.Schema({
    name: String,   //name, which will be a string
    isReadyToEat: Boolean,   // isReadyToEat, which will be a boolean indicating whether the fruit is ready to be eaten
})


// define the model for our fruit schema
const Fruit = mongoose.model('Fruit', fruitSchema)


// we want to export the Fruit model we just created, so that the rest of our application has access to it
module.exports = Fruit