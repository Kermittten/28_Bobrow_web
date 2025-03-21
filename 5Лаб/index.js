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
}

function saveBlocks() {
    localStorage.setItem('blocks', JSON.stringify(blocks));
}

function renderBlocks() {
    const container = document.getElementById('tier-list-container');
    container.innerHTML = blocks.map(block => block.getHTML()).join('');

    const unassignedImagesContainer = document.querySelector('.unassigned-images');
    const assignedImages = blocks.flatMap(block => block.images);
    const unassignedImages = IMAGES.filter(img => !assignedImages.includes(img));
    unassignedImagesContainer.innerHTML = unassignedImages.map(img => `
        <img src="images/${img}" alt="${img}" data-id="${img}" draggable="true">
    `).join('');

    document.querySelectorAll('.delete-tier-button').forEach(button => {
        button.addEventListener('click', () => {
            const tierId = button.closest('.tier').dataset.id;
            deleteTier(tierId);
        });
    });

    setupDragAndDrop();
    toggleEditButtons();
}

function deleteTier(tierId) {
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
    const addTierButton = document.getElementById('add-tier-button');
    const deleteButtons = document.querySelectorAll('.delete-tier-button');

    if (editMode) {
        addTierButton.classList.remove('hidden');
        deleteButtons.forEach(button => button.classList.remove('hidden'));
    } else {
        addTierButton.classList.add('hidden');
        deleteButtons.forEach(button => button.classList.add('hidden'));
    }
}

function addTier() {
    const newLabel = prompt("Введите буквенное обозначение для нового тира (например, E):");
    if (newLabel) {
        const newId = blocks.length + 1;
        blocks.push(new TierBlock(newId, newLabel));
        saveBlocks();
        renderBlocks();
    }
}

function setupDragAndDrop() {
    const draggableImages = document.querySelectorAll('img[draggable="true"]');
    const tierContainers = document.querySelectorAll('.tier-content');

    draggableImages.forEach(img => {
        img.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.id);
        });
    });

    tierContainers.forEach(container => {
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            const imageId = e.dataTransfer.getData('text/plain');
            const tierId = container.dataset.tierId;
            moveImageToTier(imageId, tierId);
        });
    });
}

function moveImageToTier(imageId, tierId) {
    const tier = blocks.find(block => block.id == tierId);
    if (tier && !tier.images.includes(imageId)) {
        tier.images.push(imageId);
        saveBlocks();
        renderBlocks();
    }
}

document.getElementById('edit-mode-toggle').addEventListener('click', toggleEditMode);
document.getElementById('add-tier-button').addEventListener('click', addTier);

document.addEventListener('DOMContentLoaded', () => {
    initializeTiers();
    loadBlocks();
    renderBlocks();
});