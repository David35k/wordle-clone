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

function getWord() {
    fetch("https://speedword.herokuapp.com/word")
        .then(respone => respone.json())
        .then(data => {
            console.log(data);
            correctWord = data;
        })
}

getWord();

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
                pause = false;
            }, 250);
            charArr = [];
            mainIndex = 0;
        }
    }
});

function check(arr, word) {
    setTimeout(() => {
        if (arr.join("") === word) {
            pause = true;
            console.log("you got the word!");
            for (var i = 0; i < 5; i++) {
                changeSquare(i, "correct");
            }
            streak++;
            wordDisplay.innerHTML = "Nice! You got the correct word.";
            wordDisplay.style.color = "orange";
            restartButton.style.visibility = "visible";

        } else {
            for (var i = 0; i < arr.length; i++) {
                if (word.includes(arr[i])) {
                    if (arr[i] === Array.from(word)[i]) {
                        console.log(arr[i] + " is in the correct word and in the correct spot");
                        changeSquare(i, "correct");
                    } else {
                        console.log("The correct word contains " + arr[i]);
                        changeSquare(i, "contains");
                    }
                } else {
                    console.log("The correct answer does not contain " + arr[i]);
                    changeSquare(i, "wrong");
                }
            }
        }
    }, 250);

    checkCount++;

    if (checkCount === 6 && !pause) {
        pause = true;
        wordDisplay.innerHTML = "Wrong! The correct word was: " + "<strong>" + correctWord + "</strong>";
        wordDisplay.style.color = "var(--wrong)";
        restartButton.style.visibility = "visible";
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
    checkCount = 0;
    mainIndex = 0;
    charArr = [];
    wordDisplay.innerHTML = "";
    restartButton.style.visibility = "hidden";
    document.querySelector("#streakText").innerHTML = streak;
    pause = false;
}


keys.forEach(k => {
    k.addEventListener("click", (event) => {
        if (correctWord !== "") {
            let html = k.innerHTML;
            let str = html.replace(/ /g, "")
            console.log(str);

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