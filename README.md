# React Kanban Board

An interactive, React-based Kanban board where users can manage tasks across dynamic columns. Built using **React + Redux Toolkit + Tailwind CSS**, with full support for drag-and-drop, task filtering, and data persistence via `localStorage`.

## Features

- Add / Rename / Delete Columns
- Add / Edit / Delete Tasks
- View Task Details in Modal
- Add / Edit / Delete Task Comments
- Drag-and-Drop tasks across columns and reorder within a column
- Real-time Filtering by:
  - Priority (Single-select)
  - Type (Multi-select)
- All data persisted in `localStorage`

## Tech Stack

- **Framework**: React (Vite)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Persistence**: localStorage
- **Drag & Drop**: [@dnd-kit](https://github.com/clauderic/dnd-kit)

## Getting Started

1. Clone the Repository 
  ```bash
  git clone git@github.com:PallaviDule/react-kanban-board.git
  cd react-kanban-board
  ```
2. Install Dependencies
  ```bash
  npm install
  ```

3. Run the App Locally    
  ```bash
  npm run dev
  ```

The app will run at: [http://localhost:5173](http://localhost:5173)
