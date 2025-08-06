import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/ChatUI.css';
import { OllamaProvider } from './context/OllamaContext';
import ChatPage from './pages/ChatPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OllamaProvider>
      <ChatPage />
    </OllamaProvider>
  </React.StrictMode>
);