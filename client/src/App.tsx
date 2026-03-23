import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [btnPos, setBtnPos] = useState({ top: '0px', left: '0px' });
  const [isMoved, setIsMoved] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('Storage full! Download RAM?');
  const [captchaScore, setCaptchaScore] = useState(0);
  const [isBackendLoading, setIsBackendLoading] = useState(false);
  const [backendMessage, setBackendMessage] = useState('');
  
  const [fakeLoader, setFakeLoader] = useState(0);
  const [showFakeLoader, setShowFakeLoader] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fake popup logic
    const interval = setInterval(() => {
      setPopupContent(Math.random() > 0.5 ? 'Storage full! Download RAM?' : 'Your session expired 2 minutes from now. Log in again?');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }, 15000);

    // Annoying audio occasional beep
    const audioInterval = setInterval(() => {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(12000, audioCtx.currentTime); // very high pitch
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
      } catch(e) {}
    }, 25000);
    
    // Title flashing
    const titleInterval = setInterval(() => {
      document.title = Math.random() > 0.5 ? '🔴 URGENT MESSAGE!' : '(3) Missed Calls';
      setTimeout(() => { document.title = 'Next-Gen Experience | The Perfect Annoyer'; }, 2000);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(audioInterval);
      clearInterval(titleInterval);
    };
  }, []);

  // Fake Loading Bar logic
  useEffect(() => {
    if (showFakeLoader) {
      const interval = setInterval(() => {
        setFakeLoader(prev => {
          if (prev >= 95) {
            return Math.random() < 0.6 ? 23 : prev; 
          }
          return prev + Math.random() * 20;
        });
      }, 500);
      
      const timeout = setTimeout(() => setShowFakeLoader(false), 12000); 
      return () => { clearInterval(interval); clearTimeout(timeout); };
    }
  }, [showFakeLoader]);

  // Track mouse and add body events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: window.innerWidth - e.clientX, y: window.innerHeight - e.clientY });
    };
    
    const handleScroll = (e: Event) => {
      if (Math.random() > 0.8) {
        window.scrollBy(0, -50);
      }
    };
    
    const handleClick = () => {
      document.body.classList.add('flash-invert');
      setTimeout(() => document.body.classList.remove('flash-invert'), 80);
      if (Math.random() < 0.1) setInputText("");
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleBtnHover = () => {
    if (!isMoved) setIsMoved(true);
    const randomX = Math.floor(Math.random() * 200) - 100;
    const randomY = Math.floor(Math.random() * 200) - 100;
    setBtnPos({ top: `${randomY}px`, left: `${randomX}px` });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    let newVal = val.split('').map(char => {
      if (char.toLowerCase() === 'e') return 'a';
      if (Math.random() < 0.05) return char.toUpperCase();
      return char;
    }).join('');
    
    if (Math.random() < 0.05) newVal = inputText; // drop keystroke
    
    // Auto-corrupt words
    newVal = newVal.replace(/important/gi, "useless");
    
    setInputText(newVal);
  };

  const handleConnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBackendLoading(true);
    setBackendMessage('Connecting to annoying server...');
    try {
      const response = await fetch(`${API_URL}/annoy`);
      const data = await response.json();
      setBackendMessage(data.message || 'It failed successfully.');
    } catch(err) {
      setBackendMessage('Connection timed out...');
    }
    setIsBackendLoading(false);
  };

  const submitData = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (Math.random() < 0.3) {
      alert("Please wait. We are evaluating your cursor trajectory.");
      return;
    }
    setIsBackendLoading(true);
    setBackendMessage('Submitting...');
    try {
      const response = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: inputText })
      });
      const data = await response.json();
      setBackendMessage(data.message || data.error);
    } catch(err) {
      setBackendMessage('Network Error: Try plugging in your router.');
    }
    setIsBackendLoading(false);
  };

  // Generate a random path for the fake hair
  const hairPath = `M ${window.innerWidth * 0.7} ${window.innerHeight * 0.3} Q ${window.innerWidth * 0.6} ${window.innerHeight * 0.5} ${window.innerWidth * 0.8} ${window.innerHeight * 0.7}`;

  return (
    <div className="app-container" ref={containerRef}>
      <svg className="fake-hair" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d={hairPath} />
        {/* Adds a second hair */}
        <path d={`M ${window.innerWidth * 0.2} ${window.innerHeight * 0.8} Q ${window.innerWidth * 0.3} ${window.innerHeight * 0.7} ${window.innerWidth * 0.25} ${window.innerHeight * 0.6}`} strokeWidth={0.8} />
      </svg>

      {showFakeLoader && (
        <div className="fake-loader-overlay">
          <h2 style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Optimizing User Experience... {Math.min(100, Math.floor(fakeLoader))}%
          </h2>
          <div className="fake-loader-bar">
            <div className="fake-loader-fill" style={{ width: `${Math.min(100, fakeLoader)}%` }}></div>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>Do not refresh or all your tabs will close.</p>
        </div>
      )}

      <div className="ambient-glow" />
      
      <div 
        className="glass-panel blur-text" 
        onContextMenu={(e) => { e.preventDefault(); alert("Right click is premium only."); }}
        // Displacement effect based on mouse pos for ultimate annoying aim
        style={{ transform: `translate(${mousePos.x / 40}px, ${mousePos.y / 40}px)` }}
      >
        <h1>Next-Gen Experience</h1>
        <p>A seamless, revolutionary paradigm shift in web interactions. Engineered for maximum efficiency.</p>
        
        <input 
          type="text" 
          value={inputText}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Enter something important..."
        />
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            className="btn-primary"
            onMouseEnter={handleBtnHover}
            onFocus={handleBtnHover}
            onClick={submitData}
            style={isMoved ? { transform: `translate(${btnPos.left}, ${btnPos.top})`, position: 'absolute' } : {}}
          >
            Submit Data
          </button>
          
          <button 
            className="btn-primary"
            onClick={handleConnect}
            style={{ filter: 'hue-rotate(90deg)' }}
          >
            Ping Server
          </button>
        </div>

        {backendMessage && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <p style={{ margin: 0, color: 'var(--accent-color)' }}>{backendMessage}</p>
          </div>
        )}

        <div className="fake-captcha">
          <p style={{ margin: 0 }}>Prove you are human: Select all images of air.</p>
          <div className="captcha-images">
            {[1,2,3,4,5,6].map((idx) => (
              <div 
                key={idx} 
                className={`captcha-img ${Math.random() < -1 ? 'selected' : ''}`}
                onClick={(e) => { (e.target as any).classList.toggle('selected'); setCaptchaScore(c => c+1); }}
                style={{ background: `hsl(${Math.random() * 360}, 50%, 50%)` }}
              ></div>
            ))}
          </div>
          <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={(e) => { e.stopPropagation(); alert("Verification failed. Analyzing micro-hesitations."); }}>Verify</button>
        </div>
      </div>

      <div className={`annoying-popup ${showPopup ? 'visible' : ''}`}>
        <h4>⚠️ Critical Alert</h4>
        <p style={{ fontSize: '0.9rem', margin: '0.5rem 0', color: 'white' }}>{popupContent}</p>
        <button className="btn-primary" style={{ padding: '0.5rem', fontSize: '0.8rem', width: '100%' }} onClick={(e) => { e.stopPropagation(); setShowPopup(false); }}>Ignore (Lowers Credit Score)</button>
      </div>

    </div>
  );
}

export default App;
