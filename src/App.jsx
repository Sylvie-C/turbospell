import { useGameStore } from './store'

import Header from './components/Header'
import Board from './components/Board'
import Footer from './components/Footer'


export default function App() {

  const { gameOver , gameStarted, setGameStarted , gamePaused , setGamePaused } = useGameStore()

  const startGame = () => { 
    setGameStarted(true)
    setGamePaused(false)
  }
  const pauseGame = () => { 
    setGamePaused(true)
  }
  
  return (
    <>
      <Header />
      <main className="flex flex-col items-center">

        {/* Start Button */}
        { 
          <button 
            className={`
              ${ gameOver && "pointer-events-none"}
              m-2 py-1 px-2 hover:cursor-pointer hover:transition-colors hover:bg-violet-300 hover:text-violet-900 bg-violet-900 text-violet-300 border-violet-300 hover:border-violet-900 border-2 rounded-2xl
            `}

            onClick={ (!gameStarted || gamePaused) ? startGame : pauseGame } 
          > 
            { (!gameStarted || gamePaused) ? "Start" : "Pause" } 
          </button>
        }

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
