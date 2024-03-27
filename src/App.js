import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignupPage from "./pages/signupPage";
import SignupVerifyPage from "./pages/signupVerifyPage/SignupVerifyPage";
import { AuthLangProviderFunction } from "./context/authLangContext";

const App = () => {
  return (
    <AuthLangProviderFunction>
      <Routes>
        <Route exact path="/user-signup" element={<SignupPage />} />
        <Route
          exact
          path="/user-email-verification/:token"
          element={<SignupVerifyPage />}
        />
      </Routes>
    </AuthLangProviderFunction>
  );
};

export default App;
