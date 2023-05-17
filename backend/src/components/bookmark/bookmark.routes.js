const express = require('express')
const bookmarkRoutes = express.Router()
const bookmarkController = require('./bookmark.controller')
const auth = require('../../middleware/auth')

bookmarkRoutes.post('/bookmark', auth.auth, bookmarkController.addBookmark)
bookmarkRoutes.get('/bookmark/:userId', auth.auth, bookmarkController.getBookmarkByUserId)
bookmarkRoutes.post('/bookmark', bookmarkController.addBookmark)
bookmarkRoutes.get('/bookmark/:userId', bookmarkController.getBookmarkByUserId)

module.exports = bookmarkRoutes