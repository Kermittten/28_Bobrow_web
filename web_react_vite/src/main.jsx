import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import './index.css'

let DndProvider, HTML5Backend

if (typeof window !== 'undefined') {
  import('react-dnd').then(module => {
    DndProvider = module.DndProvider
  })
  import('react-dnd-html5-backend').then(module => {
    HTML5Backend = module.HTML5Backend
  })
}

const RootComponent = () => {
  if (typeof window === 'undefined' || !DndProvider || !HTML5Backend) {
    return <App /> 
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
)