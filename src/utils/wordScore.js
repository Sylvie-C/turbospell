import { useGameStore } from '../store'


/* Function to calculate a word score based on Zustand lettersStore data. 
  Params: word string. 
  Return: word score (int)
*/
export const wordScore = (word) => { 
  const { lettersStore } = useGameStore.getState()

  const wordArray = word.split('')

  let score = 0

  wordArray.forEach (
    elt => score += lettersStore[elt]?.value
  )

  return score
}