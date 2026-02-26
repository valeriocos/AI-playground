/**
 * Theater Reveal - Game Logic
 */

const CONFIG = {
    SHAKE_DURATION: 300,
    CURTAIN_DURATION: 800,
    STORAGE_KEY: 'theater_reveal_state'
};

const MYSTERY_SHAPE = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#f80" d="M2 2h12v12H2z"/><path fill="#000" d="M3 3h10v10H3z"/><path fill="#f80" d="M4 4h8v8H4z"/><path fill="#000" d="M7 10h2v1H7zm1-5h1v1H8zm-1 1h2v3H7zM6 6h1v1H6zm4 0h1v1h-1z"/><path fill="#fff" d="M3 3h1v1H3zm10 0h1v1h-1zm0 10h1v1h-1zm-10 0h1v1H3z"/></svg>`;

const CHARACTERS = [
    // Pennywise (It) - White face, red streaks, orange hair, yellow eyes
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <path fill="#f80" d="M7 4h10v2h2v4h-2v2H7v-2H5V6h2V4z"/>
        <path fill="#fff" d="M8 6h8v10H8V6zm-2 2h2v6H6V8zm10 0h2v6h-2V8z"/>
        <path fill="#f00" d="M9 7h1v4H9V7zm5 0h1v4h-1V7zm-3 7h2v1h-2v-1zM7 11h1v1H7v-1zm9 0h1v1h-1v-1z"/>
        <path fill="#000" d="M9 8h1v1H9V8zm5 0h1v1h-1V8z"/>
        <path fill="#aaa" d="M9 16h6v2H9v-2z"/>
    </svg>`,
    // Freddy Krueger - Fedora, striped sweater, metal claws
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <path fill="#421" d="M6 4h12v2H6V4zm-2 2h16v1H4V6z"/>
        <path fill="#ca8" d="M8 7h8v5H8V7z"/>
        <path fill="#141" d="M5 12h14v10H5V12z"/>
        <path fill="#811" d="M5 13h14v1H5v-1zm0 3h14v1H5v-1zm0 3h14v1H5v-1z"/>
        <path fill="#777" d="M16 14h2v6h-2v-6zm3 1h1v4h-1v-4z"/>
        <path fill="#000" d="M9 9h1v1H9V9zm5 0h1v1h-1V9z"/>
    </svg>`,
    // Super Mario - Iconic red hat and blue overalls
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <path fill="#f00" d="M8 2h8v1H7v1H6v2h12V3h-1V2h2v5H5V4h1V3h2V2z"/>
        <path fill="#fca" d="M8 6h9v6H8V6zM7 8h1v3H7V8zm10 0h1v3h-1V8z"/>
        <path fill="#421" d="M12 9h4v1h-4V9zm-2 0h1v1h-1V9zM7 7h10v1H7V7z"/>
        <path fill="#04b" d="M7 12h10v8H7v-8z"/>
        <path fill="#fd0" d="M8 14h2v2H8v-2zm6 0h2v2h-2v-2z"/>
        <path fill="#840" d="M6 18h2v4H6v-4zm10 0h2v4h-2v-4z"/>
    </svg>`,
    // Superman - Blue suit, red cape, S emblem
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <path fill="#e00" d="M4 4h2v16H4V4zm14 0h2v16h-2V4z"/>
        <path fill="#04b" d="M6 4h12v14H6V4z"/>
        <path fill="#fd0" d="M9 7h6v6H9V7z"/>
        <path fill="#e00" d="M10 8l4 2-4 2V8z"/>
        <path fill="#fca" d="M8 0h8v4H8V0z"/>
        <path fill="#000" d="M9 1h1v1H9V1zm5 0h1v1h-1V1z"/>
    </svg>`,
    // Batman - Cowl with ears, dark grey suit, utility belt
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <path fill="#111" d="M8 1h1v3H8V1zm7 0h1v3h-1V1zM8 3h8v6H8V3z"/>
        <path fill="#fca" d="M9 7h6v2H9V7z"/>
        <path fill="#111" d="M10 7h1v1h-1V7zm3 0h1v1h-1V7z"/>
        <path fill="#333" d="M6 9h12v12H6V9z"/>
        <path fill="#fd0" d="M7 16h10v1H7v-1z"/>
        <path fill="#000" d="M10 16h1v1h-1v-1zm3 0h1v1h-1v-1z"/>
    </svg>`,
    // Hulk - Massive green muscles and purple ripped pants
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <path fill="#000" d="M8 2h8v3H8V2z"/>
        <path fill="#0a0" d="M4 5h16v10H4V5z"/>
        <path fill="#60a" d="M4 15h16v7H4v-7z"/>
        <path fill="#000" d="M9 7h1v1H9V7zm5 0h1v1h-1V7z"/>
        <path fill="#fff" d="M10 11h4v1h-4v-1z"/>
        <path fill="#080" d="M4 8h2v4H4V8zm14 0h2v4h-2V8z"/>
    </svg>`,
    // Robocop - Silver metallic armor and black visor
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <path fill="#99a" d="M7 2h10v4H7V2z"/>
        <path fill="#000" d="M7 4h10v1H7V4z"/>
        <path fill="#f00" d="M7 4h1v1H7V4z"/>
        <path fill="#fca" d="M9 5h6v1H9V5z"/>
        <path fill="#889" d="M5 6h14v16H5V6z"/>
        <path fill="#000" d="M11 10h2v2h-2v-2zm-2 8h6v1H9v-1z"/>
        <path fill="#778" d="M4 8h2v10H4V8zm14 0h2v10h-2V8z"/>
    </svg>`,
    // Alien (Xenomorph) - Sleek black elongated head
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <path fill="#111" d="M4 4h16v5H4V4zm10-2h4v2h-4V2z"/>
        <path fill="#222" d="M5 5h14v2H5V5z"/>
        <path fill="#000" d="M6 9h12v13H6V9z"/>
        <path fill="#555" d="M8 12h8v1H8v-1zm0 3h8v1H8v-1z"/>
        <path fill="#333" d="M20 5h2v6h-2V5z"/>
    </svg>`,
    // Predator - Masked with dreadlocks and glowing lasers
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <path fill="#543" d="M5 2h14v12H5V2z"/>
        <path fill="#111" d="M4 2h1v14H4V2zm15 0h1v14h-1V2zM6 14h12v4H6v-4z"/>
        <path fill="#999" d="M7 4h10v8H7V4z"/>
        <path fill="#000" d="M8 6h3v3H8V6zm5 0h3v3h-3V6z"/>
        <path fill="#f00" d="M14 7h1v1h-1V7z"/>
        <path fill="#876" d="M3 10h2v10H3V10zm16 0h2v10h-2V10z"/>
    </svg>`,
    // Darth Vader - Dark Lord's helmet and life support system
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <path fill="#000" d="M7 2h10v10H7V2z"/>
        <path fill="#111" d="M6 6h12v8H6V6zm-2 6h2v10H4V12zm16 0h2v10h-2V12z"/>
        <path fill="#222" d="M8 4h8v2H8V4z"/>
        <path fill="#555" d="M9 7h2v2H9V7zm4 0h2v2h-2V7z"/>
        <path fill="#000" d="M11 9h2v4h-2V9z"/>
        <path fill="#d00" d="M11 15h2v1h-2v-1z"/>
    </svg>`,
    // Chewbacca - Shaggy fur and rebel bandolier
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <path fill="#631" d="M7 2h10v20H7V2z"/>
        <path fill="#421" d="M6 4h12v16H6V4zm2-2h1v22H8V2zm7 0h1v22h-1V2z"/>
        <path fill="#000" d="M10 6h1v1h-1V6zm3 0h1v1h-1V6zM11 10h2v1h-2v-1z"/>
        <path fill="#888" d="M7 7l10 10v1L7 8z"/>
        <path fill="#fff" d="M8 8l1 1zm2 2l1 1zm2 2l1 1zm2 2l1 1z"/>
    </svg>`,
    // Spock - Iconic pointed ears and Starfleet blue
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <path fill="#0af" d="M6 12h12v10H6V12z"/>
        <path fill="#fca" d="M8 4h8v10H8V4zm-2 2h2v4H6V6zm10 0h2v4h-2V6z"/>
        <path fill="#000" d="M7 2h10v5H7V2zm3 6h1v1h-1V8zm3 0h1v1h-1V8z"/>
        <path fill="#fd0" d="M15 15h1v2h-1z"/>
        <path fill="#000" d="M8 12h8v2H8v-2z"/>
    </svg>`,
    // Indiana Jones - Fedors, stubble, and leather jacket
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <path fill="#642" d="M6 3h12v3H6V3zm-3 3h18v1H3V6z"/>
        <path fill="#fca" d="M8 7h8v8H8V7z"/>
        <path fill="#a86" d="M8 11h8v4H8v-4z" opacity="0.3"/>
        <path fill="#853" d="M6 15h12v8H6v-8z"/>
        <path fill="#000" d="M10 9h1v1h-1V9zm3 0h1v1h-1V9z"/>
        <path fill="#321" d="M18 16h2v6h-2v-6z"/>
    </svg>`,
    // Terminator (T-800) - Half-flesh, half-endo skeleton with red eye
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <path fill="#fca" d="M8 4h4v10H8V4z"/>
        <path fill="#99a" d="M12 4h4v10h-4V4z"/>
        <path fill="#000" d="M7 2h10v4H7V2zm3 6h1v2h-1V8zm3 0h1v2h-1V8z"/>
        <path fill="#f00" d="M13 8h1v1h-1V8z"/>
        <path fill="#333" d="M6 14h12v10H6V14z"/>
        <path fill="#778" d="M12 18h4v2h-4v-2z"/>
    </svg>`
];

