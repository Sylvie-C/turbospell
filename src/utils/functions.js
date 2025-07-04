import { useGameStore } from '../store'


/* Function to return an array of letters * their number in stock, based on Zustand lettersStore data. 
  Used for better letters pickup probabilities. 
  Params: none. 
  Return: Array of letters. e.g.: ["A","A","A","A", ... "B","B",... ]
*/
export const lettersInStock = () => { 
  const { lettersStore } = useGameStore.getState() 

  // Zustand lettersStore entries
  const lettersStoreEntries = Object.entries(lettersStore) // convert to Array of entries: ["letter",{nb: , value: }] ,...]

  const lettersArray = []

  // Parse lettersStore entries (Arrays)
  for (let [letter] of lettersStoreEntries ) { 
    for (let i=0; i<lettersStore[letter].nb; i++) lettersArray.push(letter) 
  } 
  return lettersArray
}


/* Function to convert a 1D index value in a one dimension board, to a position in a 2D board (x,y). 
  Params: 
    - index value (type integer), 
    - colsNb: board array columns number (where cols = rows). int type. 
  Return: object { row: integer , col: integer }. 
*/
export function convert1Dto2D (index , colsNb) {

  const x = Math.floor(index / colsNb)
  const y = index % colsNb

  return { row: x , col: y }
}


/* Function to convert a 2D position in a 2D board (x,y), to a 1D index value. 
  Params: 
    - x: row value (int type) , 
    - y: col value (int type), 
    - colsNb: board array columns number (where cols = rows). int type. 
  Return: index value (int type). 
*/
export function convert2Dto1D (x,y,colsNb) {
  const index = x * colsNb + y
  return index
}


/* Function to return ONE random letter, picked up from an array of available letters in stock. 
  Parameter: Array of available letters
  Return : one random letter. 
*/ 
const randomLetterGen = (lettersArray) => { 

  const randomInt = Math.floor(Math.random() * lettersArray.length)

  const randomLetter = lettersArray[randomInt]

  lettersArray.splice(randomInt,1)

  return randomLetter

}


/* Function to return an array of multiple random letters. 
  Params: 
    - lettersNb: number of letters to pickup, 
    - storeLetters: array of available letters (e.g.: ["A","A","A", ... ]) based on Zustand store. 
    Use this array instead of Zustand letterStore[letter].nb value due to letters pickup probability and user experience, 
  Return: Array of letters [string]. 
*/
export const randomLettersGen = (lettersNb , storeLetters) => { 

  const lettersArray = [] 
  let randomLetter

  for (let i=1; i<=lettersNb; i++) { 
    randomLetter = randomLetterGen(storeLetters) 
    lettersArray.push(randomLetter)
  }

  return lettersArray
}


/* Function to extract filled tiles positions on board (2D format { row , col }). 
  Params : 
    - boardArray : board array of 1D format positions. Applied for "tilesContent" in <Board/> state, 
    - colsNb : board array columns number (where cols = rows). 
  Return : array of filled tiles 2D positions. Type [ {row: int , col: int} , ... ]
*/
export const extractFilledTilesPos = (boardArray , colsNb) => {

  const positions = boardArray.map (
    (elt , index) => elt ? convert1Dto2D(index , colsNb) : null
  )

  const filledTilesPositions = positions.filter (elt => elt)

  return filledTilesPositions
}

/* Function to delete letters in board. 
  Params: 
    - lettersSet: Set of letters index (1D positions) to delete from board, 
    - boardArray: initial board array of letters. 
  Return: new board array of letters without deleted letters. 
*/
export const deleteLetters = (lettersSet , boardArray) => { 

  const newBoardArray = boardArray.map(
    (elt, index) => lettersSet.has(index) ? "" : elt
  )

  return newBoardArray
}


/* Function to return an array of random index integer, if not in another array of filled tiles index. 
  Params : 
    - positionsNb: number of index to return, 
    - filledTilesIndex: Array of filled tiles index, 
    - colsNb: main board columns number (where cols = rows). 
  Return : Array of 1D positions index (board index from 0 to 63). 
*/
export const lettersPositionsGen = (positionsNb , filledTilesIndex , colsNb) => { 
  const randomIndex = []

  for ( let i=1; i<=positionsNb; i++ ) {
    let randomPosition = Math.floor(Math.random() * (colsNb**2)) 

    // while random index are not different OR while tile index is not empty, choose another index position
    while ( randomIndex.includes(randomPosition) || filledTilesIndex.includes(randomPosition) ) {
      randomPosition = Math.floor(Math.random() * (colsNb**2))
    }

    randomIndex.push(randomPosition)
  }

  return randomIndex
}


