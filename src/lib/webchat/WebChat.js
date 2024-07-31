import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactWebChat, { createDirectLine, createStyleSet, createCognitiveServicesSpeechServicesPonyfillFactory } from 'botframework-webchat';
import { styleSetDark, styleSetLight } from './utils/chatbotStyleDefs';
import './WebChat.css';
import { useTheme } from 'react-hook-theme';


const USR_BOT_ID = 'USR_BOT_ID';

const WebChat = ({ className, onFetchToken, store, token, lang, darkMode }) => {
  const [webSpeechPonyfillFactory, setWebSpeechPonyfillFactory] = useState(null);
  let firstImg = useRef(true);
  let mode = useRef(darkMode);
  const conversationStartProperties = useMemo(() => ({ locale: lang }), [lang]);
  const directLine = useMemo(
    () => createDirectLine({ token, conversationStartProperties }),
    [token, conversationStartProperties]
  );
  const styleSet = useMemo(
    () => createStyleSet(darkMode ? styleSetDark : styleSetLight),
    [darkMode]
  );
  const { theme, setTheme } = useTheme();

  const [status, setStatus] = useState('')
  const [mic, setMic] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  let resumeApiTimeOut;
  let showEnableMicButton;

  // Hide upload button if not working in set options
  useEffect(() => {
    const uploadButton = document.querySelector(".webchat__upload-button");
    if (uploadButton) {
      uploadButton.style.display = "none";
    }
  }, []);

  useEffect(() => {
    onFetchToken();
  }, [onFetchToken]);
  const endPointId = lang === 'en' ? 'e2b3576b-a599-4386-b9f9-2694e82c3037' : '03c831b8-ad2f-4ed1-9eaf-143145d2d0e0'

  useEffect(() => {
    const createFetchSpeechServicesCredentials = () => {
      let expireAfter = 0;
      let lastPromise;

      return () => {
        const now = Date.now();

        if (now > expireAfter) {
          expireAfter = now + 300000;
          lastPromise = fetch('https://westeurope.api.cognitive.microsoft.com/sts/v1.0/issuetoken', {
            method: 'POST',
            headers: {
              'Ocp-Apim-Subscription-Key': '56f852e25e2343f0a85c78636f361d02',
            }
          }).then(
            async res => {
              let temp = await res.text();
              return { authorizationToken: temp, token: temp, region: "westeurope" }
            },
            err => {
              expireAfter = 0;
              return Promise.reject(err);
            }
          );
        }
        return lastPromise;
      };
    }
    const speechSynthesisDeploymentId = status === "enabled" || status === '' ? { speechSynthesisDeploymentId: endPointId } : {}
    const fetchSpeechServicesCredentials = createFetchSpeechServicesCredentials();
    const fetchData = async () => {
      const res = await fetch('https://directline.botframework.com/v3/directline/tokens/generate', {
        method: 'POST', headers: {
          'Authorization': 'Bearer oaUG9Bt3zrs.Dwde2smAT-XtF4d4lzAVAThpDgMQO4UqpSPQa2iIgU4',
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          "User": { "Id": localStorage.getItem(USR_BOT_ID) }
        }
        )
      });
      const { token } = await res.json();
      const factory = await createCognitiveServicesSpeechServicesPonyfillFactory({
        credentials: fetchSpeechServicesCredentials,
        locale: lang === 'en' ? 'en-US' : 'ar-SA',
        ...speechSynthesisDeploymentId
        // speechSynthesisDeploymentId: '66c784a4-c67b-475f-988b-e2bf14c53c8c'
      });
      setWebSpeechPonyfillFactory(() => factory);
    };
    fetchData()?.catch(err => console.error(err));
  }, [status]);



  const resumeVoiceEndpoint = async () => {
    if (resumeApiTimeOut) {
      clearTimeout(resumeApiTimeOut);
    }
    if (showEnableMicButton) {
      clearTimeout(showEnableMicButton);
    }
    setShowLoader(true)
    try {
      const url = 'https://qf-cnv-speecch-tracker.azurewebsites.net/api/http_trigger?status=resume'
      const response = await fetch(url, {
        method: 'GET',
      });
      const result = await response.json();
      setStatus(result?.response?.CNV_Status)
      if (result?.response?.CNV_Status === "enabled") {
        setMic(true)
        showEnableMicButton = setTimeout(() => {
          setMic(false)
          setShowLoader(false)
        }, 600000)
      } else {
        setMic(false)
        resumeApiTimeOut = setTimeout(() => {
          resumeVoiceEndpoint()
        }, 10000);
      }
    } catch (error) {
      setMic(false)
      setShowLoader(false)
      // setStatus('error')
      console.error(error);
    }
  };



  // useEffect(() => {
  //   setTimeout(() => {
  //     const microphoneButton = document.querySelector('.webchat__microphone-button__button');
  //     console.log(microphoneButton, 'microphoneButton');
  //     if (microphoneButton) {
  //       microphoneButton.addEventListener('click', () => {
  //         // resumeVoiceEndpoint();
  //         stopReply()
  //       });
  //     }
  //   }, 1000)

  //   // return () => {
  //   //   // if (microphoneButton) {
  //   //     document.querySelector('.webchat__microphone-button__button').removeEventListener('click', resumeVoiceEndpoint);
  //   //   // }    };
  // }, [mic]);

  useEffect(() => {
    const form = document.querySelector(".webchat__send-box__main");
    if (mode.current !== darkMode) {
      firstImg.current = true;
      if (form !== null) {
        const img = form.querySelector('img');
        img.remove();
      }
    }

    if (directLine && firstImg.current) {
      const img = document.createElement("img");
      img.classList.add('chat-head-npc')
      img.src = "/npc-logo-white.svg";
      // img.src = "/botaina_n.png";
      img.alt = "Logo Qatar Foundation";
      img.width = '46';
      img.height = '46';

      if (form !== null) {
        form.insertAdjacentElement("afterbegin", img);
      }
      firstImg.current = false;
      mode.current = darkMode;
    }
  }, [directLine, darkMode]);

  const voiceModelName = lang === 'ar' ? 'botaina-ArNeural' : 'Botaina-EnNeural';
  const getSelectVoice = (status, lang, voiceModelName) => {
    if (status === 'enabled') {
      return () => ({ voiceURI: voiceModelName });
    } else {
      return (voices) => {
        return voices.find(({ _lang, _gender }) =>
          _lang === (lang === 'en' ? 'en-US' : 'ar-SA') && _gender === 'Female'
        );
      };
    }
  };
  const [isReply, setReply] = useState({ status: false, textId: '', replybuttonStatus: true });

  let currentAudioRef = useRef(null);
  const speakWithCustomVoice = async (messageText, id) => {

    setReply((prev) => ({ ...prev, replybuttonStatus: false, textId: id }));
    const urlRege = /(https?:\/\/[^\s]+)/g;
    const urlRegex = /\[[^\]]+\]\((http[s]?:\/\/[^\)]+)\)/g;
    const text = messageText.replace(urlRege, '').replace(/&/g, 'and').replace(/</g, '').replace(/>/g, '').replace(/meta/g,'');

    const endpoint = `https://westeurope.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId=${endPointId} `;
    try {
      const response =
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': '56f852e25e2343f0a85c78636f361d02',
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          },
          body: `<speak version='1.0' xml:lang='en-IN'>
               <voice xml:lang="en-IN" name='${voiceModelName}'>
                 <prosody pitch="+0%" rate="+0%" volume="+0%">${text}</prosody>
               </voice>
             </speak>`
        });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      currentAudioRef.current = new Audio(audioUrl);
      currentAudioRef.current.oncanplaythrough = () => {
        setReply((prv) => ({ ...prv, status: true, textId: id }));
      };
      currentAudioRef.current.onended = () => {
        setReply((prv) => ({ ...prv, status: false, textId: "", replybuttonStatus: true }));
      };
      currentAudioRef.current.play();
    } catch (error) {
      setReply((prv) => ({ ...prv, status: false, textId: "", replybuttonStatus: true }))
      console.error('Speech synthesis error:', error);
    }
  };

  const stopReply = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setReply((prev) => ({ ...prev, status: false, textId: '', replybuttonStatus: true }));
  };


  const urlRegex1 = /\[[^\]]+\]\((http[s]?:\/\/[^\)]+)\)/g;
  const urlRegex2 = /(https?:\/\/[^\s]+)/g;
  const urlRegex3=/\[(http[s]?:\/\/[^\)]+)\]/g;
  const urlRegex4=/\((http[s]?:\/\/[^\)]+)\)/g;
  const combinedUrlRegex = /\[[^\]]+\]\((http[s]?:\/\/[^\)]+)\)|\[(http[s]?:\/\/[^\)]+)\]|\((http[s]?:\/\/[^\)]+)\)/g;


