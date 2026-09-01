import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VisualizerPage from "./pages/VisualizerPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/problems/:topicId/:problemId" element={<VisualizerPage />} />
      <Route path="/problems/:problemId" element={<VisualizerPage />} />
      <Route path="/visualizer" element={<VisualizerPage />} />
    </Routes>
  );
}

export default App;
