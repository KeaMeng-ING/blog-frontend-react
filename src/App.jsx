import "./App.css";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./components/layouts/root-layout.jsx";
import Login from "./components/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./components/Home.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />}></Route>
          </Route>
        </Route>
        <Route path="/sign-in" element={<Login />}></Route>
      </Routes>
    </>
  );
}

export default App;
