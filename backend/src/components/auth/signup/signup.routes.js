const express = require('express')
const signupRoutes = express.Router()
const signupController = require('./signup.controller')

signupRoutes.post('/signup', signupController.signUp)

module.exports = signupRoutes