const state = {
    names: [],
    mode: 'A', // 'A' or 'B'
    characters: [], // { id, name, revealed, eliminated, spriteIndex }
    canSelect: false,
    isShuffling: false
};

// DOM Elements
const nameListTextarea = document.getElementById('name-list');
const capsContainer = document.getElementById('caps-container');
const curtainMain = document.getElementById('curtain-main');
const statusAnnouncer = document.getElementById('status-announcer');
const gameContainer = document.getElementById('game-container');
const shuffleBtn = document.getElementById('shuffle-btn');
const newGameBtn = document.getElementById('new-game-btn');
const clearBtn = document.getElementById('clear-btn');
const modeRadios = document.querySelectorAll('input[name="game-mode"]');
const particleCanvas = document.getElementById('particle-canvas');
const ctx = particleCanvas.getContext('2d');

/**
 * Initialize the game
 */
function init() {
    loadState();
    setupEventListeners();
    renderCharacters();
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        renderCharacters();
    });
}

/**
 * Load state from localStorage
 */
function loadState() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) {
        const data = JSON.parse(saved);
        state.names = data.names || [];
        state.mode = data.mode || 'A';
        state.characters = data.characters || [];
        
        nameListTextarea.value = state.names.join('\n');
        const radio = document.querySelector(`input[name="game-mode"][value="${state.mode}"]`);
        if (radio) radio.checked = true;
    }
}

