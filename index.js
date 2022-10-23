let mainIndex = 0;
let charArr = [];
let pause = false;
let checkCount = 0;
let correctWord = "";
let streak = 0;

const wordDisplay = document.querySelector("#wordDisplay");
const restartButton = document.querySelector("#restart");

const keys = document.querySelectorAll(".key");

let squares = Array.from(document.querySelectorAll(".square"));

//Length of game in seconds
let timer = 120;
const timeText = document.querySelector(".timer");

function getWord() {
    fetch("https://speedword.herokuapp.com/word")
        .then(respone => respone.json())
        .then(data => {
            console.log(data);
            correctWord = data;
        })
}

getWord();
changeKeys("all");

window.addEventListener("keydown", (event) => {
    if (!pause && correctWord !== "") {
        if (event.key.length === 1 && /^[a-zA-Z]+$/.test(event.key) && mainIndex < 5) {
            squares[mainIndex].textContent = event.key;
            squares[mainIndex].classList.add("bounceAnim");
            charArr.push(event.key);
            changeSquare(mainIndex, "typing");
            mainIndex++;
        } else if (event.key === "Backspace" && mainIndex > 0) {
            mainIndex--;
            squares[mainIndex].textContent = "";
            squares[mainIndex].classList.remove("bounceAnim");
            charArr.pop();
            changeSquare(mainIndex);
        } else if (event.key === "Enter" && mainIndex === 5) {
            check(charArr, correctWord);
            for (var i = 0; i < 5; i++) {
                squares[i].classList.add("checkAnim");
            }
            pause = true;
            setTimeout(() => {
                for (var i = 0; i < 5; i++) {
                    squares.shift();
                }
            }, 250);
            charArr = [];
            mainIndex = 0;
        }
    }
});

function check(arr, word) {

    if (arr.join("") === word) {
        pause = true;
    }

    setTimeout(() => {
        if (arr.join("") === word) {
            for (var i = 0; i < 5; i++) {
                changeSquare(i, "correct");
            }
            streak++;
            wordDisplay.style.color = "orange";
            wordDisplay.innerHTML = "Nice! You got the correct word.";
            restartButton.style.visibility = "visible";
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (word.includes(arr[i])) {
                    if (arr[i] === Array.from(word)[i]) {
                        changeSquare(i, "correct");
                        changeKeys(arr[i], "correct");
                    } else {
                        changeSquare(i, "contains");
                        changeKeys(arr[i], "contains");
                    }
                } else {
                    changeSquare(i, "wrong");
                    changeKeys(arr[i], "wrong");
                }
            }
            pause = false;
        }
    }, 250);

    checkCount++;

    if (checkCount === 6 && !pause) {
        pause = true;
        wordDisplay.style.color = "var(--wrong)";
        wordDisplay.innerHTML = "Wrong! The correct word was: " + "<strong>" + correctWord + "</strong>";
        restartButton.style.visibility = "visible";
        streak = 0;
    }
}

function changeSquare(index, state) {
    switch (state) {
        case "correct":
            squares[index].style.background = "var(--correct)";
            squares[index].style.border = "none";
            squares[index].style.color = "white";
            break;
        case "contains":
            squares[index].style.background = "var(--in-word)";
            squares[index].style.border = "none";
            squares[index].style.color = "white";
            break;
        case "wrong":
            squares[index].style.background = "var(--wrong)";
            squares[index].style.border = "none";
            squares[index].style.color = "white";
            break;
        case "typing":
            squares[index].style.background = "white";
            squares[index].style.border = "solid black 2px";
            squares[index].style.color = "black";
            break;
        default:
            squares[index].style.background = "white";
            squares[index].style.border = "solid grey 2px";
            squares[index].style.color = "black";
            break;
    }
}

function restart() {
    getWord();
    squares = Array.from(document.querySelectorAll(".square"));
    for (var i = 0; i < squares.length; i++) {
        changeSquare(i);
        squares[i].innerHTML = "";
        squares[i].classList.remove("checkAnim");
        squares[i].classList.remove("bounceAnim");
    }
    changeKeys("all");
    checkCount = 0;
    mainIndex = 0;
    charArr = [];
    wordDisplay.innerHTML = "";
    restartButton.style.visibility = "hidden";
    document.querySelector("#streakText").innerHTML = streak;
    if (streak <= 1) {
        timer = 120;
    } else if (streak > 1 && streak < 4) {
        timer = 60;
    } else if (streak > 3 && streak < 6) {
        timer = 30;
    } else if (streak > 5) {
        timer = 15;
    }

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; //For literally every other browser bruh
    pause = false;
}


keys.forEach(k => {
    k.addEventListener("click", (event) => {
        if (correctWord !== "") {
            let html = k.innerHTML;
            let str = html.replace(/ /g, "")

            if (str == "back") {
                window.dispatchEvent(new KeyboardEvent("keydown", {
                    "key": "Backspace"
                }))
            } else {
                window.dispatchEvent(new KeyboardEvent("keydown", {
                    "key": str
                }))
            }
        }
    })
})

function changeKeys(letter, state) {

    if (letter === "all") {
        for (var i = 0; i < keys.length; i++) {
            keys[i].style.background = "var(--key)";
            keys[i].style.color = "black";
        }
    }

    for (var i = 0; i < keys.length; i++) {
        if (keys[i].innerHTML === letter) {
            switch (state) {
                case "correct":
                    if (keys[i].style.background != "var(--correct)") {
                        keys[i].style.background = "var(--correct)";
                        keys[i].style.color = "white";
                    }
                    break;
                case "contains":
                    if (keys[i].style.background != "var(--correct)") {
                        keys[i].style.background = "var(--in-word)";
                        keys[i].style.color = "white";
                    }
                    break;
                case "wrong":
                    keys[i].style.background = "var(--wrong)";
                    keys[i].style.color = "white";
                    break;
                default:
                    keys[i].style.background = "var(--key)";
                    keys[i].style.color = "black";
                    break;
            }
        }
    }
}

//Changing the timer
let timerId;
function decreaseTimer() {
    if (timer > 0) {
        timer--;
        timeText.innerHTML = timer;
    }

    //End game based on time
    if (timer === 0 && !pause) {
        pause = true;
        wordDisplay.style.color = "var(--wrong)";
        wordDisplay.innerHTML = "You ran out of time! The correct word was: " + "<strong>" + correctWord + "</strong>";
        restartButton.style.visibility = "visible";
        streak = 0;
    }

    timerId = setTimeout(decreaseTimer, 1000);
}

decreaseTimer();