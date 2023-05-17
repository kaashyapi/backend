const Question = require("../../models/question");

// search question
exports.searchQuestion =  async (req, res) => {
  try {
    const {question, tags} = req.query;
    const queryObject = {};

    if(question){
      queryObject.question = {$regex: question, $options: "i"};;
    }
    if(tags){
      queryObject.tags = {$regex: tags, $options: "i"};
    } 
    const searchedData = await Question.find(queryObject);
    
    if (!searchedData) {
      return res.status(404).json({
        status: 404,
        message: "Data Not Found",
      });
    } else {
    res.status(200).json({
      status: 200,
      message: "Qustion searched Successfully",
      data: searchedData,
    });
  }
  } catch (e) {
    return res.status(500).json({
      status:500,
      message: "Server Error",
    });
  }
};