/**
 * Save state to localStorage
 */
function saveState() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
        names: state.names,
        mode: state.mode,
        characters: state.characters
    }));
}

/**
 * Setup UI event listeners
 */
function setupEventListeners() {
    nameListTextarea.addEventListener('input', saveNames);
    shuffleBtn.addEventListener('click', startShuffle);
    newGameBtn.addEventListener('click', startNewGame);
    clearBtn.addEventListener('click', clearEverything);

    modeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.mode = e.target.value;
            saveState();
        });
    });

    window.addEventListener('keydown', (e) => {
        if (document.activeElement === nameListTextarea) return;
        if (e.code === 'Space') {
            e.preventDefault();
            startShuffle();
        }
    });
}

/**
 * Parses textarea and saves names
 */
function saveNames() {
    const text = nameListTextarea.value;
    let newNames = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    
    if (newNames.length > 16) {
        newNames = newNames.slice(0, 16);
        announce('Maximum 16 stars allowed on stage!');
    }

    const oldIds = state.characters.map(c => c.id);
    state.names = newNames;
    state.characters = state.names.map((name, index) => {
        const existing = state.characters.find(c => c.name === name);
        
        // Use hash of name to pick a stable unique character
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = ((hash << 5) - hash) + name.charCodeAt(i);
            hash |= 0;
        }
        const stableSpriteIndex = Math.abs(hash) % CHARACTERS.length;
        
        return {
            id: existing ? existing.id : `char-${index}-${Date.now()}`,
            name: name,
            revealed: true,
            eliminated: false,
            spriteIndex: stableSpriteIndex
        };
    });

    state.canSelect = false;
    saveState();
    renderCharacters();
    
    // Trigger smoke bomb effect on newly added characters
    state.characters.forEach(char => {
        if (!oldIds.includes(char.id)) {
            setTimeout(() => triggerSmokeBombAtElement(char.id), 50);
        }
    });

    announce('Stars ready on stage!');
}

/**
 * Trigger smoke bomb effect
 */
function triggerSmokeBombAtElement(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 30; i++) {
        const smoke = document.createElement('div');
        smoke.className = 'smoke-particle';
        smoke.style.left = `${centerX + (Math.random() - 0.5) * 40}px`;
        smoke.style.top = `${centerY + (Math.random() - 0.5) * 40}px`;
        smoke.style.width = `${Math.random() * 20 + 20}px`;
        smoke.style.height = smoke.style.width;
        smoke.style.background = `rgba(200, 200, 200, ${Math.random() * 0.5 + 0.3})`;
        smoke.style.animationDelay = `${Math.random() * 0.2}s`;
        document.body.appendChild(smoke);
        setTimeout(() => smoke.remove(), 1000);
    }
}


