// JavaScript source code
//Blackjack
// By me

let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
let values = ['Ace', { name: 'King', value: 10 }, 'Queen', 'Jack', 'Ten', 'Nine', 'Eight', 'Seven', 'Six', 'Five', 'Four', 'Three', 'Two'];

let textArea = document.getElementById('text-area');
let newGameButton = document.getElementById("new-game");
let hitButton = document.getElementById("hit");
let stayButton = document.getElementById("stay");
let player = document.getElementById("playercards");
let dealer = document.getElementById("dealercards");


let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();


newGameButton.addEventListener('click', function() {
    gameStarted = true;
    gameOver = false;
    playerWon = false;

    deck = createDeck();
    shuffleDeck(deck);
    dealerCards = [ getNextCard(), getNextCard() ];
    dealerScore = dealerCards.reduce((a, b) => a + b.value, 0)
    playerCards = [ getNextCard(), getNextCard() ];
    playerScore = playerCards.reduce((a, b) => a + b.value, 0)

    newGameButton.style.display = 'none';
    hitButton.style.display = 'inline';
    stayButton.style.display = 'inline';
    showStatus();
});

hitButton.addEventListener('click', function() {
    playerCards.push(getNextCard())
    playerScore = playerCards.reduce((a, b) => a + b.value, 0)
    showStatus();
})


function createDeck(){
     let deck = []
    for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
        for (let valueIdx = 2; valueIdx <= 10; valueIdx++) {
            let card = {
                suit: suits[suitIdx], 
                value: valueIdx,
                name: valueIdx.toString()
            };
            deck.push( card );
        }
        deck.push({ suit: suits[suitIdx], value: 10, name: 'King' })
        deck.push({ suit: suits[suitIdx], value: 10, name: 'Queen' })
        deck.push({ suit: suits[suitIdx], value: 10, name: 'Jack' })
        deck.push({ suit: suits[suitIdx], value: 11, name: 'Ace' })
        // add Jack Queen King
        // add Ace

    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
        let swapIdx = Math.trunc(Math.random() * deck.length);
        let tmp = deck[swapIdx];
        deck[swapIdx] = deck[i]
        deck[i] = tmp;
    }
}
function getCardString(card) {
    return card.name + ' of ' +card.suit + "<br>";
}

function showStatus() {
    if (!gameStarted) {
        textArea.innerText = 'Welcome to Blackjack!';
        return;
    }
    let cardText = ''
    for (let i = 0; i < playerCards.length; i++) {
        cardText += getCardString(playerCards[i])
    }
    player.innerHTML = cardText + playerScore

    cardText = ''
    for (let i = 0; i < dealerCards.length; i++) {
        cardText += getCardString(dealerCards[i])
    }
    dealer.innerHTML = cardText
}

function getNextCard() {
    return deck.shift();
}


// console.log("Welcome to Blackjack!");

// console.log("You are dealt:  ");
// console.log(" " + getCardString (playerCards[0]) );
// console.log(" " + getCardString (playerCards[1]) );
