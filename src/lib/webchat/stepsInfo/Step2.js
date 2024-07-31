import React from 'react';

const Step2 = ({changeStep, darkMode=false, lang}) => {

  return <div className={`info-steps ${darkMode ? 'dark' : ''}`}>    
    {/* <img src={darkMode ? '/botaina.gif' : '/botaina.gif'} alt='Logo Qatar Foundation' /> */}
    <img className='intro-img-npc' loading='lazy' src={darkMode ? '/npc-logo-white.svg' : '/npc-logo-white.svg'} alt='Logo Qatar Foundation'/>
    <div className="info-steps__text">
        
        <p>{lang == 'en' ? "I'm here to answer your" : 'أنا هنا للإجابة على'}</p>
        <p>{lang == 'en' ? "questions about" : 'أسئلتك عن مؤسسة قطر'}</p>
        <p>{lang == 'en' ? "Qatar Foundation, its'" : 'وكياناتها، وغير ذلك'}</p>
        <p>{lang == 'en' ? "entities and more" : ''}</p>
    </div>

    <div className='info-steps__bottom'>
        <button className="info-steps__button" onClick={()=>changeStep(2)}>{lang == 'en' ? 'WHAT ELSE?' : 'وماذا أيضًا؟'}</button>
        <p className='info-steps__skip' onClick={()=>changeStep(3)}>{lang == 'en' ? 'Skip intro' : 'تخط المقدمة'}</p>
    </div>
    
  </div>
};

export default Step2;
