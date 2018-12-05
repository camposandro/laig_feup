/**
* Returns list length
* listLength(+List,-Length)
*/
listLength([],0).
listLength([_|T],L) :-
    listLength(T,N),
    L is N + 1.

/**
* Returns value on an index of a given list
* getListVal(+List,+Idx,+Val)
*/
getListVal([H|_],1,Val) :-
    Val = H.
getListVal([_|T],Idx,Val) :-
    Idx > 1,
    Idx1 is Idx - 1,
    getListVal(T,Idx1,Val).

/**
* Returns the maximum value on a given list
* getBoardVal(+List,-Value)
*/
getMaxList([Value], Value).
getMaxList([X|Xs], Value) :-
    getMaxList(Xs, T),
    (X > T -> Value = X ; Value = T).

/**
* Returns piece on a given board's position
* getBoardVal(+Board,+Row,+Col,-Val)
*/
getBoardVal([H|_],1,Col,Val) :-
    getListVal(H,Col,Val).
getBoardVal([_|T],Row,Col,Val) :-
    Row > 1,
    Row1 is Row - 1,
    getBoardVal(T,Row1,Col,Val).

/**
* Returns a specific board column
* getBoardCol(+Board,,+Row,+Col,-FullCol)
*/
getBoardCol([],_,[]).
getBoardCol([H|T],Col,[H1|T1]) :-
    getListVal(H,Col,H1),
    getBoardCol(T,Col,T1).

/**
* Returns all the columns of the board
* getAllCols(+Board,+Col,-ColsList)
*/
getAllCols(_Board,0,[]).
getAllCols(Board,Col,[H1|T1]) :-
    Col > 0,
    Col1 is Col - 1,
    getBoardCol(Board,Col,H1),
    getAllCols(Board,Col1,T1).

/**
* Changes value on a given list
* replaceListVal(+List,+Idx,+Val,-NewBoard)
*/
replaceListVal([_|T],1,Val,[Val|T]).
replaceListVal([H|T],Idx,Val,[H|Ts]) :-
    Idx > 1,
    Idx1 is Idx - 1,
    replaceListVal(T,Idx1,Val,Ts).

/**
* Changes piece on a given board's position
* replaceBoardVal(+Board,+Row,+Col,+Val,-NewBoard)
*/
replaceBoardVal([H|T],1,Col,Val,[Hs|T]) :-
    replaceListVal(H,Col,Val,Hs).
replaceBoardVal([H|T],Row,Col,Val,[H|Ts]) :-
    Row > 1,
    Row1 is Row - 1,
    replaceBoardVal(T,Row1,Col,Val,Ts).

/**
* Returns the maximum of two values
* getMax(+Val1,+Val2,-Max)
*/
getMax(Val1,Val2,Val1):-
    Val1 >= Val2, !.
getMax(_,Val2,Val2).

/**
* Absolute value of a value
* abs(+Value,-AbsValue)
*/
abs(Value,AbsValue) :-
    Value < 0 -> AbsValue is -Value;
    AbsValue = Value.

/**
* Randomizes the seed, so that the values differ
*/
initializeRandomSeed :-
	now(Usec), Seed is Usec mod 30269,
	getrand(random(X, Y, Z, _)),
    setrand(random(Seed, X, Y, Z)), !.

/**
* Generates a move for the bot
* generateNumber(+MinNum,+MaxNum,-Number)
*/
generateNumber(MinNum,MaxNum,Number) :-
    random(MinNum,MaxNum,Number).