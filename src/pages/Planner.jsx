import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { THEMES } from '../data/themes'

export default function Planner() {
  const [planner, setPlanner] = useLocalStorage('planner', [])
  const [savedSessions, setSaved] = useLocalStorage('sessions', [])
  const [sessionName, setSessionName] = useState('')
  const [showSave, setShowSave] = useState(false)

  const totalTime = planner.reduce((sum, g) => sum + g.time, 0)

  const remove = (id) => setPlanner(prev => prev.filter(g => g.id !== id))

  const moveUp = (idx) => {
    if (idx === 0) return
    setPlanner(prev => {
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      return next
    })
  }

  const moveDown = (idx) => {
    setPlanner(prev => {
      if (idx >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      return next
    })
  }

  const saveSession = () => {
    const name = sessionName.trim() || `Sessione ${new Date().toLocaleDateString('it-IT')}`
    setSaved(prev => [
      { name, games: planner, savedAt: new Date().toISOString() },
      ...prev,
    ])
    setSessionName('')
    setShowSave(false)
    setPlanner([])
  }

  const loadSession = (session) => {
    setPlanner(session.games)
  }

  const deleteSession = (idx) => {
    setSaved(prev => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-black text-white">📋 Scaletta</h1>
          {planner.length > 0 && (
            <p className="text-xs text-slate-400">{planner.length} giochi · {totalTime} min totali</p>
          )}
        </div>
        {planner.length > 0 && (
          <button
            onClick={() => setShowSave(s => !s)}
            className="px-3 py-2 rounded-xl bg-violet-600 text-white text-sm font-bold"
          >
            Salva
          </button>
        )}
      </div>

      {/* Save form */}
      {showSave && (
        <div className="mb-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
          <p className="text-sm text-slate-300 mb-2">Nome sessione (facoltativo)</p>
          <input
            value={sessionName}
            onChange={e => setSessionName(e.target.value)}
            placeholder={`Sessione ${new Date().toLocaleDateString('it-IT')}`}
            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-white text-sm mb-3 outline-none focus:border-violet-500"
          />
          <button
            onClick={saveSession}
            className="w-full py-2 rounded-xl bg-violet-600 text-white font-bold text-sm"
          >
            Salva e svuota scaletta
          </button>
        </div>
      )}

      {/* Current planner */}
      {planner.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-sm">La scaletta è vuota.</p>
          <Link to="/" className="inline-block mt-4 px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-bold">
            Vai ai giochi
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-6">
          {planner.map((game, idx) => {
            const theme = THEMES[game.theme]
            return (
              <div key={`${game.id}-${idx}`} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700">
                {/* Order controls */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="text-slate-400 disabled:opacity-20 active:text-white text-lg leading-none"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === planner.length - 1}
                    className="text-slate-400 disabled:opacity-20 active:text-white text-lg leading-none"
                  >
                    ↓
                  </button>
                </div>

                {/* Position number */}
                <span className="text-slate-500 font-bold text-sm w-5 text-center">{idx + 1}</span>

                {/* Emoji + title */}
                <Link to={`/game/${game.id}`} className="flex-1 flex items-center gap-2 min-w-0">
                  <span className="text-2xl">{game.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm leading-tight truncate">{game.title}</p>
                    <p className={`text-xs ${theme.text}`}>{theme.emoji} {theme.label} · {game.time}min</p>
                  </div>
                </Link>

                {/* Remove */}
                <button
                  onClick={() => remove(game.id)}
                  className="text-slate-500 active:text-red-400 text-xl px-1"
                >
                  ✕
                </button>
              </div>
            )
          })}

          {/* Total bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-violet-900/40 border border-violet-700/40 mt-1">
            <span className="text-sm font-bold text-violet-300">Durata totale</span>
            <span className="text-lg font-black text-white">{totalTime} min</span>
          </div>
        </div>
      )}

      {/* Saved sessions */}
      {savedSessions.length > 0 && (
        <>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Sessioni salvate</h2>
          <div className="flex flex-col gap-2">
            {savedSessions.map((session, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm">{session.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {session.games.length} giochi · {session.games.reduce((s, g) => s + g.time, 0)} min
                      {' · '}{new Date(session.savedAt).toLocaleDateString('it-IT')}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {session.games.map(g => (
                        <span key={g.id} className="text-base">{g.emoji}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => loadSession(session)}
                      className="px-2 py-1 rounded-lg bg-violet-600 text-white text-xs font-bold"
                    >
                      Carica
                    </button>
                    <button
                      onClick={() => deleteSession(idx)}
                      className="px-2 py-1 rounded-lg bg-slate-700 text-slate-400 text-xs"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