/* Function to check if a tile contains a letter. 
  Param : 
    - boardArray : board array in <Board /> state ( array of 1D format positions )
    - colsNb: board array columns number (where cols = rows). int type. 
    - tilePos : tile 2D position { row:int , col:int } type. 
  Return : boolean. 
*/
export const isTileFilled = (boardArray, colsNb , tilePos) => {

  const filledTilesPositions = extractFilledTilesPos(boardArray , colsNb)

  const isFilled = filledTilesPositions.some(
    (elt) => elt.row === tilePos.row && elt.col === tilePos.col
  )

  return isFilled 
}


/* Function to return 2D tiles positions around another tile. 
  Params: 
    - tilePosition : tile 2D position of { row:int , col:int } type, 
    - maxColIndex : board max index (col=row)
  Return : array of 2D possible positions [ {row:x , col:y } , ... ]
*/
export const movesAround = (tilePosition , maxColIndex) => {

  const moveUp = { row: tilePosition.row -1 , col: tilePosition.col }
  const moveDown = { row: tilePosition.row +1 , col: tilePosition.col }
  const moveRight = { row: tilePosition.row , col: tilePosition.col + 1 }
  const moveLeft = { row: tilePosition.row , col: tilePosition.col - 1 }

  let posAround = []

  // if tile on left side, 
  if (tilePosition.col === 0) {

    // if tile on top left
    if (tilePosition.row === 0) posAround = [ moveDown , moveRight ]

    // if tile at bottom left
    else if (tilePosition.row === maxColIndex) posAround = [ moveUp , moveRight ]

    // if tile on middle left
    else {
      posAround = [ moveUp , moveDown , moveRight ]
    }
  }

  // if tile on right side, 
  else if (tilePosition.col === maxColIndex) {

    // if tile on top right
    if (tilePosition.row === 0) posAround = [ moveDown , moveLeft ]

    // if tile at bottom right
    else if (tilePosition.row === maxColIndex) posAround = [ moveUp , moveLeft ]

    // if tile on middle right
    else {
      posAround = [ moveUp , moveDown , moveLeft ]
    }

  }

  // if tile on middle top, 
  else if (tilePosition.row === 0 && tilePosition.col !== 0 && tilePosition !== maxColIndex) {
    posAround = [ moveLeft , moveRight , moveDown ]
  }

  // if tile on middle bottom, 
  else if (tilePosition.row === maxColIndex && tilePosition.col !== 0 && tilePosition !== maxColIndex) { 
    posAround = [ moveLeft , moveRight , moveUp ]
  }

  // if tile in the middle
  else {
    posAround = [ moveUp , moveDown , moveLeft , moveRight ]
  }

  return posAround
}


/* Function to return authorized moves around a tile (2D positions). Authorized moves must be empty tiles and not already visited/checked.
  Params : 
    - boardArray : array of 1D positions (index), 
    - colsNb : board columns number (where rows=cols number), 
    - visitedPos : unauthorized already visited tiles. Necessary variable for later path construction (tilesInspect()), 
    - tilePos : current tile 2D position, 
    - destinationPos : last tile to be analyzed (must be included even if filled for later use in path). 
  Return : array of 2D positions ( [ {row:x,col:y}, ... ] )
*/
const nextTilesGen = (boardArray , colsNb , visitedPos , tilePos , destinationPos) => {

  const maxColIndex = colsNb-1
  let authMoves = movesAround (tilePos, maxColIndex)

  // filter filled tiles
  authMoves = authMoves.filter(
    elt => { 
      const isDestination = elt.row === destinationPos.row && elt.col === destinationPos.col
      if (isDestination) return true                  // always allow destination tile
      return !isTileFilled(boardArray, colsNb, elt)   // block other filled tiles
    }
  )

  // filter visited tiles
  authMoves = authMoves.filter(
    elt => !visitedPos.some(pos => pos.row === elt.row && pos.col === elt.col)
  )

  return authMoves
}


