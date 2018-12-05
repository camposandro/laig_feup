/**
* Generates bot movement on one of its pieces 
* generateBotMovement(+Board,+Piece,+Row,+Col,+FinalRow,+FinalCol)
*/
generateBotMovement(Board,Piece,Row,Col,FinalRow,FinalCol) :-
    selectBotInitialCell(Board,Piece,Row,Col), !,
    selectBotFinalCell(Board,Piece,Row,Col,FinalRow,FinalCol), !.

/**
* Selects a initial movement cell, occupied by the bot's pieces
* selectBotInitialCell(+Board,+Piece,-Row,-Col)
*/
selectBotInitialCell(Board,Piece,Row,Col) :-
    generateNumber(0,6,Row),
    generateNumber(0,6,Col),
    (
        checkPieceCell(Board,Piece,Row,Col),
        validMoves(Board,Row,Col,ValidMoves),
        listLength(ValidMoves,Length),
        Length > 0
    );
    selectBotInitialCell(Board,Piece,Row,Col).

/**
* Selects a free adjacent cell to the initial one picked for the bot
* selectBotFinalCell(+Board,+Piece,+Row,+Col,-FinalRow,-FinalCol)
*/
selectBotFinalCell(Board,Piece,Row,Col,FinalRow,FinalCol) :-
    (
        generateNumber(0,6,FinalRow),
        generateNumber(0,6,FinalCol),
        checkMovement(Board,Row,Col,FinalRow,FinalCol)
    );
    selectBotFinalCell(Board,Piece,Row,Col,FinalRow,FinalCol).

/**
* Selects a free random cell of the board
* generateFreeCell(+Board,-Row,-Col)
*/
generateFreeCell(Board,Row,Col) :-
    (
        generateNumber(0,6,Row),
        generateNumber(0,6,Col),
        freeCell(Board,Row,Col)
    );
    generateFreeCell(Board,Row,Col).

/**
* Chooses a move for the bot
* chooseMove(+Board,+Piece,+Row,+Col,-FinalRow,-FinalCol)
*/
chooseMove(Board,Piece,Row,Col,FinalRow,FinalCol) :-
    validMoves(Board,Row,Col,ValidMoves),
    getValidBoards(Board,Row,Col,ValidMoves,BoardList),
    chooseBest(Piece,BoardList,VMoves),
    getMaxList(VMoves,HigherValue),
    getListVal(ValidMoves,HigherValue,BestMove),
    getListVal(BestMove,1,FinalRow),
    getListVal(BestMove,2,FinalCol).

/**
* Gets all the boards resulting of a valid set of moves
* getValidBoards(+Board,+Row,+Col,+ValidMoves,-ValidBoards)
*/
getValidBoards(_,_,_,[],[]).
getValidBoards(Board,Row,Col,[Move | OtherMoves],[NewBoard | OtherBoards]) :-
    getListVal(Move,1,FinalRow),
    getListVal(Move,2,FinalCol),
    moveBoardPiece(Board,Row,Col,FinalRow,FinalCol,NewBoard),
    getValidBoards(Board,Row,Col,OtherMoves,OtherBoards).

/**
* Evaluates the board
* chooseBest(+Piece,+ValidBoards,-Values)
*/  
chooseBest(_,[],[]).
chooseBest(Piece,[Board | OtherBoards],[BoardValue|VMoves]) :-
    value(Board,Piece,BoardValue),
    chooseBest(Piece,OtherBoards,VMoves).