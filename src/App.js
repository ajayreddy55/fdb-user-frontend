import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignupPage from "./pages/signupPage";

const App = () => {
  return (
    <Routes>
      <Route exact path="/user-signup" element={<SignupPage />} />
    </Routes>
  );
};

export default App;
