import { useState } from 'react'
import Board from './components/Board'

function App() {

  return (
    <>
       <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <Board />
    </>
  )
}

export default App
