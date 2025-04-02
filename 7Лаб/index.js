
const { createSlice, configureStore } = RTK;
const { Provider, useDispatch, useSelector } = ReactRedux;
const { useState, useEffect } = React;

const initialState = {
  blocks: [
    { id: 1, label: 'S', images: [] },
    { id: 2, label: 'A', images: [] },
    { id: 3, label: 'B', images: [] },
    { id: 4, label: 'C', images: [] },
    { id: 5, label: 'D', images: [] },
  ],
  unassignedImages: [],
  apiResponse: null,
  editMode: false,
};

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    addTier(state) {
      const newLabel = String.fromCharCode(
        state.blocks[state.blocks.length - 1].label.charCodeAt(0) + 1
      );
      state.blocks.push({
        id: Date.now(),
        label: newLabel,
        images: [],
      });
    },
    deleteTier(state, action) {
      const tierId = action.payload;
      const tierIndex = state.blocks.findIndex(tier => tier.id === tierId);
      if (tierIndex !== -1) {
        state.unassignedImages = [
          ...state.unassignedImages,
          ...state.blocks[tierIndex].images,
        ];
        state.blocks.splice(tierIndex, 1);
      }
    },
    moveImage(state, action) {
      const { imageId, fromTierId, toTierId } = action.payload;
      
      let image = null;
      
      if (fromTierId === 'unassigned') {
        const imageIndex = state.unassignedImages.findIndex(img => img.id === imageId);
        if (imageIndex !== -1) {
          image = state.unassignedImages[imageIndex];
          state.unassignedImages.splice(imageIndex, 1);
        }
      } else {
        const fromTierIndex = state.blocks.findIndex(tier => tier.id === fromTierId);
        if (fromTierIndex !== -1) {
          const imageIndex = state.blocks[fromTierIndex].images.findIndex(img => img.id === imageId);
          if (imageIndex !== -1) {
            image = state.blocks[fromTierIndex].images[imageIndex];
            state.blocks[fromTierIndex].images.splice(imageIndex, 1);
          }
        }
      }
      
      if (image) {
        if (toTierId === 'unassigned') {
          state.unassignedImages.push(image);
        } else {
          const toTierIndex = state.blocks.findIndex(tier => tier.id === toTierId);
          if (toTierIndex !== -1) {
            state.blocks[toTierIndex].images.push(image);
          }
        }
      }
    },
    addImageToUnassigned(state, action) {
      state.unassignedImages.push(action.payload);
    },
    setApiResponse(state, action) {
      state.apiResponse = action.payload;
    },
    toggleEditMode(state) {
      state.editMode = !state.editMode;
    },
    loadLocalImages(state, action) {
      state.unassignedImages = action.payload;
    }
  },
});

const store = configureStore({
  reducer: {
    images: imageSlice.reducer,
  },
});

const { addTier, deleteTier, moveImage, addImageToUnassigned, setApiResponse, toggleEditMode, loadLocalImages } = imageSlice.actions;

const generateLocalImages = () => {
  const images = [];
  for (let i = 1; i <= 15; i++) {
    images.push({
      id: `local-img-${i}`,
      url: `images/im${i}.png`,
      name: `Локальное изображение ${i}`
    });
  }
  return images;
};

const getRandomCatImage = async () => {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/images/search');
    if (!response.ok) throw new Error('Ошибка загрузки изображения кота');
    const data = await response.json();
    return {
      id: `cat-${Date.now()}`,
      url: data[0].url,
      name: 'Случайный кот'
    };
  } catch (error) {
    throw error;
  }
};

const getJoke = async () => {
  try {
    const response = await fetch('https://official-joke-api.appspot.com/random_joke');
    if (!response.ok) throw new Error('Ошибка загрузки анекдота');
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

const Tier = ({ tier }) => {
  const dispatch = useDispatch();
  const editMode = useSelector(state => state.images.editMode);
  
  const handleDragOver = e => e.preventDefault();
  
  const handleDrop = e => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    dispatch(moveImage({
      imageId: data.id,
      fromTierId: data.tierId,
      toTierId: tier.id,
    }));
  };
  
  const handleDragStart = (e, image) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ id: image.id, tierId: tier.id })
    );
  };
  
  return (
    <div className="tier" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="tier-header">
        <div className="tier-label">{tier.label}</div>
        {editMode && (
          <button className="delete-tier-button" onClick={() => dispatch(deleteTier(tier.id))}>
            Удалить
          </button>
        )}
      </div>
      <div className="tier-content">
        {tier.images.map(image => (
          <img
            key={image.id}
            src={image.url}
            alt={image.name}
            draggable
            onDragStart={e => handleDragStart(e, image)}
          />
        ))}
      </div>
    </div>
  );
};

