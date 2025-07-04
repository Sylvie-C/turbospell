import { useState , useEffect , useRef } from "react"

import { useGameStore } from "../store"
import { wordScore } from "../utils/functions"


export default function WordsBoard ( { foundWordsObj } ) { 

  const { gameStarted } = useGameStore()

  const [ wordsList , updateWordsList ] = useState([])
  const listIndex = useRef(0)

  useEffect (()=> { 
    let currentList = []

    foundWordsObj?.rowsWords.map(
      (elt) => {
        if (elt) {

          listIndex.current +=1 

          const score = wordScore(elt)

          currentList.push (
            <span key={`wordIndex${listIndex.current}`} className="rounded-2xl m-px px-2 bg-purple-200 dark:bg-purple-900">
              {elt} : { score } pts
            </span>
          )
        } 
      }
    )

    foundWordsObj?.colsWords.map(
      (elt) => {
        if (elt) {

          listIndex.current +=1

          const score = wordScore(elt)

          currentList.push (
            <span key={`wordIndex${listIndex.current}`} className="rounded-2xl m-px px-2 bg-purple-200 dark:bg-purple-900">
              {elt} : { score } pts
            </span>
          )
        } 
      }
    )

    const newList = [ ...currentList , ...wordsList ]

    updateWordsList(newList)
  }, [foundWordsObj] )

  useEffect (()=> {
    if (gameStarted) updateWordsList([])
  }, [gameStarted])


  return (
    <div className="flex flex-wrap text-sm sm:text-lg" > 
      {wordsList}
    </div>
  )
}

