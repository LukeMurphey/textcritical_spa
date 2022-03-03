# How Content menus work

## Chapter: recognizes the click events

The chapter component recognizes the click events and communicates up to the Reader component.

## Reader: accepts the click event

Reader recognizes the click event and sets state such that it can show the proper dialog when render is called.

## Reader.shortcuts::getPopups(): renders the popup

getPopups() renders the popups accordingly.
