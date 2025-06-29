const Joi = require('joi');
const review = require('./models/review');

//server side listing validation using joi
const listingSchema = Joi.object({
    //listing type ka ek object hona chahiye bo bi required, uske under title,description and ..... hona chaiye
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            filename: Joi.string().default("listingImage"),
            url: Joi.string().allow('', null)
        })
    }).required()
});

//server side validation for review
const reviewSchema=Joi.object({
    review:Joi.object({
      rating:Joi.number().required().min(1).max(5),
      comment:Joi.string().required()
    }).required()
}) 

module.exports = {listingSchema,reviewSchema};
