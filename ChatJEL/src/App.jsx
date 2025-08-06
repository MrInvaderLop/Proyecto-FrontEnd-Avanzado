import { OllamaProvider } from './context/OllamaContext';
import ChatPage from './pages/ChatPage';

function App() {

  return (
    <OllamaProvider>
      <ChatPage />
    </OllamaProvider>
  );
}

export default App;
