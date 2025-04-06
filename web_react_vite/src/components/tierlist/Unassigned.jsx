import { useDrag } from 'react-dnd'
import { ItemTypes } from '../../utils/dragTypes'
import useTierListStore from '../../store/tierStore'
import { useMemo } from 'react'

const Unassigned = () => {
  const { IMAGES, blocks, editMode } = useTierListStore()

  const assignedImages = useMemo(() => {
    return blocks.flatMap(block => block.images)
  }, [blocks])

  const unassignedImages = useMemo(() => {
    return IMAGES.filter(img => !assignedImages.includes(img))
  }, [IMAGES, assignedImages])

  return (
    <div id="unassigned-images-container">
      <h3>Не распределённые изображения</h3>
      <div className="unassigned-images-grid">
        {unassignedImages.map(img => (
          <DraggableImage 
            key={img} 
            id={img} 
            src={`/images/im${img.replace('im', '')}.png`} 
            disabled={!editMode}
          />
        ))}
      </div>
    </div>
  )
}

const DraggableImage = ({ id, src, disabled }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.IMAGE,
    item: { id },
    canDrag: !disabled,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <div 
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: disabled ? 'default' : 'grab',
        filter: disabled ? 'grayscale(80%)' : 'none'
      }}
      className="unassigned-image-item"
    >
      <img
        src={src}
        alt={`Не распределено: ${id}`}
        draggable={false}
        className="unassigned-image"
      />
      {disabled && (
        <div className="edit-mode-hint">
          Включите режим редактирования
        </div>
      )}
    </div>
  )
}

export default Unassigned