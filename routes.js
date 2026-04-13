const express = require("express");
const router = express.Router();
const db = require("./db");
const auth = require("./auth");
const upload = require("./upload");

// AUTH
router.post("/register", auth.register);
router.post("/login", auth.login);

// GET POSTS + LIKE COUNT
router.get("/posts", (req, res) => {
    db.query(
        `SELECT posts.*, users.firstname, users.lastname,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS likes
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        ORDER BY posts.created_at DESC`,
        (err, result) => res.json(result)
    );
});

// ADD POST
router.post("/posts", (req, res) => {
    const { user_id, title, content } = req.body;

    db.query(
        "INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)",
        [user_id, title, content],
        () => res.send("OK")
    );
});

// DELETE POST
router.delete("/posts/:id", (req, res) => {
    const { user_id } = req.body;
    const postId = req.params.id;

    db.query(
        "DELETE FROM posts WHERE id=? AND user_id=?",
        [postId, user_id],
        (err, result) => {
            if (result.affectedRows === 0)
                return res.status(403).send("Cizí post");

            res.send("OK");
        }
    );
});

// EDIT POST
router.put("/posts/:id", (req, res) => {
    const { user_id, title, content } = req.body;
    const postId = req.params.id;

    db.query(
        "UPDATE posts SET title=?, content=? WHERE id=? AND user_id=?",
        [title, content, postId, user_id],
        (err, result) => {
            if (result.affectedRows === 0)
                return res.status(403).send("Cizí post");

            res.send("OK");
        }
    );
});

// COMMENTS - GET
router.get("/comments/:post_id", (req, res) => {
    db.query(
        `SELECT comments.*, users.firstname 
         FROM comments 
         JOIN users ON comments.user_id = users.id 
         WHERE post_id=? 
         ORDER BY created_at DESC`,
        [req.params.post_id],
        (err, result) => res.json(result)
    );
});

// ADD COMMENT
router.post("/comments", (req, res) => {
    const { user_id, post_id, content } = req.body;

    db.query(
        "INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)",
        [user_id, post_id, content],
        () => res.send("OK")
    );
});

// LIKE
router.post("/like", (req, res) => {
    const { user_id, post_id } = req.body;

    db.query(
        "INSERT IGNORE INTO likes (user_id, post_id) VALUES (?, ?)",
        [user_id, post_id],
        () => res.send("OK")
    );
});

// USERS
router.get("/users", (req, res) => {
    db.query(
        `SELECT users.*, COUNT(posts.id) as post_count
         FROM users
         LEFT JOIN posts ON users.id = posts.user_id
         GROUP BY users.id`,
        (err, result) => res.json(result)
    );
});

module.exports = router;