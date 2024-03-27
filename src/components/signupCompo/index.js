import "./index.css";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IoEyeOff, IoEye } from "react-icons/io5";
import FDBLogo from "../../assets/images/dubaiFdblogo.png";
import { IoIosArrowDown } from "react-icons/io";
import countriesList from "../../countryCodes";
import "iconify-icon";
import { isValidPhoneNumber } from "libphonenumber-js";
import isEmail from "validator/lib/isEmail";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackPage from "../../pages/errorFallbackPage/ErrorFallbackPage";
import { useAuthLang } from "../../context/authLangContext";

const SignupCompo = () => {
  const [username, setUsername] = useState({
    name: "",
    nameRequiredText: "",
  });

  const [emailText, setEmailText] = useState({
    email: "",
    emailRequiredText: "",
  });

  const [phoneNumberText, setPhoneNumberText] = useState({
    phoneNumber: "",
    phoneNumberRequiredText: "",
  });

  const [passwordText, setPasswordText] = useState({
    password: "",
    passwordRequiredText: "",
  });

  const [confirmPasswordText, setConfirmPasswordText] = useState({
    password: "",
    passwordRequiredText: "",
  });

  const [serverResMsg, setServerResMsg] = useState({
    messageText: "",
    messageTextColor: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [displayPhoneCodesList, setDisplayPhoneCodesList] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    countriesList[102]
  );
  const [countryPhoneSearch, setCountryPhoneSearch] = useState("");
  const [isSignupButtonActive, setIsSignupButtonActive] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const { changeTheLanguage, language, languageDisplay, fdbCsrfToken } =
    useAuthLang();

  const filteredCountriesList = useMemo(() => {
    const newList = countriesList.filter((eachCountry) =>
      eachCountry.name.toLowerCase().includes(countryPhoneSearch.toLowerCase())
    );
    return newList;
  }, [countryPhoneSearch]);

  const changeTheUsername = (event) => {
    const usernameInput = event.target.value;

    setServerResMsg((prevState) => ({
      ...prevState,
      messageText: "",
      messageTextColor: "",
    }));

    if (usernameInput === "") {
      setUsername((prevState) => ({
        ...prevState,
        name: "",
        nameRequiredText: languageDisplay.username.msgReq,
      }));
    } else {
      setUsername((prevState) => ({
        ...prevState,
        name: usernameInput,
        nameRequiredText: "",
      }));
    }
  };

  const changeTheEmail = (event) => {
    const emailInput = event.target.value;

    setServerResMsg((prevState) => ({
      ...prevState,
      messageText: "",
      messageTextColor: "",
    }));

    if (emailInput === "") {
      setEmailText((prevState) => ({
        ...prevState,
        email: "",
        emailRequiredText: languageDisplay.email.msgReq,
      }));
    } else {
      if (isEmail(emailInput)) {
        setEmailText((prevState) => ({
          ...prevState,
          email: emailInput,
          emailRequiredText: "",
        }));
      } else {
        setEmailText((prevState) => ({
          ...prevState,
          email: emailInput,
          emailRequiredText: languageDisplay.email.msgInv,
        }));
      }
    }
  };

  const changeThePhoneNumber = (event) => {
    const phoneNumberInput = event.target.value;

    setServerResMsg((prevState) => ({
      ...prevState,
      messageText: "",
      messageTextColor: "",
    }));

    if (phoneNumberInput === "") {
      setPhoneNumberText((prevState) => ({
        ...prevState,
        phoneNumber: "",
        phoneNumberRequiredText: languageDisplay.phoneNumber.msgReq,
      }));
    } else {
      if (
        isValidPhoneNumber(`+${selectedCountryCode.phone}${phoneNumberInput}`)
      ) {
        setPhoneNumberText((prevState) => ({
          ...prevState,
          phoneNumber: phoneNumberInput,
          phoneNumberRequiredText: "",
        }));
      } else {
        setPhoneNumberText((prevState) => ({
          ...prevState,
          phoneNumber: phoneNumberInput,
          phoneNumberRequiredText: languageDisplay.phoneNumber.msgInv,
        }));
      }
    }
  };

  const changeThePassword = (event) => {
    const passwordInput = event.target.value;
    let passwordTest =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{6,12}$/;

    setServerResMsg((prevState) => ({
      ...prevState,
      messageText: "",
      messageTextColor: "",
    }));

    if (passwordInput === "") {
      setPasswordText((prevState) => ({
        ...prevState,
        password: "",
        passwordRequiredText: languageDisplay.password.msgReq,
      }));
    } else {
      if (!passwordTest.test(passwordText.password)) {
        setPasswordText((prevState) => ({
          ...prevState,
          password: passwordInput,
          passwordRequiredText: languageDisplay.password.msgInv,
        }));
      } else {
        setPasswordText((prevState) => ({
          ...prevState,
          password: passwordInput,
          passwordRequiredText: "",
        }));
      }
    }
  };

  const changeTheConfirmPassword = (event) => {
    const passwordInput = event.target.value;

    setServerResMsg((prevState) => ({
      ...prevState,
      messageText: "",
      messageTextColor: "",
    }));

    if (passwordInput === "") {
      setConfirmPasswordText((prevState) => ({
        ...prevState,
        password: "",
        passwordRequiredText: languageDisplay.confirmPassword.msgReq,
      }));
    } else {
      if (passwordText.password !== passwordInput) {
        setConfirmPasswordText((prevState) => ({
          ...prevState,
          password: passwordInput,
          passwordRequiredText: languageDisplay.confirmPassword.msgInv,
        }));
      } else {
        setConfirmPasswordText((prevState) => ({
          ...prevState,
          password: passwordInput,
          passwordRequiredText: "",
        }));
      }
    }
  };

  const registerTheUser = async () => {
    try {
      setIsSignupButtonActive(true);

      const url = "http://localhost:5020/auth/register-user";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username.name,
          email: emailText.email,
          phoneNumber: `+${selectedCountryCode.phone}-${phoneNumberText.phoneNumber}`,
          password: passwordText.password,
        }),
      };
      const serverRes = await fetch(url, options);
      const resJsonData = await serverRes.json();

      if (serverRes.status === 200) {
        setServerResMsg((prevState) => ({
          ...prevState,
          messageText: resJsonData.message,
          messageTextColor: "success-msg-color",
        }));
      } else {
        setServerResMsg((prevState) => ({
          ...prevState,
          messageText: resJsonData.message,
          messageTextColor: "",
        }));
      }
    } catch (error) {
      console.log(error.message);
      setServerResMsg((prevState) => ({
        ...prevState,
        messageText: error.message,
        messageTextColor: "",
      }));
    }
    setUsername((prevState) => ({
      ...prevState,
      name: "",
      nameRequiredText: "",
    }));
    setEmailText((prevState) => ({
      ...prevState,
      email: "",
      emailRequiredText: "",
    }));
    setPhoneNumberText((prevState) => ({
      ...prevState,
      phoneNumber: "",
      phoneNumberRequiredText: "",
    }));
    setPasswordText((prevState) => ({
      ...prevState,
      password: "",
      passwordRequiredText: "",
    }));
    setConfirmPasswordText((prevState) => ({
      ...prevState,
      password: "",
      passwordRequiredText: "",
    }));
    setSelectedCountryCode(countriesList[102]);
    setIsSignupButtonActive(false);
  };

  const validateFormData = () => {
    let passwordTest =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{6,12}$/;
    if (username.name === "") {
      setUsername((prevState) => ({
        ...prevState,
        name: "",
        nameRequiredText: languageDisplay.username.msgReq,
      }));
    } else if (emailText.email === "") {
      setEmailText((prevState) => ({
        ...prevState,
        email: "",
        emailRequiredText: languageDisplay.email.msgReq,
      }));
    } else if (!isEmail(emailText.email)) {
      setEmailText((prevState) => ({
        ...prevState,
        email: "",
        emailRequiredText: languageDisplay.email.msgInv,
      }));
    } else if (phoneNumberText.phoneNumber === "") {
      setPhoneNumberText((prevState) => ({
        ...prevState,
        phoneNumber: "",
        phoneNumberRequiredText: languageDisplay.phoneNumber.msgReq,
      }));
    } else if (
      !isValidPhoneNumber(
        `+${selectedCountryCode.phone}${phoneNumberText.phoneNumber}`
      )
    ) {
      setPhoneNumberText((prevState) => ({
        ...prevState,
        phoneNumber: "",
        phoneNumberRequiredText: languageDisplay.phoneNumber.msgInv,
      }));
    } else if (passwordText.password === "") {
      setPasswordText((prevState) => ({
        ...prevState,
        password: "",
        passwordRequiredText: languageDisplay.password.msgReq,
      }));
    } else if (confirmPasswordText.password === "") {
      setConfirmPasswordText((prevState) => ({
        ...prevState,
        password: "",
        passwordRequiredText: languageDisplay.confirmPassword.msgReq,
      }));
    } else if (!passwordTest.test(passwordText.password)) {
      setPasswordText((prevState) => ({
        ...prevState,
        passwordRequiredText: languageDisplay.password.msgInv,
      }));
    } else if (confirmPasswordText.password !== passwordText.password) {
      setConfirmPasswordText((prevState) => ({
        ...prevState,
        passwordRequiredText: languageDisplay.confirmPassword.msgInv,
      }));
    } else if (!isCheckboxChecked) {
      setServerResMsg((prevState) => ({
        ...prevState,
        messageText: languageDisplay.termsConditions.msgReq,
      }));
    } else {
      registerTheUser();
    }
  };

  const submitTheForm = (event) => {
    event.preventDefault();

    validateFormData();
  };

  const changeTheCheckboxStatus = (event) => {
    setServerResMsg((prevState) => ({
      ...prevState,
      messageText: "",
      messageTextColor: "",
    }));
    setIsCheckboxChecked(!isCheckboxChecked);
  };

  const changeTheCountrySearch = (event) => {
    setCountryPhoneSearch(event.target.value);
  };

  const changeLangInput = (event) => {
    if (event.target.value !== "") {
      changeTheLanguage(event.target.value);
      setUsername((prevState) => ({
        ...prevState,
        name: "",
        nameRequiredText: "",
      }));
      setEmailText((prevState) => ({
        ...prevState,
        email: "",
        emailRequiredText: "",
      }));
      setPhoneNumberText((prevState) => ({
        ...prevState,
        phoneNumber: "",
        phoneNumberRequiredText: "",
      }));
      setPasswordText((prevState) => ({
        ...prevState,
        password: "",
        passwordRequiredText: "",
      }));
      setConfirmPasswordText((prevState) => ({
        ...prevState,
        password: "",
        passwordRequiredText: "",
      }));
      setServerResMsg((prevState) => ({
        ...prevState,
        messageText: "",
        messageTextColor: "",
      }));
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackPage}>
      <div
        className="signup-form-card shadow"
        onClick={() => {
          setDisplayPhoneCodesList(false);
          setCountryPhoneSearch("");
        }}
      >
        <div className="signup-logo-image-container">
          <img className="signup-logo-image" src={FDBLogo} alt="website logo" />
          <p className="signup-logo-name">FindDubai</p>
        </div>
        <div className="signup-lang-select-container">
          <select
            className="signup-lang-select-ele"
            value={language}
            onChange={changeLangInput}
            aria-label="language select"
          >
            <option value={""} disabled aria-disabled={true}>
              Language
            </option>
            <option value={"ENG"}>English</option>
            <option value={"ARB"}>Arabic</option>
          </select>
        </div>
        <form className="signup-form-element" onSubmit={submitTheForm}>
          <div className="d-flex flex-column justify-content-center mt-2 mb-1">
            <label className="signup-label" htmlFor="signupUsername">
              {languageDisplay.username.label}
            </label>
            <input
              className="signup-input-ele"
              id="signupUsername"
              placeholder={languageDisplay.username.placeholder}
              type="text"
              value={username.name}
              onChange={changeTheUsername}
            />
            <p className="signup-required-text">{username.nameRequiredText}</p>
          </div>
          <div className="d-flex flex-column justify-content-center mt-1 mb-1">
            <label className="signup-label" htmlFor="signupEmail">
              {languageDisplay.email.label}
            </label>
            <input
              className="signup-input-ele"
              id="signupEmail"
              placeholder={languageDisplay.email.placeholder}
              type="text"
              value={emailText.email}
              onChange={changeTheEmail}
            />
            <p className="signup-required-text">
              {emailText.emailRequiredText}
            </p>
          </div>
          <div className="d-flex flex-column justify-content-center mt-1 mb-1">
            <label className="signup-label" htmlFor="signupPhoneNumber">
              {languageDisplay.phoneNumber.label}
            </label>
            <div className="signup-input-phone-number-container">
              <div
                className="signup-phone-number-select-ele"
                onClick={(event) => {
                  event.stopPropagation();
                  setDisplayPhoneCodesList(!displayPhoneCodesList);
                }}
              >
                <div className="d-flex align-items-center">
                  <iconify-icon
                    icon={`flag:${selectedCountryCode.code.toLowerCase()}-4x3`}
                  ></iconify-icon>

                  <span className="ms-2">+{selectedCountryCode.phone}</span>
                </div>
                <IoIosArrowDown
                  className={
                    displayPhoneCodesList
                      ? "signup-phone-select-arrow signup-phone-list-displayed"
                      : "signup-phone-select-arrow"
                  }
                />
              </div>
              <div
                className={displayPhoneCodesList ? "" : "d-none"}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="signup-select-options-container shadow">
                  <input
                    type="search"
                    placeholder="Search Country"
                    className="signup-phone-codes-search-input"
                    onChange={changeTheCountrySearch}
                    value={countryPhoneSearch}
                    name="SearchCountryCode"
                  />
                  <ul>
                    {filteredCountriesList.length !== 0 ? (
                      filteredCountriesList.map((eachCountry) => {
                        const changeTheCountryCodeObject = () => {
                          setSelectedCountryCode(eachCountry);
                          setDisplayPhoneCodesList(false);
                          setPhoneNumberText((prevState) => ({
                            ...prevState,
                            phoneNumber: "",
                            phoneNumberRequiredText: "",
                          }));
                          setCountryPhoneSearch("");
                        };

                        return (
                          <li
                            key={eachCountry.id}
                            onClick={changeTheCountryCodeObject}
                          >
                            <div className="signup-select-options-list-container">
                              <div className="d-flex align-items-center">
                                <iconify-icon
                                  icon={`flag:${eachCountry.code.toLowerCase()}-4x3`}
                                ></iconify-icon>
                                <span>{eachCountry.name}</span>
                              </div>
                              <span>+{eachCountry.phone}</span>
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <li>No Data Found</li>
                    )}
                  </ul>
                </div>
              </div>
              <input
                className="signup-phone-number-input-ele"
                id="signupPhoneNumber"
                placeholder={languageDisplay.phoneNumber.placeholder}
                type="tel"
                value={phoneNumberText.phoneNumber}
                onChange={changeThePhoneNumber}
              />
            </div>

            <p className="signup-required-text">
              {phoneNumberText.phoneNumberRequiredText}
            </p>
          </div>
          <div className="d-flex flex-column justify-content-center mt-1 mb-1">
            <label className="signup-label" htmlFor="signupPassword">
              {languageDisplay.password.label}
            </label>
            <div className="signup-input-password-container">
              <input
                className="signup-input-password-ele"
                id="signupPassword"
                placeholder={languageDisplay.password.placeholder}
                type={showPassword ? "text" : "password"}
                value={passwordText.password}
                onChange={changeThePassword}
              />
              <button
                className="signup-password-eye-icon-button"
                type="button"
                onClick={() => setShowPassword((prevState) => !prevState)}
              >
                {showPassword ? <IoEyeOff /> : <IoEye />}
              </button>
            </div>
            <p className="signup-required-text">
              {passwordText.passwordRequiredText}
            </p>
            <ul className="signup-password-points-list">
              <li>{languageDisplay.passwordIns.one}</li>
              <li>{languageDisplay.passwordIns.two}</li>
              <li>{languageDisplay.passwordIns.three}</li>
              <li>{languageDisplay.passwordIns.four}</li>
            </ul>
          </div>
          <div className="d-flex flex-column justify-content-center mt-1 mb-1">
            <label className="signup-label" htmlFor="signupConfirmPassword">
              {languageDisplay.confirmPassword.label}
            </label>
            <div className="signup-input-password-container">
              <input
                className="signup-input-password-ele"
                id="signupConfirmPassword"
                placeholder={languageDisplay.confirmPassword.placeholder}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPasswordText.password}
                onChange={changeTheConfirmPassword}
              />
              <button
                className="signup-password-eye-icon-button"
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prevState) => !prevState)
                }
              >
                {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
              </button>
            </div>
            <p className="signup-required-text">
              {confirmPasswordText.passwordRequiredText}
            </p>
          </div>
          <div className="signup-terms-conditions-container">
            <div className="d-flex align-items-center flex-wrap">
              <input
                name="checkboxTerms"
                type="checkbox"
                className="signup-terms-checkbox"
                onChange={changeTheCheckboxStatus}
              />
              <Link className="signup-terms-conditions-text">
                {languageDisplay.termsConditions.label}
              </Link>
            </div>
          </div>
          <div className="signup-submit-button-container">
            <button
              className={
                !isSignupButtonActive
                  ? "signup-submit-button"
                  : "signup-submit-button signup-submit-button-inactive"
              }
              type="submit"
              disabled={isSignupButtonActive}
            >
              {languageDisplay.signupButton}
            </button>
          </div>
          <p
            className={`signup-required-text ${serverResMsg.messageTextColor}`}
          >
            {serverResMsg.messageText}
          </p>
        </form>
        <div className="signup-already-have-account-container">
          <p className="signup-already-have-account-text">
            {languageDisplay.alreadyHave.label}{" "}
            <Link className="signup-already-have-account-link">
              {languageDisplay.alreadyHave.signinLink}
            </Link>
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SignupCompo;
