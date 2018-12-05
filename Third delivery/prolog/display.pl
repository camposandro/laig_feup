/**
* Displays columns' headers
*/
displayFirstLine :-
    write('    A    B    C    D    E '), nl.

/**
* Displays board line
* displayLine(+LineList,+nCols)
*/
displayLine([],N) :-
    write('  '),
    write(N).
displayLine([H|T], N) :-
    piece(H,Symbol),
    write(Symbol),
    write('  | '),
    displayLine(T,N).

/**
* Displays board by line
* displayBoard(+LinesList,+nLines)
*/
displayBoard([],_).
displayBoard([H|T],L) :-
	N is L + 1,
    write(' | '),
    displayLine(H,N), nl,
    displayBoard(T,N).
	
/**
* Displays game board
* displayGame(+Board)
*/
displayGame(Board) :-
    nl, displayFirstLine, nl,
    displayBoard(Board,0), nl.

/**
* Prints the randomly generated cell  
* printGeneratedCell(+Row,+Col)
*/
printGeneratedCell(Row,Col) :-
    write('. (AI) Row generated: '), write(Row), nl,
    write('. (AI) Col generated: '), write(Col), nl.

/**
* Prints the randomly generated movement  
* printGeneratedMove(+Row,+Col,+FinalRow,+FinalCol)
*/
printGeneratedMove(Row,Col,FinalRow,FinalCol) :-
    write('. (AI) Initial row generated: '), write(Row), nl,
    write('. (AI) Initial col generated: '), getColNum(ICol,Col), write(ICol), nl,
    write('. (AI) Final row generated: '), write(FinalRow), nl,
    write('. (AI) Final col generated: '), getColNum(FCol,FinalCol), write(FCol), nl.

/**
* Prints the player/bot currently playing
* along with the pieces it has in its charge.
* printPlayer(+Player,+Piece)
*/
printPlayer(Player,Piece) :-
    write('. ('), write(Player), write(') '),
    write(Piece), write(' pieces playing!\n') .

/**
* Prints the winner player/bot
* printWinner(+Player,+Piece)
*/
printWinner(Player,Piece) :-
    write('. Congratulations '), write(Player), write('!\n'),
    write('. '), write(Piece), write(' pieces won!\n').