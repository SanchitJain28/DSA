import { Routes, Route } from "react-router-dom";
import VisualizerPage from "./pages/VisualizerPage";
import RevisionPage from "./pages/RevisionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<VisualizerPage />} />
      <Route path="/revision" element={<RevisionPage />} />
    </Routes>
  );
}

export default App;
