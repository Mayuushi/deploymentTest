import React from 'react'
import Canvas2D from './components/Canvas2D'

export default function App(){
  return (
    <div className="app">
      <h1>2D Graphics (Canvas) Demo</h1>
      <Canvas2D />
      <p className="hint">Move your mouse over the canvas to interact.</p>
    </div>
  )
}
