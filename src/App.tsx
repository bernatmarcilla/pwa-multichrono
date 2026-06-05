import { ChronoProvider } from './context/ChronoContext';
import HomeScreen from './screens/HomeScreen';

function App() {
  return (
    <ChronoProvider>
      <HomeScreen />
    </ChronoProvider>
  );
}

export default App;