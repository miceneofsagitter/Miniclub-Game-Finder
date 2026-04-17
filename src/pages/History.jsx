import { Link } from 'react-router-dom'
import games from '../data/games.json'
import { THEMES } from '../data/themes'
import { useLocalStorage } from '../hooks/useLocalStorage'

function formatDate(iso) {
  const d = new Date(iso)
  const today = new Date()
  const diff = Math.floor((today - d) / 86400000)
  if (diff === 0) return 'Oggi'
  if (diff === 1) return 'Ieri'
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}

export default function History() {
  const [history, setHistory] = useLocalStorage('history', [])

  // Group entries by date (most recent first)
  const byDate = history
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .reduce((acc, entry) => {
      const dateKey = new Date(entry.date).toDateString()
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(entry)
      return acc
    }, {})

  const removeEntry = (entryIndex) => {
    setHistory(prev => {
      const sorted = [...prev].sort((a, b) => new Date(b.date) - new Date(a.date))
      sorted.splice(entryIndex, 1)
      return sorted
    })
  }

  const clearAll = () => {
    if (window.confirm('Eliminare tutto lo storico?')) setHistory([])
  }

  // Flat sorted list for index tracking
  const sortedEntries = history
    .map((e, originalIdx) => ({ ...e, originalIdx }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  if (history.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 pt-5">
        <h1 className="text-xl font-black text-white mb-6">📅 Storico</h1>
        <div className="text-center py-16 text-slate-500">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-sm">Nessun gioco segnato ancora.</p>
          <Link to="/" className="inline-block mt-4 px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-bold">
            Vai ai giochi
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-black text-white">📅 Storico</h1>
        <button
          onClick={clearAll}
          className="text-xs text-slate-500 active:text-red-400 px-2 py-1"
        >
          Cancella tutto
        </button>
      </div>

      <div className="flex flex-col gap-4 pb-4">
        {Object.entries(byDate).map(([dateKey, entries]) => (
          <div key={dateKey}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {formatDate(entries[0].date)}
            </p>
            <div className="flex flex-col gap-2">
              {entries.map((entry) => {
                const game = games.find(g => g.id === entry.id)
                if (!game) return null
                const theme = THEMES[game.theme]
                const entryIdx = sortedEntries.findIndex(
                  e => e.originalIdx === history.indexOf(history.find(h => h.id === entry.id && h.date === entry.date))
                )

                return (
                  <div key={`${entry.id}-${entry.date}`} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700">
                    <span className="text-2xl">{game.emoji}</span>
                    <Link to={`/game/${game.id}`} className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm truncate">{game.title}</p>
                      <p className={`text-xs ${theme.text}`}>{theme.emoji} {theme.label}</p>
                    </Link>
                    <p className="text-xs text-slate-500 shrink-0">
                      {new Date(entry.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <button
                      onClick={() => {
                        const idx = history.findIndex(h => h.id === entry.id && h.date === entry.date)
                        setHistory(prev => prev.filter((_, i) => i !== idx))
                      }}
                      className="text-slate-600 active:text-red-400 text-lg px-1"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
