
import { wordScore } from "./wordScore"


const todayWordsSet = new Set ([
  "ACCEPTE", "ADMIRER", "AFFECT", "AIMABLE", "AMUSER", "ALLEGER", "AMICAL", "AMITIE", "AMOUR", 
  "BONHEUR", "BONTE", "CALINS", "CALME", "CHARMES", "CHERIR", "CIVIQUE", "CONFIANT", "COURAGE", 
  "COURTOIS", "DIALOGUE", "DEVOUES", "DIGNITE", "ECOUTER", "EGAUX", "EMPATIE", "ENCHANT", "ENTENTE", 
  "ENTIER", "ENTRAIDE", "EQUITES", "ESPOIRS", "ESTHETE", "ESTIME", "ESTIMER", "EUPHORIE", "FIDELITE", 
  "FLEXIBLE", "FRANCHE", "GAIETE", "GENEREUX", "GENTIL", "GENTILLE", "GENTILS", "HARMONIE", "HEUREUX", 
  "HEUREUSE", "HONNEUR", "HONNETE", "JOYEUX", "JOYEUSE", "JUSTICE", "LIBEREE", "LIBEREES", 
  "LIBERES", "LIBERTE", "LIBERTES", "LIBRE", "LIBRES", "LUMIERE", "OUVERTS", "PAIX", "PARTAGE", 
  "PATIENCE", "PLAISIR", "PROCHES", "PROGRES", "RASSURE", "RESPECT", "RIRES" , "SAGES", 
  "SAGESSE", "SEREINS", "SERENITE", "SINCERE", "SOUTIEN", "SOUTENUE", "SOURIRE", "SOUTENIR", "SPIRITUEL", 
  "TENDRES", "TOLERER", "UNISSON", "UNITE", "UTOPIES", "VAINCRE", "VALEURS", "VERITE", "VOLONTE", 

  "APPAISER", "AVANCER", "CHANCE", "COMPTER", "CREATIF", "CREATIVE", "EGAYER", "EPANOUIE", "EXALTER", 
  "FELICITE", "FORTUNE", "GENIAL", "HUMILITE", "INSPIRER", "LIBERER", "MOTIVER", "NATUREL", "PARTAGEE", 
  "PARTAGER", "REUSSITE", "SOUTENUES", "SOUTENUS", "UNIS", "UNIES", "UNISSEZ", "VIVRE", "VIVANT", 
  "VIVANTE", "VIVANTS", "VIVANTES"
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

