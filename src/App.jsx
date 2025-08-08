import { useGameStore } from './store' 
import { getWordOfTheDay } from './utils/todayWord'

import Header from './components/Header'
import Board from './components/Board'
import Footer from './components/Footer'


export default function App() { 

  const { 
    gameOver , 
    gameStarted, setGameStarted , 
    gamePaused , setGamePaused , 
    todayWord , setTodayWord, 

    mainScore , 
  } = useGameStore()

  const startGame = () => { 
    setGameStarted(true)
    setGamePaused(false) 

    const todayWord = getWordOfTheDay()
    setTodayWord(todayWord)
  }
  const pauseGame = () => { 
    setGamePaused(true)
  }

  
  return (
    <>
      <Header />
      <main className="m-2 flex flex-col items-center text-sm sm:text-base">

        {/* Word of the day */}
        { gameStarted &&
          <div className="self-start px-1">
            <p> Mot du jour : 
              <span className="mx-2
                bg-violet-300 text-violet-900 border-violet-900 
                dark:bg-violet-900 dark:text-violet-300 dark:border-violet-300"
              >
                { todayWord } 
              </span> 
              <span className="text-xs sm:text-sm">(mot compte triple)</span>
            </p> 
          </div>
        }

        {/* Main Score */}
        <p className="self-start px-1
        bg-violet-300 text-violet-900 border-violet-900 
        dark:bg-violet-900 dark:text-violet-300 dark:border-violet-300
        ">
          { gameStarted && `Total parties : ${ mainScore }` }
        </p>

        {/* Start Button */}
        <button 
          className={`
            ${ gameOver && "pointer-events-none"}
            my-2 py-1 px-2 border-2 rounded-2xl hover:cursor-pointer hover:transition-colors 
            transition-all duration-300 ease-in-out
            dark:hover:bg-violet-300 dark:hover:text-violet-900 dark:hover:border-violet-900
            hover:bg-violet-900 hover:text-violet-300 hover:border-violet-300
          bg-violet-300 text-violet-900 border-violet-900 
          dark:bg-violet-900 dark:text-violet-300 dark:border-violet-300

          `}

          onClick={ (!gameStarted || gamePaused) ? startGame : pauseGame } 
        > 
          { (!gameStarted || gamePaused) ? "Start" : "Pause" } 
        </button>

        {/* Board */}
        <div className="relative">
          <Board />
          { (gamePaused || !gameStarted) && <div className="absolute inset-0 bg-black/50"></div> }
        </div>

      </main>
      <Footer/>
    </>
  )
}
