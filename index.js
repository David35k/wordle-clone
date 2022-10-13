let squares = Array.from(document.querySelectorAll(".square"));
let mainIndex = 0;
const correctWord = "farts";
let charArr = [];
let gameOver = false;
let checkCount = 0;

if (correctWord.length !== 5) {
    alert("Invalid word! Make sure it is 5 letters long.");
}

window.addEventListener("keydown", (event) => {
    if (!gameOver) {
        if (event.key.length === 1 && /^[a-zA-Z]+$/.test(event.key) && mainIndex < 5) {
            squares[mainIndex].textContent = event.key;
            charArr.push(event.key);
            changeSquare(mainIndex, "typing");
            mainIndex++;
        } else if (event.key === "Backspace" && mainIndex > 0) {
            mainIndex--;
            squares[mainIndex].textContent = "";
            charArr.pop();
            changeSquare(mainIndex);
        } else if (event.key === "Enter" && mainIndex === 5) {
            check(charArr, correctWord);
            for (var i = 0; i < 5; i++) {
                squares.shift();
            }
            charArr = [];
            mainIndex = 0;
        }
    }
})

function check(arr, word) {

    if (arr.join("") === word) {
        gameOver = true;
        console.log("you got the word!");
        for (var i = 0; i < 5; i++) {
            changeSquare(i, "correct");
        }

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

    if(checkCount === 6) {
        gameOver = true;
    }

    checkCount++;
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