// const text='for exampleThe website link for Hamad Bin Khalifa University (HBKU) is [https://www.hbku.edu.qa/en]. (https://www.hbku.edu.qa/en) [Qatar Foundation Website](https://www.qf.org.qa/)'


// const newText = text.replace(combinedUrlRegex, (match, p1, p2, p3) => {
//   const url = p1 || p2 || p3;
//   return `<meta>${url}</meta>`;
// });

// console.log(newText,"regex");

  const removeUrlFromText = (msgText) => {
//  remove url from text and replace it with link
    const text = msgText.replace(/</g, '').replace(/>/g, '').replace(/meta/g,'').replace(urlRegex2, '<a href="$1" target="_blank">here <i class="fa fa-external-link"style="font-size: 11px;" aria-hidden="true"></i></a>').replace(/'and'/g, '&')
  
    return text
  }

  const CustomActivityMiddleware = () => next => card => {
    const firstCard = [...card.activity.id]

    // console.log(card.activity.text)
    if (
      card.activity.type === 'message' &&
      card.activity.from.role === 'bot' &&
      card.activity.attachmentLayout !== "carousel" &&
      card.activity.attachments.length === 0
    ) {
      // card.activity.text = card.activity.text.replace(/&/g, "'and'").replace(/</g, '').replace(/>/g, '').replace(urlRegex1, `<meta>$1</meta>`).replace(urlRegex3,`<meta>$1</meta>`)
      card.activity.text = card.activity.text.replace(/&/g, "'and'").replace(/</g, '').replace(/>/g, '').replace(combinedUrlRegex, (match, p1, p2, p3) => {
        const url = p1 || p2 || p3;
        return `<meta>${url}</meta>`;
      });
      return () => (
        
        <div className='card-container'>
          <div className={`message-card ${theme==='light' ? 'message-card-light' : 'message-card-dark'}`}>
            <div className='activity-text-card'>
              <div className={`message-text-span ${theme}`} dangerouslySetInnerHTML={{ __html: removeUrlFromText(card.activity.text) }} />
              <span className={`message-text-span ${theme}`} >
                {mic && <span style={{ display: "flex", marginTop: "5px" }}>
                  <>
                    {!isReply.status && <button
                      className='voice-reply-button'
                      onClick={() => isReply.replybuttonStatus ? speakWithCustomVoice(card.activity.text, card.activity.id,) : null}
                    > 
                     {/* <i className="fa fa-volume-up" aria-hidden="true"></i> */}
                    {!isReply.replybuttonStatus &&isReply.textId === card.activity.id ? < i class="fa fa-refresh fa-spin"></i> : <i className="fa fa-volume-up" aria-hidden="true"></i> }
                    </button>}
                    {!isReply.replybuttonStatus && isReply.status && isReply.textId === card.activity.id && <button
                      className='voice-reply-button'
                      onClick={() => isReply.textId === card.activity.id ? stopReply() : null} >
                      <i class="fa fa-stop" aria-hidden="true"></i>
                    </button>}
                  </>
                </span>}
              </span>
            </div>
          </div>
          <span className='time-ago'>{firstCard[firstCard.length - 1] !== '1' && timeAgo(new Date(card.activity.timestamp))}</span>

        </div>
      );
    }
    return next(card);
  };
  return !!directLine ? (
    <>
      <ReactWebChat
        className={`${className || ''} web-chat`}
        directLine={directLine}
        selectVoice={getSelectVoice(status, lang, voiceModelName)}
        activityMiddleware={() => next => card => CustomActivityMiddleware()(next)(card)}
        // selectVoice={() => ({ voiceURI: voiceModelName })}
        speechSynthesisDeploymentId={endPointId}
        store={store}
        styleSet={styleSet}
        locale={lang}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        webSpeechPonyfillFactory={mic ? webSpeechPonyfillFactory : null}
      />
      {/* {!mic && <EnableMicButton onClick={resumeVoiceEndpoint} showLoader={showLoader} lang={lang} />
      } */}
    </>
  ) : (
    <div className={`${className || ''} connect-spinner`}>
      <div className='content'>
        <div className='icon'>
          <span className='ms-Icon ms-Icon--Robot' />
        </div>
        {lang === 'ar' ? (
          <p>يرجى الانتظار أثناء الاتصال.</p>
        ) : (
          <p>Please wait while we are connecting.</p>
        )}
      </div>
    </div>
  );
};

