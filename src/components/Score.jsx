import { useMemo , useRef , useEffect } from "react"

import { wordScore } from "../utils/functions"


export default function Score ( { foundWordsObj , onGameover } ) { 

  const totalRef = useRef(0)
  const isFirstRender = useRef(true)

  // Update found words scores
  const score = useMemo(() => {
    if (!foundWordsObj) return 0
        
    return [...foundWordsObj.rowsWords , ...foundWordsObj.colsWords]  // concatenate rows + cols arrays
      .filter(Boolean)                                  // filter undefined elements
      .reduce((acc, elt) => acc + wordScore(elt) , 0)   // accumulation of all found words scores, initial value 0

  }, [foundWordsObj])


  // Handle total score
	useEffect(() => { 
		// prevent first totalRef update, already initialised immediately at component mount, before useEffect
    if (isFirstRender.current) { isFirstRender.current = false } 
    else { totalRef.current += score } 
	}, [score])

  // Pass total score prop on game over
  useEffect(()=> { 
    onGameover(totalRef.current)
  }, [onGameover , totalRef.current])


  return (
    <p className= {`${ foundWordsObj ? "visible" : "invisible" } rounded-2xl px-2 text-bg-purple-900 dark:text-purple-200 bg-purple-200 dark:bg-purple-900`} 
    >
      Mot : { score } pts / Total : { totalRef.current } pts.
    </p>
  )
}