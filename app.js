// constants
const colors = {
  "1": "blue",
  "-1": "yellow",
  "0": "white",
};

const NUM_COLS = 7;
const NUM_ROWS = 6;

// app state
let board, winner, turn;
// cached elements
const msgEl = document.getElementById("msg");
const markersEl = document.getElementById("markers");

let cellEls = [];

for (let colIdx = 0; colIdx < NUM_COLS; colIdx++) {
  let tmp = [];
  for (let rowIdx = 0; rowIdx < NUM_ROWS; rowIdx++) {
    let el = document.getElementById(`c${colIdx}r${rowIdx}`);
    tmp.push(el);
  }
  cellEls.push(tmp);
}

// event listeners
markersEl.addEventListener("click", handleMarkerClick);
// functions
init();

function handleMarkerClick(evt) {
  let el = evt.target;
  const colId = parseInt(el.getAttribute("id").replace("col", ""));

  if (isNaN(colId) || winner) return;

  let rowId = board[colId].indexOf(0);
  if (rowId === -1) return;

  board[colId][rowId] = turn;
  getWinner();
  turn = turn * -1;
  render();
}

function getWinner() {
  let foundZero = false;
  for (let colIdx = 0; colIdx < board.length; colIdx++) {
    for (let rowIdx = 0; rowIdx < board[colIdx].length; rowIdx++) {
      winner =
        checkUp(colIdx, rowIdx) ||
        checkRight(colIdx, rowIdx) ||
        checkDiag(colIdx, rowIdx, 1) ||
        checkDiag(colIdx, rowIdx, -1);
      if (winner) break;

      foundZero = foundZero || board[colIdx][rowIdx] === 0;
    }
    if (winner) break;
  }
  if (!winner && !foundZero) {
    winner = "T";
  }
}
function checkUp(colIdx, rowIdx) {
  if (rowIdx > 2) return null;
  const colArr = board[colIdx];

  let absVal = Math.abs(
    colArr[rowIdx] +
      colArr[rowIdx + 1] +
      colArr[rowIdx + 2] +
      colArr[rowIdx + 3]
  );
  return absVal === 4 ? colArr[rowIdx] : null;
}

function checkRight(colIdx, rowIdx) {
  if (colIdx > 3) return null;
  let absVal = Math.abs(
    board[colIdx][rowIdx] +
      board[colIdx + 1][rowIdx] +
      board[colIdx + 2][rowIdx] +
      board[colIdx + 3][rowIdx]
  );
  return absVal === 4 ? board[colIdx][rowIdx] : null;
}

function checkDiag(colIdx, rowIdx, vertOffset) {
  if (
    colIdx > 3 ||
    (vertOffset > 0 && rowIdx > 2) ||
    (vertOffset < 0 && rowIdx < 3)
  )
    return;
  let absVal = Math.abs(
    board[colIdx][rowIdx] +
      board[colIdx + 1][rowIdx + vertOffset] +
      board[colIdx + 2][rowIdx + vertOffset * 2] +
      board[colIdx + 3][rowIdx + vertOffset * 3]
  );
  return absVal === 4 ? board[colIdx][rowIdx] : null;
}

function render() {
  board.forEach(function (colArray, colIdx) {
    const markerEl = document.getElementById(`col${colIdx}`);
    markerEl.style.borderTopColor = colArray.includes(0)
      ? "black"
      : "transparent";

    colArray.forEach(function (cell, rowIdx) {
      cellEls[colIdx][rowIdx].style.backgroundColor = colors[cell];
    });
  });

  if (winner) {
    if (winner === "T") {
      msgEl.textContent = "TIE";
    } else {
      let color = colors[winner];
      msgEl.innerHTML = `<span style ="color:${color}">${color.toUpperCase()}</span> is the winner`;
    }
  } else {
    let color = colors[turn];
    msgEl.innerHTML = `<span style ="color:${color}">${color.toUpperCase()}'s</span> turn`;
  }
}
function init() {
  board = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];

  winner = null;
  turn = 1;

  render();
}
