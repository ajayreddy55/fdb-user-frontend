import { createContext, useContext, useEffect, useState } from "react";
import languageRegObject from "../languagesList";

const authLangContext = createContext();

export const AuthLangProviderFunction = ({ children }) => {
  const [language, setLanguage] = useState("ENG");
  const [languageDisplay, setLanguageDisplay] = useState(languageRegObject.ENG);
  const [fdbCsrfToken, setFdbCsrfToken] = useState("");

  //   useEffect(() => {
  //     getCsrfToken();
  //   }, []);

  //   const getCsrfToken = async () => {
  //     try {
  //       const url = "http://localhost:5020/fdb-csrf-token";
  //       const options = {
  //         method: "GET",
  //       };
  //       const serverResponse = await fetch(url, options);
  //       const serverResponseJson = await serverResponse.json();
  //       setFdbCsrfToken(serverResponseJson.csrfToken);
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };

  const changeTheLanguage = (value) => {
    setLanguage(value);
    setLanguageDisplay(languageRegObject[value]);
  };

  const authLangContextObject = {
    changeTheLanguage,
    language,
    languageDisplay,
    fdbCsrfToken,
  };

  return (
    <authLangContext.Provider value={authLangContextObject}>
      {children}
    </authLangContext.Provider>
  );
};

export const useAuthLang = () => {
  return useContext(authLangContext);
};
