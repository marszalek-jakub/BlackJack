let blackJackGame = {
    "you": {scoreSpan: "#your-blackjack-result", "div": "#your-cards", "score": 0},
    "dealer": {scoreSpan: "dealer-blackjack-result", "div": "#dealer-box", "score": 0}
}

const YOU = blackJackGame["you"];
const DEALER = blackJackGame["dealer"];

const hitSound = new Audio("./sounds/swish.m4a")

    
    
document.querySelector("#blackjack-hit-button").addEventListener("click", blackJackHit);

function blackJackHit(){
    let cardImage = document.createElement("img");
    cardImage.src = "./images/Q.png";
    document.querySelector(YOU["div"]).appendChild(cardImage).classList.add("card");
    hitSound.play();
}

