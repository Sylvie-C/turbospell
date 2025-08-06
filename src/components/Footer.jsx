import { useGameStore } from '../store'


export default function Footer () { 

  const { lettersStore } = useGameStore()

  return (
    <footer className="m-2 text-xs sm:text-sm">
      Nombre de lettres en stock et valeur (points) : 
      <div className="grid gap-x-2 grid-cols-3 sm:grid-cols-5 md:grid-cols-7">
        <span>A: { lettersStore.A.nb } / 1 pt</span>
        <span>B: { lettersStore.B.nb } / 7 pts</span>
        <span>C: { lettersStore.C.nb } / 5 pts</span>
        <span>D: { lettersStore.D.nb } / 6 pts</span>
        <span>E: { lettersStore.E.nb } / 1 pt</span>
        <span>F: { lettersStore.F.nb } / 8 pts</span>
        <span>G: { lettersStore.G.nb } / 7 pts</span>
        <span>H: { lettersStore.H.nb } / 8 pts</span>
        <span>I: { lettersStore.I.nb } / 2 pts</span>
        <span>J: { lettersStore.J.nb } / 9 pts</span>
        <span>K: { lettersStore.K.nb } / 9 pts</span>
        <span>L: { lettersStore.L.nb } / 4 pts</span>
        <span>M: { lettersStore.M.nb } / 6 pts</span>
        <span>N: { lettersStore.N.nb } / 3 pts</span>
        <span>O: { lettersStore.O.nb } / 3 pts</span>
        <span>P: { lettersStore.P.nb } / 6 pts</span>
        <span>Q: { lettersStore.Q.nb } / 9 pts</span>
        <span>R: { lettersStore.R.nb } / 2 pts</span>
        <span>S: { lettersStore.S.nb } / 2 pts</span>
        <span>T: { lettersStore.T.nb } / 3 pts</span>
        <span>U: { lettersStore.U.nb } / 4 pts</span>
        <span>V: { lettersStore.V.nb } / 8 pts</span>
        <span>W: { lettersStore.W.nb } / 9 pts</span>
        <span>X: { lettersStore.X.nb } / 9 pts</span>
        <span>Y: { lettersStore.Y.nb } / 9 pts</span>
        <span>Z: { lettersStore.Z.nb } / 9 pts</span>
      </div>
    </footer>
  )
}