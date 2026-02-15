import { useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { Settings } from './components/Settings'
import { Header } from './components/Header'
import { ApiKeyProvider } from './context/ApiKeyContext'

function App() {
  const [view, setView] = useState<'dashboard' | 'settings'>('dashboard')

  return (
    <ApiKeyProvider>
      <div className="min-h-screen flex flex-col">
        <Header view={view} setView={setView} />
        <main className="flex-1 px-4 py-4 md:px-8 md:py-6 max-w-[1400px] mx-auto w-full animate-[fadeIn_0.4s_ease-out]">
          {view === 'dashboard' ? <Dashboard /> : <Settings />}
        </main>
      </div>
    </ApiKeyProvider>
  )
}

export default App
