const Player = (marker) => {
  return { marker };
}

const game = (() => {
  let players = [Player("X"), Player("O")];
  let board = new Array(9);
  let currentPlayer = 0;
  let turn = 1;
  let gameOver = false;

  const takeTurn = (index) => {
    if (board[index] !== undefined)
      return;
    if (gameOver) {
      return;
    }

    let player = players[currentPlayer];
    board[index] = player;
    displayController.placeMarker(index, player);

    let {result, squares} = checkWin(player);

    if (result) {
      gameOver = true;
      displayController.gameOver(result, player, squares);
    } else {
        currentPlayer ^= 1;
        displayController.setCurrentPlayer(players[currentPlayer]);
        turn++;
    }        
  }

  const checkWin = (player) => {
    // Check rows
    for (let row = 0; row < 3; row++) {
      if (board[3*row] === player && board[3*row+1] === player && board[3*row+2] === player) {
        return {
          result: "win",
          squares: [3*row, 3*row+1, 3*row+2]
        }
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      if (board[col] === player && board[col+3] === player && board[col+6] === player) {
        return {
          result: "win",
          squares: [col, col+3, col+6]
        }
      }
    }
    
    // Check \ diagonal
    if (board[0] === player && board[4] === player && board[8] === player) {
      return {
        result: "win",
        squares: [0, 4, 8]
      };
    }
    
    // Check / diagonal
    if (board[2] === player && board[4] === player && board[6] === player) {
      return {
        result: "win",
        squares: [2, 4, 6]
      };
    }
    
    if (turn === 9)
      return { result: "tie" };

    return {};
  }

  return { takeTurn }
})();

const displayController = (() => {  
  const board = document.querySelector(".game-board");
  const status = document.querySelector(".game-status");
  const playAgain = document.querySelector(".play-again");

  const gameOver = (result, player, squares) => {
    if (result === "win") {
      status.textContent = `${player.marker} wins!`;
      highlightSquares(squares);
    } else {
      status.textContent = "Draw!";
    }

    board.classList.add("end")
    playAgain.innerHTML = '<a href="#" onclick="window.location.reload()" class="play-again__link">Play again?</a>';
  }

  const placeMarker = (index, player) => {
    const square = board.children[index];
    square.dataset.player = player.marker;
  }

  const setCurrentPlayer = (player) => {
    board.dataset.currentPlayer = player?.marker ?? "none";
  }

  const highlightSquares = (squares) => {
    for (let i = 0; i < 9; i++) {
      let square = board.children[i];
      if (squares?.includes(i)) {
        square.classList.add("highlight");
      } else {
        square.classList.remove("highlight");
      }
    }
  }

  return { placeMarker, setCurrentPlayer, gameOver };
})();

document.querySelectorAll(".game-square").forEach(el =>
  el.addEventListener("click", (e) => 
    game.takeTurn(Number(e.target.dataset.index))));