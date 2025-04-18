import "./App.css";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./components/layouts/root-layout.jsx";
import Login from "./components/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./components/Home.jsx";
import BlogForm from "./components/BlogForm.jsx";
import { BlogProvider } from "./context/BlogContext.jsx";
import BlogDetail from "./components/BlogDetail.jsx";
import ProfileDetail from "./components/ProfileDetail.jsx";

function App() {
  return (
    <>
      <BlogProvider>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route
                path="/profile/:username"
                element={<ProfileDetail />}
              ></Route>
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
        </Routes>
      </BlogProvider>
    </>
  );
}

export default App;
