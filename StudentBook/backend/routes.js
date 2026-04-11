const express = require("express");
const router = express.Router();
const db = require("./db");
const auth = require("./auth");
const upload = require("./upload");

// AUTH
router.post("/register", auth.register);
router.post("/login", auth.login);

// POSTS
router.get("/posts", (req, res) => {
    db.query(
        `SELECT posts.*, users.firstname, users.lastname 
         FROM posts 
         JOIN users ON posts.user_id = users.id 
         ORDER BY created_at DESC`,
        (err, result) => res.json(result)
    );
});

router.post("/posts", upload.single("image"), (req, res) => {
    const { user_id, title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    db.query(
        "INSERT INTO posts (user_id, title, content, image) VALUES (?, ?, ?, ?)",
        [user_id, title, content, image],
        () => res.send("OK")
    );
});

// COMMENTS
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
        "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
        [user_id, post_id],
        () => res.send("liked")
    );
});

router.delete("/like", (req, res) => {
    const { user_id, post_id } = req.body;

    db.query(
        "DELETE FROM likes WHERE user_id=? AND post_id=?",
        [user_id, post_id],
        () => res.send("unliked")
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