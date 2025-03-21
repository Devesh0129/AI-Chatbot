import { useState } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setLoading(true);
  
    try {
      const response = await axios.post("http://localhost:8000/chat", {
        message: input,
      });
  
      console.log("API Response:", response.data); // Debugging
  
      // Extracting only the 'response' text
      const assistantMessage = response.data.response || "No response received";
  
      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        { role: "assistant", content: "Error fetching response." },
      ]);
    }
  
    setInput("");
    setLoading(false);
  };
  

  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-3 text-center">AI Chatbot</h1>
        <div className="h-80 overflow-y-auto border p-2 mb-2 rounded">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-1 rounded max-w-[80%] ${
                msg.role === "user"
                  ? "bg-blue-500 text-white ml-auto text-right"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="text-gray-500 text-sm mt-2">Thinking...</div>
          )}
        </div>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border p-2 w-full rounded-l focus:outline-none"
            placeholder="Type your message..."
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            className={`px-4 rounded-r ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
