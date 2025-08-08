import { useState , useEffect } from "react"

import logoSmall from '../assets/logo_92x75.webp'
import logoLarge from '../assets/logo_210x172.webp'

export default function Header () { 

  const [ showRules , setShowRules ] = useState(false)

  return (
    <header className= { `flex ${ showRules ? "h-fit" : "overflow-hidden h-[100px] sm:h-40" } ` } >

      {/* Game logo */}
      <img
        srcSet={`
          ${logoSmall} 92w,
          ${logoLarge} 208w,
        `}
        sizes="(max-width: 639px) 92px, 208px"
        src={logoLarge} 
        alt="TurboSpell logo"
        loading="lazy"
        className= "mt-5 mr-2 w-[92px] sm:w-52 h-[75px] sm:h-40 sm:mt-2"
      />

      {/* Game Rules */}
      <div className= "relative sm:w-full flex flex-col" >

        {/* Title + button */}
        <div className= "flex justify-center items-center mb-2" >
  
          <h2 className="mr-4 sm:text-2xl text-violet-500 underline">RÈGLE DU JEU</h2>
  
          <button className= { `w-fit h-fit rounded-full px-2 flex items-center hover:cursor-pointer
          transition-all duration-300 ease-in-out
          dark:hover:bg-violet-300 dark:hover:text-violet-900 dark:hover:border-violet-900
          hover:bg-violet-900 hover:text-violet-300 hover:border-violet-300
          bg-violet-300 text-violet-900 border-violet-900 
          dark:bg-violet-900 dark:text-violet-300 dark:border-violet-300
          ${ showRules ? "rotate-180" : "rotate-0" }
          ` } 
          aria-label="Lire les règles du jeu"

          onClick = { () => setShowRules(!showRules) }
          >
            V
          </button>
  
        </div>
  
        {/* Text rules */}
        <div className= { ` h-full bg-purple-200 text-purple-900 dark:bg-purple-900 dark:text-purple-200 rounded-2xl p-2 text-sm sm:text-base text-justify 
          ${ !showRules && "bg-gradient-to-t from-purple-900 dark:from-purple-200 via-transparent to-transparent" } 
        ` } >

          <p>Le but de ce jeu est de former des mots de 5 lettres minimum, en déplaçant des lettres sur le tableau, en 1mn, ce qui permet de comptabiliser des points. </p>
          <p>Si le joueur ne forme aucun mot dans la minute, des lettres apparaissent, mais s'il forme un mot, ses lettres disparaissent.</p>
          <p>Il faut donc accumuler le plus de points possible avant qu'il n'y ait plus de place dans le tableau.</p>
          <p>Le 1er clic sélectionne la case à déplacer, le 2ème clic la case de destination.</p>
          <p>Les noms propres ne sont pas autorisés, mais les verbes conjugés oui (mêmes règles qu'au Scrabble). </p>
          <p>Bonne chance ! :)</p>
        </div>
  
      </div>

    </header>
  )
}