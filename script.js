document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    const pieces = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟'
    };

    // setup of the chessboard
    const initialSetup = [
        'rnbqkbnr',
        'pppppppp',
        '        ',
        '        ',
        '        ',
        '        ',
        'PPPPPPPP',
        'RNBQKBNR'
    ];

    let board = initialSetup.map(row => row.split(''));
    let selectedPiece = null;
    let currentTurn = 'white';

    // Function to render the chessboard
    const renderBoard = () => {
        chessboard.innerHTML = '';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const tile = document.createElement('div');
                tile.className = 'tile ' + ((row + col) % 2 === 0 ? 'pink' : 'black');
                tile.dataset.row = row;
                tile.dataset.col = col;

                const piece = board[row][col];
                if (piece !== ' ') {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = 'piece';
                    pieceElement.textContent = pieces[piece.toLowerCase()];
                    pieceElement.dataset.color = piece === piece.toUpperCase() ? 'white' : 'black';
                    tile.appendChild(pieceElement);
                }

                tile.addEventListener('click', onTileClick);
                chessboard.appendChild(tile);
            }
        }
    };

    // Function to handle tile click events
    const onTileClick = (e) => {
        const tile = e.currentTarget;
        const row = parseInt(tile.dataset.row);
        const col = parseInt(tile.dataset.col);
        const piece = board[row][col];

        if (selectedPiece) {
            movePiece(selectedPiece, { row, col });
            selectedPiece = null;
        } else if (piece !== ' ' && (piece === piece.toUpperCase() ? 'white' : 'black') === currentTurn) {
            selectedPiece = { row, col, piece };
            tile.classList.add('selected');
        }
    };

    // Function to move a piece from one position to another
    const movePiece = (from, to) => {
        board[to.row][to.col] = from.piece;
        board[from.row][from.col] = ' ';
        currentTurn = currentTurn === 'white' ? 'black' : 'white';
        renderBoard();
        if (currentTurn === 'black') {
            setTimeout(botMove, 500);
        }
    };

    // Function to make the bot move
    const botMove = () => {
        const moves = getAllPossibleMoves('black');
        if (moves.length > 0) {
            const move = moves[Math.floor(Math.random() * moves.length)];
            movePiece(move.from, move.to);
        }
    };

    // Function to get all moves for a color
    const getAllPossibleMoves = (color) => {
        const moves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece !== ' ' && (piece === piece.toUpperCase() ? 'white' : 'black') === color) {
                    const possibleMoves = getPossibleMoves({ row, col, piece });
                    possibleMoves.forEach(to => {
                        moves.push({ from: { row, col, piece }, to });
                    });
                }
            }
        }
        return moves;
    };

    // Function to get moves for a piece 
    const getPossibleMoves = (from) => {
        const moves = [];
        const directions = [
            { dr: -1, dc: 0 }, { dr: 1, dc: 0 },
            { dr: 0, dc: -1 }, { dr: 0, dc: 1 },
            { dr: -1, dc: -1 }, { dr: -1, dc: 1 },
            { dr: 1, dc: -1 }, { dr: 1, dc: 1 }
        ];
        directions.forEach(({ dr, dc }) => {
            const newRow = from.row + dr;
            const newCol = from.col + dc;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const targetPiece = board[newRow][newCol];
                if (targetPiece === ' ' || (targetPiece === targetPiece.toUpperCase() ? 'white' : 'black') !== (from.piece === from.piece.toUpperCase() ? 'white' : 'black')) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });
        return moves;
    };

    renderBoard();
});
