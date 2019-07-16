// Blackjack
// by lamador
//


// Valores de las cartas
let suits = ["Hearts", "Clubs", "Diamonts", "Spades"],
  values = ['Ace', 'King', 'Queen', 'Jack',
    'Ten', 'Nine', 'Eight', 'Seven', 'Six',
    'Five', 'Four', 'Three', 'Two',
  ];

// Variables DOM
let textArea = document.getElementById('paragraph'),
  newButton = document.getElementById('new-game-btn'),
  stayButton = document.getElementById('stay-btn'),
  hitButton = document.getElementById('hit-btn')

// Variables de juego
let gameStarted = false,
  gameOver = false,
  playerWon = false,
  dealerCards = [],
  playerCards = [],
  dealerScore = 0,
  playerScore = 0,
  deck = []

stayButton.style.display = 'none';
hitButton.style.display = 'none';
showStatus();

// event listeners

newButton.addEventListener('click', function () {
  gameStarted = true;
  gameOver = false;
  playerWon = false;

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  stayButton.style.display = 'inline';
  hitButton.style.display = 'inline';
  newButton.style.display = 'none';
  checkForEndOfGame();
  showStatus();
});

hitButton.addEventListener('click', function () {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

stayButton.addEventListener('click', function () {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

// final event listeners

function createDeck() {
  let deck = [];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex++) {
    for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
      let card = {
        suit: suits[suitIndex],
        value: values[valueIndex]
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    let swapIndex = Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIndex];
    deck[swapIndex] = deck[i];
    deck[i] = tmp;
  }
}

function getCardString(card) {
  return card.value + " of " + card.suit;
}

function getNextCard() {
  return deck.shift();
}

function getCardNumericValue(card) {
  switch (card.value) {
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five':
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
}

function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === 'Ace') {
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);

}

function checkForEndOfGame() {
  updateScores();

  if (dealerScore === 21) {
    gameOver = true
    playerWon = false;
  }
  if (playerScore === 21) {
    gameOver = true
    playerWon = true;
  }

  if (gameOver) {
    //permite al dealer pedir mas cartas
    while (dealerScore < playerScore &&
      playerScore <= 21 &&
      dealerScore <= 21) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }
  if (playerScore > 21) {
    // declara perdedor al player cuando playerScore > 21
    playerWon = false;
    gameOver = true;
  }
  if (dealerScore > 21) {
    // declara ganador al player cuando dealerScore > 21

    playerWon = true;
    gameOver = true;

  }
  if (dealerScore === 21 && playerScore === 21) {
    // empate, dealer ganador
    playerWon = false;
    gameOver = true;
  }

  if (playerCards.length >=5 && playerScore <= 21){
    // player tiene 5 cartas = ganador
    playerWon = true;
    gameOver = true;
  }

  if (dealerCards.length >=5 && dealerScore <=21){
        // player tiene 5 cartas = ganador

    playerWon = true;
    gameOver = true;
  }
}

function showStatus() {
  if (!gameStarted) {
    // pantalla de inicio de juego
    textArea.innerText = 'Welcome to Blackjack!';
    return;
  }

  let dealerCardString = '';
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + '\n';
  }

  let playerCardString = '';
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + '\n';
  }

  updateScores();

  textArea.innerText =
    'Dealer has:\n' +
    dealerCardString +
    '(score: ' + dealerScore + ')\n\n' +

    'Player has:\n' +
    playerCardString +
    '(score: ' + playerScore + ')\n\n';

  if (gameOver) {
    if (playerWon) {
      textArea.innerText += "YOU WIN!!";
    } else {
      textArea.innerText += "DEALER WINS";
    }
    newButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }

}