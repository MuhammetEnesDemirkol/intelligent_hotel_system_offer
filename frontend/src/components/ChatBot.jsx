import React, { useState } from "react";
import "../styles/chatbot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  // Basit soru-cevap veritabanı
  const qaPairs = {
    "oda fiyatları":
      "Oda fiyatlarımız mevsime göre değişmektedir. Standart oda 1000TL'den, Suit oda 2000TL'den başlamaktadır.",
    kahvaltı:
      "Kahvaltı hizmetimiz 07:00-10:00 saatleri arasında ücretsiz olarak sunulmaktadır.",
    "check-in": "Check-in saatimiz 14:00'tür.",
    "check-out": "Check-out saatimiz 12:00'dir.",
    havuz:
      "Otelimizde açık ve kapalı yüzme havuzu bulunmaktadır. Havuzlarımız 08:00-22:00 saatleri arasında hizmet vermektedir.",
    wifi: "Otelimizin her alanında ücretsiz Wi-Fi hizmeti verilmektedir.",
    otopark: "Otelimizde ücretsiz otopark hizmeti bulunmaktadır.",
    spa: "Spa merkezimiz 09:00-21:00 saatleri arasında hizmet vermektedir.",
    restoran: "Restoranımız 07:00-23:00 saatleri arasında hizmet vermektedir.",
    "toplantı salonu":
      "Otelimizde farklı kapasitelerde 5 adet toplantı salonu bulunmaktadır.",
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Kullanıcı mesajını ekle
    const newMessages = [...messages, { text: inputMessage, sender: "user" }];

    // Bot cevabını bul
    let botResponse =
      "Üzgünüm, bu konuda bilgi veremiyorum. Lütfen resepsiyonu arayınız.";

    // Soruyu küçük harfe çevir ve anahtar kelimeleri ara
    const question = inputMessage.toLowerCase();
    for (const [key, value] of Object.entries(qaPairs)) {
      if (question.includes(key)) {
        botResponse = value;
        break;
      }
    }

    // Bot cevabını ekle
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
                {message.text}
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
