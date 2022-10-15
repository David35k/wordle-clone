const PORT = 8000;
const hostname = "127.0.0.1"
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const fs = require('fs');

function getWord() {
    var wordList = fs.readFileSync("word-files/wordle-words.txt", "utf8");

    var wordArr = wordList.split("\n");

    let rand = Math.floor(Math.random() * wordArr.length);

    return wordArr[rand];
}

app.get("/word", (req, res) => {
    res.json(getWord());
});

app.listen(process.env.PORT, PORT, () => console.log("Server running at: " + hostname + ":" + PORT));