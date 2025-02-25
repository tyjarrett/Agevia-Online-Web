import React from "react";
import { useEffect, useState } from "react";
import { getUserGivenToken } from "../../functions/apiCalls";
import { useAuthWithoutToken } from "./AuthProvider";
import { AxiosError } from "axios";
//import * as SecureStore from "expo-secure-store";
import Cookies from "js-cookie";
import NavigationMenu from "../navigation/NavigationMenu";

import LoginPageStub from "./LoginPageStub";
import CreateUserScreen from "./CreateUserScreen";
import ResetScreen from "./ResetScreen";
import NavigationProvider from "../navigation/NavigationProvider";
import ResetToken from "./ResetToken";
import ResetPass from "./ResetPass";

const LoginOrApp = () => {
  const auth = useAuthWithoutToken();
  const [checkCreds, setCheckCreds] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [page, setPage] = useState("FirstScreen");
  const [passToken, setPassToken] = useState("");

  useEffect(() => {
    setIsAuthorized(false);
    if (!checkCreds) {
      return;
    }
    async function fetchCreds() {
      const token = Cookies.get("token");
      if (token) {
        auth.setAuthToken(token);
        getUserGivenToken(token)
          .then(({ data: user }) => {
            auth.setCurrentUser(user);
            setIsAuthorized(true);
            // setLoadingCreds(false);
          })
          .catch((err: AxiosError) => {
            // possibly invalid token, but should do more error validation
            console.log(err.message);
            // setLoadingCreds(false);
          });
      } else {
        console.log("no creds");
        // setLoadingCreds(false);
      }
      // setLoadingCreds(false);
      // should eventually remove all of these console logs
    }
    fetchCreds();
    setCheckCreds(false);
  }, [checkCreds, auth.clearIndicator]);

  return (
    <>
      {isAuthorized && auth.authToken ? (
        <NavigationProvider>
          <NavigationMenu />
        </NavigationProvider>
      ) : page == "LoginPageStub" ? (
        <LoginPageStub setCheckCreds={setCheckCreds} setPage={setPage} />
      ) : page == "CreateUserScreen" ? (
        <CreateUserScreen setCheckCreds={setCheckCreds} setPage={setPage} />
      ) : page == "Reset" ? (
        <ResetScreen setPage={setPage} />
      ) : page == "ResetRequest" ? (
        <ResetToken setPage={setPage} setPassToken={setPassToken} />
      ) : page == "ResetPass" ? (
        <ResetPass setPage={setPage} passtoken={passToken} />
      ) : (
        <LoginPageStub setCheckCreds={setCheckCreds} setPage={setPage} />
      )}
    </>
  );
};

export default LoginOrApp;
