
class Block {
    constructor(id, type) {
        this.id = id;
        this.type = type;
    }

    getHTML() {
        throw new Error("Method 'getHTML()' must be implemented.");
    }
}

class TierBlock extends Block {
    constructor(id, label, images = []) {
        super(id, 'tier');
        this.label = label;
        this.images = images;
    }

    getHTML() {
        return `
            <div class="tier" data-id="${this.id}">
                <div class="tier-header">
                    <div class="tier-label" data-tier="${this.label}">${this.label}</div>
                    <button class="delete-tier-button hidden">Удалить</button>
                </div>
                <div class="tier-content" data-tier-id="${this.id}">
                    ${this.images.map(img => `<img src="${img.url}" alt="${img.name}" data-id="${img.id}" draggable="true">`).join('')}
                </div>
            </div>
        `;
    }
}

const TIER_LABELS = ['S', 'A', 'B', 'C', 'D'];
let blocks = [];
let editMode = false;
let unassignedImages = []; 

async function getRandomCatImage() {
    const statusCodes = [100, 101, 200, 201, 202, 204, 206, 207, 300, 301, 302, 
                         303, 304, 305, 307, 400, 401, 402, 403, 404, 405, 406, 
                         408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 
                         422, 423, 424, 425, 426, 429, 431, 444, 450, 451, 500, 
                         502, 503, 504, 506, 507, 508, 509, 510, 511];
    
    const randomCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
    return {
        id: `cat-${randomCode}-${Date.now()}`,
        url: `https://http.cat/${randomCode}`,
        name: `HTTP Cat ${randomCode}`
    };
}

async function getJoke() {
    try {
        const container = document.getElementById('api-response-container');
        container.innerHTML = '<p>Загружаем анекдот...</p>';
        
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        if (!response.ok) {
            throw new Error('Ошибка загрузки анекдота');
        }
        
        const jokeData = await response.json();
        
        if (!jokeData || !jokeData.setup) {
            throw new Error('Некорректный формат анекдота');
        }
        
        displayJoke(jokeData.setup, jokeData.punchline);
    } catch (error) {
        showError(`Ошибка: ${error.message}`);
        console.error('Ошибка при загрузке анекдота:', error);
    }
}

async function getMeme() {
    try {
        const container = document.getElementById('api-response-container');
        container.innerHTML = '<p>Загружаем мем...</p>';
        
        const catImage = await getRandomCatImage();
        displayMeme(catImage);
    } catch (error) {
        showError(error.message);
    }
}

function displayMeme(meme) {
    const container = document.getElementById('api-response-container');
    container.innerHTML = `
        <h3>${meme.name}</h3>
        <img src="${meme.url}" alt="Meme" style="max-width: 100%;">
        <button id="add-to-tier">Добавить в тир-лист</button>
    `;
    
    document.getElementById('add-to-tier').addEventListener('click', () => {
        addImageToUnassigned(meme);
    });
}

function displayJoke(setup, punchline) {
    const container = document.getElementById('api-response-container');
    container.innerHTML = `
        <h3>Анекдот:</h3>
        <p><strong>Вопрос:</strong> ${setup}</p>
        <p><strong>Ответ:</strong> ${punchline}</p>
    `;
}

function showError(message) {
    const container = document.getElementById('api-response-container');
    container.innerHTML = `
        <h3>Ошибка:</h3>
        <p>${message}</p>
    `;
}

function addImageToUnassigned(image) {
    unassignedImages.push(image);
    renderUnassignedImages();
}

function renderUnassignedImages() {
    const unassignedContainer = document.querySelector('.unassigned-images');
    unassignedContainer.innerHTML = '';
    
    unassignedImages.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.url;
        imgElement.alt = image.name;
        imgElement.dataset.id = image.id;
        imgElement.draggable = true;
        unassignedContainer.appendChild(imgElement);
    });
    
    setupDragAndDrop();
}

