import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VisualizerPage from "./pages/VisualizerPage";
import RevisionPage from "./pages/RevisionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/visualizer" element={<VisualizerPage />} />
      <Route path="/revision" element={<RevisionPage />} />
    </Routes>
  );
}

export default App;
