import logoSmall from '../assets/logo_92x75.webp'
import logoLarge from '../assets/logo_210x172.webp'

export default function Header () { 

  return (
    <header className="m-2">

      <img
        srcSet={`
          ${logoSmall} 92w,
          ${logoLarge} 208w,
        `}
        sizes="(max-width: 639px) 92px, 208px"
        src={logoLarge} 
        className="float-left mt-5 mr-2 w-[92px] h-[75px] sm:w-52 sm:h-40 sm:mt-2"
        alt="TurboSpell logo"
        loading="lazy"
      />

        <h2 className="text-center sm:text-2xl text-violet-500 underline">RÈGLE DU JEU</h2>

        <div className="text-sm sm:text-base text-justify">
          <p>Le but de ce jeu est de former des mots de 5 lettres minimum, en déplaçant des lettres sur le tableau, en 1mn, ce qui permet de comptabiliser des points. </p>
          <p>Si le joueur ne forme aucun mot dans la minute, des lettres apparaissent, mais s'il forme un mot, ses lettres disparaissent.</p>
          <p>Il faut donc accumuler le plus de points possible avant qu'il n'y ait plus de place dans le tableau.</p>
          <p>Le 1er clic sélectionne la case à déplacer, le 2ème clic la case de destination.</p>
          <p>Les noms propres ne sont pas autorisés, mais les verbes conjugés oui (mêmes règles qu'au Scrabble). </p>
          <p>Bonne chance ! :)</p>
        </div>
        <hr className="m-y-2"/>

    </header>
  )
}