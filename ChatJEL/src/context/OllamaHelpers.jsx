// Definir el contexto y un custom hook para usarlo fácilmente.

import { useContext } from 'react';
import { OllamaContext } from './OllamaContext';

const useOllama = () => {
    const context = useContext(OllamaContext);
    if (!context) {
        throw new Error('useOllama debe usarse dentro de un OllamaProvider');
    }
    return context;
};

export default useOllama;