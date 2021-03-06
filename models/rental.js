const mongoose = require('mongoose');
const Joi = require('joi');
const {movieSchema} = require("./movie");

const Rental = mongoose.model('Rental', new mongoose.Schema({
   customer:{
      type: new mongoose.Schema({
         name:{
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
         },
         isGold:{
            type: Boolean,
            default: false
         },
         phone:{
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
         }
      })
   },
   date: {
      type: Date,
      default: Date.now
   },
   movie: {
      type: new mongoose.Schema({
         title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 255
         },
         dailyRentalRate: {
            type: Number,
            required: true,
            min: 0,
            max: 255
         }
      })
   },
   dateOut:{
      type: Date,
      required: true,
      default:Date.now
   },
   dateReturned:{
      type: Date
   },
   rentalFee:{
      type: Number,
      min: 0
   }
}));

function validateRental(movie) {
   const schema = {
      movieId: Joi.objectId().required(),
      customerId: Joi.objectId().required()
   };

   return Joi.validate(movie, schema);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;
