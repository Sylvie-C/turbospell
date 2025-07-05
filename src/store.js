import { create } from "zustand"

export const useGameStore = create(
  (set) => (
    {
      gameStarted: false, 
      gamePaused: false, 
      gameOver: false, 
      roundTime: 60, 
      mainScore: 0,
      modalVisible: false, 
      modalMessage: "", 

      lettersStore: { 
        A: { nb: 23 , value: 1 },   B: { nb: 4 , value: 7 },    C: { nb: 7, value: 5 }, 
        D: { nb: 5 , value: 6 },    E: { nb: 30 , value: 1 },   F: { nb: 3, value: 8 }, 
        G: { nb: 4, value: 7 },     H: { nb: 3, value: 8 } ,    I: { nb: 16 , value: 2 }, 
        J: { nb: 1 , value: 9 },    K: { nb: 1 , value: 9 } ,   L: { nb: 9 , value: 4 }, 
        M: { nb: 5 , value: 6 },    N: { nb: 10 , value: 3 } ,  O: { nb: 11 , value: 3 }, 
        P: { nb: 5 , value: 6 },    Q: { nb: 1 , value: 9 } ,   R: { nb: 15 , value: 2 }, 
        S: { nb: 17 , value: 2 },   T: { nb: 13 , value: 3 } ,  U: { nb: 9 , value: 4 }, 
        V: { nb: 3 , value: 8 },    W: { nb: 1 , value: 9 } ,   X: { nb: 1 , value: 9 }, 
        Y: { nb: 1 , value: 9 },    Z: { nb: 2 , value: 9 } ,
      } ,  

      setGameStarted: (value) => set ( { gameStarted: value } ) ,
      setGamePaused: (value) => set ( { gamePaused: value } ) ,  
      setGameOver: (value) => set ( { gameOver: value } ) , 
      setMainScore: (newScore) => set ( { mainScore: newScore } ) , 
      setModalVisible: (value) => set ( { modalVisible: value } ) , 
      setModalMessage: (value) => set ( { modalMessage: value } ) , 

    }
  )
)