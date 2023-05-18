const Question = require("../../models/question");
const Bookmark = require("../../models/bookmark");
const Answer = require("../../models/answer");

// post a question
exports.createQuestion = async (req, res) => {
  try {
    const userId = req.body.userId;
    const question = req.body.question;
    const questionDescribe = req.body.questionDescribe;
    const tags = req.body.tags;
    const questionCreated = new Question({
      userId,
      question,
      tags,
      questionDescribe,
    });
    await questionCreated.save();
    res.status(201).json({
      status: 201,
      message: "Question created successfully",
      data: questionCreated,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

// question pagination
exports.questionPagination = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 8;
    let skip = (page - 1) * limit;

    const questionsData = await Question.find()
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: "userId",
        },
      ]);
    const count = await Question.countDocuments();
    const totalPages = Math.ceil(count / limit);
    const hasMore = page < totalPages;

    if (!questionsData) {
      return res.status(404).json({
        status: 404,
        message: "Data Not Found",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Questions Readed successfully",
        data: questionsData,
        nbHits: questionsData.length,
        totalPages: totalPages,
        hasMore,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

// read the questions from database
exports.readQuestions = async (req, res) => {
  try {
    const questionsData = await Question.find().populate([
      {
        path: "userId",
      },
    ]);
    if (!questionsData) {
      return res.status(404).json({
        status: 404,
        message: "Data Not Found",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Questions Readed successfully",
        data: questionsData,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};
// get a speific question by question id
exports.readByIdQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    const questionData = await Question.findById({ _id: id }).populate([
      {
        path: "userId",
      },
    ]);
    if (!questionData) {
      return res.status(404).json({
        status: 404,
        message: "Data Not Found",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Question Readed successfully",
        data: questionData,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

// get a speific question by user id
exports.readByIdUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const questionData = await Question.find({ userId }).populate([
      {
        path: "userId",
      },
    ]);
    console.log(questionData);
    if (!questionData) {
      return res.status(404).json({
        status: 404,
        message: "Data Not Found",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Question Readed successfully",
        data: questionData,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

// update perticular question
exports.updateQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const updateQuestion = await Question.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!updateQuestion) {
      return res.status(404).json({
        status: 404,
        message: "Data Not Found",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Question Updated Successfully",
        data: updateQuestion,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

// delete perticular question
exports.deleteQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    await Question.findByIdAndDelete(id);
    await Bookmark.deleteMany({ questionId: id });
    await Answer.deleteMany({ questionId: id });
    res.status(200).json({
      status: 200,
      message: "Question Deleted Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};
