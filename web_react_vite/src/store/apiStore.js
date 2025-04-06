import { create } from 'zustand'

const useApiStore = create((set) => ({
  catData: null,
  catLoading: false,
  catError: null,
  
  jokeData: null,
  jokeLoading: false,
  jokeError: null,

  fetchCat: async () => {
    set({ catLoading: true, catError: null })
    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search')
      if (!response.ok) throw new Error('Ошибка загрузки котиков')
      const data = await response.json()
      set({ catData: data[0], catLoading: false })
    } catch (error) {
      set({ catError: error, catLoading: false })
    }
  },

  fetchJoke: async () => {
    set({ jokeLoading: true, jokeError: null })
    try {
      const response = await fetch('https://official-joke-api.appspot.com/random_joke')
      if (!response.ok) throw new Error('Ошибка загрузки шутки')
      const data = await response.json()
      set({ jokeData: data, jokeLoading: false })
    } catch (error) {
      set({ jokeError: error, jokeLoading: false })
    }
  },

  resetApiState: () => set({
    catData: null,
    jokeData: null,
    catLoading: false,
    jokeLoading: false,
    catError: null,
    jokeError: null
  })
}))

export default useApiStore