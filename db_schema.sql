
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS authors (
    author_id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name TEXT NOT NULL,
    blog_title TEXT DEFAULT "",
    blog_desc TEXT DEFAULT ""
);

CREATE TABLE IF NOT EXISTS articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_title TEXT NOT NULL,
    article_subtitle TEXT DEFAULT "" NOT NULL,
    article_text TEXT DEFAULT "" NOT NULL,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    edit_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    published INT2 DEFAULT 0 NOT NULL,
    author_id  INT NOT NULL,
    likes INTEGER DEFAULT 0 NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(author_id)
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_text TEXT NOT NULL,
    article_id INTEGER NOT NULL,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(article_id)
);

-- insert default data (if necessary here)
INSERT INTO authors ("author_name", "blog_title", "blog_desc") VALUES("Simon Star", "Simon's Spooky Spiels", "Spooky stories guaranteed to keep you guessing all night!");
-- published article, empty subtitle
INSERT INTO articles ("article_title", "article_text","published", "author_id") VALUES( "First Sample Article without Subtitles", "Lorem ipsum dolor sit amet", 1, 1);
-- published article, 2 comments
INSERT INTO articles ("article_title", "article_subtitle", "article_text", "published", "author_id") VALUES( "Second Sample Article with Comments","Sample Subtitle", "Consectetur adipiscing elit sed do", 1, 1); 
INSERT INTO comments ("comment_text", "article_id") VALUES("First sample comment", 2);
INSERT INTO comments ("comment_text", "article_id") VALUES("Second sample comment", 2);
-- UNpublished article, 0 comments
INSERT INTO articles ("article_title", "article_subtitle", "article_text", "published", "author_id") VALUES( "Unpublished Sample","Filler Subtitle", "Eiusmod tempor incididunt ut labore", 0, 1); 

-- second author preview -Anthony Abrams: two articles
INSERT INTO authors ("author_name", "blog_title", "blog_desc") VALUES("Anthony Abrams", "Food Bits Unknown", "A personal journey through the unexplored wonders of the food world");
INSERT INTO articles ("article_title", "article_subtitle", "article_text", "published", "author_id") VALUES( "10 Tips When Cooking on the Road","When you need healthy living on the go", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque pulvinar pellentesque habitant morbi. Mollis nunc sed id semper risus in hendrerit gravida. Quisque sagittis purus sit amet. Enim diam vulputate ut pharetra sit amet aliquam id. Ultricies leo integer malesuada nunc vel risus.", 1, 2); 
INSERT INTO comments ("comment_text", "article_id") VALUES("I love this food blog!", 4);
INSERT INTO articles ("article_title", "article_subtitle", "article_text", "published", "author_id", "likes") VALUES( "A $6 meal and a beer in Hanoi","An omage to a great chef and the President", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque pulvinar pellentesque habitant morbi. Mollis nunc sed id semper risus in hendrerit gravida. Quisque sagittis purus sit amet. Enim diam vulputate ut pharetra sit amet aliquam id. Ultricies leo integer malesuada nunc vel risus.", 1, 2,6); 

COMMIT;

