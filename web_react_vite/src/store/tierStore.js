import { create } from 'zustand'

const useTierListStore = create((set, get) => ({
  blocks: [],
  loading: false,
  editMode: false,
  TIER_LABELS: ['S', 'A', 'B', 'C', 'D'],
  IMAGES: Array.from({ length: 15 }, (_, i) => `im${i + 1}.png`),

  initializeTiers: () => {
    if (!localStorage.getItem('blocks')) {
      get().resetTierState()
    }
  },

  loadBlocks: () => {
    set({ loading: true })
    try {
      const savedBlocks = JSON.parse(localStorage.getItem('blocks')) || []
      set({ blocks: savedBlocks })
    } catch (error) {
      console.error('Failed to load blocks:', error)
      get().resetTierState()
    } finally {
      set({ loading: false })
    }
  },

  saveBlocks: () => {
    localStorage.setItem('blocks', JSON.stringify(get().blocks))
  },

  resetTierState: () => {
    const initialBlocks = get().TIER_LABELS.map((label, index) => ({
      id: index + 1,
      type: 'tier',
      label,
      images: []
    }))
    set({
      blocks: initialBlocks,
      editMode: false,
      loading: false
    })
    localStorage.setItem('blocks', JSON.stringify(initialBlocks))
  },

  toggleEditMode: () => set(state => ({ editMode: !state.editMode })),

  addTier: (label) => {
    const newId = Math.max(...get().blocks.map(b => b.id), 0) + 1
    const newBlock = {
      id: newId,
      type: 'tier',
      label: label || `New Tier ${newId}`,
      images: []
    }
    set(state => ({ blocks: [...state.blocks, newBlock] }))
    get().saveBlocks()
    return newBlock
  },

  deleteTier: (tierId) => {
    set(state => ({
      blocks: state.blocks.filter(block => block.id !== tierId)
    }))
    get().saveBlocks()
  },

  moveImageToTier: (imageId, fromTierId, toTierId) => {
    set(state => {
      const updatedBlocks = state.blocks.map(block => 
        block.id === fromTierId 
          ? { ...block, images: block.images.filter(id => id !== imageId) }
          : block
      )
      
      return {
        blocks: updatedBlocks.map(block =>
          block.id === toTierId && !block.images.includes(imageId)
            ? { ...block, images: [...block.images, imageId] }
            : block
        )
      }
    })
    get().saveBlocks()
  },

  getUnassignedImages: () => {
    const assignedImages = get().blocks.flatMap(block => block.images)
    return get().IMAGES.filter(img => !assignedImages.includes(img))
  }
}))

export default useTierListStore