export default WebChat;


export const EnableMicButton = ({ onClick, showLoader, lang }) => {

  return (
    <button
      onClick={onClick}
      className="enable-mic-button"
      title="Speak"
      type="button"
      style={{insetInlineStart:lang === 'ar' ? '90px' : 'auto',insetInlineEnd:lang === 'en' ? '79px' : 'auto'}}
    >
      <>  <div
        className="webchat__icon-button__shade"
        data-userway-s19-styled="true"
        data-text-align-feature-value={1}
        style={{ textAlign: "left !important", transition: "all 0s ease 0s" }}
      />
        {showLoader ? <i class="fa fa-refresh fa-spin"></i> : <span>{lang === 'en' ? 'Enable Mic' : 'Enable Mic Ar'}</span>
        }

        <div
          className="webchat__icon-button__keyboard-focus-indicator"
          data-userway-s19-styled="true"
          data-text-align-feature-value={1}
          style={{ textAlign: "left !important", transition: "all 0s ease 0s" }}
        /></>
    </button>
  )
}

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }

  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return 'Just now';
}




// import React, { useEffect, useMemo, useRef } from 'react';
// import ReactWebChat, { createDirectLine, createStyleSet } from 'botframework-webchat';
// import { styleSetDark, styleSetLight } from './utils/chatbotStyleDefs';
// import './WebChat.css';

