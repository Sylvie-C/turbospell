import { useState , useEffect } from "react"
import { useGameStore } from "../store"


export default function Modal ( { jsxContent } ) {

  const { modalVisible , setModalVisible } = useGameStore()

  const handleCloseModal = () => { 
    if (modalVisible) setModalVisible(false)
  }


  return (
    modalVisible && 
    <div className="fixed z-10 top-0 left-0 w-screen h-full bg-black/[0.5] flex justify-center sm:items-center">

      <div className="text-2xl text-center size-72 sm:w-[600px] sm:h-80 overflow-scroll m-4 p-4 rounded-2xl bg-purple-300 dark:bg-purple-950 text-purple-950 dark:text-purple-300">
        {
          <div className="relative w-full h-full flex flex-col justify-center">

            { 
              <button 
                onClick={ handleCloseModal } 
                className="absolute top-0 right-0 w-fit leading-none text-sm hover:cursor-pointer" 
              > X </button>
            }

            {jsxContent}
            
          </div>
        }
      </div>
    </div>
  )
}