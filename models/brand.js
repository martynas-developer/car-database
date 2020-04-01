var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var BrandSchema = new Schema(
    {
        name: {type: String, required: true, max: 100},
        //logo
        founded: {type: Date},
    }
);

BrandSchema
    .virtual('url')
    .get(function () {
        return '/catalog/brand/' + this._id;
    });

BrandSchema
    .virtual('founded_formatted')
    .get(function () {
        return moment(this.founded).format('YYYY');
    });

module.exports = mongoose.model('Brand', BrandSchema);