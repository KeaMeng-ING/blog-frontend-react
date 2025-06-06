import "./App.css";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./components/layouts/root-layout.jsx";
import Login from "./components/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./components/Home.jsx";
import BlogForm from "./components/BlogForm.jsx";
import BlogDetail from "./components/BlogDetail.jsx";
import SignUp from "./components/SignUp.jsx";
import ProfileDetail from "./components/ProfileDetail.jsx";
import Setting from "./components/Setting.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile/:username"
              element={<ProfileDetail />}
            ></Route>
            <Route path="/settings" element={<Setting />}></Route>
          </Route>
          <Route path="/" element={<Home />}></Route>
        </Route>
        <Route path="/blog" element={<RootLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="create" element={<BlogForm />}></Route>
            <Route path=":slug" element={<BlogDetail />}></Route>
          </Route>
        </Route>
        <Route path="/sign-in" element={<Login />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
      </Routes>
    </>
  );
}

export default App;
