import { Link } from 'react-router-dom'
import { THEMES, MATERIALS } from '../data/themes'

// Returns how many days ago the game was last played (null if never)
function daysSince(history, gameId) {
  const entries = history.filter(e => e.id === gameId)
  if (!entries.length) return null
  const latest = Math.max(...entries.map(e => new Date(e.date).getTime()))
  return Math.floor((Date.now() - latest) / 86400000)
}

export default function GameCard({ game, history = [], onAddToPlanner, inPlannerMode = false }) {
  const theme = THEMES[game.theme]
  const mat   = MATERIALS[game.mat]
  const days  = daysSince(history, game.id)
  const recent = days !== null && days <= 7

  return (
    <div className={`relative rounded-2xl overflow-hidden border ${recent ? 'border-orange-500/60' : 'border-slate-700/50'} bg-slate-800/70`}>
      {/* Recent badge */}
      {recent && (
        <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {days === 0 ? 'oggi' : `${days}g fa`}
        </div>
      )}

      <Link to={`/game/${game.id}`} className="block p-4 active:bg-white/5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span className="text-4xl leading-none">{game.emoji}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg leading-tight text-white">{game.title}</h2>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {/* Theme badge */}
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${theme.light} ${theme.text}`}>
                {theme.emoji} {theme.label}
              </span>
              {/* Material badge */}
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                {mat.emoji} {mat.label}
              </span>
              {/* Duration */}
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                ⏱ {game.time}min
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mt-2 text-sm text-slate-300 line-clamp-2 leading-snug">{game.desc}</p>
      </Link>

      {/* Add to planner button */}
      {onAddToPlanner && (
        <div className="px-4 pb-3 -mt-1">
          <button
            onClick={() => onAddToPlanner(game)}
            className={`w-full py-2 rounded-xl text-sm font-bold transition-colors active:scale-95 ${
              inPlannerMode
                ? 'bg-slate-600 text-slate-400 cursor-default'
                : 'bg-violet-600 active:bg-violet-700 text-white'
            }`}
            disabled={inPlannerMode}
          >
            {inPlannerMode ? '✓ In scaletta' : '+ Aggiungi a scaletta'}
          </button>
        </div>
      )}
    </div>
  )
}
