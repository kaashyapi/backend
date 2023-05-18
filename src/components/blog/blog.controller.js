const Blog = require("../../models/blog");
const User = require("../../models/user");
//get all posted blogs
exports.blogs = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 8;
    const pipeline = [
      {
        $match: {
          isApproved: true,
        },
      },
      {
        $sort: {
          createdDate: -1,
        },
      },
      {
        $skip: (pageNumber - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          isApproved: 1,
          createdDate: 1,
          "user.firstName": 1,
          "user.lastName": 1,
        },
      },
    ];

    const blogs = await Blog.aggregate(pipeline);
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

//get a specific blog
exports.blog = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id).populate([
      {
        path: "userId",
      },
    ]);
    if (!blog) {
      return res.status(404).json({
        status: 404,
        message: "Blog not found!",
      });
    } else {
      res.status(201).send({
        status: 201,
        message: "Succesfully got the Blog",
        data: blog,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

//post a new blog
exports.createBlog = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId;
  const blog = new Blog({
    userId,
    title,
    content,
  });
  try {
    Blog;
    await blog.save();
    res.status(201).json({
      status: 201,
      message: "Blog posted successfully",
      data: blog,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

// blog get using userId
exports.getBlog = async (req, res) => {
  try {
    const userId = req.params.userId;
    const blog = await Blog.find({ userId }).populate([
      {
        path: "userId",
      },
    ]);
    console.log(blog);
    if (!blog) {
      return res.status(404).json({
        status: 404,
        message: "Data not Found",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: " Blog get successfully",
        data: blog,
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

exports.getBlogTitle = async (req,res) =>{
  try {
    const projection = {title:1}
    const blogsd = await Blog.find({isApproved:true}, projection).exec()
    const blogsData = blogsd.map((btitle) => ({
      title: btitle.title,
    }));
    return res.status(201).json({ blogs: blogsData });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};



//delete an existing blog
exports.deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteblog = await Blog.findByIdAndDelete(id);
    if (!deleteblog) {
      res.status(404).json({
        status: 404,
        message: "Already deleted!",
      });
    } else {
      res.status(201).send({
        status: 201,
        message: "Succesfully deleted a blog",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};

//update an existing blog
exports.updateBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const updateblog = await Blog.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updateblog) {
      res.status(404).json({
        status: 404,
        message: "Blog not found!",
      });
    } else {
      res.status(201).send({
        status: 201,
        message: "Succesfully updated a blog",
        data: updateblog,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
};
