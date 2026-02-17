import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPage from "./components/MenuPage";
import EditMenuPage from "./components/EditMenuPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MenuPage />} />
                <Route path="/edit" element={<EditMenuPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
