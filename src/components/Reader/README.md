
This is the main component that provides the interface for reading works.

## What is the lifecycle of resolving a new reference (when the user types in a new reference)?

1. `ReadingMenuBar`: accepts key preesses and checks the server to see if the reference is valid
2. `ReadingMenuBar`: if the user presses "enter", the reference is checked in `checkAndGoToReference()` and `Reader::goToReference()` is called to go to the new page
3. `Reader::goToReference()` accepts the request to go to a new reference and calls `updateHistory()` to modify the URL and load the new path
4. `Reader::useEffect()` triggers, parses the new URL and loads the page accordingly

## How does the view avoid reloading the content when a verse reference is to a verse within the existing chapter?

`updateHistory()` checks to see if the URL would be different and decides against a reload if so.

## How Context menus work

### Chapter: recognizes the click events

The chapter component recognizes the click events and communicates up to the Reader component.

### Reader: accepts the click event

Reader recognizes the click event and sets state such that it can show the proper dialog when render is called.

### Reader.shortcuts::getPopups(): renders the popup

getPopups() renders the popups accordingly.
