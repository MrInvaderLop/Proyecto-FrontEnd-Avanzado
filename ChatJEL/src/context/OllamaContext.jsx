// Estamos creando Contexto para manejar el estado del hook useOllamaHook con todos los componentes.
// Una buena práctica si pensamos crecer nuestro sitio en el futuro.


import { createContext, useState } from 'react';

export const OllamaContext = createContext();

export const OllamaProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);      // Historial completo del chat
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null);          // Estado de error

    const sendMessage = async (userPrompt) => {
        if (!userPrompt.trim()) return;

    // Añadir el mensaje del usuario al historial
    setMessages((prev) => [...prev, { role: 'user', content: userPrompt }]);
    setIsLoading(true);
    setError(null);

        try {
        const res = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            model: 'llama3',
            messages: [
                ...messages, // conversación previa
                { role: 'user', content: userPrompt }, // nuevo mensaje
            ],
            stream: true,
            }),
        });

        if (!res.ok || !res.body) {
            throw new Error('Respuesta inválida del modelo');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let partialBotResponse = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
            if (!line.trim()) continue;

            try {
                const parsed = JSON.parse(line);

                if (parsed.done) {
                partialBotResponse = '';
                return;
                }

                //Concatenamos los fragmentos recibidos del modelo en partialBotResponse
                if (parsed.message?.content) {
                partialBotResponse += parsed.message.content;

                setMessages((prev) => {
                    const last = prev[prev.length - 1];
                    // Si el último mensaje ya es del assistant, lo actualizamos
                    if (last?.role === 'assistant') {
                    return [
                        ...prev.slice(0, -1),
                        { role: 'assistant', content: partialBotResponse },
                    ];
                    }
                    // Si aún no hay respuesta del assistant, lo agregamos
                    return [...prev, { role: 'assistant', content: partialBotResponse }];
                });
                }

            } catch (err) {
                console.warn('❗ Error parseando JSON:', err, line);
            }
            }
        }
        } catch (err) {
        console.error('Error en streaming:', err);
        setError(err.message || 'Error inesperado');
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <OllamaContext.Provider
        value={{
            messages,
            isLoading,
            error,
            sendMessage,
        }}
        >
        {children}
        </OllamaContext.Provider>
    );
};

/* No introduciremos App.jsx, App,css, index.css ni main.jsx a esta carpeta */