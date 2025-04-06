import { useEffect } from 'react'
import useTierListStore from '../../store/tierStore'
import Tier from './Tier'
import Unassigned from './Unassigned'
import Loading from '../common/Loading'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './TierList.css'

const TierList = () => {
  const {
    blocks,
    loading,
    editMode,
    initializeTiers,
    loadBlocks,
    toggleEditMode,
    addTier,
    saveBlocks
  } = useTierListStore()

  useEffect(() => {
    initializeTiers()
    loadBlocks()
  }, [initializeTiers, loadBlocks])

  useEffect(() => {
    if (blocks.length > 0) {
      saveBlocks()
    }
  }, [blocks, saveBlocks])

  const handleAddTier = () => {
    const newLabel = prompt("Введите буквенное обозначение для нового тира (например, E):")
    if (newLabel) {
      addTier(newLabel)
    }
  }

  if (loading) return <Loading fullScreen={false} />

  return (
    <DndProvider backend={HTML5Backend}>
      <section id="tier-list-section" className="content-section active">
        <div className="tier-list-controls">
          <button 
            onClick={toggleEditMode}
            className={`edit-mode-toggle ${editMode ? 'active' : ''}`}
          >
            {editMode ? 'Закончить редактирование' : 'Режим редактирования'}
          </button>
          
          {editMode && (
            <button 
              onClick={handleAddTier}
              className="add-tier-button"
            >
              + Добавить тир
            </button>
          )}
        </div>

        <div id="tier-list-container">
          {blocks.map(block => (
            <Tier key={block.id} block={block} />
          ))}
        </div>

        <Unassigned />
      </section>
    </DndProvider>
  )
}

export default TierList