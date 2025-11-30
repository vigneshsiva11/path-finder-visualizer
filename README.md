# Path-Finding Algorithm Visualizer

A fully interactive and responsive web application to visualize various pathfinding algorithms and maze generation techniques. Built with React, TypeScript, and Vite, this tool helps users understand how different algorithms navigate through a grid to find the shortest path between two points.

## 🚀 Features

### Pathfinding Algorithms

Visualize the following algorithms in action:

- **Dijkstra's Algorithm**: The father of pathfinding algorithms; guarantees the shortest path.
- **A\* Search**: A smart algorithm that uses heuristics to find the shortest path faster than Dijkstra.
- **Breadth-First Search (BFS)**: Explores all neighbor nodes at the present depth prior to moving on to the nodes at the next depth level. Guarantees the shortest path in unweighted graphs.
- **Depth-First Search (DFS)**: Explores as far as possible along each branch before backtracking. Does not guarantee the shortest path.

### Maze Generation

Automatically generate complex mazes to test the algorithms:

- **Random Maze**: Randomly places walls across the grid.
- **Recursive Division**: Creates a maze by recursively dividing the grid with walls.
- **Vertical Maze**: Generates vertical walls with gaps.
- **Horizontal Maze**: Generates horizontal walls with gaps.
- **Spiral Maze**: Creates a spiral pattern of walls.

### Interactive Grid

- **Drag & Drop**: Move the Start (Green) and End (Red) nodes to any position.
- **Draw Walls**: Click and drag on the grid to create your own obstacles.
- **Responsive Design**: Works on different screen sizes.

### Advanced Features

- **Comparison Mode**: Run two different algorithms side-by-side on the same maze to directly compare their performance and pathfinding logic.
- **Real-Time Analytics**: View detailed charts and graphs displaying metrics like visited nodes, path length, and execution time to determine the most efficient algorithm.
- **Playback Controls**:
  - **Pause & Play**: Control the flow of the visualization at any moment.
  - **Rewind & Scrub**: Use the timeline slider to rewind the visualization and see exactly how the algorithm explored the grid at any specific point in time.

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://react.dev/) (v18)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/) for analytics visualization.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v18 or higher recommended)
- **npm** (usually comes with Node.js)

## 📥 Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/path-finding-visualizer.git
    cd path-finding-visualizer
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

## ▶️ Running the Application

To start the development server and run the application locally:

```bash
npm run dev
```

After running the command, open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal, e.g., `http://localhost:3000`).

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory. You can then preview the production build locally using:

```bash
npm run preview
```

## 🧪 Running Tests

_Note: Currently, there are no automated tests configured for this project. Contributions to add testing (e.g., using Vitest or Jest) are welcome!_

## 📖 Usage Guide

1.  **Select an Algorithm**: Use the controls to choose a pathfinding algorithm (e.g., Dijkstra, A\*).
2.  **Generate a Maze (Optional)**: Select a maze pattern to automatically fill the grid with walls.
3.  **Draw Walls**: Click and drag on empty grid cells to draw walls manually. Click on a wall to remove it.
4.  **Move Nodes**: Drag the **Start Node** (Green) or **End Node** (Red) to your desired locations.
5.  **Visualize**: Click the "Visualize" button to start the animation.
6.  **Clear**: Use the "Clear Board" or "Clear Path" buttons to reset the grid.

## 📂 Project Structure

```
src/
├── components/        # React components (Grid, Controls, Analytics, etc.)
├── guidelines/        # Project guidelines and documentation
├── styles/            # Global styles and CSS
├── types/             # TypeScript type definitions
├── utils/             # Algorithm implementations and helper functions
│   ├── maze-generators.ts       # Maze generation logic
│   └── pathfinding-algorithms.ts # Pathfinding algorithm logic
├── App.tsx            # Main application component
└── main.tsx           # Entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
