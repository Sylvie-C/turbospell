import { useEffect, useState, useRef } from 'react'

import { useGameStore } from '../store'


export default function Timer ( { onTimeout, resetTrigger, freezeTimer } ) { 
  
  const { gameOver , roundTime } = useGameStore()
  const [ timeLeft, setTimeLeft ] = useState(roundTime) // timeLeft in seconds
  const intervalRef = useRef(null)

  // Function to convert seconds into mm:ss
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  // Function to handle time update
  const startTimer = (startTime) => {
    clearInterval(intervalRef.current)
    setTimeLeft(startTime)

    // Vérifie si le timer doit être figé
    if (!freezeTimer) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  // if game paused, restart timer from time left (previous value)
  useEffect(() => { 
    startTimer(timeLeft) 
  }, [freezeTimer])
 
  useEffect (()=> {
    // if resetTrigger is true, reset timer after 2 seconds
    if (resetTrigger) { 
      startTimer(roundTime)
    }
  }, [resetTrigger])

  // if timer at 00:00
  useEffect(() => {
    if (timeLeft === 0) {
      setTimeout(() => {        // setTimeout(),0 to force await renders in Parent.
        onTimeout()             // execute onTimeout() prop
      }, 0)

        setTimeout(() => {
          startTimer(roundTime)   // Reset automatically at 00:00 after 2s delay
        }, 2000)

    }
  }, [timeLeft])


  return (
    <div className={ `sm:text-xl font-bold ${timeLeft < 10 ? "text-red-600" : "text-cyan-400"} ${ gameOver && "invisible" }` }>
      ⏳ { formatTime(timeLeft) }
    </div>
  )
}
