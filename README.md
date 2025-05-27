# 📅 React Calendar App with Drag-and-Drop

A simple calendar app built with React that supports drag-and-drop functionality for events.



 🔧 Setup Instructions

1. Clone the repository
git clone 
cd calendar-app
2. npm install
3. npm run dev
The app will run at:
👉 http://localhost:5173

⚠️ Special Instructions

Could not find "store" in the context of "Connect(Droppable)"
You should switch to @hello-pangea/dnd, which does not require Redux:

npm uninstall react-beautiful-dnd
npm install @hello-pangea/dnd
Update your imports:
// From:
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// To:
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
Do not use defaultProps on React.memo components. Instead, use default function parameters.

📁 Project Structure (Overview)
src/
├── components/Calendar/      # Calendar UI components
├── context/                  # Global event state using Context API
├── App.jsx
└── main.jsx



![sample_view](https://github.com/user-attachments/assets/9624f003-899f-4c40-9e50-5bba929131cc)





