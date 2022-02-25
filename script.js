const cardElements = document.querySelectorAll('.memory-card');
const endGameElement = document.querySelector('.overlay');
const endGameBtn = document.querySelector('.endgame-reset');
const scoreWindowElement = document.querySelector('.scores');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedCard = 0;
let bestResults = [];

window.addEventListener('load', getLocalStorage);

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add('flip');
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    moves++;

    return;
  }
  hasFlippedCard = false;
  secondCard = this;
  moves++;

  matchCheckHandler();
}

function matchCheckHandler() {
  if (firstCard.dataset.char === secondCard.dataset.char) {
    matchedCard++;
    if (matchedCard == 6) {
      setTimeout(() => {
        endGameHandler();
      }, 500);
    }
    removeEventHandler(firstCard, 'click', flipCard);
    removeEventHandler(secondCard, 'click', flipCard);
  } else {
    unflipCardHandler();
  }
}

function removeEventHandler(t, e, handler) {
  t.removeEventListener(e, handler);
}
function unflipCardHandler() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoardHandler();
  }, 1000);
}
function resetBoardHandler() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffleHandler() {
  cardElements.forEach((card) => {
    let orderRandom = Math.floor(Math.random() * 12);
    card.style.order = orderRandom;
  });
})();
function endGameHandler() {
  endGameElement.classList.remove('hidden');
  document.querySelector(
    '.endgame-text'
  ).textContent = `You won in ${moves} moves!`;
  let res = new Result(moves);
  bestResults.push(res);
  setLocalStorage(bestResults);
}
function newGameHandler() {
  endGameElement.classList.add('hidden');
  matchedCard = 0;
  moves = 0;
  cardElements.forEach((card) => {
    card.classList.remove('flip');
  });
  resetBoardHandler();
  cardElements.forEach((card) => {
    let orderRandom = Math.floor(Math.random() * 12);
    card.style.order = orderRandom;
  });
  cardElements.forEach((card) => card.addEventListener('click', flipCard));
}
function setLocalStorage(arr) {
  removeResultHandler(arr);
  let arrJSON = JSON.stringify(arr);
  localStorage.setItem('results', arrJSON);
}
function getLocalStorage() {
  if (localStorage.getItem('results')) {
    showBestResultsHandler();
  } else {
    const message = `<p>Congratulations! It's your first win!</p>`;
    scoreWindowElement.insertAdjacentElement('beforeend', message);
  }
}

function showBestResultsHandler() {
  let tmp = localStorage.getItem('results');
  bestResults = JSON.parse(tmp);
  for (let i = 0; i < bestResults.length; i++) {
    const text = `<p>${i + 1}. Moves to win: ${bestResults[i].moves}</p>`;

    scoreWindowElement.insertAdjacentHTML('beforeend', text);
  }
  removeResultHandler(bestResults);
}
function Result(moves) {
  this.moves = moves;
}
function removeResultHandler(arr) {
  if (arr.length >= 10) {
    arr.shift();
  }
}

endGameBtn.addEventListener('click', newGameHandler);
cardElements.forEach((card) => card.addEventListener('click', flipCard));

