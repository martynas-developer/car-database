var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var ModelSchema = new Schema(
    {
        name: {type: String, required: true},
        brand: {type: Schema.ObjectId, ref: 'Brand', required: true},
        feature: [{ type: Schema.ObjectId, ref: 'Feature' }],
        type: {type: String, required: true, enum: ['Sedan', 'SUV', 'Coupe'], default: 'Sedan'},
        production_start: {type: Date},
        production_end: {type: Date, default: Date.now},
    }
);

ModelSchema.virtual('production').get(function () {
    return (this.production_start.getYear() - this.date_of_birth.production_end()).toString();
});

ModelSchema.virtual('url').get(function () {
    return '/catalog/model/' + this._id;
});

ModelSchema.virtual('production_start_yyyy_mm_dd').get(function() {
    return moment(this.production_start).format('YYYY-MM-DD');
});

ModelSchema.virtual('production_end_yyyy_mm_dd').get(function() {
    return moment(this.production_end).format('YYYY-MM-DD');
});

module.exports = mongoose.model('Model', ModelSchema);