import logo from '../assets/logo.webp'
import logo_xs from '../assets/logo_92x75.webp'

export default function Header () { 

  return (
    <header className="m-2">

        <picture>
          <source media="(max-width: 639px)" srcSet={logo_xs} />
          <img
            src={logo}
            className="float-left m-2 w-[92px] h-[75px] sm:w-[208px] sm:h-[160px]"
            width="92"
            height="75"
            alt="logo turbospell"
            loading="lazy"
          />
        </picture>

        <h2 className="text-center sm:text-2xl text-violet-500 underline">RÈGLE DU JEU</h2>

        <div className="text-sm sm:text-base text-justify">
          <p>Le but de ce jeu est de former des mots de 5 lettres minimum, en déplaçant des lettres sur le tableau, en 1mn, ce qui permet de comptabiliser des points. </p>
          <p>Si le joueur ne forme aucun mot dans la minute, des lettres apparaissent, mais s'il forme un mot, ses lettres disparaissent.</p>
          <p>Il faut donc accumuler le plus de points possible avant qu'il n'y ait plus de place dans le tableau.</p>
          <p>Le 1er clic sélectionne la case à déplacer, le 2ème clic la case de destination. 
          <br/>Attention : un clic sur une lettre ne peut être annulé ! </p>
          <p>Les noms propres ne sont pas autorisés, mais les verbes conjugés oui (mêmes règles qu'au Scrabble). </p>
        </div>
        <hr className="m-y-2"/>

    </header>
  )
}