/* Function to return path from start to destination tiles 2D positions. 
  The Function explores every tiles in the <Board/> (tileInspect) then reconstruct path from explored Map. 
  Parameters: 
    - boardArray : array of 1D positions, 
    - colsNb: board array columns number (where cols = rows). int type, 
    - startPos : start 2D format position ( {row:int , col:int} type ), 
    - destinationPos : destination 2D format position, 
    - pathMap : Map object of path using "x,y" keys 
  Return : array of 2D positions path. Type Map : [ {row:x1,col:y1} , {row:x2,col:y2} , ... ]
*/
export const movePath = (boardArray , colsNb , startPos , destinationPos) => { 

  const queue = [startPos]
  let visited = []
  const exploredPaths = new Map()

  // Function to convert {x:int,y:int} 2D position to string "row,col" for Map keys object
  const posToKey = (pos) => `${pos.row},${pos.col}`

  /* Function to find path (array of 2D positions objects) from Start tile to Destination. 
      Params : 
        - tilesQueue : tiles queue. Must provide START TILE 2D position type { row:int , col:int },  
        - board : game board as Array of 1D positions - index, 
        - colsNb : board number of columns (where cols = rows), 
        - visitedTiles : array of visited tiles 2D positions, 
        - pathsMap : explored possible paths stored in Map object, 
        - destination : tile destination as 2D position type { row:int , col:int },
      Return : none. 
  */ 
  const tileInspect = (tilesQueue, board, colsNb, visitedTiles, pathsMap , destination) => {

    const currentTile = tilesQueue.shift() 

    // if destination reached, stop process
    if (currentTile.row === destination.row && currentTile.col === destination.col) { 
      tilesQueue.length = 0 // empty tiles queue to stop process
    }

    // return authorized tiles around current tile in queue
    const neighbors = nextTilesGen(board , colsNb , visitedTiles , currentTile, destination)

    for (const neighbor of neighbors) {
      const key = posToKey(neighbor)

      // Map ( neighbor"x1,y1": currentTile , neighbor"x2,y2": currentTile , neighbor"x3,y3": currentTile , ... ] )
      pathsMap.set(key, currentTile) 

      tilesQueue.push(neighbor)       // queue = neighbors [ {row:x1 , col:y1} , {row:x2 , col:y2} , ... ]
    }

    visited.push (currentTile)
  }

  /* Function to reconstruct path as Map object of explored paths, from last tile (destination) to 1st tile. 
    Params : 
      - pathMap : Map object of explored paths. Type { "connectedX,connectedY" , { row:x , col:y } }, 
      - startTile : 2D position of start tile (type {row:int,col:int}), 
      - destTile : 2D position of destination tile. 
    Return : path as Array of 2D positions ( [ {row:x1,col:y1} , {row:x2,col:y2} , ... ] )
  */
  const pathConstruct = (pathsMap , startTile , destTile) => { 

    const path = [destTile]
    let step = destTile       // initialize step with destination tile 2D position
    let stepKey  

    // Parse Map keys of explored paths from the end, to get connected tiles until start position
    while ( !(step.row === startTile.row && step.col === startTile.col) ) {
      stepKey = posToKey(step)        // convert position as key ("x,y" string type)

      step = pathsMap.get(stepKey)    // get connected tile with key in Map of paths

      // if no existing path
      if (!step) { 
        console.error('No path found back from destination to start!', { stepKey, pathsMap })
        return [] 
      }

      path.unshift(step)     // add position step in path array as first element
    }

    return path
  }

  // while tiles to analyze in queue
  while (queue.length > 0) { 
    tileInspect(queue , boardArray , colsNb , visited , exploredPaths , destinationPos) 
  }

  const fullPath = pathConstruct (exploredPaths , startPos , destinationPos)

  return fullPath
}


// Function to check if a word exists (in "filteredWordsArray" words list global variable)
const wordInList = (word , wordsList) => { 
  const exist = wordsList.has(word) 
  if (exist) return word
}


/* Function to find a word in an array of letters, where letters are reversed. 
  e.g.: search index of "LIBRE" in array ["","",E,R,B,I,L,""]. 
  Params: 
    - word: word to search index for in array container, 
    - container: array of letters type [string]. 
  Return: start index (int). 
*/
const findStart = (word , container) => { 

  // e.g.: word "LIBRE" -> [L,I,B,R,E] -> [E,R,B,I,L] -> "ERBIL"
  const wordReversed = word.split("").reverse().join("")

  // e.g.: container ["","",E,R,B,I,L,""] -> "_ _ ERBIL_"
  const containerString = container.map (elt => elt || "_").join("")
  
  // Use String.indexOf() to find start index of word in container string
  const wordIndex = containerString.indexOf(wordReversed)

  return wordIndex
}


