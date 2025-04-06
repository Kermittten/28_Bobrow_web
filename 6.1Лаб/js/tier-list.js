
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
                    ${this.images.map(img => `<img src="images/${img}" alt="${img}" data-id="${img}" draggable="true">`).join('')}
                </div>
            </div>
        `;
    }
}

const TIER_LABELS = ['S', 'A', 'B', 'C', 'D'];
const IMAGES = Array.from({ length: 15 }, (_, i) => `im${i + 1}.png`);
let blocks = [];
let editMode = false;

document.addEventListener('DOMContentLoaded', () => {
    initializeTiers();
    loadBlocks();
    renderBlocks();
    setupEventListeners();
});

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
        return block.type === 'tier' 
            ? new TierBlock(block.id, block.label, block.images) 
            : null;
    }).filter(Boolean);
}

function saveBlocks() {
    localStorage.setItem('blocks', JSON.stringify(blocks));
}

function renderBlocks() {
    const container = document.getElementById('tier-list-container');
    if (!container) return;

    container.innerHTML = blocks.map(block => block.getHTML()).join('');

    const unassignedImagesContainer = document.querySelector('.unassigned-images');
    if (unassignedImagesContainer) {
        const assignedImages = blocks.flatMap(block => block.images);
        const unassignedImages = IMAGES.filter(img => !assignedImages.includes(img));
        unassignedImagesContainer.innerHTML = unassignedImages.map(img => `
            <img src="images/${img}" alt="${img}" data-id="${img}" draggable="true">
        `).join('');

        if (unassignedImages.length === 0) {
            unassignedImagesContainer.classList.add('empty');
        } else {
            unassignedImagesContainer.classList.remove('empty');
        }
    }

    setupDragAndDrop();
    toggleEditButtons();
}

function setupEventListeners() {
    document.getElementById('edit-mode-toggle')?.addEventListener('click', toggleEditMode);
    document.getElementById('add-tier-button')?.addEventListener('click', addTier);
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-tier-button')) {
            const tierId = e.target.closest('.tier').dataset.id;
            deleteTier(tierId);
        }
    });
}

function deleteTier(tierId) {
    if (!confirm('Вы уверены, что хотите удалить этот тир?')) return;
    
    blocks = blocks.filter(block => block.id != tierId);
    saveBlocks();
    renderBlocks();
}

function toggleEditMode() {
    editMode = !editMode;
    document.body.classList.toggle('edit-mode', editMode);
    renderBlocks();
}

function toggleEditButtons() {
    const editModeToggle = document.getElementById('edit-mode-toggle');
    const addTierButton = document.getElementById('add-tier-button');
    const deleteButtons = document.querySelectorAll('.delete-tier-button');

    if (editModeToggle) editModeToggle.classList.toggle('hidden', !editMode);
    if (addTierButton) addTierButton.classList.toggle('hidden', !editMode);
    deleteButtons.forEach(btn => btn.classList.toggle('hidden', !editMode));
}

function addTier() {
    const newLabel = prompt("Введите буквенное обозначение для нового тира (например, E):");
    if (newLabel) {
        const newId = blocks.length > 0 ? Math.max(...blocks.map(b => b.id)) + 1 : 1;
        blocks.push(new TierBlock(newId, newLabel));
        saveBlocks();
        renderBlocks();
    }
}

function setupDragAndDrop() {
    const draggableImages = document.querySelectorAll('img[draggable="true"]');
    const tierContainers = document.querySelectorAll('.tier-content, .unassigned-images');

    draggableImages.forEach(img => {
        img.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.id);
            setTimeout(() => e.target.classList.add('dragging'), 0);
        });

        img.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    
    tierContainers.forEach(container => {
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            container.classList.add('drag-over');
        });

        container.addEventListener('dragleave', () => {
            container.classList.remove('drag-over');
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.classList.remove('drag-over');
            
            const imageId = e.dataTransfer.getData('text/plain');
            const tierId = container.closest('.tier')?.dataset.tierId;
            moveImageToTier(imageId, tierId);
        });
    });
}

function moveImageToTier(imageId, tierId) {
  
    if (tierId) {
        const tier = blocks.find(block => block.id == tierId);
        if (tier && !tier.images.includes(imageId)) {
     
            blocks.forEach(block => {
                block.images = block.images.filter(img => img !== imageId);
            });
        
            tier.images.push(imageId);
            saveBlocks();
            renderBlocks();
        }
    } else {
    
        blocks.forEach(block => {
            block.images = block.images.filter(img => img !== imageId);
        });
        saveBlocks();
        renderBlocks();
    }
}