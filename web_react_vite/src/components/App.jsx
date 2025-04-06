import { useState, useEffect } from 'react'
import Navbar from './common/Navbar'
import TierList from './tierlist/TierList'
import CatApi from './api/CatApi'
import JokeApi from './api/JokeApi'
import Loading from './common/Loading'
import useApiStore from '../store/apiStore'
import useTierListStore from '../store/tierStore'
import '../styles/App.css'

const App = () => {
  const [activeSection, setActiveSection] = useState('tier-list')
  const { resetApiState } = useApiStore()
  const { 
    resetTierState,
    initializeTiers,
    loadBlocks,
    editMode,
    toggleEditMode
  } = useTierListStore()

  useEffect(() => {
    const init = async () => {
      await initializeTiers()
      await loadBlocks()
    }
    init()
  }, [initializeTiers, loadBlocks])

  useEffect(() => {
    if (activeSection !== 'tier-list') {
      resetApiState()
    }
  }, [activeSection, resetApiState])

  const renderSection = () => {
    switch (activeSection) {
      case 'tier-list':
        return <TierList />
      case 'cat-api':
        return <CatApi />
      case 'joke-api':
        return <JokeApi />
      default:
        return <TierList /> 
    }
  }

  return (
    <div className="app-container">
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        sections={['tier-list', 'cat-api', 'joke-api']} 
      />
      
      {activeSection === 'tier-list' && (
        <div className="edit-controls">
          <button 
            onClick={toggleEditMode}
            className={`edit-mode-toggle ${editMode ? 'active' : ''}`}
          >
            {editMode ? 'Закончить редактирование' : 'Режим редактирования'}
          </button>
        </div>
      )}

      <main className="main-content">
        {renderSection()}
      </main>

      <Loading />
    </div>
  )
}

export default App