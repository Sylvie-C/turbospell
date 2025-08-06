import { useMemo , useRef , useEffect } from "react"

import { useGameStore } from '../store'
import { wordScore } from "../utils/wordScore"
import { detectTodayWord } from "../utils/todayWord"


export default function Score ( { foundWordsObj , onGameover } ) { 

  const { todayWord } = useGameStore()

  const totalRef = useRef(0)
  const isFirstRender = useRef(true)


  // Update found words scores
  const score = useMemo( () => {
    if (!foundWordsObj) return 0
        
    return [...foundWordsObj.rowsWords , ...foundWordsObj.colsWords]  // concatenate rows + cols arrays
      .filter(Boolean)  

      // accumulation of all found words scores + today word score to initial value 0
      .reduce((acc, elt) => acc + wordScore(elt) , 0) 

  }, [ foundWordsObj ] )


  // Add today word score to found word score -> x2 +1 = x3
  const todayWordScore = useMemo( () => { 
    return detectTodayWord(foundWordsObj, todayWord)
  } , [ foundWordsObj , todayWord ] )


  // Update total score
	useEffect(() => { 
		// prevent first totalRef update, already initialised immediately at component mount, before useEffect
    if (isFirstRender.current) { isFirstRender.current = false } 

    else { 
      totalRef.current += (score + todayWordScore) // add today word score if found
    } 

	}, [score])


  // Pass total score prop on game over
  useEffect(()=> { 
    onGameover(totalRef.current)
  }, [ onGameover , totalRef.current ])


  return (
    <p className= {`${ foundWordsObj ? "visible" : "invisible" } rounded-2xl px-2 text-bg-purple-900 dark:text-purple-200 bg-purple-200 dark:bg-purple-900`} 
    >
      Mot : { score } pts / Total : { totalRef.current } pts.
    </p>
  )
}