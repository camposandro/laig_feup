/**
* Handles main menu's interaction
*/
mainMenu :-
    printMenu,
    askOption(Opt),
    handleOption(Opt).

/**
* Starts game on mode 'player vs player'
* handleOption(+'a')
*/
handleOption('a') :-
    startGame('Player','Player','NoMode'),!.

/**
* Handles bot menu for mode 'player vs bot'
* handleOption(+'b')
*/
handleOption('b') :-
    printBotMenu,
    askOption(Opt),
    handleOptionBot('Player','Bot',Opt).

/**
* Handles bot menu for mode 'bot vs bot'
* handleOption(+'c')
*/
handleOption('c') :-
    printBotMenu,
    askOption(Opt),
    handleOptionBot('Bot','Bot',Opt).

/**
* Leaves game
* handleOption(+'d')
*/
handleOption('d') :-
    write('. Leaving game...\n').

/**
* Starts game with bot of random plays
* handleOptionBot(+Player1,+Player2,+'a')
*/
handleOptionBot(Player1,Player2,'a') :-
   startGame(Player1,Player2,'Random'),!.

/**
* Starts game with AI bot of best play
* handleOptionBot(+Player1,+Player2,+'b')
*/
handleOptionBot(Player1,Player2,'b') :-
   startGame(Player1,Player2,'BestPlay'),!.

/**
* Returns to main menu
* handleOptionBot(+Player1,+Player2,+'d')
*/
handleOptionBot(_,_,'d') :-
    mainMenu,!.

/**
* Prints the main menu's design
*/
printMenu :-
    write('          _____________________          '),nl,
    write('         |                     |         '),nl,
    write('         |        Teeko        |         '),nl,
    write('         |                     |         '),nl,
    write('         |      Main menu      |         '),nl,
    write('         |_____________________|         '),nl,
    write('                                         '),nl,
    write('          a). Player vs Player           '),nl,
    write('          b). Player vs Bot              '),nl,
    write('          c). Bot vs Bot                 '),nl,
    write('          d). Leave                      '),nl,nl.

/**
* Prints the bot menu's design
*/
printBotMenu :-
    write('          ______________________          '),nl,
    write('         |                      |         '),nl,
    write('         |        Teeko         |         '),nl,
    write('         |                      |         '),nl,
    write('         |       Bot mode       |         '),nl,
    write('         |______________________|         '),nl,
    write('                                          '),nl,
    write('          a). Random                      '),nl,
    write('          b). Best play                   '),nl,
    write('          d). Return to main menu         '),nl,nl.