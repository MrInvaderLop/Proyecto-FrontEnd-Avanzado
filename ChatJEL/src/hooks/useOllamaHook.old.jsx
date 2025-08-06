//CODIGO PROPUESTO POR LOS SENSEIS - HE USADO OllamaContext para poner este código

import { useState } from 'react';

export default function useOllamaHook() {
    const [response, setResponse] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


//La función que envía el mensaje del usuario a Ollama, procesa la respuesta y actualiza la UI
const handleSubmit = async (_prompt) => { {/* declara funcion flecha asíncrona que recibe _prompt como parametro*/}
    console.log('handleSubmit called with prompt:', _prompt); {/* Imprime _prompt recibido */}
    setLoading(true); {/* Cambia el estado de loading a true para luego configurar un indicador de carga en la UI */}
    setResponse(''); {/* Limpua el estado response para asegurar no mostrar respuestas anteriores */}
    setError(null); {/* Resetea el estado de error a nill, eliminando mensajes previos de error antes de procesar el nuevo prompt */}

/* Bloque de codigo try para manejar errores que ocurren durante la ejecución del código
Por ejemplo: 
- fetch: si el servidor Ollama no está corriendo, no hay conexión o la URL es incorrecta, arroja un error
- res.json(): si la respuesta no es un json valido, también arroja error
- Cualquier otro error inesperado dentro de este bloque de código
Si omitimos ponerlo en try el programa se detiene y no podríamos manejar el error de manera controlada*/
try {
    const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            model: 'deepseek-r1:1.5b',
            prompt: _prompt,
            max_tokens: 500,
            stream: true,
        }),
    });

    //Validación de la respuesta -  res.ok que la respuesta HTTP sea exitosa y res.body que exista un stream de respuesta.
    if (!res.ok || !res.body) {
        throw new Error('Respuesta inválida');
    }

    //Lectura del stream
    const reader = res.body.getReader(); //Obtiene un lector de streams para leer los datos de la respuesta poco a poco.
    const decoder = new TextDecoder('utf-8'); //Crea un decodificador para convertir los bytes en texto legible (utf-8).
    let buffer = ''; //Declara un string vacío para almacenar la respuesta recibida.

    while (true) {
        const { value, done} = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, {stream: true});

        //Procesa líneas completas
        const lines = buffer.split('\n'); //Divide el buffer acumulado en una array de lineas usando salto de linea \n como separador
        buffer = lines.pop(); /*Elimina y guarda la ultima linea en buffer nuevamente porque puede estar incompleta (no ha terminado 
                de llegar el JSON), así se asegura de no intentar parsear un JSON incompleto y causar error*/

        // Proceso para procesar línea por línea (objetos JSON) la resupuesta que llega del modelo de lenguaje.
        for(const line of lines) {
            if (!line.trim()) continue; //Ignora lineas vacías (espacios en blanco, saltos de linea, etc.)

            try {
                const parsed = JSON.parse(line); //Convertir la linea (string) en un objeto JSON
                if (parsed.done) {
                    console.log('🟢 FIN DE GENERACIÓN');
                    break;  //Si la línea indica que ya se terminó la generación (done: true), sale de la función.
                }
                if (parsed.response) {
                    setResponse((prev) => prev + parsed.response); //Si la línea contiene un fragmento de texto generado (response: "..."), se agrega al estado response concatenándolo con lo anterior.
                }
            } catch (err) { //Si la línea no era un JSON válido (por ejemplo, estaba incompleta), se muestra una advertencia en consola, pero el proceso no se detiene.
                console.warn( '❗ Error parseando línea JSON', err, line);
            }
        } 
    }
} catch (err) { //Captura cualquier error que haya ocurrido en cualquier parte del bloque try
    console.error('Error en streaming', err); //Después se imprime el error completo en consola para facilitar la depuración.
    setError(err.message || 'Error en streaming'); //Esto actualiza el estado error con el mensaje del error. Usa || para poner un mensaje por defecto si err.message está vacío o indefinido.
} finally { 
    setLoading(false); //Sirve para indicar que la carga terminó, ya sea porque hubo éxito o porque hubo error. Este bloque se ejecuta siempre, ocurra un error o no.
}
};

return { handleSubmit, response, error, loading };
}

//probar las direcciones del fetch y headers.*/