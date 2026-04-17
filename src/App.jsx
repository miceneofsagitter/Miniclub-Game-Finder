import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import GameDetail from './pages/GameDetail'
import Planner from './pages/Planner'
import History from './pages/History'

function NavBar() {
  const base = 'flex flex-col items-center gap-0.5 text-xs font-semibold transition-colors py-2 px-3 rounded-xl'
  const active = 'text-white bg-white/10'
  const inactive = 'text-slate-400'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-slate-800 safe-bottom">
      <div className="flex justify-around max-w-md mx-auto px-2 pt-1 pb-1">
        {[
          { to: '/',        icon: '🎮', label: 'Giochi'   },
          { to: '/planner', icon: '📋', label: 'Scaletta' },
          { to: '/history', icon: '📅', label: 'Storico'  },
        ].map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          >
            <span className="text-2xl leading-none">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <HashRouter>
      <div className="pb-20 min-h-screen">
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/game/:id"  element={<GameDetail />} />
          <Route path="/planner"   element={<Planner />} />
          <Route path="/history"   element={<History />} />
        </Routes>
      </div>
      <NavBar />
    </HashRouter>
  )
}
