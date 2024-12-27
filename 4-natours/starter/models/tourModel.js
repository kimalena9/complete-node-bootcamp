const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
// specify schema for our data
// First Parameter -> schema definition
// Second Parameter -> options object that configures the behavior of the schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minLength: [10, 'A tour name must have more or equal than 10 characters'],
      // validator library -> .isAlpha checks whether a string contains only alphabetic characters
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // enum -> validator that restricts the possible values of a field (only for strings)
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be between above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      // mongoose internally binds 'this' to the document that is being saved or created before calling the validation function
      validate: {
        validator: function (val) {
          // 'this' only points to current doc on NEW document creation
          return val < this.price;
        },
        // {VALUE} -> when the validator function returns false, mongoose checks the message property and if it contains {VALUE}, it replaces {VALUE} with the value of the field being validated
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    // when we enable virtuals with toJSON, mongoose checks if the document has an _id field and dynamically creates an id field that maps directly to the string value of _id
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Mongoose's virtual property-> Does not persist in the database, is computed dynamically based on other fields in the document, can be accessed like a regular field when working with documents

// get function specifies how the virtual property is computed
// this-> refers to the document instance (since arrow functions do not have their own 'this', it uses the 'this' from where the schema is defined and not the document instance )
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE (provided by Mongoose):
// .pre() -> runs before .save() and .create()
//    has access to 'this' (the current instance of the document being saved)
// .post() -> runs after .save() and .create()
//    has access to 'doc' (the saved document)
// slug -> URL friendly string

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE

// .pre() -> sets up middlware function to run before a 'find' query is executed
// 'this' -> refers to the current query instance (not the document itself)
// 'this.find' -> adds a filter to the query
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  // next() signals completion of the middleware, allowing it to proceed with executing the query
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);
  next();
});

// pipeline() -> specific to the pre('aggregate) middleware.
//  returns an array of stages that represent the aggregation pipeline being built
// each stage processes data and passes the results to the next stage
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
