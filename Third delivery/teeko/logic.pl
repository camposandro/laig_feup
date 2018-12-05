/**
* Initializes game board and its initial conditions
* - The initial number of plays is 8;
* - The initial pieces are black;
* initialize(-Board,-InitialNPlays,-InitialPiece)
*/
initialize(Board,InitialNPlays,InitialPiece) :-
    InitialNPlays is 8,
    InitialPiece = black,
    initialBoard(Board).

/**
* Game entry point
* startGame(+Player1,+Player2,+Mode)
*/
startGame(Player1,Player2,Mode) :-
    initialize(Board,InitialNPlays,InitialPiece),
    displayGame(Board),
    place(Board,Player1,Player2,InitialPiece,InitialNPlays,Mode,NewBoard);
    move(NewBoard,Player1,Player2,InitialPiece,Mode).

/**
* Checks for the existence of winners
* gameOver(+Board,+Player1,+Player2)
*/
gameOver(Board,Player1,Player2) :-
    (checkWin(Board,black), printWinner(Player1,'Black'));
    (checkWin(Board,red), printWinner(Player2,'Red')).

/**
* Clause to check winning state
* checkWin(+Board,+Piece)
*/
checkWin(Board,Piece) :-
    winRow(Board,Piece);
    winCol(Board,Piece);
    winDiag(Board,Piece);
    winSquare(Board,Piece).

/**
* Game's initial playing cycle of placing pieces on the board
* Turns alternate between the players of black and red pieces
* place(+Board,+Player1,+Player2,+Piece,+NPlays,-NewBoard)
*/
place(Board,Player1,Player2,_,_,_,_) :- 
    gameOver(Board,Player2,Player1), !.

place(Board,Player1,Player2,Piece,0,Mode,_) :-
    !, move(Board,Player1,Player2,Piece,Mode).

place(Board,Player1,Player2,Piece,NPlays,Mode,NewBoard) :-
    NPlays > 0,
    NewNPlays is NPlays - 1,
    (
        placePiece(Board,Player1,Piece,NextBoard),
        getNextPiece(Piece,NextPiece),
        place(NextBoard,Player2,Player1,NextPiece,NewNPlays,Mode,NewBoard)
    );
    NewBoard = Board.

/**
* Clause for placing pieces iteration
* placePiece(+Board,+Player,+Piece,-NextBoard)
*/
placePiece(Board,Player,Piece,NextBoard) :-
    (Player = 'Player' -> 
        askFreeCell(Board,Row,Col); 
        generateFreeCell(Board,Row,Col),
        printGeneratedCell(Row,Col)
    ),
    replaceBoardVal(Board,Row,Col,Piece,NextBoard),
    displayGame(NextBoard).

/**
* Handles player/bot piece movements
* move(+Board,+Player1,+Player2,+Piece)
*/
move(Board,Player1,Player2,_,_) :-
    gameOver(Board,Player2,Player1), !.

move(Board,Player1,Player2,Piece,Mode) :-
    (Player1 = 'Player' -> 
        askMovement(Board,Piece,Row,Col,FinalRow,FinalCol); 
        (
            (Mode = 'Random' ->
                generateBotMovement(Board,Piece,Row,Col,FinalRow,FinalCol);
                (
                    selectBotInitialCell(Board,Piece,Row,Col),
                    chooseMove(Board,Piece,Row,Col,FinalRow,FinalCol)
                )
            ),
            printGeneratedMove(Row,Col,FinalRow,FinalCol)
        )
    ),
    moveBoardPiece(Board,Row,Col,FinalRow,FinalCol,FinalBoard),
    displayGame(FinalBoard),
    getNextPiece(Piece,NextPiece),
    move(FinalBoard,Player2,Player1,NextPiece,Mode).
    
/**
* Moves a board piece to another cell
* moveBoardPiece(+Board,+Row,+Col,+FinalRow,+FinalCol)
*/
moveBoardPiece(Board,Row,Col,FinalRow,FinalCol,FinalBoard) :-
    getBoardVal(Board,Row,Col,Piece),
    replaceBoardVal(Board,Row,Col,empty,NewBoard),
    replaceBoardVal(NewBoard,FinalRow,FinalCol,Piece,FinalBoard).

/**
* Returns all valid piece moves from a given position
* validMoves(+Board,+Row,+Col,-ValidMoves)
*/
validMoves(Board,Row,Col,ValidMoves) :-
    findall([FRow,FCol],getAdjacent(Row,Col,FRow,FCol), AdjacentMoves),
    getFreeMoves(Board,AdjacentMoves,ValidMoves).

/**
* Checks if a piece movement is legal, this is
* if the piece moves to a free adjacent cell
* checkMovement(+Board,+Row,+Col,+FinalRow,+FinalCol)
*/
checkMovement(Board,Row,Col,FinalRow,FinalCol) :-
    validMoves(Board,Row,Col,ValidMoves),
    member([FinalRow,FinalCol],ValidMoves).

/**
* Returns adjacent cells
* getAdjacent(+Row,+Col,-FRow,-FCol)
*/
getAdjacent(Row,Col,FRow,FCol) :-
    (
        FRow is Row, FCol is Col + 1;
        FRow is Row + 1, FCol is Col + 1;
        FRow is Row + 1, FCol is Col;
        FRow is Row + 1, FCol is Col - 1;
        FRow is Row, FCol is Col - 1;
        FRow is Row - 1, FCol is Col - 1;
        FRow is Row - 1, FCol is Col;
        FRow is Row - 1, FCol is Col + 1
    ),
    FRow > 0, FCol > 0, FRow < 6, FCol < 6.

/**
* Verifies if two positions are adjacent, 
* horizontally, vertically or diagonally
* adjacentPos(+X,+Y,+X2,+Y2)
*/
adjacentPos(X,Y,X2,Y2) :-
    abs(X2 - X, Dx), Dx =< 1,
    abs(Y2 - Y, Dy), Dy =< 1.

/**
* Returns all the valid moves for adjacent free cells
* getFreeMoves(+Board,+AdjMoves,-AdjFreeMoves)
*/
getFreeMoves(_,[],[]).
getFreeMoves(Board,[H|T],T1) :-
    getListVal(H,1,X),
    getListVal(H,2,Y),
    \+ freeCell(Board,X,Y),!,
    getFreeMoves(Board,T,T1).
getFreeMoves(Board,[H|T],[H|T1]) :-
    getFreeMoves(Board,T,T1).

/**
* Checks if board cell is free
* freeCell(+Board,+Row,+Col)
*/
freeCell(Board,Row,Col) :-
    getBoardVal(Board,Row,Col,empty).

/**
* Verifies if chosen cell has a certain piece
* checkPieceCell(+Board,+Piece,+Row,+Col)
*/
checkPieceCell(Board,Piece,Row,Col) :-
    getBoardVal(Board,Row,Col,CellPiece),
    CellPiece == Piece.

/**
* Retrieves next turn's player piece
* getNextPiece(+Piece,-OtherPiece)
*/
getNextPiece(Piece,NextPiece) :-
    (Piece = black, NextPiece = red);
    (Piece = red, NextPiece = black).