var express = require('express');
var router = express.Router();

// Require controller modules.
var brand_controller = require('../controllers/brandController');
var model_controller = require('../controllers/modelController');
var feature_controller = require('../controllers/featureController');

/// BRAND ROUTES ///

router.get('/', brand_controller.index);
// GET request for creating a brand. NOTE This must come before routes that display brand (uses id).
router.get('/brand/create', brand_controller.brand_create_get);
router.post('/brand/create', brand_controller.brand_create_post);

router.get('/brand/:id/upload_logo', brand_controller.brand_upload_logo_get);
router.post('/brand/:id/upload_logo', brand_controller.brand_upload_logo_post);

router.get('/brand/:id/delete', brand_controller.brand_delete_get);
router.post('/brand/:id/delete', brand_controller.brand_delete_post);

router.get('/brand/:id/update', brand_controller.brand_update_get);
router.post('/brand/:id/update', brand_controller.brand_update_post);

router.get('/brand/:id', brand_controller.brand_detail);
router.get('/brands', brand_controller.brand_list);


/// MODEL ROUTES ///

// GET request for creating a model. NOTE This must come before routes that display brand (uses id).
router.get('/model/create', model_controller.model_create_get);
router.post('/model/create', model_controller.model_create_post);

router.get('/model/:id/delete', model_controller.model_delete_get);
router.post('/model/:id/delete', model_controller.model_delete_post);

router.get('/model/:id/update', model_controller.model_update_get);
router.post('/model/:id/update', model_controller.model_update_post);

router.get('/model/:id', model_controller.model_detail);
router.get('/models', model_controller.model_list);

/// FEATURE ROUTES ///

// GET request for creating a feature. NOTE This must come before routes that display brand (uses id).
router.get('/feature/create', feature_controller.feature_create_get);
router.post('/feature/create', feature_controller.feature_create_post);

router.get('/feature/:id/delete', feature_controller.feature_delete_get);
router.post('/feature/:id/delete', feature_controller.feature_delete_post);

router.get('/feature/:id/update', feature_controller.feature_update_get);
router.post('/feature/:id/update', feature_controller.feature_update_post);

router.get('/feature/:id', feature_controller.feature_detail);
router.get('/features', feature_controller.feature_list);

module.exports = router;