import { useState } from "react"
import { useGameStore } from "../store"

import Modal from "./Modal"


export default function RecordScore ( { score } ) { 

  const [ displayForm , setDisplayForm ] = useState(false)
  const [ pseudo , setPseudo ] = useState("")
  const [ errorMsg , setErrorMsg ] = useState("")
  
  const { 
    setSaveScore, saveScore ,
    modalVisible , setModalVisible , 
    modalMessage , setModalMessage , 
  } = useGameStore()


  const saveScoreToDB = async (data) => { 

    const response = await fetch (
      `${import.meta.env.VITE_BACKEND_URL}/record`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify( data )
      }
    ) 

    if (!response.ok) { 
      setErrorMsg("Il y a eu un problème. Veuillez recommencer. ")
      throw new Error(`Erreur serveur: ${response.status}`)
    }
    else { 
      setErrorMsg("")
      setDisplayForm(false)
      setSaveScore(false)

      const message = <p>Score bien enregistré !<br/>Merci d'avoir joué à TurboSpell {pseudo} !<br/>À bientôt ! :)</p>
      setModalMessage(message)
      setModalVisible(true)
    }

    const result = await response.json()

    setPseudo (result.pseudo)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const pseudo = formData.get("pseudo")
    const score = Number(formData.get("score"))

    await saveScoreToDB({ pseudo, score })
  }

  return ( 
    <>
      {/* Confirm record saved modal */}
      { modalVisible } ? <Modal jsxContent={ modalMessage } />
      : 
      {/* Save record modal */} 
      { saveScore } && 
      <div className="absolute top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center">

        <div className="bg-purple-200 text-purple900 dark:bg-purple-900 dark:text-purple-200 p-4 rounded shadow-md flex flex-col items-center gap-4">
    
          <p>Ajouter score au classement (total parties) ?</p>
    
          {/* Record score confirm Modal (Yes / No) */}
          <div className="flex">
            <button 
              onClick= { () => setDisplayForm(true) }
              className="m-2 px-2 
                hover:cursor-pointer hover:transition-colors border-2 rounded-2xl text-base sm:text-lg
                hover:bg-violet-300 hover:text-violet-900 hover:border-violet-900
                bg-violet-900 text-violet-300 border-violet-300"
            >
              OK
            </button>
            <button 
              onClick= { () => { setDisplayForm(false); setSaveScore(false); } }
              className="m-2 px-2 
                hover:cursor-pointer hover:transition-colors border-2 rounded-2xl text-base sm:text-lg
                hover:bg-violet-300 hover:text-violet-900 hover:border-violet-900
                bg-violet-900 text-violet-300 border-violet-300"
            >
              Non / Quitter
            </button>
          </div>
    
          {/* Form */}
          { displayForm && 
            <form 
              onSubmit={ handleSubmit } 
              className= {`transition-all duration-300 ease-in-out origin-top scale-y-0
                ${ displayForm ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0" }
              `} 
            >
        
              <input type="hidden" name="score" value={score} />
              <label htmlFor="pseudo" className="block mb-2">Entrez votre pseudo :</label>
              <input type="text" name="pseudo" id="pseudo" className="p-2 border border-gray-300 rounded" required />
        
              <button 
                type="submit" 
                className="m-2 px-2 
                  hover:cursor-pointer hover:transition-colors border-2 rounded-2xl text-base sm:text-lg
                  hover:bg-violet-300 hover:text-violet-900 hover:border-violet-900
                  bg-violet-900 text-violet-300 border-violet-300"
              >
                OK
              </button>
            </form>
          }

          {/* Error message */}
          { errorMsg && <p className="text-red-700"> { errorMsg } </p>}
    
        </div>

      </div>
    </>
  )
}