const Bookmark = require("../../models/bookmark");

module.exports = {
  addBookmark: async (req, res) => {
    try {
      const userId = await req.body.userId;
      const questionId = req.body.questionId;
      const addedBookmark = await Bookmark.findOne({ userId, questionId });
      if (addedBookmark) {
        await Bookmark.findByIdAndDelete(addedBookmark._id);
        res.status(200).json({
          status: 200,
          message: "Bookmark removed",
        });
      } else {
        const bookmark = new Bookmark({ userId, questionId });
        await bookmark.save();
        res.status(201).json({
          status: 201,
          message: "Added bookmark",
          data: bookmark,
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "Server Error",
      });
    }
  },

  getBookmarkByUserId: async (req, res) => {
    try {
      const userId = req.params.userId;
      const bookmarks = await Bookmark.find({ userId }).populate([
        {
          path: "questionId",
          populate: {
            path: "userId",
            model: "user",
          },
        },
      ]);
      res.status(200).json({
        status: 200,
        message: "Bookmarks",
        data: bookmarks,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "Server Error",
      });
    }
  },
};
