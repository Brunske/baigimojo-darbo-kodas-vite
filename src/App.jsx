import { createBrowserRouter, Route, NavLink, createRoutesFromElements, RouterProvider } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

//pages
import Main from "./pages/Home/Main.jsx";
import Login from "./pages/Login/LoginForm.jsx";
import SignUp from "./pages/Signup/SignUpForm.jsx";

//Layouts
import LevelLayout from "./layouts/LevelLayout";
import MainLayout from "./layouts/MainLayout"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Main />} />


      <Route path="/">
        <Route path="signup" element={<SignUp />}></Route>
        <Route path="login" element={<Login />}></Route>
      </Route>
    </Route>
  )
)

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
