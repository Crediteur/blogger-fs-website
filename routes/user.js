const express = require("express");
const router = express.Router();
const assert = require("assert");
const { db_all, db_get, db_run, auth_list } = require("../helpers/query.js");

// ----- HOMEPAGE -----
//user homepage
router.get("/", async (req, res, next) => {
  try {
    //query variables
    const drafts_list = await db_all(
      "SELECT * FROM articles WHERE published=0;"
    );
    const articles_list = await db_all(
      "SELECT * FROM articles WHERE published=1;"
    );
    const author_info = await db_get("SELECT * FROM authors WHERE author_id=1");
    const auth_names = await auth_list();

    //pass variables to ejs view
    res.render("user-homepage.ejs", {
      drafts: drafts_list,
      articles: articles_list,
      author: author_info,
      author_names: auth_names,
    });
  } catch (err) {
    next(err);
  }
});

// ----- UNPUBLISHED DRAFTS -----
//edit draft article
router.get("/edit/:id", async (req, res, next) => {
  //get parameter id
  const article_id = req.params["id"];
  try {
    //query variables
    const draft_article = await db_get(
      `SELECT * FROM articles WHERE article_id=${article_id};`
    );
    const author_info = await db_get(
      "SELECT author_name FROM authors WHERE author_id=1"
    );

    //pass variables to ejs view
    res.render("user-edit-article.ejs", {
      draft: draft_article,
    });
  } catch (err) {
    next(err);
  }
});

//submit editted article changes
router.post("/edit-draft/:id", async (req, res, next) => {
  //parse variables
  const article_id = req.params["id"];
  const article_title = String(req.body.article_title);
  const article_subtitle = String(req.body.article_subtitle);
  const article_text = String(req.body.article_text);

  try {
    //update database based on form data
    await db_run(
      `UPDATE articles SET article_title="${article_title}", article_subtitle="${article_subtitle}", article_text="${article_text}", edit_date=CURRENT_TIMESTAMP WHERE article_id=${article_id};`
    );
    //redirect back to regular view of article after changes
    res.redirect(`/user/${article_id}`);
  } catch (err) {
    next(err);
  }
});

// ----- SETTINGS -----
//user settings endpoint
router.get("/settings", async (req, res, next) => {
  try {
    //query author data
    const author_info = await db_get("SELECT * FROM authors WHERE author_id=1");

    //pass variables to ejs view
    res.render("user-settings.ejs", {
      author: author_info,
    });
  } catch (err) {
    next(err);
  }
});

//submit blog setting changes
router.post("/edit-author/:id", async (req, res, next) => {
  //parse variables
  const author_id = req.params["id"];
  const blog_title = String(req.body.blog_title);
  const blog_desc = String(req.body.blog_desc);
  const author_name = String(req.body.author_name);

  try {
    //update database based on form data
    await db_run(
      `UPDATE authors SET blog_title="${blog_title}", blog_desc="${blog_desc}", author_name="${author_name}" WHERE author_id=${author_id};`
    );
    //redirect back to regular view of article after changes
    res.redirect("/user");
  } catch (err) {
    next(err);
  }
});

// ----- COMMENTS -----
//delete a comment, TODO: this should be a POST request to hide query
router.get("/delete-comment/:id", async (req, res, next) => {
  //parse variables
  const comment_id = req.params["id"];
  try {
    //update comment to be deleted in database
    await db_run(
      `UPDATE comments SET comment_text="removed by the author" WHERE comment_id=${comment_id};`
    );
    //redirect back to regular view of article after changes
    res.redirect("back");
  } catch (err) {
    next(err);
  }
});

// ----- BUTTONS ------
// new draft
router.get("/new-draft", async (req, res, next) => {
  try {
    //insert new article into database
    await db_run(
      `INSERT INTO articles ("article_title", "published", "author_id") VALUES( "New draft", 0, 1);`
    );
    const article_id = await db_get("SELECT last_insert_rowid() as id");

    res.redirect(`/user/edit/${article_id.id}`);
  } catch (err) {
    next(err);
  }
});
// edit button

// delete button
router.get("/delete-article/:id", async (req, res, next) => {
  //get parameter id
  const article_id = req.params["id"];
  try {
    //delete comments and article from database
    await db_run(`DELETE FROM comments WHERE article_id=${article_id};`);
    await db_run(`DELETE FROM articles WHERE article_id=${article_id};`);
    //redirect back to regular view of article after changes
    res.redirect("back");
  } catch (err) {
    next(err);
  }
});

// publish button
router.get("/publish-draft/:id", async (req, res, next) => {
  //get parameter id
  const article_id = req.params["id"];
  try {
    //update 'published' variable in database to true
    await db_run(
      `UPDATE articles SET published=1 WHERE article_id=${article_id}`
    );
    //redirect back to regular view of article after changes
    res.redirect("back");
  } catch (err) {
    next(err);
  }
});

// ----- REGULAR ARTICLE VIEW -----
//user article view
router.get("/:id", async (req, res, next) => {
  //get parameter id
  const article_id = req.params["id"];

  //reduce some routing errors
  if (isNaN(article_id)) {
    next();
  }

  try {
    //query variables
    const single_article = await db_get(
      `SELECT * FROM articles WHERE article_id=${article_id};`
    );
    const comments_list = await db_all(
      `SELECT * FROM comments WHERE article_id=${article_id}`
    );
    const author_info = await db_get(
      `SELECT * FROM authors WHERE author_id=${single_article.author_id}`
    );

    //pass variables to ejs view
    res.render("user-article.ejs", {
      article: single_article,
      comments: comments_list,
      author_info: author_info,
    });
  } catch (err) {
    next(err);
  }
});

// author name in homepage
//image upload
module.exports = router;
