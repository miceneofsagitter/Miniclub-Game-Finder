import { useParams, useNavigate } from 'react-router-dom'
import games from '../data/games.json'
import { THEMES, MATERIALS } from '../data/themes'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function GameDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const game = games.find(g => g.id === Number(id))

  const [planner, setPlanner] = useLocalStorage('planner', [])
  const [history, setHistory] = useLocalStorage('history', [])

  if (!game) return (
    <div className="flex items-center justify-center h-screen text-slate-400">
      Gioco non trovato.
    </div>
  )

  const theme = THEMES[game.theme]
  const mat   = MATERIALS[game.mat]

  const inPlanner = planner.some(p => p.id === game.id)

  const addToPlanner = () => {
    if (!inPlanner) setPlanner(prev => [...prev, game])
    navigate('/planner')
  }

  const markDone = () => {
    setHistory(prev => [...prev, { id: game.id, date: new Date().toISOString() }])
  }

  // Check if already marked today
  const today = new Date().toDateString()
  const doneToday = history.some(e => e.id === game.id && new Date(e.date).toDateString() === today)

  return (
    <div className="max-w-md mx-auto px-4 pt-4 pb-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-slate-400 mb-4 active:text-white transition-colors"
      >
        <span className="text-xl">←</span> <span className="text-sm">Indietro</span>
      </button>

      {/* Hero */}
      <div className={`rounded-2xl p-5 ${theme.light} mb-4`}>
        <div className="text-6xl mb-3 text-center">{game.emoji}</div>
        <h1 className="text-2xl font-black text-white text-center mb-3">{game.title}</h1>
        <div className="flex flex-wrap justify-center gap-2">
          <span className={`inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full ${theme.color} text-white`}>
            {theme.emoji} {theme.label}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full bg-slate-700 text-slate-200">
            {mat.emoji} {mat.label}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full bg-slate-700 text-slate-200">
            ⏱ {game.time} min
          </span>
        </div>
      </div>

      {/* Description */}
      <section className="mb-4">
        <p className="text-base text-slate-200 leading-relaxed">{game.desc}</p>
      </section>

      {/* Materials */}
      {game.mat_detail && game.mat_detail !== 'Nessuno' && (
        <section className="mb-4 p-4 rounded-xl bg-amber-900/30 border border-amber-700/40">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">Materiali</h2>
          <p className="text-sm text-slate-200">{game.mat_detail}</p>
        </section>
      )}

      {/* Steps */}
      <section className="mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Istruzioni</h2>
        <ol className="space-y-3">
          {game.steps.map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className={`shrink-0 w-7 h-7 rounded-full ${theme.color} flex items-center justify-center text-sm font-black text-white`}>
                {i + 1}
              </span>
              <span className="text-base text-white leading-snug pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Variante multilingua */}
      <section className="mb-6 p-4 rounded-xl bg-violet-900/40 border border-violet-700/40">
        <h2 className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-2">
          🌍 Variante multilingua (5–8 anni)
        </h2>
        <p className="text-sm text-slate-200 leading-relaxed">{game.variante}</p>
      </section>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={addToPlanner}
          className="w-full py-4 rounded-2xl bg-violet-600 active:bg-violet-700 text-white font-black text-lg transition-colors"
        >
          {inPlanner ? '📋 Già in scaletta' : '+ Aggiungi a scaletta'}
        </button>
        <button
          onClick={markDone}
          disabled={doneToday}
          className={`w-full py-3 rounded-2xl font-bold text-base transition-colors ${
            doneToday
              ? 'bg-green-900/40 text-green-400 border border-green-700/40 cursor-default'
              : 'bg-slate-700 active:bg-slate-600 text-white'
          }`}
        >
          {doneToday ? '✅ Fatto oggi' : '✓ Segna come fatto oggi'}
        </button>
      </div>
    </div>
  )
}