// const WebChat = ({ className, onFetchToken, store, token, lang, darkMode }) => {
//   let firstImg = useRef(true);
//   let mode = useRef(darkMode);
//   const conversationStartProperties = useMemo(() => ({ locale: lang }), [lang]);
//   const directLine = useMemo(
//     () => createDirectLine({ token, conversationStartProperties }),
//     [token, conversationStartProperties]
//   );
//   const styleSet = useMemo(
//     () => createStyleSet(darkMode ? styleSetDark : styleSetLight),
//     [darkMode]
//   );

//   // Hide upload button is not working in set options
//   const uploadButton = document.querySelector(".webchat__upload-button");
//   if (uploadButton) {
//     uploadButton.style.display = "none";
//   }

//   useEffect(() => {
//     onFetchToken();
//   }, [onFetchToken]);

//   //Insert Botaina img 
//   useEffect(() => {
//     const form = document.querySelector(".webchat__send-box__main");
//     if (mode.current !== darkMode) {
//       firstImg.current = true;
//       if (form !== null) {
//         const img = form.querySelector('img');
//         img.remove();
//       }      
//     }
//     if (directLine && firstImg.current) {      
//       const img = document.createElement("img");
//       //img.src = darkMode ? "/botaina_head_scarf_yello.svg" : "/BOTainanew.png";
//       img.src = "/botaina_n.png";
//       img.alt = "Logo Qatar Foundation";
//       img.width = '46';
//       img.height = '46';   
//       if (form !== null) {
//         form.insertAdjacentElement("afterbegin", img);
//       }
//       firstImg.current = false;
//       mode.current = darkMode;
//     }
//   }, [directLine, darkMode]); 

//   return !!directLine ? (    
//           <ReactWebChat
//             className={`${className || ''} web-chat`}
//             directLine={directLine}
//             store={store}
//             styleSet={styleSet}
//             locale={lang}            
//             dir={lang === 'ar' ? 'rtl' : 'ltr'}
//           />    
//   ) : (
//     <div className={`${className || ''} connect-spinner`}>
//       <div className='content'>
//         <div className='icon'>
//           <span className='ms-Icon ms-Icon--Robot' />
//         </div>
//         {lang === 'ar' ? (
//           <p>يرجى الانتظار أثناء الاتصال.</p>
//         ) : (
//           <p>Please wait while we are connecting.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WebChat;
