import React, { useState } from 'react';
import './ChatInterface.css';

// Services
import { reportService } from '../../services/reportService';

const ChatInterface = ({ reportId }) => {
  const [messages, setMessages] = useState([
    {
      type: 'system',
      content: 'Raporunuz hakkında soru sorabilirsiniz. Örneğin: "En yüksek değer hangi kategoride?", "Trend analizi nasıl?", "Ana bulgular neler?"'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = {
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await reportService.askQuestion(reportId, inputValue);
      
      const aiMessage = {
        type: 'ai',
        content: response.answer,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'error',
        content: 'Üzgünüm, sorunuzu cevaplayamadım. Lütfen tekrar deneyin.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-avatar">
              {message.type === 'user' ? '👤' : message.type === 'ai' ? '🤖' : 'ℹ️'}
            </div>
            <div className="message-content">
              <p>{message.content}</p>
              {message.timestamp && (
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message ai">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <div className="input-container">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Raporunuz hakkında soru sorun..."
            disabled={loading}
          />
          <button 
            onClick={sendMessage} 
            disabled={!inputValue.trim() || loading}
            className="send-btn"
          >
            ➤
          </button>
        </div>
      </div>

      <div className="suggested-questions">
        <p>Örnek sorular:</p>
        <div className="question-chips">
          <span onClick={() => setInputValue('Ana bulgular neler?')}>
            Ana bulgular neler?
          </span>
          <span onClick={() => setInputValue('En dikkat çekici trend hangisi?')}>
            En dikkat çekici trend hangisi?
          </span>
          <span onClick={() => setInputValue('Hangi aksiyonları öncelikli yapmalıyım?')}>
            Hangi aksiyonları öncelikli yapmalıyım?
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;