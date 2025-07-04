import React from "react"


function Tile ( { content="" , tileId , onSelect , selected , newLetter } ) { 

  const handleClick = () => { onSelect(tileId) }
  
  return (
    <div 
      className= { `
        ${ selected 
            ? "bg-purple-900 text-white dark:bg-white dark:text-purple-900" 
            : "bg-purple-200 dark:bg-purple-900" } 

        ${ newLetter ? "animate-blink" : "bg-purple-200 dark:bg-purple-900" }

        dark:text-white dark:hover:bg-white dark:hover:text-purple-900
        hover:cursor-pointer 
        w-full h-full flex justify-center items-center 
        text-2xl sm:text-4xl border-2 border-black rounded-b-sm
        ` }

      onClick={ handleClick }
    >
      { content }
    </div>
  )
}

export default React.memo(Tile)