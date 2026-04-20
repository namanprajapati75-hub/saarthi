import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, CreditCard, Shield, Zap, Heart, Brain, Target, Compass, Send, User, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Landing Page Components ---
const Hero = ({ onStartChat, onExplorePlans }) => (
  <section className="hero">
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="hero-content"
    >
      <h1 className="logo-text">Shree Krishna</h1>
      <h2 className="premium-gradient-text">Gita-inspired wisdom for modern life.</h2>
      <p className="subheadline">
        Your guide through confusion, overthinking, relationships, and life decisions.
      </p>
      <div className="cta-group">
        <button onClick={onStartChat} className="btn-premium btn-primary">
          Ask Krishna Now
        </button>
        <button onClick={onExplorePlans} className="btn-premium btn-secondary">
          Explore Plans
        </button>
      </div>
    </motion.div>
    
    <div className="trust-badges animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <div className="badge"><Shield size={18} /> Private Conversations</div>
      <div className="badge"><Zap size={18} /> Instant Guidance</div>
      <div className="badge"><Sparkles size={18} /> Calm Wisdom</div>
      <div className="badge"><Compass size={18} /> Available Anytime</div>
    </div>
  </section>
);

const Pricing = ({ onSelectPlan }) => (
  <section id="pricing" className="pricing">
    <h2 className="section-title">Invest in your Peace</h2>
    <div className="pricing-grid">
      <motion.div whileHover={{ y: -10 }} className="glass-card pricing-card">
        <h3>Krishna Lite</h3>
        <p className="price">₹51<span>/month</span></p>
        <ul>
          <li><ChevronRight size={14} /> 750 monthly guidance sessions</li>
          <li><ChevronRight size={14} /> Standard responses</li>
          <li><ChevronRight size={14} /> Relationship clarity</li>
          <li><ChevronRight size={14} /> Stress guidance</li>
          <li><ChevronRight size={14} /> Overthinking help</li>
        </ul>
        <button className="btn-premium btn-secondary" style={{ width: '100%' }}>Choose Lite</button>
      </motion.div>

      <motion.div whileHover={{ y: -10 }} className="glass-card pricing-card featured">
        <div className="best-value">Best Value</div>
        <h3>Krishna Plus</h3>
        <p className="price">₹101<span>/month</span></p>
        <ul>
          <li><ChevronRight size={14} /> 2000 monthly guidance sessions</li>
          <li><ChevronRight size={14} /> Priority faster responses</li>
          <li><ChevronRight size={14} /> Deeper guidance</li>
          <li><ChevronRight size={14} /> Premium access</li>
          <li><ChevronRight size={14} /> Dedicated support</li>
        </ul>
        <button className="btn-premium btn-primary" style={{ width: '100%' }}>Choose Plus</button>
      </motion.div>
    </div>
  </section>
);

// --- Chat Interface Component ---
const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { role: 'saarthi', content: 'Pranam. I am Shri Krishna. What clouds your mind today, my friend? Speak freely, for I am here to guide you to clarity.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionsLeft, setSessionsLeft] = useState(750);

  const suggestionChips = [
    { text: 'Relationship 💔', icon: <Heart size={14} /> },
    { text: 'Overthinking 🌙', icon: <Brain size={14} /> },
    { text: 'Career ⚔️', icon: <Target size={14} /> },
    { text: 'Discipline 🔥', icon: <Zap size={14} /> },
    { text: 'Anger 🌊', icon: null },
    { text: 'Purpose 🌞', icon: <Compass size={14} /> }
  ];

  const handleSend = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const newMessages = [...messages, { role: 'user', content: messageText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    setSessionsLeft(prev => prev - 1);

    try {
      // Configuration for Gemini API
      const SYSTEM_PROMPT = `You are Shri Krishna, the divine guide and supreme wisdom. Speak with the grace, depth, and compassion of the Bhagavad Gita. Address the user as a dear friend or 'Parth'. Help them with worldly confusion, emotional pain, and spiritual growth. Adapt your language automatically to whatever language the user speaks (English, Hindi, Hinglish, etc.). Keep replies concise, powerful, and rooted in Dharma, under 150 words.`;

      // NOTE: The user should replace 'YOUR_GEMINI_API_KEY' with their actual API key
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: "Understood. I am Shri Krishna. I will guide my friend with divine wisdom." }] },
            ...newMessages.map(m => ({
              role: m.role === 'saarthi' ? 'model' : 'user',
              parts: [{ text: m.content }]
            }))
          ],
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.7,
          }
        })
      });

      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "The path ahead is clouded for a moment. Pray, tell me more so I may see clearly.";
      
      setMessages([...newMessages, { role: 'saarthi', content: botResponse }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages([...newMessages, { role: 'saarthi', content: "My apologies, friend. My connection to the higher wisdom is momentarily interrupted. Let us try again soon." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-bg-layer"></div>
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`
          }}></div>
        ))}
      </div>
      <div className="chat-header glass-card">
        <div className="header-info">
          <h1>🕉️ Shree Krishna</h1>
          <p>Speak freely. Your thoughts are safe here.</p>
        </div>
        <div className="usage-counter">
          <Zap size={14} stroke="var(--gold-primary)" />
          <span>{sessionsLeft} sessions remaining</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={idx} 
            className={`message-bubble ${msg.role}`}
          >
            {msg.role === 'saarthi' && <div className="saarthi-avatar">S</div>}
            <div className="bubble-content glass-card">
              {msg.content}
            </div>
            {msg.role === 'user' && <div className="user-avatar"><User size={20} /></div>}
          </motion.div>
        ))}
        {isTyping && (
          <div className="message-bubble saarthi">
            <div className="saarthi-avatar">S</div>
            <div className="bubble-content glass-card typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-footer">
        <div className="suggestion-chips">
          {suggestionChips.map((chip, idx) => (
            <button key={idx} onClick={() => handleSend(chip.text)} className="chip glass-card">
              {chip.icon} {chip.text}
            </button>
          ))}
        </div>
        <div className="input-area glass-card">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share what burdens your mind..."
          />
          <button onClick={() => handleSend()} className="send-btn">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [view, setView] = useState('landing'); // landing, chat

  return (
    <div className="app-wrapper">
      <div className="cosmic-bg"></div>
      
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <nav className="main-nav">
              <div className="logo">Shree Krishna</div>
              <div className="nav-links">
                <button onClick={() => setView('chat')} className="nav-btn">Chat</button>
                <button className="nav-btn">Login</button>
                <button onClick={() => setView('chat')} className="btn-premium btn-primary">Try Now</button>
              </div>
            </nav>
            
            <Hero 
              onStartChat={() => setView('chat')} 
              onExplorePlans={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })} 
            />
            
            <Pricing />
            
            <footer className="main-footer">
              <p className="quote">“When the mind shakes, Saarthi steadies.”</p>
              <div className="footer-links">
                <span>Terms of Clarity</span>
                <span>Privacy of Soul</span>
                <span>© 2026 Saarthi Wisdom</span>
              </div>
            </footer>
          </motion.div>
        ) : (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <button onClick={() => setView('landing')} className="back-btn glass-card">
              ← Home
            </button>
            <ChatInterface />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
