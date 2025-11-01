
import { wordScore } from "./wordScore"


const todayWordsSet = new Set ([
  "ACCEPTE", "ADMIRER", "AFFECT", "AIMABLE", "AMUSER", "ALLEGER", "AMICAL", "AMITIE", "AMOUR", 
  "APPAISER", "AVANCER", "AIMER", 
  "BONHEUR", "BONTE", "BEAUTE", 
  "CALINS", "CALINER", "CALME", "CHARMES", "CHERIR", "CIVIQUE", "CONFIANT", "COURAGE", "CHANCE", 
  "CHANCEUX", "COMPTER", "CREATIF", "CREATIVE", "COURTOIS", "CHARITE", 
  "DIALOGUE", "DEVOUES", "DIGNITE", "DROITURE", "DOUCEUR", "DOUCES", "DIVINS", "DIVINE", 
  "ECOUTER", "EGAUX", "EMPATHIE", "ENCHANTE", "ENTENTE", "ENTIERE", "ENTRAIDE", "EQUITES", "ESPOIRS", 
  "ESTHETE", "ESTIME", "ESTIMER", "EUPHORIE", "EGAYER", "EPANOUIE", "EXALTER", 
  "FIDELITE", "FLEXIBLE", "FRANCHE", "FELICITE", "FORTUNE", 
  "GAIETE", "GENEREUX", "GENTIL", "GENTILLE", "GENTILS", "GENIALE", 
  "HARMONIE", "HEUREUX", "HEUREUSE", "HONNEUR", "HONNETE", "HUMILITE", 
  "INSPIRER", 
  "JOIES", "JOYEUX", "JOYEUSE", "JUSTICE", 
  "LIBEREE", "LIBEREES", "LIBERES", "LIBERTE", "LIBERTES", "LIBRE", "LIBRES", "LUMIERE", "LIBERER", 
  "MOTIVER", "MAGIQUE", 
  "NATUREL", 
  "OUVERTS", 
  "PAISIBLE" , "PARTAGE", "PARTAGEE", "PARTAGER", "PATIENCE", "PLAISIR", "PROCHES", "PROGRES", "PROTEGER", "PROTEGEE", 
  "RASSURE", "RESPECT", "RIRES" , "REUSSITE", 
  "SAGES", "SAGESSE", "SEREINS", "SERENITE", "SINCERE", "SOUTIEN", "SOURIRE", "SOUTENIR", 
  "SOUTENUE", "SOUTENUS", 
  "TENDRES", "TOLERER", 
  "UNISSON", "UNIONS", "UTOPIE", 
  "VAINCRE", "VICTOIRE", "VALEURS", "VERITE", "VOLONTE", "VIVRE", "VIVANT", "VIVANTE", "VIVANTS", "VIVANTES", 
])

export const getWordOfTheDay = (date = new Date()) => { 

  const todayWordsArray = Array.from(todayWordsSet)

  const dayIndex = Math.floor(date.getTime() / (1000 * 60 * 60 * 24))   // jours depuis epoch

  const index = dayIndex % todayWordsArray.length

  return todayWordsArray[index]
}


/* Function to detect today word in list of found words then return its score.
  Params:
    - foundWordsObj: Object with rowsWords and colsWords arrays,
    - todayWord: String, word of the day.
  Return:
    - If today word found, return its score,
    - If not found, return 0.
*/
export const detectTodayWord = ( foundWordsObj , todayWord ) => { 

  const todayWordScore = wordScore ( todayWord )
  let currentScore = 0

  // Detect if word is in foundWordsObj
  foundWordsObj?.rowsWords.forEach(
    elt => { 
      elt === todayWord ? currentScore += (2 * todayWordScore) : null
    }
  )

  foundWordsObj?.colsWords.forEach(
    elt => { 
      elt === todayWord ? currentScore += (2 * todayWordScore) : null
    }
  )

  return currentScore
}

