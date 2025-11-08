import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TradingSimulator from './TradingSimulator';
import Homepage from './Homepage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/app" element={<TradingSimulator />} />
      </Routes>
    </Router>
  );
}

export default App;
