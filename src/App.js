import React, { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth'; // New v6 syntax
import axios from 'axios';
import '@aws-amplify/ui-react/styles.css';

const API_URL = "https://ffutqdt4cc.execute-api.ap-northeast-1.amazonaws.com/dev/chat"; 

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;
    
    // Add user message to UI immediately
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Get the JWT Token from Cognito
      const session = await fetchAuthSession();
      const token = session.tokens.idToken.toString();
console.log("ID Token:", session.tokens.idToken.toString());

      // Call API Gateway
      const response = await axios.post(API_URL, 
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add AI response to UI
      setMessages([...newMessages, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
          <header style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
            {/* <h3>Hello</h3> */}
            <button onClick={signOut}>Sign Out</button>
          </header>

          <div style={{ border: '1px solid #ccc', height: '400px', overflowY: 'scroll', padding: '10px', marginBottom: '10px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', margin: '10px 0' }}>
                <span style={{ 
                  background: msg.role === 'user' ? '#007bff' : '#f1f1f1', 
                  color: msg.role === 'user' ? '#fff' : '#000',
                  padding: '8px 12px', 
                  borderRadius: '10px',
                  display: 'inline-block'
                }}>
                  {msg.content}
                </span>
              </div>
            ))}
            {loading && <div><i>AI is typing...</i></div>}
          </div>

          <div style={{ display: 'flex' }}>
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              style={{ flex: 1, padding: '10px' }} 
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} style={{ padding: '10px 20px' }}>Send</button>
          </div>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
