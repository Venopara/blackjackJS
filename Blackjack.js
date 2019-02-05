// JavaScript source code
//Blackjack
// By Tristen Throckmorton
// Updated by Aaron Throckmorton

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
    },
    endHand(winOrLose, message) {
      if (message) message += ' '
      ui.status.innerHTML = `${message}You ${winOrLose}!`
      ui.buttons.newHand.classList.remove('hidden')
      ui.buttons.hit.classList.add('hidden')
      ui.buttons.stay.classList.add('hidden')
    },
    startHand() {
      ui.status.innerHTML = ''
      ui.dealer.classList.add('hide-first-card')
      ui.buttons.newHand.classList.add('hidden')
      ui.buttons.hit.classList.remove('hidden')
      ui.buttons.stay.classList.remove('hidden')
    },
    setStatus(status) {
      ui.status.innerHTML = status
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

  function stay() {
    ui.dealer.classList.remove('hide-first-card')

    while (players[DEALER].handValue() < 17) {
      hit(DEALER)
    }

    let dealerScore = players[DEALER].handValue()
    let playerScore = players[PLAYER].handValue()

    if (dealerScore > 21) {
      ui.endHand('WIN', 'Dealer BUSTED!')
    } else if (dealerScore >= playerScore) {
      ui.endHand('LOSE')
    } else {
      ui.endHand('WIN')
    }
  }

  function dealNewHand() {
    ui.startHand()

    hit(DEALER)
    hit(PLAYER)
    hit(DEALER)
    hit(PLAYER)

    let dealerScore = players[DEALER].handValue()
    let playerScore = players[PLAYER].handValue()

    if (dealerScore === 21 && playerScore === 21) {
      ui.endHand('PUSH', 'Double Blackjack!')
    } else if (dealerScore === 21) {
      ui.endHand('LOSE', 'Dealer has Blackjack!')
    } else if (playerScore  === 21) {
      ui.endHand('WIN', 'Blackjack!')
    }
  }

  ui.buttons.newGame.addEventListener('click', function (e) {

  })

  ui.buttons.hit.addEventListener('click', function (e) {
    hit(PLAYER)
    let playerScore = players[PLAYER].handValue()
    if (playerScore > 21) {
      // Busted!
      ui.endHand('LOSE', 'BUSTED!')
    } else if (playerScore == 21) {

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
      us.setStatus('Dealer BUSTED - You WIN!')
    } else if (dealerScore >= playerScore) {
      us.setStatus('You LOSE!')
    } else {
      us.setStatus('You WIN!')
    }
    ui.buttons.newHand.classList.remove('hidden')
  })

  ui.buttons.newHand.addEventListener('click', function (e) {
    dealNewHand()
  })

  dealNewHand()
}

let game = new GameOfBlackjack()
