import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import games from '../data/games.json'
import { THEMES, MATERIALS } from '../data/themes'
import { useLocalStorage } from '../hooks/useLocalStorage'
import GameCard from '../components/GameCard'

export default function Home() {
  const [activeTheme, setActiveTheme] = useState(null)
  const [activeMat,   setActiveMat]   = useState(null)
  const [planner, setPlanner] = useLocalStorage('planner', [])
  const [history]             = useLocalStorage('history', [])
  const navigate = useNavigate()

  const addToPlanner = (game) => {
    const alreadyIn = planner.some(p => p.id === game.id)
    if (!alreadyIn) setPlanner(prev => [...prev, game])
    navigate('/planner')
  }

  const filtered = games.filter(g => {
    if (activeTheme && g.theme !== activeTheme) return false
    if (activeMat   && g.mat   !== activeMat)   return false
    return true
  })

  return (
    <div className="max-w-md mx-auto px-4 pt-5">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-3xl">🎪</span>
        <div>
          <h1 className="text-xl font-black text-white leading-tight">Miniclub</h1>
          <p className="text-xs text-slate-400">Game Finder — {filtered.length} giochi</p>
        </div>
      </div>

      {/* Theme filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-2">
        <button
          onClick={() => setActiveTheme(null)}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-colors ${
            !activeTheme ? 'bg-white text-slate-900 border-white' : 'border-slate-600 text-slate-300'
          }`}
        >
          Tutti
        </button>
        {Object.entries(THEMES).map(([key, t]) => (
          <button
            key={key}
            onClick={() => setActiveTheme(prev => prev === key ? null : key)}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-colors ${
              activeTheme === key
                ? `${t.color} text-white border-transparent`
                : 'border-slate-600 text-slate-300'
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Material filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
        <button
          onClick={() => setActiveMat(null)}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
            !activeMat ? 'bg-slate-200 text-slate-900 border-transparent' : 'border-slate-600 text-slate-400'
          }`}
        >
          Qualsiasi
        </button>
        {Object.entries(MATERIALS).map(([key, m]) => (
          <button
            key={key}
            onClick={() => setActiveMat(prev => prev === key ? null : key)}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              activeMat === key
                ? 'bg-slate-200 text-slate-900 border-transparent'
                : 'border-slate-600 text-slate-400'
            }`}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      {/* Game grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-5xl mb-3">🤷</div>
          <p>Nessun gioco corrisponde ai filtri.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 pb-4">
          {filtered.map(game => (
            <GameCard
              key={game.id}
              game={game}
              history={history}
              onAddToPlanner={addToPlanner}
              inPlannerMode={planner.some(p => p.id === game.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
