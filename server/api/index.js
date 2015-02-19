
'use strict';

var express = require('express');
var controller = require('../controllers/userController.js');
//var config = require('../../config/environment');
//var auth = require('../../auth/auth.service');

var router = express.Router();

//router.get('/', auth.hasRole('admin'), controller.index);
//router.delete('/:id', auth.hasRole('admin'), controller.destroy);
//router.get('/me', auth.isAuthenticated(), controller.me);
//router.post('/me/search', auth.isAuthenticated(), controller.search);
//router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', req.isAuthenticated(), controller.show);
//router.post('/', controller.create);
//router.get('/profiles/:githubUsername', controller.getUserProfile);
//router.post('/profiles/:githubUsername', auth.isAuthenticated(), controller.postNewSkill);

module.exports = router;