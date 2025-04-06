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

window.appCommon = {
    showLoading: function() {
        document.getElementById('loading-overlay')?.classList.remove('hidden');
    },
    hideLoading: function() {
        document.getElementById('loading-overlay')?.classList.add('hidden');
    },
    displayError: function(elementId, error) {
        const element = document.getElementById(elementId);
        if (element) element.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded");
    initializeTiers();
    loadBlocks();
    renderBlocks();
    setupNavigation();
    console.log("Initialization complete");

    document.querySelector('.nav-link[data-section="tier-list"]')?.click();
   
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
    try {
        const savedBlocks = JSON.parse(localStorage.getItem('blocks')) || [];
        blocks = savedBlocks.map(block => {
            return block && block.type === 'tier' 
                ? new TierBlock(block.id, block.label, block.images || []) 
                : null;
        }).filter(Boolean);
        
        if (blocks.length === 0) {
            initializeTiers();
        }
    } catch (e) {
        console.error("Error loading blocks:", e);
        initializeTiers();
    }
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
    }

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
    const elements = {
        editModeToggle: document.getElementById('edit-mode-toggle'),
        addTierButton: document.getElementById('add-tier-button'),
        deleteButtons: document.querySelectorAll('.delete-tier-button')
    };

    Object.entries(elements).forEach(([key, element]) => {
        if (!element) return;
        if (key === 'deleteButtons') {
            element.forEach(btn => btn.classList.toggle('hidden', !editMode));
        } else {
            element.classList.toggle('hidden', !editMode);
        }
    });
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
    const tierContainers = document.querySelectorAll('.tier-content');

    draggableImages.forEach(img => {
        img.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.id);
        });
    });

    tierContainers.forEach(container => {
        container.addEventListener('dragover', (e) => e.preventDefault());
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
        blocks.forEach(block => {
            block.images = block.images.filter(img => img !== imageId);
        });
        tier.images.push(imageId);
        saveBlocks();
        renderBlocks();
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const editButtons = document.querySelector('.header-buttons');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = `${link.dataset.section}-section`;

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            contentSections.forEach(section => {
                section.classList.toggle('active', section.id === sectionId);
            });

            if (editButtons) {
                editButtons.classList.toggle('hidden', sectionId !== 'tier-list-section');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTiers();
    loadBlocks();
    renderBlocks();
    setupNavigation();

    document.querySelector('.nav-link[data-section="tier-list"]')?.click();

    document.getElementById('edit-mode-toggle')?.addEventListener('click', toggleEditMode);
    document.getElementById('add-tier-button')?.addEventListener('click', addTier);
});