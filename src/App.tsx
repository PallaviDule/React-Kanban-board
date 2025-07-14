import { useState } from 'react'
import Board from './components/Board'

function App() {

  return (
<div className="h-screen flex flex-col">
      {/* Fixed App Header */}
      <header className="sticky top-0 z-10 bg-white shadow px-6 py-2">
        <h1 className="text-2xl font-bold text-blue-800">Kanban Board</h1>
      </header>

      {/* Scrollable main content */}
      <main className="flex-1 overflow-auto">
        <Board />
      </main>
    </div>
  )
}

export default App
