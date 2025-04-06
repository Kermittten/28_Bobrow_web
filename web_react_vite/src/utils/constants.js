
export const TIER_LIST_CONFIG = {
    DEFAULT_TIERS: ['S', 'A', 'B', 'C', 'D'], 
    DEFAULT_IMAGES: Array.from({ length: 15 }, (_, i) => `im${i + 1}.png`), 
    LOCAL_STORAGE_KEYS: {
      TIERS: 'tierList-tiers',
      IMAGES: 'tierList-images',
      SETTINGS: 'tierList-settings'
    },
    TIER_COLORS: {
      'S': '#ff7f7f', 
      'A': '#ffbf7f', 
      'B': '#ffdf7f', 
      'C': '#ffff7f', 
      'D': '#bfff7f', 
      DEFAULT: '#7fbfff' 
    },
    MAX_TIERS: 10, 
    MAX_IMAGES: 50 
  }
  
  export const API_CONFIG = {
    JSON_PLACEHOLDER: {
      BASE_URL: 'https://jsonplaceholder.typicode.com',
      ENDPOINTS: {
        POSTS: '/posts'
      }
    },
    CAT_API: {
      BASE_URL: 'https://api.thecatapi.com/v1',
      ENDPOINTS: {
        IMAGES: '/images/search'
      }
    },
    JOKE_API: {
      BASE_URL: 'https://official-joke-api.appspot.com',
      ENDPOINTS: {
        RANDOM_JOKE: '/random_joke'
      }
    }
  }
  
  export const TEXT_CONTENT = {
    TIER_LIST: {
      EMPTY_TIER_MESSAGE: 'Перетащите изображения сюда',
      UNASSIGNED_TITLE: 'Не распределённые изображения',
      EDIT_MODE_HINT: 'Включите режим редактирования',
      DELETE_CONFIRM: (tierLabel) => `Удалить тир ${tierLabel}? Все изображения будут перемещены в нераспределенные.`,
      ADD_TIER_PROMPT: 'Введите буквенное обозначение для нового тира (например, E):'
    },
    COMMON: {
      LOADING: 'Загрузка...',
      ERROR: 'Произошла ошибка',
      SUCCESS: 'Успешно'
    }
  }
  
  export const DND_TYPES = {
    IMAGE: 'image',
    TIER: 'tier'
  }
  
  export const IMAGE_SETTINGS = {
    SIZE: {
      SMALL: { width: 50, height: 50 },
      MEDIUM: { width: 80, height: 80 },
      LARGE: { width: 120, height: 120 }
    },
    ASPECT_RATIO: '1/1', 
    DEFAULT_ALT: (name) => `Изображение ${name}`
  }
  
  export default {
    TIER_LIST_CONFIG,
    API_CONFIG,
    TEXT_CONTENT,
    DND_TYPES,
    IMAGE_SETTINGS
  }