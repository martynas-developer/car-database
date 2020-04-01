var Feature = require('../models/feature');
var Model = require('../models/model');

var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.feature_list = function(req, res) {
    Feature.find()
        .exec(function (err, list_features) {
            if (err) { return next(err); }
            res.render('feature/feature_list', { title: 'Feature List', feature_list: list_features });
        });
};

exports.feature_detail = function(req, res, next) {
    async.parallel({
        feature: function(callback) {
            Feature.findById(req.params.id)
                .exec(callback);
        },
        feature_models: function(callback) {
            Model.find({ 'feature': req.params.id })
                .populate('brand')
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.feature==null) {
            var err = new Error('feature not found');
            err.status = 404;
            return next(err);
        }
        res.render('feature/feature_detail', { title: results.feature.title, feature: results.feature, feature_models: results.feature_models } );
    });

};

exports.feature_create_get = function(req, res) {
    res.render('feature/feature_form', { title: 'Create feature' })
};

exports.feature_create_post = [

    body('name', 'Name required').trim().isLength({ min: 1 }),
    body('description').trim(),

    sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a feature object with escaped and trimmed data.
        var feature = new Feature(
            {
                name: req.body.name,
                description: req.body.description
            }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('feature/feature_form', { title: 'Create feature', feature: feature, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid.
            // Check if Feature with same name already exists.
            Feature.findOne({ 'name': req.body.name })
                .exec( function(err, found_feature) {
                    if (err) { return next(err); }

                    if (found_feature) {
                        res.redirect(found_feature.url);
                    }
                    else {

                        feature.save(function (err) {
                            if (err) { return next(err); }
                            res.redirect(feature.url);
                        });

                    }

                });
        }
    }
];

exports.feature_delete_get = function(req, res, next) {
    async.parallel({
        feature: function(callback) {
            Feature.findById(req.params.id).exec(callback)
        },
        feature_models: function(callback) {
            Model.find({ 'feature': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.feature==null) {
            res.redirect('/catalog/features');
        }
        res.render('feature/feature_delete', { title: 'Delete Feature', feature: results.feature, feature_models: results.feature_models } );
    });
};

exports.feature_delete_post = function(req, res, next) {

    async.parallel({
        feature: function(callback) {
            Feature.findById(req.params.id).exec(callback)
        },
        feature_models: function(callback) {
            Model.find({ 'feature': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.feature_models.length > 0) {
            res.render('feature/feature_delete', { title: 'Delete Feature', feature: results.feature, feature_models: results.feature_models } );
            return;
        }
        else {
            Feature.findByIdAndRemove(req.body.featureid, function deleteFeature(err) {
                if (err) { return next(err); }
                res.redirect('/catalog/features')
            })
        }
    });
};

exports.feature_update_get = function(req, res, next) {
    Feature.findById(req.params.id)
        .exec(function (err, feature) {
            if (err) { return next(err); }
            if (feature==null) {
                res.redirect('/catalog/features');
            }
            res.render('feature/feature_form', { title: 'Update Feature', feature:  feature});
        })
};

exports.feature_update_post =  [

    body('name', 'Name required').trim().isLength({ min: 1 }),
    body('description').trim(),

    sanitizeBody('*').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var feature = new Feature(
            {
                name: req.body.name,
                description: req.body.description,
                _id: req.params.id //This is required, or a new ID will be assigned!
            }
        );


        if (!errors.isEmpty()) {
            res.render('feature/feature_form', { title: 'Update feature', feature: feature, errors: errors.array()});
            return;
        }
        else {
            Feature.findByIdAndUpdate(req.params.id, feature, {}, function (err, updateFeature) {
                if (err) { return next(err); }
                res.redirect(updateFeature.url);
            });
        }
    }
];