/* Function to check if a word exists in an array of letters, based on Set of words list, and considering : 
  - a word must be of 5 letters minimum, 
  - a word must be of "array.length" letters maximum, 
  - if multiple existing words found in array, longest one should be retained, 
  - words can be read from right to left (reversed). 
  Params: 
    - sequenceArray: array of strings (letters or empty)
  Return: Array of Objects type { at: startIndex (int) , length: found word length (int) }
*/
const wordInSequence = (wordsList , sequenceArray , sequenceIndexInBoard , columnSequence=false) => { 

  const positionArray = []
  const wordsArray = []
  const wordMinLength = 5

  const seqStr = sequenceArray.map( elt => elt==="" ? "_" : elt).join('')
  let seqTest = seqStr

  const reversedSeqStr = sequenceArray.toReversed().map( elt => elt==="" ? "_" : elt).join('') 
  let reversedSeqTest = reversedSeqStr

  // Parse index [0- ], [1- ], [2- ], [3- ]
  for (let start=0; start <= sequenceArray.length-wordMinLength; start++) {

		/* Parse index [0-7],[0-6],[0-5],[0-4] then [1-7],[1-6],[1-5] then [2-7],[2-6], then [3-7]. 
			For start=0 end=7, for start=1 end=6, for start=2 end=5, for start=3 end=4. 
      Start parse from the end to find longest word first. */
    for (let end=sequenceArray.length-1; end >= wordMinLength-1+start ; end--) { 

      seqTest = seqStr.slice(start,end+1)

      // find start index in main Board
      let startInBoard

      // If sequence Array is a Board Column or Row, use corresponding Start Index in main Board
      if (columnSequence) { 
        startInBoard = convert2Dto1D ( start , sequenceIndexInBoard , sequenceArray.length)
      }
      else {
        startInBoard = convert2Dto1D ( sequenceIndexInBoard , start , sequenceArray.length )
      }

      if (wordInList(seqTest , wordsList)) { 

        const word = wordInList(seqTest , wordsList)

        wordsArray.push(word)
        positionArray.push( { at: startInBoard , length: seqTest.length } )
      }
    }
  }
  
  // Parse Reversed string. If word found in it, re-order string to keep found word starting at same position/index. 
  for (let start=0; start <= reversedSeqStr.length-wordMinLength; start++) { 

    // Start parse from the end to find longest word first
    for (let end=sequenceArray.length-1; end >= wordMinLength-1+start ; end--) { 

      // check substrings
      reversedSeqTest = reversedSeqStr.slice(start,end+1)

      // find start index in main Board for reversed sequence
      let startInBoard
      const startIndex = findStart(reversedSeqTest , sequenceArray)

      if (columnSequence) { 
        startInBoard = convert2Dto1D ( startIndex , sequenceIndexInBoard , sequenceArray.length)
      }
      else {
        startInBoard = convert2Dto1D ( sequenceIndexInBoard , startIndex , sequenceArray.length )
      }

      // update positionArray
      if (wordInList(reversedSeqTest , wordsList)) { 

        const word = wordInList(reversedSeqTest , wordsList)

        wordsArray.push(word)
        positionArray.push( { at: startInBoard , length: reversedSeqTest.length } )
      }
    }
  }

  // If word(s) found, "positionArray" format: [ { at: word start index in sequence , length: word length } ,  ]
  if (positionArray.length > 0) { 

    // Reduce to longest word (if found several)
    const longestPosition = positionArray.reduce (
      (accumulator, currentValue) => accumulator.length > currentValue.length ? accumulator : currentValue
    )

    const longestWord = wordsArray.reduce (
      (accumulator , currentValue) => accumulator.length > currentValue.length ? accumulator : currentValue
    )

    return { word: longestWord , position: longestPosition }
  }

  else return null
}


/* Function to extract columns values from main board, separately in sub-arrays. 
  Params: boardArray (main array of letters) , colsNb: main array columns number (int). 
  Return: 
    - Array of sub-arrays, where main array index are columns numbers. 
      Type: [ [ col0Value0, col0Value1, ... ] , [ col1Value0, col1Value2, ... ] , ... ] 
*/
const getColumns = (boardArray , colsNb) => { 

  const columnsArrays = []

  // Parse columns index
  for (let col=0; col < colsNb; col++) { 

    const colArr = []

    // Parse board array to extract values for current column
    for (let i=0; i<boardArray.length; i++) { 
		  if ( i % colsNb === col ) {       // if board index corresponds to current column
			  colArr.push(boardArray[i]) 
	    } 
    }

    columnsArrays.push(colArr)
  }

  return columnsArrays
}


