fetch("/source/head.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("head").innerHTML += data;
    });

fetch("/source/header.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("header").innerHTML += data;
    });



function navButton() {
    const navBar = document.getElementById("nav-bar")
    const navButton = document.getElementById("nav-button")
    const overlay = document.getElementById("overlay")
    if (navBar.style.width == "54.1vh") {
        navBar.style.width = "0px";
        navButton.textContent = "☰";
        overlay.style.opacity = 0
    } else {
        navBar.style.width = "54.1vh";
        navButton.textContent = "✖"
        overlay.style.opacity = 1
    }           
}




let questions = [];

fetch("/source/BadPeopleQuestions.csv")
.then(res => res.text())
.then(data => {
    questions = data
    .split("\n")
    .slice(1) // skip header
    .map(q => q.trim())
    .filter(q => q.length > 0)
    .map(q => q.replace(/^"|"$/g, "")) // remove surrounding quotes
    .map(q => q.replace(/""/g, '"')); // fix double quotes
});

let frontCard = document.getElementById("card1");
let backCard = document.getElementById("card2");
let isAnimating = false; // lock to prevent multiple clicks

// initialize z-index
frontCard.style.zIndex = 2;
backCard.style.zIndex = 1;

function getRandomQuestion() {
    if (!questions || questions.length === 0) return "No questions loaded";
    const index = Math.floor(Math.random() * questions.length);
    return questions[index];
}

function newCard() {
    if (isAnimating) return; // ignore clicks during animation
    isAnimating = true;       // lock clicks

    // 1️⃣ swipe front card to the right
    frontCard.style.transition = "left 1s ease, opacity 0.5s ease";
    frontCard.style.left = "150%";
    frontCard.style.opacity = "0";

    // 2️⃣ bring back card forward (3D "pop")
    backCard.style.transition = "transform 1s ease, opacity 1s ease";
    backCard.style.transform = "scale(1)";
    backCard.style.opacity = "1";

    setTimeout(() => {
        // 3️⃣ swap cards
        const temp = frontCard;
        frontCard = backCard;
        backCard = temp;

        // 4️⃣ reset the old front card behind the new front card
        backCard.style.transition = "none";
        backCard.style.left = "5.6vh";
        backCard.style.transform = "scale(0.9)";
        backCard.style.opacity = "0.7";
        backCard.style.zIndex = 1;

        // 5️⃣ bring new front card to top
        frontCard.style.zIndex = 2;

        // 6️⃣ assign new question to back card
        backCard.innerText = getRandomQuestion();

        // 7️⃣ force browser to reflow so transitions will work next time
        void backCard.offsetWidth;

        // 8️⃣ restore transitions
        backCard.style.transition = "transform 1s ease, opacity 1s ease, left 1.2s ease";
        frontCard.style.transition = "left 1s ease, opacity 0.5s ease";

        // 9️⃣ unlock clicks
        isAnimating = false;

    }, 1000); // match swipe duration
}