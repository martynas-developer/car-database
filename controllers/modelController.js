var Model = require('../models/model');
var Brand = require('../models/brand');
var Feature = require('../models/feature');

var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.model_list = function(req, res) {
    Model.find({}, 'name type')
        .populate('brand')
        .exec(function (err, list_models) {
            if (err) { return next(err); }
            res.render('model/model_list', { title: 'Model List', model_list: list_models });
        });
};

exports.model_detail = function(req, res) {

    async.parallel({
        model: function(callback) {
            Model.findById(req.params.id)
                .populate('brand')
                .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.model==null) {
            var err = new Error('model not found');
            err.status = 404;
            return next(err);
        }
        res.render('model/model_detail', { title: results.model.name, model: results.model } );
    });
};

exports.model_create_get = function(req, res) {
    async.parallel({
        brands: function(callback) {
            Brand.find(callback);
        },
        features: function (callback) {
            Feature.find(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('model/model_form', { title: 'Create model', brands: results.brands, features: results.features });
    });
};

exports.model_create_post = [
    // Convert the feature to an array.
    (req, res, next) => {
        if(!(req.body.feature instanceof Array)){
            if(typeof req.body.feature==='undefined')
                req.body.feature=[];
            else
                req.body.feature=new Array(req.body.feature);
        }
        next();
    },
    // Validate fields.
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }),
    body('type', 'Type must not be empty.').trim().isLength({ min: 1 }),
    body('brand', 'Brand must not be empty.').trim().isLength({ min: 1 }),
    body('production_start', 'Invalid date of production start').optional({ checkFalsy: true }).isISO8601(),
    body('production_end', 'Invalid date of production end').optional({ checkFalsy: true }).isISO8601(),

    // https://github.com/express-validator/express-validator/issues/791
    //sanitizeBody('*').escape(),
    //sanitizeBody('feature.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Model object with escaped and trimmed data.
        var model = new Model(
            {
                name: req.body.name,
                type: req.body.type,
                brand: req.body.brand,
                feature: req.body.feature,
                production_start: req.body.production_start,
                production_end: req.body.production_end
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            async.parallel({
                brands: function(callback) {
                    Brand.find(callback);
                },
                features: function (callback) {
                    Feature.find(callback);
                }
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected features as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (model.feature.indexOf(results.features[i]._id) > -1) {
                        results.features[i].checked='true';
                    }
                }
                res.render('model/model_form', { title: 'Create model', brands: results.brands, features: results.features, model: model, errors: errors.array() });
            });
            return;
        }
        else {
            model.save(function (err) {
                if (err) { return next(err); }
                res.redirect(model.url);
            });
        }
    }
];

exports.model_delete_get = function(req, res, next) {
    Model.findById(req.params.id)
        .populate('brand')
        .exec(function (err, model) {
            if (err) { return next(err); }
            if (model==null) {
                res.redirect('/catalog/models');
            }
            res.render('model/model_delete', { title: 'Delete Model', model:  model});
        })
};

exports.model_delete_post = function(req, res, next) {
    Model.findByIdAndRemove(req.body.modelid, function deleteModel(err) {
        if (err) { return next(err); }
        res.redirect('/catalog/models');
    });
};

exports.model_update_get = function(req, res, next) {
    async.parallel({
        model: function(callback) {
            Model.findById(req.params.id).populate('brand').populate('feature').exec(callback);
        },
        brands: function(callback) {
            Brand.find(callback);
        },
        features: function (callback) {
            Feature.find(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.model==null) {
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        for (var features_iterator = 0; features_iterator < results.features.length; features_iterator++) {
            for (var model_featute_iterator = 0; model_featute_iterator < results.model.feature.length; model_featute_iterator++) {
                if (results.features[features_iterator]._id.toString()==results.model.feature[model_featute_iterator]._id.toString()) {
                    results.features[features_iterator].checked='true';
                }
            }
        }
        res.render('model/model_form', { title: 'Update Model', brands: results.brands, features: results.features, model: results.model });
    });

};

exports.model_update_post = [

    // Convert the feature to an array.
    (req, res, next) => {
        if(!(req.body.feature instanceof Array)){
            if(typeof req.body.feature==='undefined')
                req.body.feature=[];
            else
                req.body.feature=new Array(req.body.feature);
        }
        next();
    },
    // Validate fields.
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }),
    body('type', 'Type must not be empty.').trim().isLength({ min: 1 }),
    body('brand', 'Brand must not be empty.').trim().isLength({ min: 1 }),
    body('production_start', 'Invalid date of production start').optional({ checkFalsy: true }).isISO8601(),
    body('production_end', 'Invalid date of production end').optional({ checkFalsy: true }).isISO8601(),

    // https://github.com/express-validator/express-validator/issues/791
    //sanitizeBody('*').escape(),
    //sanitizeBody('feature.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Model object with escaped and trimmed data.
        var model = new Model(
            {
                name: req.body.name,
                type: req.body.type,
                brand: req.body.brand,
                feature: (typeof req.body.feature==='undefined') ? [] : req.body.feature,
                production_start: req.body.production_start,
                production_end: req.body.production_end,
                _id: req.params.id //This is required, or a new ID will be assigned!
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            async.parallel({
                brands: function(callback) {
                    Brand.find(callback);
                },
                features: function (callback) {
                    Feature.find(callback);
                }
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected features as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (model.feature.indexOf(results.features[i]._id) > -1) {
                        results.features[i].checked='true';
                    }
                }
                res.render('model/model_form', { title: 'Update model', brands: results.brands, features: results.features, model: model, errors: errors.array() });
            });
            return;
        }
        else {
            Model.findByIdAndUpdate(req.params.id, model, {}, function (err, themodel) {
                if (err) { return next(err); }
                res.redirect(themodel.url);
            });
        }
    }
];