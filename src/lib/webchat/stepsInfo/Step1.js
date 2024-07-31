
import React from 'react';
const Step1 = ({changeStep, darkMode = false, lang}) => {

return <div className={`info-steps ${darkMode ? 'dark' : ''}`}>     
    <img className='intro-img-npc' loading='lazy' src={darkMode ? '/npc-logo-white.svg' : '/npc-logo-white.svg'} alt='Logo Qatar Foundation'/>
    <div className="info-steps__text">
        <p>{lang == 'en' ? 'Hey there' : 'مرحبًا، '}</p>
        {/* <p>{lang == 'en' ? "I'm Botaina." : 'أنا بوتينة'}</p> */}
    </div>
    
    <div className='info-steps__bottom'>
        <button className="info-steps__button" onClick={()=>changeStep(1)}>{lang == 'en' ? 'HI' : 'أهلًا بوتينة'}</button>
        <p className='info-steps__skip' onClick={()=>changeStep(3)}>{lang == 'en' ? 'Skip intro' : 'تخط المقدمة'}</p>
    </div>
    
  </div>
};

export default Step1;
