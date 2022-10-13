const PORT = 8000;
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const fs = require('fs');

function getWord() {
    var wordList = fs.readFileSync("valid-wordle-words.txt", "utf8");

    var wordArr = wordList.split("\n");

    let rand = Math.floor(Math.random() * wordArr.length);

    return wordArr[rand];
}

app.get("/word", (req, res) => {
    res.json(getWord());
});

app.listen(PORT, () => console.log("Server running on port: " + PORT));