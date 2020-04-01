var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FeatureSchema = new Schema(
    {
        name: {type: String, required: true},
        description: {type: String},
    }
);

FeatureSchema
    .virtual('url')
    .get(function () {
        return '/catalog/feature/' + this._id;
    });

module.exports = mongoose.model('Feature', FeatureSchema);