import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/chatbot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const initialMessages = [
    {
      id: "welcome",
      type: "system",
      sender: "bot",
      message: "👋 Merhaba! Otelimize hoş geldiniz. Size yardımcı olmak için buradayım.\n\n📌 Aşağıdaki konular hakkında bilgi alabilirsiniz:\n• Oda fiyatları\n• Rezervasyon ve iptal işlemleri\n• Giriş / çıkış saatleri\n• Spa, restoran, havuz\n• Ulaşım, otopark, evcil hayvan politikası\n\n📝 Lütfen sormak istediğiniz konuyu kısaca yazın.\nÖrnek: “Evcil hayvan kabul ediyor musunuz?” veya “Kahvaltı saat kaçta?”"
    }
  ];
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [qaPairs, setQaPairs] = useState([]);

  // Backend'den soru-cevapları çek
  useEffect(() => {
    axios.get("http://localhost:5000/api/chatbot/answers")
      .then(res => setQaPairs(res.data))
      .catch(() => setQaPairs([]));
  }, []);

  function findAnswer(question) {
    question = question.toLowerCase();
    for (const pair of qaPairs) {
      for (const keyword of pair.keywords) {
        if (question.includes(keyword)) {
          return pair.answer;
        }
      }
    }
    return "Üzgünüm, bu konuda bilgi veremiyorum. Lütfen resepsiyonu arayınız.";
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { text: inputMessage, sender: "user" }];
    const botResponse = findAnswer(inputMessage);
    newMessages.push({ text: botResponse, sender: "bot" });
    setMessages(newMessages);
    setInputMessage("");
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <i className="fas fa-comments"></i>
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Hotel Yardımcınız</h3>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.message || message.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Mesajınızı yazın..."
            />
            <button onClick={handleSendMessage}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
