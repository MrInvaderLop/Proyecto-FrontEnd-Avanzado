// Necesitamos un un contenedor para mostrar los mensajes del usuario y del bot.

import React, { useContext, useEffect, useRef } from 'react';
import InputBar from './InputBar';
import Message from './Message';
import { OllamaContext } from '../context/OllamaContext';

export default function ChatBox() {
    const { messages, isLoading, sendMessage, error } = useContext(OllamaContext);
    const bottomRef = useRef(null); //Para el desplazamiento automático (ayuda con IA)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-box">
        <div className="chat-messages">
            {messages.map((msg, index) => (
            <Message
                key={index}
                text={msg.content}
                isBot={msg.role === 'assistant'}
            />
            ))}

            {error && (
            <div className="error-message">
                <p style={{ color: 'red' }}>{error}</p>
            </div>
            )}

            <div ref={bottomRef} />
        </div>

        <InputBar onSend={sendMessage} loading={isLoading} />
        </div>
    );
}