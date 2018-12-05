:- use_module(library(random)).
:- use_module(library(system)).
:- consult('bot.pl').
:- consult('data.pl').
:- consult('display.pl').
:- consult('input.pl').
:- consult('logic.pl').
:- consult('menus.pl').
:- consult('utilities.pl').

play :-
    initializeRandomSeed,
    mainMenu.