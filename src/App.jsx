import React, { useState, useEffect, useCallback, useRef } from 'react';

const CONFIG = {
    SHAKE_DURATION: 300,
    CURTAIN_DURATION: 800,
    STORAGE_KEY: 'theater_reveal_state_react'
};

const MYSTERY_SHAPE = (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
        <path fill="#f80" d="M2 2h12v12H2z"/><path fill="#000" d="M3 3h10v10H3z"/><path fill="#f80" d="M4 4h8v8H4z"/><path fill="#000" d="M7 10h2v1H7zm1-5h1v1H8zm-1 1h2v3H7zM6 6h1v1H6zm4 0h1v1h-1z"/><path fill="#fff" d="M3 3h1v1H3zm10 0h1v1h-1zm0 10h1v1h-1zm-10 0h1v1H3z"/>
    </svg>
);

const CHARACTERS_SVG = [
    // Pennywise (It)
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#f80" d="M7 4h10v2h2v4h-2v2H7v-2H5V6h2V4z"/><path fill="#fff" d="M8 6h8v10H8V6zm-2 2h2v6H6V8zm10 0h2v6h-2V8z"/><path fill="#f00" d="M9 7h1v4H9V7zm5 0h1v4h-1V7zm-3 7h2v1h-2v-1zM7 11h1v1H7v-1zm9 0h1v1h-1v-1z"/><path fill="#000" d="M9 8h1v1H9V8zm5 0h1v1h-1V8z"/><path fill="#aaa" d="M9 16h6v2H9v-2z"/></svg>`,
    // Freddy Krueger
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#421" d="M6 4h12v2H6V4zm-2 2h16v1H4V6z"/><path fill="#ca8" d="M8 7h8v5H8V7z"/><path fill="#141" d="M5 12h14v10H5V12z"/><path fill="#811" d="M5 13h14v1H5v-1zm0 3h14v1H5v-1zm0 3h14v1H5v-1z"/><path fill="#777" d="M16 14h2v6h-2v-6zm3 1h1v4h-1v-4z"/><path fill="#000" d="M9 9h1v1H9V9zm5 0h1v1h-1V9z"/></svg>`,
    // Super Mario
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#f00" d="M8 2h8v1H7v1H6v2h12V3h-1V2h2v5H5V4h1V3h2V2z"/><path fill="#fca" d="M8 6h9v6H8V6zM7 8h1v3H7V8zm10 0h1v3h-1V8z"/><path fill="#421" d="M12 9h4v1h-4V9zm-2 0h1v1h-1V9zM7 7h10v1H7V7z"/><path fill="#04b" d="M7 12h10v8H7v-8z"/><path fill="#fd0" d="M8 14h2v2H8v-2zm6 0h2v2h-2v-2z"/><path fill="#840" d="M6 18h2v4H6v-4zm10 0h2v4h-2v-4z"/></svg>`,
    // Superman
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#e00" d="M4 4h2v16H4V4zm14 0h2v16h-2V4z"/><path fill="#04b" d="M6 4h12v14H6V4z"/><path fill="#fd0" d="M9 7h6v6H9V7z"/><path fill="#e00" d="M10 8l4 2-4 2V8z"/><path fill="#fca" d="M8 0h8v4H8V0z"/><path fill="#000" d="M9 1h1v1H9V1zm5 0h1v1h-1V1z"/></svg>`,
    // Batman
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#111" d="M8 1h1v3H8V1zm7 0h1v3h-1V1zM8 3h8v6H8V3z"/><path fill="#fca" d="M9 7h6v2H9V7z"/><path fill="#111" d="M10 7h1v1h-1V7zm3 0h1v1h-1V7z"/><path fill="#333" d="M6 9h12v12H6V9z"/><path fill="#fd0" d="M7 16h10v1H7v-1z"/><path fill="#000" d="M10 16h1v1h-1v-1zm3 0h1v1h-1v-1z"/></svg>`,
    // Hulk
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#000" d="M8 2h8v3H8V2z"/><path fill="#0a0" d="M4 5h16v10H4V5z"/><path fill="#60a" d="M4 15h16v7H4v-7z"/><path fill="#000" d="M9 7h1v1H9V7zm5 0h1v1h-1V7z"/><path fill="#fff" d="M10 11h4v1h-4v-1z"/><path fill="#080" d="M4 8h2v4H4V8zm14 0h2v4h-2V8z"/></svg>`,
    // Robocop
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#99a" d="M7 2h10v4H7V2z"/><path fill="#000" d="M7 4h10v1H7V4z"/><path fill="#f00" d="M7 4h1v1H7V4z"/><path fill="#fca" d="M9 5h6v1H9V5z"/><path fill="#889" d="M5 6h14v16H5V6z"/><path fill="#000" d="M11 10h2v2h-2v-2zm-2 8h6v1H9v-1z"/><path fill="#778" d="M4 8h2v10H4V8zm14 0h2v10h-2V8z"/></svg>`,
    // Alien (Xenomorph)
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#111" d="M4 4h16v5H4V4zm10-2h4v2h-4V2z"/><path fill="#222" d="M5 5h14v2H5V5z"/><path fill="#000" d="M6 9h12v13H6V9z"/><path fill="#555" d="M8 12h8v1H8v-1zm0 3h8v1H8v-1z"/><path fill="#333" d="M20 5h2v6h-2V5z"/></svg>`,
    // Predator
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#543" d="M5 2h14v12H5V2z"/><path fill="#111" d="M4 2h1v14H4V2zm15 0h1v14h-1V2zM6 14h12v4H6v-4z"/><path fill="#999" d="M7 4h10v8H7V4z"/><path fill="#000" d="M8 6h3v3H8V6zm5 0h3v3h-3V6z"/><path fill="#f00" d="M14 7h1v1h-1V7z"/><path fill="#876" d="M3 10h2v10H3V10zm16 0h2v10h-2V10z"/></svg>`,
    // Darth Vader
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#000" d="M7 2h10v10H7V2z"/><path fill="#111" d="M6 6h12v8H6V6zm-2 6h2v10H4V12zm16 0h2v10h-2V12z"/><path fill="#222" d="M8 4h8v2H8V4z"/><path fill="#555" d="M9 7h2v2H9V7zm4 0h2v2h-2V7z"/><path fill="#000" d="M11 9h2v4h-2V9z"/><path fill="#d00" d="M11 15h2v1h-2v-1z"/></svg>`,
    // Chewbacca
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#631" d="M7 2h10v20H7V2z"/><path fill="#421" d="M6 4h12v16H6V4zm2-2h1v22H8V2zm7 0h1v22h-1V2z"/><path fill="#000" d="M10 6h1v1h-1V6zm3 0h1v1h-1V6zM11 10h2v1h-2v-1z"/><path fill="#888" d="M7 7l10 10v1L7 8z"/><path fill="#fff" d="M8 8l1 1zm2 2l1 1zm2 2l1 1zm2 2l1 1z"/></svg>`,
    // Spock
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#0af" d="M6 12h12v10H6V12z"/><path fill="#fca" d="M8 4h8v10H8V4zm-2 2h2v4H6V6zm10 0h2v4h-2V6z"/><path fill="#000" d="M7 2h10v5H7V2zm3 6h1v1h-1V8zm3 0h1v1h-1V8z"/><path fill="#fd0" d="M15 15h1v2h-1z"/><path fill="#000" d="M8 12h8v2H8v-2z"/></svg>`,
    // Indiana Jones
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#642" d="M6 3h12v3H6V3zm-3 3h18v1H3V6z"/><path fill="#fca" d="M8 7h8v8H8V7z"/><path fill="#a86" d="M8 11h8v4H8v-4z" opacity="0.3"/><path fill="#853" d="M6 15h12v8H6v-8z"/><path fill="#000" d="M10 9h1v1h-1V9zm3 0h1v1h-1V9z"/><path fill="#321" d="M18 16h2v6h-2v-6z"/></svg>`,
    // Terminator (T-800)
    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><path fill="#fca" d="M8 4h4v10H8V4z"/><path fill="#99a" d="M12 4h4v10h-4V4z"/><path fill="#000" d="M7 2h10v4H7V2zm3 6h1v2h-1V8zm3 0h1v2h-1V8z"/><path fill="#f00" d="M13 8h1v1h-1V8z"/><path fill="#333" d="M6 14h12v10H6V14z"/><path fill="#778" d="M12 18h4v2h-4v-2z"/></svg>`
];

const SmokeBomb = ({ x, y }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: x + (Math.random() - 0.5) * 40,
            top: y + (Math.random() - 0.5) * 40,
            size: Math.random() * 20 + 20,
            background: `rgba(200, 200, 200, ${Math.random() * 0.5 + 0.3})`,
            delay: Math.random() * 0.2
        }));
        setParticles(newParticles);
        const timer = setTimeout(() => setParticles([]), 1000);
        return () => clearTimeout(timer);
    }, [x, y]);

    return (
        <>
            {particles.map(p => (
                <div
                    key={p.id}
                    className="smoke-particle"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        background: p.background,
                        animationDelay: `${p.delay}s`
                    }}
                />
            ))}
        </>
    );
};

const CharacterBox = ({ char, onReveal, canSelect }) => {
    const spriteRef = useRef(null);
    const [smokePos, setSmokePos] = useState(null);

    const handleClick = () => {
        if (!canSelect || char.revealed || char.eliminated) return;
        const rect = spriteRef.current.getBoundingClientRect();
        setSmokePos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        onReveal(char.id);
    };

    return (
        <div 
            id={char.id}
            className={`character-box ${char.revealed ? 'revealed' : 'hidden'} ${char.blinking ? 'blink' : ''}`}
            onClick={handleClick}
            ref={spriteRef}
        >
            <div className="character-sprite">
                {char.revealed ? (
                    <div dangerouslySetInnerHTML={{ __html: CHARACTERS_SVG[char.spriteIndex] }} />
                ) : (
                    MYSTERY_SHAPE
                )}
            </div>
            <div className="character-name-box">{char.name}</div>
            {smokePos && <SmokeBomb x={smokePos.x} y={smokePos.y} />}
        </div>
    );
};

const ParticleCanvas = ({ particles }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.current = particles.current.filter(p => p.life > 0);
            particles.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.015;
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.fillRect(p.x, p.y, p.size, p.size);
            });
            if (particles.current.length > 0) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        if (particles.current.length > 0) {
            animationFrameId = requestAnimationFrame(render);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [particles.current.length]);

    useEffect(() => {
        const handleResize = () => {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas id="particle-canvas" ref={canvasRef} />;
};

function App() {
    const [names, setNames] = useState('');
    const [mode, setMode] = useState('A');
    const [characters, setCharacters] = useState([]);
    const [canSelect, setCanSelect] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const [status, setStatus] = useState('Stars ready on stage!');
    const particlesRef = useRef([]);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            setNames(data.names.join('\n'));
            setMode(data.mode);
            setCharacters(data.characters);
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
            names: names.split('\n').filter(s => s.trim().length > 0),
            mode,
            characters
        }));
    }, [names, mode, characters]);

    const announce = (msg) => {
        setStatus(msg);
        console.log(`[Show] ${msg}`);
    };

    const handleNamesChange = (e) => {
        const text = e.target.value;
        setNames(text);
        
        let newNames = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
        if (newNames.length > 16) {
            newNames = newNames.slice(0, 16);
            announce('Maximum 16 stars allowed on stage!');
        }

        const newChars = newNames.map((name, index) => {
            const existing = characters.find(c => c.name === name);
            
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = ((hash << 5) - hash) + name.charCodeAt(i);
                hash |= 0;
            }
            const spriteIndex = Math.abs(hash) % CHARACTERS_SVG.length;

            return {
                id: existing ? existing.id : `char-${index}-${Date.now()}`,
                name,
                revealed: true,
                eliminated: false,
                spriteIndex,
                blinking: false
            };
        });

        setCharacters(newChars);
        setCanSelect(false);
        announce('Stars ready on stage!');
    };

    const startShuffle = () => {
        if (isShuffling || characters.length === 0) return;
        
        setIsShuffling(true);
        setCanSelect(false);
        announce('The show is preparing...');

        setTimeout(() => {
            setCharacters(prev => {
                const updated = prev.map(c => ({
                    ...c,
                    revealed: c.eliminated ? c.revealed : false,
                    blinking: false
                }));
                return [...updated].sort(() => Math.random() - 0.5);
            });
            
            setTimeout(() => {
                setIsShuffling(false);
                setCanSelect(true);
                announce('Pick your champion!');
            }, CONFIG.CURTAIN_DURATION + 300);
        }, CONFIG.CURTAIN_DURATION);
    };

    const triggerPixelDust = (charId) => {
        const el = document.getElementById(charId);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 40; i++) {
            particlesRef.current.push({
                x: centerX,
                y: centerY,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                size: Math.random() * 6 + 2,
                life: 1.0,
                color: mode === 'B' ? '#ff4444' : '#ffd700'
            });
        }
    };

    const handleReveal = (id) => {
        setCharacters(prev => {
            const updated = prev.map(c => 
                c.id === id ? { ...c, revealed: true, blinking: true } : c
            );
            return updated;
        });

        const char = characters.find(c => c.id === id);
        announce(`Revealed: ${char.name}!`);

        if (mode === 'A') {
            setCanSelect(false);
        } else {
            // Mode B Elimination
            setTimeout(() => {
                triggerPixelDust(id);
                setCharacters(prev => {
                    const updated = prev.map(c => 
                        c.id === id ? { ...c, eliminated: true, blinking: false } : c
                    );
                    const remaining = updated.filter(c => !c.eliminated);
                    if (remaining.length === 1) {
                        return updated.map(c => c.id === remaining[0].id ? { ...c, revealed: true, blinking: true } : c);
                    }
                    return updated;
                });

                setTimeout(() => {
                    const remaining = characters.filter(c => !c.eliminated && c.id !== id);
                    if (remaining.length === 1) {
                        announce(`THE STAR OF THE SHOW: ${remaining[0].name}!`);
                    }
                }, 500);
            }, 2000);
        }
    };

    const startNewGame = () => {
        setCharacters(prev => prev.map(c => ({
            ...c,
            revealed: true,
            eliminated: false,
            blinking: false
        })));
        setCanSelect(false);
        announce('Welcome back to the show!');
    };

    const clearEverything = () => {
        if (window.confirm('Clear all stars?')) {
            setNames('');
            setCharacters([]);
            announce('Theater cleared.');
        }
    };

    return (
        <div id="game-container" className={isShuffling ? 'shake' : ''}>
            <div className="crt-overlay"></div>

            <header>
                <h1 className="pixel-text">THEATER REVEAL</h1>
                <p className="pixel-subtitle">"Enter names, reveal the stars!"</p>
            </header>

            <main id="table-area">
                <div className="curtain-side curtain-left"></div>
                <div className="curtain-side curtain-right"></div>
                <div id="curtain-main" className={isShuffling ? 'active' : ''}></div>
                <div id="table">
                    <div id="caps-container">
                        {characters.filter(c => !c.eliminated).map(char => (
                            <CharacterBox 
                                key={char.id} 
                                char={char} 
                                onReveal={handleReveal}
                                canSelect={canSelect}
                            />
                        ))}
                    </div>
                </div>
            </main>

            <aside id="control-panel" className="pixel-border">
                <div className="input-group">
                    <label htmlFor="name-list" className="pixel-label">ENTER NAMES (one per line):</label>
                    <textarea 
                        id="name-list" 
                        value={names}
                        onChange={handleNamesChange}
                        placeholder="John Doe&#10;Jane Smith&#10;..."
                    />
                </div>

                <div className="mode-selector pixel-border">
                    <span className="pixel-label">WIN CONDITION:</span>
                    <div className="radio-group">
                        <label>
                            <input 
                                type="radio" 
                                name="game-mode" 
                                value="A" 
                                checked={mode === 'A'} 
                                onChange={(e) => setMode(e.target.value)}
                            />
                            <span>FIRST WINS</span>
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="game-mode" 
                                value="B" 
                                checked={mode === 'B'} 
                                onChange={(e) => setMode(e.target.value)}
                            />
                            <span>LAST WINS</span>
                        </label>
                    </div>
                </div>

                <div className="actions">
                    <button className="pixel-btn important" onClick={startShuffle}>SHUFFLE</button>
                    <button className="pixel-btn" onClick={startNewGame}>NEW GAME</button>
                    <button className="pixel-btn danger" onClick={clearEverything}>CLEAR ALL</button>
                </div>
                <div style={{fontSize: '0.6rem', color: '#888', textAlign: 'center'}}>{status}</div>
            </aside>

            <ParticleCanvas particles={particlesRef} />
            <div id="status-announcer" className="sr-only" aria-live="polite">{status}</div>
        </div>
    );
}

export default App;
