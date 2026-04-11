const bcrypt = require("bcrypt");
const db = require("./db");

exports.register = async (req, res) => {
    const { username, password, firstname, lastname, age, gender } = req.body;

    if (age < 13) return res.status(400).send("Musíš mít 13+");

    const hash = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO users (username, password, firstname, lastname, age, gender) VALUES (?, ?, ?, ?, ?, ?)",
        [username, hash, firstname, lastname, age, gender],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("OK");
        }
    );
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, result) => {
            if (result.length === 0) return res.status(400).send("User neexistuje");

            const user = result[0];
            const valid = await bcrypt.compare(password, user.password);

            if (!valid) return res.status(400).send("Špatné heslo");

            res.json(user);
        }
    );
};