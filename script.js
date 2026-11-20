
// ===== Digital Vision Board Web App =====

// LocalStorage keys
const STORAGE_KEY = 'visionBoardItems';

// Item structure: {goal, affirmation, imageUrl, id}
let items = [];

// DOM elements
const visionForm = document.getElementById('visionForm');
const goalInput = document.getElementById('goalInput');
const affirmationInput = document.getElementById('affirmationInput');
const imageInput = document.getElementById('imageInput');
const visionBoard = document.getElementById('visionBoard');
const clearAllBtn = document.getElementById('clearAllBtn');

// --- Load existing items from localStorage ---
function loadItems() {
    const stored = localStorage.getItem(STORAGE_KEY);
    items = stored ? JSON.parse(stored) : [];
}

// --- Save items to localStorage ---
function saveItems() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// --- Render all vision board cards ---
function renderBoard() {
    visionBoard.innerHTML = "";

    if (items.length === 0) {
        visionBoard.innerHTML = `
            <div style="opacity:.5;text-align:center;">
                Your vision board is empty. Start adding goals,
                images, affirmations!
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "vision-card";

        // Delete button (each item)
        const delBtn = document.createElement("button");
        delBtn.className = "delete-btn";
        delBtn.title = "Delete this item";
        delBtn.innerHTML = "✖";

        delBtn.onclick = () => {
            items = items.filter(i => i.id !== item.id);
            saveItems();
            renderBoard();
        };

        card.appendChild(delBtn);

        // Show image preview if any
        if (item.imageUrl) {
            const img = document.createElement("img");
            img.src = item.imageUrl;
            img.className = "vision-img";
            img.alt = "Vision item";
            card.appendChild(img);
        }

        // Goal text box
        if (item.goal) {
            const goal = document.createElement("div");
            goal.className = "goal-text";
            goal.textContent = item.goal;
            card.appendChild(goal);
        }

        // Affirmation box
        if (item.affirmation) {
            const affirm = document.createElement("div");
            affirm.className = "affirm-box";
            affirm.textContent = item.affirmation;
            card.appendChild(affirm);
        }

        visionBoard.appendChild(card);
    });
}

// --- Handle "Add to Board" ---
visionForm.addEventListener("submit", e => {
    e.preventDefault();

    // Collect inputs
    const goal = goalInput.value.trim();
    const affirmation = affirmationInput.value.trim();
    const imageFile = imageInput.files[0];

    // At least one field required
    if (!goal && !affirmation && !imageFile) return;

    // Read image as base64 (if any)
    if (imageFile) {
        const reader = new FileReader();

        reader.onload = function(evt) {
            addItem(goal, affirmation, evt.target.result);
        };

        reader.readAsDataURL(imageFile);
    } else {
        addItem(goal, affirmation, null);
    }

    // Reset fields
    goalInput.value = '';
    affirmationInput.value = '';
    imageInput.value = '';
});

// --- Add item to board and localStorage ---
function addItem(goal, affirmation, imageUrl) {
    const item = {
        goal,
        affirmation,
        imageUrl,
        id: Date.now() + Math.random()
    };

    items.push(item);
    saveItems();
    renderBoard();
}

// --- Clear All ---
clearAllBtn.onclick = () => {
    if (confirm("Clear all vision board items?")) {
        items = [];
        saveItems();
        renderBoard();
    }
};

// --- Initial board render ---
loadItems();
renderBoard();
