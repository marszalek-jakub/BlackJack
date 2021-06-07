let blackJackGame = {
    "you": {scoreSpan: "#your-blackjack-result", "div": "#your-cards", "score": 0},
    "dealer": {scoreSpan: "#dealer-blackjack-result", "div": "#dealer-cards", "score": 0},
    "cards":["2","3","4","5","6","7","8","9","10","J","K","Q","A"],
    "cardsMap": {"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"J":10,"K":10,"Q":10,"A":[1,11]},
    "wins": 0,
    "losses": 0,
    "draws": 0,
    "isStand": false,
    "turnsOver": false, 
};

const YOU = blackJackGame["you"];
const DEALER = blackJackGame["dealer"];

const hitSound = new Audio("./sounds/swish.m4a");
const winSound = new Audio("./sounds/cash.mp3");
const lossSound = new Audio("./sounds/aww.mp3");



let blackJackHit = () => {
    if(blackJackGame["isStand"] === false) {
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU)
        showScore(YOU);
    }
}

let randomCard = () => {
    let randomIndex = Math.floor(Math.random()*13);
    return blackJackGame["cards"][randomIndex];
}


let showCard = (card, activePlayer) => {
    if (activePlayer["score"] <= 21) {
        let cardImage = document.createElement("img");
        cardImage.src = `./images/${card}.png`;
        document.querySelector(activePlayer["div"]).appendChild(cardImage).classList.add("card");
        hitSound.play();
    }
}


let blackJackDeal = () => {

    if(blackJackGame["turnsOver"] === true) {
        blackJackGame["isStand"] = false;
        let yourImages = document.querySelector("#your-box").querySelectorAll("img");
        let dealerImages = document.querySelector("#dealer-box").querySelectorAll("img");
        
        for(i=0; i<yourImages.length; i++) {
            yourImages[i].remove();
        }

        for(i=0; i<dealerImages.length; i++) {
        dealerImages[i].remove();
        }
        YOU["score"] = 0;
        DEALER["score"] = 0;

        document.querySelector("#your-blackjack-result").textContent = 0;
        document.querySelector("#dealer-blackjack-result").textContent = 0;
        document.querySelector("#your-blackjack-result").style.color = "white";
        document.querySelector("#dealer-blackjack-result").style.color = "white";
        document.querySelector("#blackjack-result").textContent = "Let's play";
        document.querySelector("#blackjack-result").style.color = "black";
        blackJackGame["turnsOver"] = true;
    }

}

let updateScore = (card, activePlayer) => {
   if (card === "A") {
       //if AS
        if (activePlayer["score"] + blackJackGame["cardsMap"][card][1]<= 21){
            activePlayer["score"] +=blackJackGame["cardsMap"][card][1];
        } else {
            activePlayer["score"] +=blackJackGame["cardsMap"][card][0]
        }
    } else {
        activePlayer['score'] += blackJackGame['cardsMap'][card];
    }
   
}

let showScore = activePlayer => {
    if (activePlayer["score"] > 21){
        document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST";
        document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
    }
        else {
            document.querySelector(activePlayer["scoreSpan"]).textContent = activePlayer["score"];
        }
}

let sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let dealerLogic = async () => {
    blackJackGame["isStand"] = true; 

    while(DEALER["score"] < 16 && blackJackGame["isStand"] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(500);
    }

        blackJackGame["turnsOver"] = true;
        let winner = computeWinner();
        showResult(winner);
        console.log(blackJackGame["turnsOver"]);
}

 //compute winner and return who jsut won
// update table win, losses and draws
 let computeWinner = () => {
     let winner;

     if (YOU["score"] <= 21) {
         // condition: higher score than dealer or when dealer busts but you are 21 or under
        if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21 ) {
            winner = YOU;
            blackJackGame["wins"]++;
        } else if (YOU["score"] < DEALER["score"]){
            winner = DEALER;
            blackJackGame["losses"]++;
        } else if (YOU["score"] === DEALER["score"]) {
            blackJackGame["draws"]++;
        }
        // condition: when you bust but dealer doesn't
     } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
         winner = DEALER;
         blackJackGame["losses"]++;
        //both busts
     } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
        blackJackGame["draws"]++;
     }
    console.log(blackJackGame);
     return winner;

 }

 let showResult = winner =>  {
    let message, messageColor;
    if (blackJackGame["turnsOver"] === true) {
        if (winner === YOU) {
            document.querySelector("#wins").textContent = blackJackGame["wins"];
            message = "You won!";
            messageColor = "green";
            winSound.play();
        } else if (winner === DEALER) {
            document.querySelector("#losses").textContent = blackJackGame["losses"];
            message = "You lost!";
            messageColor = "red";
            lossSound.play();
        } else {
            document.querySelector("#draws").textContent = blackJackGame["draws"];
            message = "You drew!";
            messageColor = "black";
        }
        document.querySelector("#blackjack-result").textContent = message;
        document.querySelector("#blackjack-result").style.color = messageColor;
    }

 }

 document.querySelector("#blackjack-hit-button").addEventListener("click", blackJackHit);
document.querySelector("#blackjack-stand-button").addEventListener("click", dealerLogic);
document.querySelector("#blackjack-deal-button").addEventListener("click", blackJackDeal);