const TierList = () => {
  const dispatch = useDispatch();
  const { blocks, editMode } = useSelector(state => state.images);
  
  return (
    <div id="tier-list-container">
      {blocks.map(tier => (
        <Tier key={tier.id} tier={tier} />
      ))}
      {editMode && (
        <button id="add-tier-button" onClick={() => dispatch(addTier())}>
          Добавить тир
        </button>
      )}
    </div>
  );
};

const UnassignedImages = () => {
  const dispatch = useDispatch();
  const { unassignedImages } = useSelector(state => state.images);
  
  const handleDragOver = e => e.preventDefault();
  
  const handleDrop = e => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    dispatch(moveImage({
      imageId: data.id,
      fromTierId: data.tierId,
      toTierId: 'unassigned',
    }));
  };
  
  const handleDragStart = (e, image) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ id: image.id, tierId: 'unassigned' })
    );
  };
  
  return (
    <div id="unassigned-images-container">
      <h3>Не распределённые изображения</h3>
      <div className="unassigned-images" onDragOver={handleDragOver} onDrop={handleDrop}>
        {unassignedImages.map(image => (
          <img
            key={image.id}
            src={image.url}
            alt={image.name}
            draggable
            onDragStart={e => handleDragStart(e, image)}
          />
        ))}
      </div>
    </div>
  );
};

const ApiResponse = () => {
  const dispatch = useDispatch();
  const apiResponse = useSelector(state => state.images.apiResponse);
  
  const handleAddToTier = (image) => {
    dispatch(addImageToUnassigned(image));
  };
  
  if (!apiResponse) return null;
  
  return (
    <div id="api-response-container">
      {apiResponse.type === 'error' && (
        <>
          <h3>Ошибка:</h3>
          <p>{apiResponse.message}</p>
        </>
      )}
      {apiResponse.type === 'loading' && (
        <p>{apiResponse.message}</p>
      )}
      {apiResponse.type === 'joke' && (
        <>
          <h3>Анекдот:</h3>
          <p><strong>Вопрос:</strong> {apiResponse.setup}</p>
          <p><strong>Ответ:</strong> {apiResponse.punchline}</p>
        </>
      )}
      {apiResponse.type === 'meme' && (
        <>
          <h3>{apiResponse.name}</h3>
          <img src={apiResponse.url} alt="Meme" style={{ maxWidth: '100%' }} />
          <button onClick={() => handleAddToTier(apiResponse)}>
            Добавить в тир-лист
          </button>
        </>
      )}
    </div>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const editMode = useSelector(state => state.images.editMode);
  
  const handleLoadJoke = async () => {
    dispatch(setApiResponse({ type: 'loading', message: 'Загружаем анекдот...' }));
    const joke = await getJoke();
    if (joke.error) {
      dispatch(setApiResponse({ type: 'error', message: joke.error }));
    } else {
      dispatch(setApiResponse({ type: 'joke', setup: joke.setup, punchline: joke.punchline }));
    }
  };
  
  const handleLoadMeme = async () => {
    try {
      dispatch(setApiResponse({ type: 'loading', message: 'Загружаем кота...' }));
      const catImage = await getRandomCatImage();
      dispatch(setApiResponse({ type: 'meme', ...catImage }));
    } catch (error) {
      dispatch(setApiResponse({ type: 'error', message: error.message }));
    }
  };
  
  return (
    <header>
      <button id="edit-mode-toggle" onClick={() => dispatch(toggleEditMode())}>
        {editMode ? 'Выйти из режима редактирования' : 'Режим редактирования'}
      </button>
      <nav>
        <ul>
          <li><button id="memes-button" onClick={handleLoadMeme}>Мемы (Коты)</button></li>
          <li><button id="jokes-button" onClick={handleLoadJoke}>Анекдоты</button></li>
        </ul>
      </nav>
    </header>
  );
};

const App = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const localImages = generateLocalImages();
    dispatch(loadLocalImages(localImages));
    
    window.addEventListener('unhandledrejection', (event) => {
      dispatch(setApiResponse({ type: 'error', message: event.reason.message }));
    });
    
    return () => {
      window.removeEventListener('unhandledrejection', () => {});
    };
  }, [dispatch]);
  
  return (
    <>
      <Header />
      <TierList />
      <UnassignedImages />
      <ApiResponse />
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);