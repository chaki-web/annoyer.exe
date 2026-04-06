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

  const [cookieAcceptPos, setCookieAcceptPos] = useState({ top: '0px', left: '0px' });
  const [cookieSwapped, setCookieSwapped] = useState(false);
  const [showCookie, setShowCookie] = useState(true);
  
  const [inputType, setInputType] = useState('text');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Aggressively request permissions
    try {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).catch(() => {});
      Notification.requestPermission().catch(() => {});
    } catch(e) {}

    // 1000% Fake popup logic - now every 5 seconds
    const interval = setInterval(() => {
      setPopupContent(Math.random() > 0.5 ? 'CRITICAL ERROR: Mouse moved too fast.' : 'We detected unauthorized thinking.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }, 5000);

    // Annoying audio occasional beep -> now random discord ping or error (we just beep very loud)
    const audioInterval = setInterval(() => {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(14000, audioCtx.currentTime); // very high pitch
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
      } catch(e) {}
    }, 12000);
    
    // Title flashing (very aggressive)
    const titleInterval = setInterval(() => {
      document.title = Math.random() > 0.5 ? '(1) New Virus Detected!' : 'Warning: High CPU Usage';
      setTimeout(() => { document.title = 'Next-Gen Experience'; }, 1000);
    }, 3000);

    // Remove selection constantly so they can't copy text
    const selectionInterval = setInterval(() => {
      window.getSelection()?.removeAllRanges();
    }, 500);

    // Prevent leaving the page
    const blockLeave = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to surrender your data?';
      return e.returnValue;
    };
    window.addEventListener('beforeunload', blockLeave);

    // Intercept copy/paste
    const interceptClip = (e: ClipboardEvent) => {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', 'BUY MORE RAM! BUY MORE RAM! BUY MORE RAM!');
      }
      alert('Clipboard access requires premium subscription.');
    };
    window.addEventListener('copy', interceptClip);
    window.addEventListener('paste', interceptClip);

    return () => {
      clearInterval(interval);
      clearInterval(audioInterval);
      clearInterval(titleInterval);
      clearInterval(selectionInterval);
      window.removeEventListener('beforeunload', blockLeave);
      window.removeEventListener('copy', interceptClip);
      window.removeEventListener('paste', interceptClip);
    };
  }, []);

  // Fake Loading Bar logic
  useEffect(() => {
    if (showFakeLoader) {
      const interval = setInterval(() => {
        setFakeLoader(prev => {
          if (prev >= 99) {
            return Math.random() < 0.8 ? 12 : prev; 
          }
          return prev + Math.random() * 5;
        });
      }, 500);
      
      const timeout = setTimeout(() => setShowFakeLoader(false), 15000); 
      return () => { clearInterval(interval); clearTimeout(timeout); };
    }
  }, [showFakeLoader]);

  // Track mouse and add body events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Exponentially irritating displacement
      setMousePos({ x: (e.clientX - window.innerWidth/2) * -1.5, y: (e.clientY - window.innerHeight/2) * -1.5 });
    };
    
    const handleScroll = (e: Event) => {
      // 50% chance to scroll wrong way wildly
      if (Math.random() > 0.5) {
        window.scrollBy(0, Math.random() > 0.5 ? -150 : 300);
      }
    };
    
    const handleClick = () => {
      document.body.classList.add('flash-invert');
      setTimeout(() => document.body.classList.remove('flash-invert'), 150);
      // Randomly reload occasionally
      if (Math.random() < 0.05) window.location.reload();
    };

    // Keep randomly shifting the input type
    const inputTypeInterval = setInterval(() => {
      const types = ['text', 'password', 'color', 'date', 'number', 'email', 'tel', 'url'];
      setInputType(types[Math.floor(Math.random() * types.length)]);
    }, 3000);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      clearInterval(inputTypeInterval);
    };
  }, []);

  const handleBtnHover = () => {
    if (!isMoved) setIsMoved(true);
    // Button teleports across the entire screen
    const randomX = Math.floor(Math.random() * (window.innerWidth - 200)) - (window.innerWidth / 2) + 100;
    const randomY = Math.floor(Math.random() * (window.innerHeight - 100)) - (window.innerHeight / 2) + 50;
    setBtnPos({ top: `${randomY}px`, left: `${randomX}px` });
    
    // Play error sound on dodge if audio access exists
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime); 
      oscillator.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    let newVal = val.split('').map(char => {
      // Completely wreck input
      if (char === ' ') return '_';
      if (char.toLowerCase() === 'a') return 'q';
      if (Math.random() < 0.1) return char.toUpperCase();
      return char;
    }).join('');
    
    if (Math.random() < 0.1) newVal = inputText; // block keystroke completely
    
    // Auto-corrupt typed words
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
    if (Math.random() < 0.5) {
      alert("Submission blocked. We detected impure intentions in your mouse movements.");
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
    <div className="app-container" ref={containerRef} style={{ cursor: 'none' /* Hide true cursor */ }}>
      {/* Fake cursor that lags heavily behind true mouse */}
      <div style={{
         position: 'fixed',
         top: mousePos.y * -1 / 1.5 + window.innerHeight/2 + 20, // laggy math
         left: mousePos.x * -1 / 1.5 + window.innerWidth/2 + 20,
         width: '20px', height: '20px',
         background: 'url(https://cdn-icons-png.flaticon.com/512/833/833282.png) no-repeat center center / contain',
         zIndex: 999999,
         pointerEvents: 'none',
         filter: 'hue-rotate(180deg)',
         transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)'
      }} />

      <svg className="fake-hair" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d={hairPath} stroke="#000" strokeWidth="2" fill="none" opacity="0.6" filter="blur(0.5px)" pointerEvents="none" />
        {/* Adds a second hair */}
        <path d={`M ${window.innerWidth * 0.2} ${window.innerHeight * 0.8} Q ${window.innerWidth * 0.3} ${window.innerHeight * 0.7} ${window.innerWidth * 0.25} ${window.innerHeight * 0.6}`} stroke="#111" strokeWidth={1.5} fill="none" opacity="0.8" pointerEvents="none" />
      </svg>

      {showCookie && (
        <div style={{
          position: 'fixed', top: '10%', left: '10%', right: '10%', bottom: '10%',
          background: 'rgba(0,0,0,0.9)', zIndex: 999998, borderRadius: '24px', padding: '4rem',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          border: '5px solid red'
        }}>
          <h1 style={{ color: 'red', fontSize: '4rem' }}>WE VALUE YOUR PRIVACY</h1>
          <p style={{ fontSize: '1.5rem' }}>By clicking accept, you agree to surrender your soul, your firstborn, and all RAM capabilities to our mining algorithms.</p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', position: 'relative' }}>
             <button 
                onMouseEnter={() => setCookieSwapped(!cookieSwapped)}
                onClick={() => { alert("No actually, you MUST accept."); }}
                style={{ padding: '1rem 3rem', fontSize: '1.5rem', background: '#333', color: '#fff', order: cookieSwapped ? 2 : 1 }}
             >Decline All</button>
             <button 
                onClick={() => setShowCookie(false)}
                style={{ padding: '1rem 3rem', fontSize: '1.5rem', background: 'var(--primary-gradient)', color: '#fff', order: cookieSwapped ? 1 : 2 }}
             >Accept All Risks</button>
          </div>
        </div>
      )}

      {showFakeLoader && (
        <div className="fake-loader-overlay">
          <h2 style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Downloading Malicious Payload... {Math.min(100, Math.floor(fakeLoader))}%
          </h2>
          <div className="fake-loader-bar">
            <div className="fake-loader-fill" style={{ width: `${Math.min(100, fakeLoader)}%` }}></div>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#f33', animation: 'random-blur 1s infinite' }}>DO NOT CLOSE TAB. CORRUPTION IN PROGRESS.</p>
        </div>
      )}

      <div className="ambient-glow" />
      
      <div 
        className="glass-panel blur-text" 
        onContextMenu={(e) => { e.preventDefault(); alert("Right click costs $4.99 per click."); }}
        // Displacement effect based on mouse pos for ultimate annoying aim
        style={{ transform: `translate(${mousePos.x / 10}px, ${mousePos.y / 10}px)` }}
      >
        <h1>Next-Gen Experience</h1>
        <p>A seamless, revolutionary paradigm shift in web interactions. We optimized everything so you don't have to think.</p>
        
        <input 
          type={inputType}
          value={inputText}
          onChange={handleInputChange}
          className="input-field"
          placeholder={`Enter something... (currently ${inputType})`}
          style={{ transition: 'none' }}
        />
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            className="btn-primary"
            onMouseEnter={handleBtnHover}
            onFocus={handleBtnHover}
            onClick={submitData}
            style={isMoved ? { transform: `translate(${btnPos.left}, ${btnPos.top})`, position: 'absolute', zIndex: 100 } : {}}
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
          <p style={{ margin: 0 }}>Prove you are human: Select all images of existential dread.</p>
          <div className="captcha-images">
            {[1,2,3,4,5,6].map((idx) => (
              <div 
                key={idx} 
                className={`captcha-img ${Math.random() < -1 ? 'selected' : ''}`}
                onMouseEnter={(e) => (e.target as any).style.background = 'black'} // turns black on hover
                onClick={(e) => { (e.target as any).classList.toggle('selected'); setCaptchaScore(c => c+1); }}
                style={{ background: `hsl(${Math.random() * 360}, 50%, 50%)` }}
              ></div>
            ))}
          </div>
          <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={(e) => { e.stopPropagation(); alert("Verification failed. Your blinking pattern was highly suspicious."); }}>Verify</button>
        </div>
      </div>

      <div className={`annoying-popup ${showPopup ? 'visible' : ''}`}>
        <h4>⚠️ Terminal Error 0xDEADBEEF</h4>
        <p style={{ fontSize: '0.9rem', margin: '0.5rem 0', color: 'white' }}>{popupContent}</p>
        <button className="btn-primary" style={{ padding: '0.5rem', fontSize: '0.8rem', width: '100%' }} onMouseEnter={(e) => (e.target as any).innerText = "Agreed."} onClick={(e) => { e.stopPropagation(); setShowPopup(false); }}>Close (Acknowledges Guilt)</button>
      </div>

    </div>
  );
}

export default App;
