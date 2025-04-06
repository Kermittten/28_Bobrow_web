import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from '../../utils/dragTypes'
import useTierListStore from '../../store/tierStore'
import { useMemo } from 'react'

const Tier = ({ block }) => {
  const { id, label, images } = block
  const { editMode, moveImageToTier, deleteTier } = useTierListStore()

  const handleDelete = () => {
    if (window.confirm(`Удалить тир ${label}? Все изображения будут перемещены в нераспределенные.`)) {
      deleteTier(id)
    }
  }

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.IMAGE,
    drop: (item) => moveImageToTier(item.id, id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }))

  const getImagePath = (imgId) => {
    return `/images/im${imgId.replace('im', '')}.png`
  }

  const tierContent = useMemo(() => (
    images.map(img => (
      <DraggableImage 
        key={img} 
        id={img} 
        src={getImagePath(img)} 
      />
    ))
  ), [images])

  return (
    <div 
      className="tier" 
      data-id={id}
      ref={drop}
      style={{
        backgroundColor: isOver ? 'rgba(0, 200, 0, 0.1)' : undefined,
        border: isOver ? '2px dashed #00c800' : undefined,
        minHeight: '100px' 
      }}
    >
      <div className="tier-header">
        <div 
          className="tier-label" 
          data-tier={label}
          style={{ backgroundColor: getTierColor(label) }}
        >
          {label}
        </div>
        {editMode && (
          <button 
            className="delete-tier-button"
            onClick={handleDelete}
            aria-label={`Удалить тир ${label}`}
            title="Удалить тир"
          >
            ×
          </button>
        )}
      </div>
      <div className="tier-content" data-tier-id={id}>
        {images.length > 0 ? tierContent : (
          <div className="empty-tier-hint">Перетащите изображения сюда</div>
        )}
      </div>
    </div>
  )
}

const getTierColor = (tierLabel) => {
  const colors = {
    'S': '#ff7f7f',
    'A': '#ffbf7f',
    'B': '#ffdf7f',
    'C': '#ffff7f',
    'D': '#bfff7f'
  }
  return colors[tierLabel] || '#7fbfff'
}

const DraggableImage = ({ id, src }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.IMAGE,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <img
      ref={drag}
      src={src}
      alt={`Изображение ${id}`}
      data-id={id}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        width: '50px',
        height: '50px',
        objectFit: 'cover'
      }}
      draggable={false}
      onDragStart={(e) => e.preventDefault()} 
    />
  )
}

export default Tier