function setupDragAndDrop() {
    const images = document.querySelectorAll('img[draggable="true"]');
    const tierContents = document.querySelectorAll('.tier-content');
    
    images.forEach(img => {
        img.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.id);
        });
    });
    
    tierContents.forEach(tier => {
        tier.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        tier.addEventListener('drop', (e) => {
            e.preventDefault();
            const imageId = e.dataTransfer.getData('text/plain');
            const imageElement = document.querySelector(`img[data-id="${imageId}"]`);
            
            if (imageElement) {
          
                const imageIndex = unassignedImages.findIndex(img => img.id === imageId);
                if (imageIndex !== -1) {
                    const image = unassignedImages[imageIndex];
                    
  
                    const tierId = tier.dataset.tierId;
                    const blockIndex = blocks.findIndex(block => block.id == tierId);
                    
                    if (blockIndex !== -1) {
         
                        blocks[blockIndex].images.push(image);
       
                        unassignedImages.splice(imageIndex, 1);

                        renderBlocks();
                        renderUnassignedImages();
                        saveBlocks();
                    }
                }
            }
        });
    });
}

function toggleEditMode() {
    editMode = !editMode;
    const editButton = document.getElementById('edit-mode-toggle');
    const addTierButton = document.getElementById('add-tier-button');
    const deleteButtons = document.querySelectorAll('.delete-tier-button');
    
    if (editMode) {
        editButton.textContent = 'Обычный режим';
        addTierButton.classList.remove('hidden');
        deleteButtons.forEach(btn => btn.classList.remove('hidden'));
    } else {
        editButton.textContent = 'Режим редактирования';
        addTierButton.classList.add('hidden');
        deleteButtons.forEach(btn => btn.classList.add('hidden'));
    }
}

function addTier() {
    const newLabel = prompt('Введите метку для нового тира (например, E):');
    if (newLabel) {
        const newId = blocks.length > 0 ? Math.max(...blocks.map(b => b.id)) + 1 : 1;
        blocks.push(new TierBlock(newId, newLabel));
        renderBlocks();
        saveBlocks();
    }
}

function initializeTiers() {
    if (!localStorage.getItem('blocks')) {
        blocks = TIER_LABELS.map((label, index) => {
            return new TierBlock(index + 1, label);
        });
        saveBlocks();
    }
}

function loadBlocks() {
    const savedBlocks = JSON.parse(localStorage.getItem('blocks')) || [];
    blocks = savedBlocks.map(block => {
        switch (block.type) {
            case 'tier':
                return new TierBlock(block.id, block.label, block.images);
            default:
                return null;
        }
    }).filter(block => block !== null);
    
    unassignedImages = JSON.parse(localStorage.getItem('unassignedImages')) || [];
}

function saveBlocks() {
    localStorage.setItem('blocks', JSON.stringify(blocks));
    localStorage.setItem('unassignedImages', JSON.stringify(unassignedImages));
}

function renderBlocks() {
    const container = document.getElementById('tier-list-container');
    container.innerHTML = blocks.map(block => block.getHTML()).join('');

    document.querySelectorAll('.delete-tier-button').forEach(button => {
        button.addEventListener('click', (e) => {
            if (editMode) {
                const tierElement = e.target.closest('.tier');
                const tierId = parseInt(tierElement.dataset.id);
                blocks = blocks.filter(block => block.id !== tierId);
                renderBlocks();
                saveBlocks();
            }
        });
    });

    setupDragAndDrop();
    toggleEditButtons();
}

function toggleEditButtons() {
    const deleteButtons = document.querySelectorAll('.delete-tier-button');
    const addTierButton = document.getElementById('add-tier-button');
    
    if (editMode) {
        deleteButtons.forEach(btn => btn.classList.remove('hidden'));
        addTierButton.classList.remove('hidden');
    } else {
        deleteButtons.forEach(btn => btn.classList.add('hidden'));
        addTierButton.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTiers();
    loadBlocks();
    renderBlocks();
    renderUnassignedImages();
    
    document.getElementById('edit-mode-toggle').addEventListener('click', toggleEditMode);
    document.getElementById('add-tier-button').addEventListener('click', addTier);
    document.getElementById('memes-button').addEventListener('click', getMeme);
    document.getElementById('jokes-button').addEventListener('click', getJoke);
    
    if (unassignedImages.length === 0) {
        for (let i = 0; i < 3; i++) {
            getRandomCatImage().then(cat => {
                addImageToUnassigned(cat);
                saveBlocks();
            });
        }
    }
});