/* Function to extract rows values from main board, separately in sub-arrays.
  Params: 
    - boardArray: main board array of letters, 
    - colsNb: main board columns number, where colsNb = rows number. 
  Return: 
    Array of sub-arrays containing rows values inside main board. 
    Format: [ [row0Value0, row0Value1, ... ] , [row1Value0, ... ] ... ]
*/
const getRows = (boardArray , colsNb) => { 

  const rowsArrays = []

  // Parse rows index
  for (let row=0; row < colsNb; row++) { 

    const rowArr = [] 

    // Parse boardArray
    for (let i=0; i<boardArray.length; i++) { 

      const rowNb = Math.floor(i / colsNb)      // row number = Math.floor(board index / colsNb)

      if (rowNb === row) rowArr.push(boardArray[i])

    }

    rowsArrays.push(rowArr)
  }

  return rowsArrays
}


/* Function to detect words in game board. 
  Params: 
    - boardArray: main <Board/> of letters (String), 
    - colsNb: main board columns number, where equal to rows number. 
  Return: 
    - Object of index where words detected, by rows and columns. 
    - Type {  rows: [ { word:string , position:{at: startIndex, length: word length} } , { word: , position: } ... ] , 
              cols: [ ... ] }
*/ 
const wordsInBoard = (wordsList , boardArray , colsNb ) => { 

  const boardColumns = getColumns(boardArray , colsNb)
  const boardRows = getRows(boardArray , colsNb)

  const wordsInRows = boardRows.map(
    (elt , colIndex) => wordInSequence(wordsList , elt , colIndex)
  )

  const wordsInCols = boardColumns.map(
    (elt , rowIndex) => wordInSequence(wordsList , elt , rowIndex , true)
  )

  return { rows: wordsInRows , cols: wordsInCols } 
} 


/* Function to extract words index in main game Board (tiles 1D positions). 
  Params: 
    - boardArray: Array of letters, 
    - colsNb: int of board columns number. 
  Return: Set of index (1D positions). 
*/
export const foundWordsIndex = (wordsList , boardArray , colsNb) => {

  const foundData = wordsInBoard(wordsList , boardArray , colsNb)

  const rowsData = foundData?.rows // Array of words in rows objects [ { word:string , position: { at:int,length:int } } , 
  const colsData = foundData?.cols

  // Extract index positions data
  const rowsIndexData = rowsData.map ( elt => elt?.position )
  const colsIndexData = colsData.map( elt => elt?.position)

  // extract index
  const indexSet = new Set()   // Set to prevent duplicates with crossed words

  rowsIndexData.forEach(
    (elt) => { 
      if (elt) {
        for (let i=0; i<elt.length; i++) { 
          indexSet.add (elt.at + i)
        }
      }
    }
  )
  
  colsIndexData.forEach (
    (elt) => { 
      if (elt) {
        // Formula: all index in a column = startIndex + colsNb  x  parseIndex. e.g.: 23=23+8x0, 31=23+8x1, 29=23+8x2... 
        for (let i=0; i< elt.length; i++) {
          indexSet.add ( elt.at + colsNb * i )
        }
      }
    }
  )

  return indexSet
}


/* Function to extract words in main game Board. 
  Params: board array of letters, board columns number (= rows number). 
  Return: Object of words in rows and columns. Type { rowsWords: [string] , colsWords: [string] }
*/
export const foundWordsStr = (wordsList , boardArray , colsNb) => { 

  const foundData = wordsInBoard(wordsList , boardArray , colsNb)

  const wordsInRows = foundData?.rows.map( elt => elt?.word )
  const wordsInCols = foundData?.cols.map( elt => elt?.word )

  return { rowsWords: wordsInRows , colsWords: wordsInCols }
}


/* Function to calculate a word score based on Zustand lettersStore data. 
  Params: word string. 
  Return: word score (int)
*/
export const wordScore = (word) => { 
  const { lettersStore } = useGameStore.getState()

  const wordArray = word.split('')

  let score = 0

  wordArray.forEach (
    elt => score += lettersStore[elt]?.value
  )

  return score
}

