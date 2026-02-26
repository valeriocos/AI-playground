# Theater Reveal React

A pixel-art, movie character reveal game built with React and Vite.

Live version available at https://ai-playground-eta-vert.vercel.app/

## Getting Started

To run this project locally, follow these steps:

### 1. Install Dependencies

Open your terminal in the project root and run:

```bash
npm install
```

### 2. Start the Development Server

Run the following command to start the app:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

## How to Play

1. **Enter Names**: Type the names of participants in the text area (one per line).
2. **Choose Mode**:
   - **First Wins**: The first character you reveal is the winner!
   - **Last Wins**: Eliminate characters one by one until only the star of the show remains.
3. **Shuffle**: Click the "SHUFFLE" button to hide the characters and randomize their positions.
4. **Reveal**: Click on the mystery boxes to reveal the movie characters.

## Features

- **Stable Grid**: Deleting names leaves empty slots, keeping the layout consistent.
- **Persistence**: Your list of names and game state are saved automatically to local storage.
- **Retro Aesthetic**: Pixel-art SVG characters, CRT effects, and "smoke bomb" reveal animations.
