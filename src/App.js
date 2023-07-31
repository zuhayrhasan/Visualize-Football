import { Route, Routes } from "react-router-dom";
import Page from './pages/page.js';
import './styles/app.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Page/>} />
      </Routes>
    </>
  );
}

export default App;