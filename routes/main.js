const express = require("express");
const router = express.Router();
const assert = require("assert");
const {
  db_all,
  db_get,
  db_run,
  auth_list,
  blog_list,
} = require("../helpers/query.js");

//main homepage endpoint, redirect from "/" for consistency
router.get("/", async (req, res, next) => {
  try {
    //query variables
    const articles_list = await db_all(
      "SELECT * FROM articles WHERE published=1;"
    );
    const auth_names = await auth_list();
    const bl_title = await blog_list();

    //pass variables to ejs view
    res.render("main-homepage.ejs", {
      articles: articles_list,
      author_names: auth_names,
      blog_titles: bl_title,
    });
  } catch (err) {
    next(err);
  }
});

//articles endpoint, recognized by url param
router.get("/:id", async (req, res, next) => {
  //get article id from url param, note that this is a string
  const article_id = req.params["id"];

  //reduce some routing errors
  if (isNaN(article_id)) {
    next();
  }
  //get article from database query
  try {
    //query variables to render on view
    const single_article = await db_get(
      `SELECT * FROM articles WHERE article_id=${article_id};`
    );
    const comments_list = await db_all(
      `SELECT * FROM comments WHERE article_id=${article_id}`
    );
    //check if article exists
    if (single_article === undefined) {
      res.redirect("/main");
    }
    const author_info = await db_get(
      `SELECT * FROM authors WHERE author_id=${single_article.author_id}`
    );

    //pass variables to ejs view
    res.render("main-article.ejs", {
      article: single_article,
      comments: comments_list,
      author_info: author_info,
    });
  } catch (err) {
    next(err);
  }
});

//insert comments into database table
router.post("/submit-comment/:id", async (req, res, next) => {
  //store comment as new variable
  const article_id = req.params["id"];
  const new_comment = req.body.comment;

  //insert comment into database
  try {
    await db_run(
      `INSERT INTO comments (comment_text, article_id) VALUES("${new_comment}", ${article_id})`
    );
    res.redirect("back"); //redirect back to previous page
  } catch (err) {
    next(err);
  }
});

//increment likes counter in database
router.get("/like-clicked/:id", async (req, res, next) => {
  //store article id as variable
  const article_id = req.params["id"];

  //find article in database and increment likes column
  try {
    await db_run(
      `UPDATE articles SET likes = likes + 1 WHERE article_id=${article_id}`
    );

    res.redirect("back"); //redirect back to previous page
  } catch (err) {
    next(err);
  }
});

module.exports = router;
