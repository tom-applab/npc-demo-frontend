import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createStore } from "botframework-webchat";
import classNames from "classnames";
import WebChat from "./WebChat";
import { checkTokenExpirationDate, createToken } from "./utils/tokenDefs";
import Step1 from "./stepsInfo/Step1";
import Step2 from "./stepsInfo/Step2";
import Step3 from "./stepsInfo/Step3";
import "./utils/fabric-icons-inline.css";
import "./MinimizableWebChat.scss";
import { useTheme } from "react-hook-theme";
// import ChatImg from "../../assets/images/botaina_n.png";
import ChatImg from "../../assets/images/npc-logo-white.svg";
const USR_BOT_TKN = "USR_BOT_TKN";

const MinimizableWebChat = ({ isHomePage = false }) => {
  // const location = window.location.href;
  // const splitedUrl = location.split("/");
  // const lang = splitedUrl.includes("ar") ? "ar" : "en";
  const lang = 'ar'

  const { theme } = useTheme();
  const darkMode = theme === "";

  useEffect(() => {
    return () => {
      localStorage.removeItem(USR_BOT_TKN);
      setToken(null);
    };
  }, [lang]);

  const store = useMemo(
    () =>
      createStore({}, ({ dispatch }) => (next) => (action) => {
        if (action.type === "DIRECT_LINE/CONNECT_FULFILLED") {
          dispatch({
            type: "WEB_CHAT/SEND_EVENT",
            payload: {
              name: "webchat/join",
              value: {
                language: lang,
              },
            },
          });
        } else if (action.type === "DIRECT_LINE/INCOMING_ACTIVITY") {
          if (action.payload.activity.from.role === "bot") {
            setNewMessage(true);
          }
        }

        return next(action);
      }),
    [lang]
  );

  const [loaded, setLoaded] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const [newMessage, setNewMessage] = useState(false);
  const [token, setToken] = useState();
  const [hidden, setHidden] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const handleFetchToken = useCallback(async () => {
    if (!token) {
      const userToken = localStorage.getItem(USR_BOT_TKN);
      const isValidToken = checkTokenExpirationDate(userToken);
      if (userToken && isValidToken) {
        return setToken(userToken);
      } else {
        const res = await fetch(createToken().uriGenerateToken, createToken().params);
        const { token } = await res.json();
        localStorage.setItem(USR_BOT_TKN, token);
        setToken(token);
      }
    }
  }, [setToken, token]);

  const handleHiddenButtonClick = useCallback(
    async (event) => {
      setHidden(false);
      setTimeout(() => {
        handleMaximizeButtonClick();
      }, 1000);
    },
    [setHidden]
  );

  const handleMaximizeButtonClick = useCallback(
    async (event) => {
      setLoaded(true);
      setMinimized(false);
      setNewMessage(false);
    },
    [setMinimized, setNewMessage]
  );

  const handleMinimizeButtonClick = useCallback(() => {
    setHidden(true);
    setMinimized(true);
    setNewMessage(false);
  }, [setMinimized, setNewMessage, setHidden]);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 767;

  const minimizeButton = () => {
    if (isMobile && hidden) {
      handleHiddenButtonClick();
    } else if (minimized) {
      handleMaximizeButtonClick();
    } else {
      handleMinimizeButtonClick();
    }
  };

  const steps = [
    // <Step1 changeStep={setCurrentStep} darkMode={darkMode} lang={lang} />,
    // <Step2 changeStep={setCurrentStep} darkMode={darkMode} lang={lang} />,
    // <Step3 changeStep={setCurrentStep} darkMode={darkMode} lang={lang} />,
    <WebChat
      className="react-web-chat"
      onFetchToken={handleFetchToken}
      store={store}
      token={token}
      lang={lang}
      darkMode={darkMode}
    />,
  ];

  return (
    <>
      <div className="minimizable-web-chat">
        {minimized && (
          <button
            id="chatBtn"
            className={classNames(
              lang === "ar" ? "maximize left" : "maximize right",
              minimized ? "" : "close",
              isMobile && hidden ? "animate" : "",
              darkMode ? "darkBtn" : ""
            )}
            onClick={
              isMobile && hidden
                ? handleHiddenButtonClick
                : minimized
                ? handleMaximizeButtonClick
                : handleMinimizeButtonClick
            }
          >
            <span>{lang == "en" ? "Chat" : "محادثة"}</span>
            <img
              src={ChatImg}
              className="chat_header"
              width={45}
              height={45}
              placeholder="blurred"
              formats={["auto", "webp", "avif"]}
              alt="Logo Qatar Foundation"
              style={{backgroundColor:'$bg-npc',borderRadius:50,padding:5}}
            />
          </button>
        )}

        {loaded && (
          <div className={classNames("chat-box ", minimized ? "hide" : "", darkMode ? "dark" : "")}>
            <div className="chat-box-header">
              <button
                className={`info-steps__close ${!isMobile ? "background-primary" : ""} `}
                onClick={minimizeButton}
              >
                {isMobile ? (
                  <span className="ms-Icon ms-Icon--ChromeMinimize" />
                ) : (
                  <span className="ms-Icon ms-Icon--Cancel" />
                )}
              </button>
            </div>

            {lang && steps[currentStep]}
          </div>
        )}
      </div>
      <div className={`web-chat-background ${minimized ? "" : "active"}`}></div>
    </>
  );
};

export default MinimizableWebChat;