/**
 * Clear all data
 */
function clearEverything() {
    if (confirm('Clear all stars?')) {
        state.names = [];
        state.characters = [];
        nameListTextarea.value = '';
        saveState();
        renderCharacters();
        announce('Theater cleared.');
    }
}

/**
 * Reset game
 */
function startNewGame() {
    state.characters.forEach(c => {
        c.revealed = true;
        c.eliminated = false;
    });
    state.canSelect = false;
    saveState();
    renderCharacters();
    announce('Welcome back to the show!');
}

/**
 * Render Characters
 */
function renderCharacters() {
    capsContainer.innerHTML = '';
    const active = state.characters.filter(c => !c.eliminated);
    
    active.forEach(charData => {
        const charBox = createCharacterElement(charData);
        capsContainer.appendChild(charBox);
    });
}

/**
 * Create Character DOM element
 */
function createCharacterElement(charData) {
    const box = document.createElement('div');
    box.className = `character-box ${charData.revealed ? 'revealed' : 'hidden'}`;
    box.id = charData.id;
    
    const sprite = document.createElement('div');
    sprite.className = 'character-sprite';
    sprite.innerHTML = charData.revealed ? (CHARACTERS[charData.spriteIndex] || CHARACTERS[0]) : MYSTERY_SHAPE;
    
    const nameBox = document.createElement('div');
    nameBox.className = 'character-name-box';
    nameBox.textContent = charData.name;
    
    box.appendChild(sprite);
    box.appendChild(nameBox);
    
    box.addEventListener('click', () => handleCharacterClick(charData));
    
    return box;
}

/**
 * Shuffle sequence
 */
function startShuffle() {
    if (state.isShuffling || state.characters.length === 0) return;
    
    state.isShuffling = true;
    state.canSelect = false;
    
    // Close Curtain
    curtainMain.classList.add('active');
    announce('The show is preparing...');

    setTimeout(() => {
        // SHUFFLE LOGIC
        // Randomize positions visually and hide them
        state.characters.forEach(c => {
            if (!c.eliminated) {
                c.revealed = false;
            }
        });
        
        // Randomize character array order
        state.characters.sort(() => Math.random() - 0.5);
        
        renderCharacters();
        gameContainer.classList.add('shake');
        
        setTimeout(() => {
            gameContainer.classList.remove('shake');
            curtainMain.classList.remove('active');
            
            setTimeout(() => {
                state.isShuffling = false;
                state.canSelect = true;
                announce('Pick your champion!');
            }, CONFIG.CURTAIN_DURATION);
        }, 300);
    }, CONFIG.CURTAIN_DURATION);
}

/**
 * Handle Character selection
 */
function handleCharacterClick(charData) {
    if (!state.canSelect || charData.revealed || charData.eliminated) return;

    charData.revealed = true;
    const el = document.getElementById(charData.id);
    const spriteEl = el.querySelector('.character-sprite');
    spriteEl.innerHTML = CHARACTERS[charData.spriteIndex] || CHARACTERS[0];
    
    el.classList.remove('hidden');
    el.classList.add('revealed');
    el.classList.add('blink');
    
    triggerSmokeBombAtElement(charData.id);
    
    announce(`Revealed: ${charData.name}!`);
    saveState();

    if (state.mode === 'A') {
        state.canSelect = false; // Only one reveal for Mode A
    } else {
        // Mode B logic (Elimination)
        setTimeout(() => {
            triggerPixelDust(el);
            charData.eliminated = true;
            saveState();
            
            setTimeout(() => {
                renderCharacters();
                checkModeBEnd();
            }, 500);
        }, 2000);
    }
}

function checkModeBEnd() {
    const remaining = state.characters.filter(c => !c.eliminated);
    if (remaining.length === 1) {
        const last = remaining[0];
        last.revealed = true;
        renderCharacters();
        announce(`THE STAR OF THE SHOW: ${last.name}!`);
        const el = document.getElementById(last.id);
        if (el) el.classList.add('blink');
    }
}

/**
 * Pixel Dust/Stars
 */
let particles = [];
function triggerPixelDust(el) {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: centerX,
            y: centerY,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12,
            size: Math.random() * 6 + 2,
            life: 1.0,
            color: CONFIG.mode === 'B' ? '#ff4444' : '#ffd700'
        });
    }
    
    if (particles.length === 40) {
        requestAnimationFrame(updateParticles);
    }
}

function updateParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.015;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    if (particles.length > 0) requestAnimationFrame(updateParticles);
}

function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}

function announce(msg) {
    statusAnnouncer.textContent = msg;
    console.log(`[Show] ${msg}`);
}

init();
