import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignupPage from "./pages/signupPage";
import SignupVerifyPage from "./pages/signupVerifyPage/SignupVerifyPage";

const App = () => {
  return (
    <Routes>
      <Route exact path="/user-signup" element={<SignupPage />} />
      <Route
        exact
        path="/user-email-verification/:token"
        element={<SignupVerifyPage />}
      />
    </Routes>
  );
};

export default App;
