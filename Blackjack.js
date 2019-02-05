// JavaScript source code
//Blackjack
// By me

// The Card class represents a card, with suit, rank, and value.
// Notice the class is declared as a const, which prevents us from
// accidentally reassigning it later.
const Card = function (suit, rank) {
  this.suit = suit
  this.rank = rank

  this.value = function () {
    if (this.value === 'A') {
      return [1, 11]
    }
    else if (['J', 'Q', 'K'].contains(this.value)) {
      return 10
    }
    return parseInt(this.value)
  }()
  // Notice the () after the function declaration?
  // This means we declared an anonymous function
  // and then called it, assigned the value returned
  // to "this.value".

  // rather than having a separate function to build out
  // an html string, we use the native toString() method.
  // Notice the lack of html here.
  this.toString = function () {
    // The following method of building a string is called
    // "string interpolation".  Using backticks instead of
    // single or double quotes allows inserting variables
    // directly in the string.
    return `${this.rank} of ${this.suit}`
  }
}

// Change these values to const as they shouldn't ever change.
// this doesn't prevent us from changing the values inside the arrays,
// but it does prevent us from accidentally reassigning a value
const suits = [ 'hearts', 'clubs', 'diamonds', 'spades' ];
const ranks = [ 'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1' ];


// Self contained DeckOfCards class.  All functionality is encompassed here.
// Notice the capital D at the beginning - this is because it is a class declaration.
const DeckOfCards = function () {
  // deck is a private variable.  It cannot be accessed from outside the class.
  let deck = []

  // Creating a deck of cards is done as soon as the object is created.
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push(new Card(suit, rank));
    }
  }

  // This is a private function - it can only be called and used inside deck.
  // The logic for generating a random card index was moved out of the shuffle
  // function to simplify the shuffle function.
  function randomCardIndex() {
    return Math.trunc(Math.random() * deck.length)
  }

  // Shuffles the deck!  Duh.
  this.shuffle = function () {
    for (let i = 0; i < deck.length; i++) {
      let swapIndex = randomCardIndex()
      let swapCard = deck[swapIndex];
      deck[swapIndex] = deck[i]
      deck[i] = swapCard;
    }
  }

  // Same as before - this pulls the top card from the deck
  // and returns it.
  this.dealCard = function () {
    return deck.shift()
  }

  // Since we can't access deck from outside the class
  // We provide some methods to provide the information
  // we need.
  this.remainingCount = function () {
    return deck.length
  }
}

const Player = function (name) {
  this.name = name
  this.hand = []

  this.handValue = function () {
    let total = 0
    this.hand.forEach(card => {
      total += card.value
    });
    return total
  }

  this.receiveCard = function (card) {
    this.hand.push(card)
  }
}


const GameOfBlackjack = function () {
  const DEALER = 0
  const PLAYER = 1

  let deck = new DeckOfCards()

  let ui = {
    title: document.getElementById('title'),
    status: document.getElementById('status'),
    dealer: document.getElementById('dealer'),
    cards: [
      document.querySelector('#dealer .hand'),
      document.querySelector('#player .hand')
    ],
    buttons: {
      newGame: document.getElementById('new-game-button'),
      hit: document.getElementById('hit-button'),
      stay: document.getElementById('stay-button'),
      newHand: document.getElementById('new-hand-button')
    }
  }

  let players = [
    new Player('Dealer'),
    new Player('Player')
  ]

  function renderCard(card) {
    let ele = document.createElement('div')
    ele.className = 'card'
    ele.classList = [ 'card', card.suit ]
    ele.innerHTML = card.rank

    return ele
  }

  function hit(playerIndex) {
    let card = deck.dealCard()
    players[playerIndex].hand.push(card)
    ui.cards[playerIndex].appendChild(renderCard(card))
  }

  function dealNewHand() {
    ui.dealer.classList.add('hide-first-card')
    ui.buttons.newHand.classList.add('hidden')

    hit(DEALER)
    hit(PLAYER)
    hit(DEALER)
    hit(PLAYER)

    ui.buttons.hit.classList.remove('hidden')
    ui.buttons.stay.classList.remove('hidden')
  }

  ui.buttons.newGame.addEventListener('click', function (e) {

  })

  ui.buttons.hit.addEventListener('click', function (e) {
    hit(PLAYER)
    if (players[PLAYER].handValue() > 21) {
      // Busted!
      ui.status.innerHTML = 'BUSTED'
    }
  })

  ui.buttons.stay.addEventListener('click', function (e) {

    ui.buttons.hit.classList.add('hidden')
    ui.buttons.stay.classList.add('hidden')
    ui.dealer.classList.remove('hide-first-card')

    while (players[DEALER].handValue() < 17) {
      hit(DEALER)
    }

    let dealerScore = players[DEALER].handValue()
    let playerScore = players[PLAYER].handValue()
    if (dealerScore > 21) {
      ui.status.innerHTML = 'Dealer BUSTED - You WIN!'
    } else if (dealerScore >= playerScore) {
      ui.status.innerHTML = 'You LOSE!'
    } else {
      ui.status.innerHTML = 'You WIN!'
    }
    ui.buttons.newHand.classList.remove('hidden')
  })

  ui.buttons.newHand.addEventListener('click', function (e) {
    dealNewHand()
  })

}


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
