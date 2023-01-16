///////////////////////////////////////////// HELPERS ///////////////////////////////////////////

/**
 *@param {string} sql query
 *@desc performs a sql queries as an async operation
 *@returns an array of json objects matching query
 */
async function db_all(query) {
  return new Promise(function (resolve, reject) {
    global.db.all(query, function (err, rows) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

/**
 *@param {string} sql query
 *@desc performs a sql queries as an async operation
 *@returns a single json object from database
 */
async function db_get(query) {
  return new Promise(function (resolve, reject) {
    global.db.get(query, function (err, rows) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

/**
 *@param {string} sql query
 *@desc runs sql queries as an async operation
 *@returns a json object from database
 */
async function db_run(query) {
  return new Promise(function (resolve, reject) {
    global.db.run(query, function (err, rows) {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

/**
 *@desc performs sql queries as an async operation
 *@returns an array of author string names
 */
async function auth_list() {
  let auth_array = [];
  try {
    const author_list = await db_all(`SELECT author_name FROM authors`);
    //push author names into array
    author_list.forEach((obj) => {
      auth_array.push(obj.author_name);
    });

    return auth_array;
  } catch (err) {
    throw err;
  }
}
/**
 *@desc performs sql queries as an async operation
 *@returns an array of blog string titles
 */
async function blog_list() {
  let blog_array = [];
  try {
    const blog_list = await db_all(`SELECT blog_title FROM authors`);
    //push author names into array
    blog_list.forEach((obj) => {
      blog_array.push(obj.blog_title);
    });

    return blog_array;
  } catch (err) {
    throw err;
  }
}

module.exports = { db_all, db_get, db_run, auth_list, blog_list };
