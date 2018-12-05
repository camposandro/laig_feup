/**
* Requests menu option from the user
* askOption(-Opt)
*/
askOption(Opt) :- 
    write('-> Insert option '),
    read(Opt),
    getOption(Opt).

/**
* Verifies if inserted option is valid
* getOption(+Opt)
*/
getOption(Opt) :-
    (
        Opt = 'a';
        Opt = 'b';
        Opt = 'c';
        Opt = 'd'
    );
    write('. Insert a valid option!\n'),
    askOption(Opt).
    
/**
* Asks for a valid cell
* askFreeCell(+Board,-Row,-Col)
*/
askFreeCell(Board,Row,Col) :-
    (
        askRow(Row),
        askCol(Col),
        freeCell(Board,Row,Col)
    );
    askFreeCell(Board,Row,Col).

/**
* Asks for a valid movement cell
* askMoveCell(+Board,-Row,-Col)
*/
askMoveCell(Board,Row,Col) :-
    (
        askRow(Row), 
        askCol(Col)
    );
    askMoveCell(Board,Row,Col).

/**
* Requests board row from the user
* askRow(-Row)
*/
askRow(Row) :-
    write('-> Insert row '), read(Row),
    checkRow(Row);
    (
        write('. Insert a valid row!\n'),
        askRow(Row)
    ).

/**
* Verifies if inserted row is valid
* checkRow(+Row)
*/
checkRow(Row) :-
    integer(Row), Row < 6, Row > 0.

/**
* Requests board column from the user
* askCol(-Col)
*/
askCol(Col) :-
    write('-> Insert col '), read(ColAux), 
    getColNum(ColAux,Col);
    (
        write('. Insert a valid col!\n'), 
        fail
    ).

/**
* Returns column number, if valid
* getColNum(+ColChar,-ColNum)
*/
getColNum('a',Col) :-
    Col = 1.
getColNum('b',Col) :-
    Col = 2.
getColNum('c',Col) :-
    Col = 3.
getColNum('d',Col) :-
    Col = 4.
getColNum('e',Col) :-
    Col = 5.

/**
* Requires input from the player to move one of its pieces
* askMovement(+Board,+Piece,+Row,+Col,+FinalRow,+FinalCol)
*/
askMovement(Board,Piece,Row,Col,FinalRow,FinalCol) :-
    write('. -- Player '), write(Piece), write(' --\n'),
    askInitialCell(Board,Piece,Row,Col), !,
    askFinalCell(Board,Piece,Row,Col,FinalRow,FinalCol), !.

/**
* Requests a cell occupied by the user's pieces
* askInitialCell(+Board,+Piece,-Row,-Col)
*/    
askInitialCell(Board,Piece,Row,Col) :-
    write('. Cell of piece to be moved .\n'),
    (
        askMoveCell(Board,Row,Col),
        checkPieceCell(Board,Piece,Row,Col),
        validMoves(Board,Row,Col,ValidMoves),
        listLength(ValidMoves,Length),
        Length > 0
    );
    write('. Insert a valid piece cell!\n'),
    askInitialCell(Board,Piece,Row,Col).

/**
* Requests a free adjacent cell to the initial one picked by the user
* askFinalCell(+Board,+Piece,+Row,+Col,-FinalRow,-FinalCol)
*/
askFinalCell(Board,Piece,Row,Col,FinalRow,FinalCol) :-
    write('. Cell to insert moved piece .\n'),
    (
        askMoveCell(Board,FinalRow,FinalCol),
        checkMovement(Board,Row,Col,FinalRow,FinalCol)
    );
    write('. Insert a free adjacent cell!\n'),
    askFinalCell(Board,Piece,Row,Col,FinalRow,FinalCol).