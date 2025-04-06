import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

const useTierList = (initialTiers = [], initialImages = []) => {
  const [tiers, setTiers] = useState(() => {
    const savedTiers = JSON.parse(localStorage.getItem('tierList-tiers'))
    return savedTiers || initialTiers
  })
  const [images, setImages] = useState(initialImages)
  const [editMode, setEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      try {
        const savedTiers = JSON.parse(localStorage.getItem('tierList-tiers'))
        const savedImages = JSON.parse(localStorage.getItem('tierList-images'))
        
        if (savedTiers) setTiers(savedTiers)
        if (savedImages) setImages(savedImages)
      } catch (error) {
        console.error('Failed to load tier list data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('tierList-tiers', JSON.stringify(tiers))
      localStorage.setItem('tierList-images', JSON.stringify(images))
    }
  }, [tiers, images, isLoading])

  const addTier = useCallback((label = 'New Tier') => {
    setTiers(prev => [
      ...prev,
      {
        id: uuidv4(),
        label,
        imageIds: []
      }
    ])
  }, [])

  const removeTier = useCallback((tierId) => {
    setTiers(prev => prev.filter(tier => tier.id !== tierId))
  }, [])

  const updateTierLabel = useCallback((tierId, newLabel) => {
    setTiers(prev =>
      prev.map(tier =>
        tier.id === tierId ? { ...tier, label: newLabel } : tier
      )
    )
  }, [])

  const moveImage = useCallback((imageId, fromTierId, toTierId) => {
    setTiers(prev =>
      prev.map(tier => {
       
        if (tier.id === fromTierId) {
          return {
            ...tier,
            imageIds: tier.imageIds.filter(id => id !== imageId)
          }
        }
 
        if (tier.id === toTierId && !tier.imageIds.includes(imageId)) {
          return {
            ...tier,
            imageIds: [...tier.imageIds, imageId]
          }
        }
        return tier
      })
    )
  }, [])

  const addImage = useCallback((imageUrl) => {
    const newImage = {
      id: uuidv4(),
      url: imageUrl
    }
    setImages(prev => [...prev, newImage])
    return newImage.id
  }, [])

  const removeImage = useCallback((imageId) => {
    setTiers(prev =>
      prev.map(tier => ({
        ...tier,
        imageIds: tier.imageIds.filter(id => id !== imageId)
      }))
    )

    setImages(prev => prev.filter(img => img.id !== imageId))
  }, [])

  const toggleEditMode = useCallback(() => {
    setEditMode(prev => !prev)
  }, [])

  const getImageById = useCallback((imageId) => {
    return images.find(img => img.id === imageId)
  }, [images])

  const getUnassignedImages = useCallback(() => {
    const assignedImageIds = tiers.flatMap(tier => tier.imageIds)
    return images.filter(img => !assignedImageIds.includes(img.id))
  }, [tiers, images])

  const resetTierList = useCallback(() => {
    setTiers(initialTiers)
    setImages(initialImages)
  }, [initialTiers, initialImages])

  return {
    tiers,
    images,
    editMode,
    isLoading,
    addTier,
    removeTier,
    updateTierLabel,
    moveImage,
    addImage,
    removeImage,
    toggleEditMode,
    getImageById,
    getUnassignedImages,
    resetTierList
  }
}

export default useTierList