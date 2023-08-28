import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Game, Login } from "./screens";
import { MainLayout } from "./layouts";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="" element={<MainLayout />}>
          <Route path="" element={<Game />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        pauseOnFocusLoss={false}
        limit={3}
        theme="dark"
        style={{ width: "fit-content", minWidth: "20rem" }}
      />
    </>
  );
};

export default App;
