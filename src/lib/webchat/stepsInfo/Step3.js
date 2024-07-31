import React, { useState } from 'react';

const Step3 = ({changeStep, darkMode=false, lang}) => {
    const [bloqActive, setBloqActive] = useState(false);
    const TIME = 1000;

    setTimeout(()=>setBloqActive(true), TIME);

  return <div className={`info-steps ${darkMode ? 'dark' : ''}`} >   
    {/* <img src={darkMode ? '/botaina.gif' : '/botaina.gif'} alt='Logo Qatar Foundation' /> */}
    <img className='intro-img-npc' loading='lazy' src={darkMode ? '/npc-logo-white.svg' : '/npc-logo-white.svg'} alt='Logo Qatar Foundation'/>
    {!bloqActive && <div className="info-steps__text">
        {lang == 'en' ? <>
                <p>Or ask</p>
                <p>questions</p>
                <p>like</p>
            </>
            : 
            <p>أو يمكنك طرح أسئلة مثل</p>
        }
    </div>}
    {bloqActive && <>
        <div className="info-steps__text">
            <div className="info-steps__border">
                <p>{lang == 'en' ? "What is Qatar" : 'ما هي'}</p>
                <p>{lang == 'en' ? "Foundation" : 'مؤسسة قطر؟'}</p>
            </div>
            <div className="info-steps__border">
                <p>{lang == 'en' ? "How big is" : 'ما مدى ضخامة'}</p>
                <p>{lang == 'en' ? "Education City?" : 'المدينة التعليمية؟'}</p>
            </div> 
        </div>
        <div className='info-steps__bottom'>
            <button className="info-steps__button" onClick={()=>changeStep(3)}>{lang == 'en' ? "LET'S GET STARTED!" : 'حسنًا، لنبدأ'}</button>         
        </div>
    </>}
  </div>
};

export default Step3;
