import { useState , useEffect , useRef } from "react"

import { useGameStore } from '../store'
import Modal from "./Modal"
import Tile from "./Tile"
import Timer from "./Timer"
import Score from "./Score"
import WordsBoard from "./WordsBoard"

import {  deleteLetters, lettersPositionsGen , randomLettersGen , 
          convert1Dto2D , convert2Dto1D , movePath , foundWordsIndex , foundWordsStr ,
          lettersInStock } 
from "../utils/functions"

const COLS_NB = 8
const NEWTILESNB = 3
const STORELETTERS = lettersInStock()


export default function Board () { 

  const { 
    gameStarted , setGameStarted , 
    gamePaused, setGamePaused ,  
    gameOver , setGameOver , 
    modalVisible , setModalVisible , 
    modalMessage , setModalMessage , 
    mainScore , setMainScore
  } = useGameStore() 

  const [ wordsList , setWordsList ] = useState(null)
  
  const [ tilesContent , setTilesContent ] = useState ( Array(64).fill("") )

  const availableLettersRef = useRef([...STORELETTERS])

  const filledTilesRef = useRef([])
  const spaceLeftRef = useRef(COLS_NB**2)

  const [ resetTimer , setResetTimer ] = useState(false)
  const [ freezeTimer , setFreezeTimer ] = useState(false)

  const [ isNew , setIsNew ] = useState(null)               // array of new tiles 1D position index (for animation)
  const [ isDeleted , setIsDeleted ] = useState(null)       // array of deleted tiles index (for animation)

  const tileClickCountRef = useRef(0)
  const [ clickedTiles , setClickedTiles ] = useState( { startTile: null , destinationTile: null } )
  const [ isSelected , setIsSelected ] = useState (null)    // for selected tile id

  const [ wordsFound , setWordsFound ] = useState (null)

  const finalScoreRef = useRef(0)

  
  // ------- INNER FUNCTIONS -------

  /* Function to pickup random letters and tiles positions, then update board + filled tiles arrays in State. 
    Params : 
      - boardArray: game board array (tilesContent state), 
      - lettersNb: number of random letters to pickup, 
      - filledTilesArray: array of index (1D positions) where tiles are not empty, 
    Return : object of Array of new positions index (1D positions), Array of letters. 
      Type : { newIndex: [int,int,...] , newContent: [string,string,...] }. 
  */
  const newTilesGen = (boardArray , lettersNb , filledTilesArray) => { 

    // pickup letters from store
    const newLetters = randomLettersGen(lettersNb , availableLettersRef.current) 

    // new tiles index (where empty tiles)
    const newPositions = lettersPositionsGen(lettersNb , filledTilesArray , COLS_NB) 

    // update board (tilesContent) : board copy with map() (state immutability)
    const newTilesContent = boardArray.map(
      (elt , index) => (
        // for each tile, if index in newPositions array, replace with corresponding letter. Else, leave empty (elt)
        newPositions.includes(index) ? newLetters[newPositions.indexOf(index)] : elt
      )
    )

    return { newIndex: newPositions , newContent: newTilesContent }
  } 


  /* Function to add 3 new tiles then delete existing words from Board. 
    - Params: current board, board index of not empty tiles. 
    - Return: updated board array of letters. 
  */ 
  const addNewTiles = async (boardArray , filledTilesArray , newTilesNb) => { 

    let newBoard

    const newTiles = newTilesGen(boardArray, newTilesNb , filledTilesArray)  // newTiles object { newIndex:[int],newContent:[string] }

    // For new tiles animation
    setIsNew(newTiles.newIndex)

    // new Board
    newBoard = boardArray.map(
      (elt,index) => newTiles.newIndex.includes(index) ? newTiles.newContent[index] : elt
    )

    // find words index
    const wordsIndex = foundWordsIndex(wordsList , newBoard , COLS_NB)   // Set of to be deleted index tiles (1D positions)

    // Object of found words strings in State ({ rowsWords: [string] , colsWords: [string] })
    if (wordsIndex.size > 0) { 
      const wordsStr = foundWordsStr(wordsList , newBoard , COLS_NB)
      setWordsFound(wordsStr)
    }

    newBoard = deleteLetters(wordsIndex , newBoard) 

    setIsDeleted(wordsIndex)    // for found letters animation

    // await letters animation end before next actions (index.css file / animate-blink)
    await new Promise( resolve => setTimeout(resolve, 300) )

    // update newBoard
    setTilesContent(newBoard)

    return newBoard
  }

  /* Function to update filledTiles index after board changes. 
    Params: 
      - prevFilledTilesState: Array of previous filled tiles index. Type [ int, int, ... ], 
      - boardArray: Array of letters or empty string. Type: [ "" , "A" , "" , ... ]
    Return: new filledTiles array. 
  */
  const filledTilesUpdate = ( prevFilledTiles , boardArray ) => { 

    let filledTiles = new Set (prevFilledTiles) // Array to Set

    boardArray.forEach (
      (elt , boardIndex) => { 

        // add missing filled tiles
        if (elt && !filledTiles.has(boardIndex)) {
          filledTiles.add(boardIndex)
        }

        // if empty tile still in State, delete it
        if (!elt && filledTiles.has(boardIndex)) {
          filledTiles.delete(boardIndex)
        }
      }
    )

    filledTiles = Array.from(filledTiles) // Set to Array

    return filledTiles
  }

  /* Function to parse a 2D positions array path, and simulate a tile move, by
    saving the parsed tile in "isSelected" State, which enables to update current tile style in JSX. 
    Params : 
      - pathArray : path of tiles. Type : Array of { row:int , col:int }, 
      - colsNb : board game number of columns (where cols=rows). 
    Return : none. 
  */
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const tileMoveEffect = async (pathArray, colsNb, setIsSelected) => {
    const tilesIndexArray = pathArray.map(
      elt => convert2Dto1D(elt.row, elt.col, colsNb)
    )

    for (let i = 0; i<tilesIndexArray.length; i++) {
      setIsSelected(tilesIndexArray[i])
      await delay(200)  // delay between tiles moves
    }
  }

  // Function to reset tiles move actions
  const moveReset = () => {
    setIsSelected(null)
    setClickedTiles(
      prev => ({
        ...prev, 
        startTile: null , destinationTile: null
      })
    )
    tileClickCountRef.current = 0
  }

  // Function to switch 2 tiles with ASYNC move animation (move animation effect THEN letters update + resets)
  const performMove = async (startTile, destinationTile, boardArray, colsNb) => { 

    // Tiles (start and destination) 2D positions
    const startTilePos = { row: startTile.row , col: startTile.col }
    const destTilePos = { row: destinationTile.row , col: destinationTile.col }

    // Switch 2 tiles content update
    const startTileIndex = convert2Dto1D(startTilePos.row , startTilePos.col , COLS_NB)
    const destTileIndex = convert2Dto1D(destTilePos.row , destTilePos.col , COLS_NB)

    // Get path of 2D positions
    const path = movePath(
      boardArray, 
      colsNb,
      { row: startTilePos.row , col: startTilePos.col } , 
      { row: destTilePos.row , col: destTilePos.col } 
    )

    // move animation
    await tileMoveEffect(path, colsNb, setIsSelected)

    // update board
    const boardCopy = [...boardArray]
    const startTileContent = boardCopy[startTileIndex]
    const destTileContent = boardCopy[destTileIndex]

    boardCopy[startTileIndex] = destTileContent   // switch start - destination tiles
    boardCopy[destTileIndex] = startTileContent 

    // Resets after move animation
    moveReset() 

    return boardCopy
  } 

  /* Function to handle switch of 2 tiles process then delete existing words from Board. 
    Params: 
      - clickedTiles: object of 2D positions (start tile , destination tile). 
        Type { startTile: {row:int,col:int} , destinationTile: {row:int,col:int} }. 
      - boardArray: board of letters, 
      - colsNb: board columns number. 
    Return: none (update State). 
  */
  const moveUpdates = async (clickedTiles , boardArray, colsNb) => { 

    let newBoard

    if (!clickedTiles.destinationTile) return

    // move tiles with animation
    newBoard = await performMove(clickedTiles.startTile , clickedTiles.destinationTile , boardArray , colsNb)

    // find words index
    const wordsIndex = foundWordsIndex(wordsList , newBoard , COLS_NB)   // Set of to be deleted index tiles (1D positions)

    // find words string + store in state for display update
    if (wordsIndex.size > 0) { 
      const wordsStr = foundWordsStr(wordsList , newBoard , COLS_NB)
      setWordsFound(wordsStr)
    }

    newBoard = deleteLetters(wordsIndex , newBoard) 

    setIsDeleted(wordsIndex)    // for found letters animation

    // await letters animation end before next actions (index.css file / animate-blink)
    await new Promise( resolve => setTimeout(resolve, 300) )

    // update Board
    setTilesContent(newBoard) 

    return newBoard
  }

  // Function to chain tiles move (player clicks), then words check, then add 3 new tiles
  const onPlayerClicks = async (clickedTiles, boardArray, colsNb , filledTilesArray) => { 

    let newFilledTiles

    setResetTimer(false)
    setFreezeTimer(true)

    // tiles move
    const boardAfterMove = await moveUpdates(clickedTiles, boardArray, colsNb) 

    // update filled tiles index array after tiles move
    newFilledTiles = filledTilesUpdate(filledTilesArray , boardAfterMove)
    filledTilesRef.current = newFilledTiles

    // update spaceLeft State after tiles move (if words)
    spaceLeftRef.current = COLS_NB**2 - newFilledTiles.length

    // if no letters left in stock, end game
    if (availableLettersRef.current.length === 0) setGameOver(true)

    if (spaceLeftRef.current >= NEWTILESNB) {

      // add new tiles
      const boardAfterNewTiles = await addNewTiles(boardAfterMove , newFilledTiles , NEWTILESNB)

      // update filled tiles index array after new tiles added
      newFilledTiles = filledTilesUpdate(newFilledTiles , boardAfterNewTiles)
      filledTilesRef.current = newFilledTiles

      // update spaceLeft State after new tiles added
      spaceLeftRef.current = COLS_NB**2 - newFilledTiles.length

      setResetTimer(true)
      setFreezeTimer(false)

    }

    else { setGameOver(true) }
  }



  // -------  EVENT LISTENERS  -------

  // Function to handle <Timer/> timeout. On timer resetTrigger change, automatic reset at max time -> force timer reset at 0 to wait 3 seconds before next round. 
  const handleTimeout = async () => { 

    if (gameStarted) { 

      tileClickCountRef.current = 0    // tiles click counter reset

      setClickedTiles (             // reset clicked tiles index in State to null
        prev => ({
          ...prev , 
          startTile: null , destinationTile: null 
        })
      )

      // if no letters left in stock, end game
      if (availableLettersRef.current.length) setGameOver(true)

      if (spaceLeftRef.current >= NEWTILESNB) {
        const boardAfterTimeout = await addNewTiles(tilesContent , filledTilesRef.current , NEWTILESNB) 

        // update filled tiles index array
        const newFilledTiles = filledTilesUpdate(filledTilesRef.current , boardAfterTimeout)
        filledTilesRef.current = newFilledTiles

        // update space left
        spaceLeftRef.current = COLS_NB **2 - newFilledTiles.length
      }

      // if timer 00:00 and no more space left for new tiles, game over
      else { 
        setGameOver(true) 
      }
    }

  }

  /* Function to handle <Tile/> select.
    Params: tile index (1D position : 0 -> 63), 
    Return : none. 
  */
  const handleTileSelect = (id) => {

    tileClickCountRef.current += 1

    const tile2Did = convert1Dto2D ( id , COLS_NB )

    if (tileClickCountRef.current === 1) {
      setClickedTiles(
        prev => ({
          ...prev, 
          startTile: { row:tile2Did.row , col:tile2Did.col }
        })
      )
    }

    if (tileClickCountRef.current === 2) { 
      setClickedTiles(
        prev => ({
          ...prev, 
          destinationTile: { row:tile2Did.row , col:tile2Did.col }
        })
      ) 
    }

    setIsSelected(id)
  }

  // Function to get final score from <Score/>, on game over
  const getFinalScore = (finalScore) => {
    finalScoreRef.current = finalScore
  }

  // Function to start new game (reset all)
  const startNewGame = () => { 
    setTilesContent (Array(64).fill(""))

    availableLettersRef.current = [...STORELETTERS]

    setClickedTiles(
      prev => ({
        ...prev, 
        startTile: null , destinationTile: null
      })
    )

    filledTilesRef.current = []
    spaceLeftRef.current = COLS_NB**2
    tileClickCountRef.current = 0
    finalScoreRef.current = 0

    setResetTimer(false)
    setIsSelected(null)
    setIsNew(null)
    setIsDeleted(null)
    setWordsFound(null)

    setModalVisible(false)
    setGameOver(false)
    
    setFreezeTimer(false)
    setGameStarted(true)
  }


  // -------  SIDE EFFECTS  -------

  // fetch words list on component mount
  useEffect(() => {
    const loadWords = async () => {   
      const response = await fetch(`${import.meta.env.VITE_API_URL}liste_mots.txt`)
      const text = await response.text()

      const wordsArray = text.split('\n').map(word => word.trim())
      const validWords = new Set(
        wordsArray.filter(word => word.length >= 5 && word.length <= 8)
      )
      setWordsList(validWords)
    }
    loadWords()
  }, [])

  // if modal visible, freeze timer (Pause, end of game)
  useEffect (() => {
    setFreezeTimer(modalVisible)
    setGamePaused(modalVisible)
  }, [ modalVisible ])

  // Begin game : fill 8 first letters on board
  useEffect (() => {
    if (gameStarted) { 
      const newTiles = newTilesGen( tilesContent , 8 , filledTilesRef.current ) 

      setIsNew(newTiles.newIndex)   // for new tiles animation
      setTilesContent(newTiles.newContent)  // update board

      filledTilesRef.current = newTiles.newIndex // initialize filled tiles index array
    }
  }, [ gameStarted ])

  // Handle timer if game paused
  useEffect(() => {
    setFreezeTimer(gamePaused)
  }, [gamePaused])

  // Handle tiles move effects on player's clicks
  useEffect(() => { 

    if (gameStarted && !gameOver) { 

      if (clickedTiles.startTile && clickedTiles.destinationTile) { 

        // Get path of 2D positions
        const path = movePath(
          tilesContent, 
          COLS_NB,
          { row: clickedTiles.startTile.row , col: clickedTiles.startTile.col } , 
          { row: clickedTiles.destinationTile.row , col: clickedTiles.destinationTile.col } 
        )

        // Handle wrong path error
        if (path.length === 0) { 
          setModalMessage("Déplacement impossible.")
          setModalVisible(true) 
          setFreezeTimer(true)
          moveReset()
        }

        else { 
          onPlayerClicks(clickedTiles , tilesContent , COLS_NB, filledTilesRef.current)
        }
      }
    }
  }, [clickedTiles]) 


  // On timer reset, watch if player wins (no letters left in store)
  useEffect(() => { 

    if (resetTimer) { 

      // if player wins
      if (availableLettersRef.current.length === 0) { 

        setModalMessage(
          <>
            <p>Bravo ! Vous avez gagné et utilisé toutes les lettres !
              <br/>Votre score est de {finalScoreRef.current} points.
              <br/>Une autre partie ?
            </p>
            <div className="flex justify-center">
              <button 
                onClick={ startNewGame } 
                className="m-2 px-2 hover:cursor-pointer hover:transition-colors hover:bg-violet-300 hover:text-violet-900 bg-violet-900 text-violet-300 border-violet-300 hover:border-violet-900 border-2 rounded-2xl"
              >
                OK
              </button>
            </div>
          </>
        )
        setModalVisible(true) 

        setGameOver(true)
      }
    } 

  }, [ resetTimer ] )


  // On game over, handle player loose + end of game (final score, modal message, freeze timer, resets)
  useEffect (() => {
    if (gameOver) { 
      setFreezeTimer(gameOver)
      setResetTimer(false)
      setGameStarted(false)

      // if player wins
      if (availableLettersRef.current.length === 0) { 
        setMainScore (mainScore + finalScoreRef.current)
      }
      else { 
        setModalMessage( 
          <>
            <p>Vous avez perdu. <br/>Votre score est de {finalScoreRef.current} points.<br/>Une autre partie ?</p>
            <div className="flex justify-center">
              <button 
                onClick={ startNewGame } 
                className="m-2 px-2 hover:cursor-pointer hover:transition-colors hover:bg-violet-300 hover:text-violet-900 bg-violet-900 text-violet-300 border-violet-300 hover:border-violet-900 border-2 rounded-2xl"
              >
                OK
              </button>
            </div>
          </>
        )

        setMainScore (0)
      }

      setModalVisible(gameOver)

    }
  }, [gameOver]) 
  

  if (!wordsList) return <p>Chargement : un instant svp...</p>


  return (
    <div>
      <Modal jsxContent={ modalMessage } /> 

      <div className="flex flex-col items-center">
        {/* Timer and Scores */}
        { gameStarted && 
          <div 
            className="w-80 sm:w-[512px] p-2 sm:p-0.5 flex justify-around items-center sm:justify-between"
          > 

            <Timer onTimeout={ handleTimeout } resetTrigger={ resetTimer } freezeTimer={ freezeTimer } />

            <div className="flex flex-col gap-1 sm:flex-row sm:gap-x-4">
              <span className= { `${gameStarted ? "visible" : "invisible"}` } >Total parties : {mainScore} pts</span>
              { <Score foundWordsObj={ wordsFound } onGameover={ getFinalScore }/> }
            </div>

          </div>
        }

        {/* Board */}
        <div className={`${ (gameOver || gamePaused || !gameStarted) && "pointer-events-none"} 
          m-1.5 justify-center 
          grid grid-cols-[repeat(8,38px)] grid-rows-[repeat(8,38px)] sm:grid-cols-[repeat(8,64px)] sm:grid-rows-[repeat(8,64px)]`}>
          {
            tilesContent.map (
              (elt , index) => {
                return (
                  <Tile 
                    key={`tile-${index}`}
                    tileId={index}
                    content={elt}
                    onSelect={ handleTileSelect }                   // to pass selected tile ID
                    selected={ isSelected === index }               // for selected tile style

                    // for new or deleted letter animation
                    newLetter={ (isNew && isNew.includes(index)) || (isDeleted && isDeleted.has(index)) }    
                  />
                )
              }
            )
          }
        </div>

        {/* Letters left */}
        { gameStarted && 
          <p>
            Il reste <span className="sm:text-xl font-bold text-cyan-400">{availableLettersRef.current.length}</span> lettres.
          </p>}
      </div>

      <WordsBoard foundWordsObj={ wordsFound } />

    </div>
  )
}
