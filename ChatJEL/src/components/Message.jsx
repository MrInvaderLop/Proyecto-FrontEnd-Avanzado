// Representa un mensaje. Este componente recibirá sender y text.

import React from 'react';

export default function Message({ text, isBot }) {
    return (
        <div className={`message ${isBot ? 'bot' : 'user'}`}>
        <p>{text}</p>
        </div>
    );
}