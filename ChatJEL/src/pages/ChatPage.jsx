import React from 'react';
import ChatBox from '../components/ChatBox';
import '../styles/ChatUI.css';

export default function ChatPage() {
    return (
        <div className="chat-page">
        <header className="chat-header">
            <h1>ChatJEL</h1>
            <p>Tu asistente potenciado por inteligencia artificial</p>
        </header>

        <main className="chat-main">
            <ChatBox />
        </main>
        </div>
    );
}