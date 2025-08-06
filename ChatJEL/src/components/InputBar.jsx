// Campo donde el usuario introducirá su texto

import React, { useState } from 'react';

export default function InputBar({ onSend, loading }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        onSend(input);
        setInput('');
    };

    return (
        <form className="input-bar" onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
            {loading ? 'Enviando...' : 'Enviar'}
        </button>
        </form>
    );
}