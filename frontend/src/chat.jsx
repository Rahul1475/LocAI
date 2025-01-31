import React, { useState, useRef } from "react";
import "./App.css";
import { marked } from "marked";
import { FaCircleStop } from "react-icons/fa6";
import { FaCircleUp } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";

const Chat = ({ selectedLLM }) => {
  const [prompt, setPrompt] = useState(""); // Change to string
  const [response, setResponse] = useState("");
  const [thinking, setThinking] = useState("");
  const abortControllerRef = useRef(null); // Reference to the AbortController
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setResponse("");
    setThinking(""); // Reset thinking content
    setLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: selectedLLM, prompt: prompt }),
        signal: abortControllerRef.current.signal, // Pass the signal to the fetch
      });

      if (!res.ok) {
        console.error("Failed to fetch response");
        setLoading(false);
        return;
      }

      // Handle streaming response
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = ""; // To store streamed data
      let is_cleaned = false;
      let cleanedData = "";
      let thinkData = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        if (selectedLLM === "deepseek-r1:1.5b") {
          if (chunk.includes("</think>")) {
            is_cleaned = true;
          }

          if (is_cleaned && !chunk.includes("</think>")) {
            cleanedData += chunk;
            let res = marked.parse(cleanedData);
            setResponse(res);
          } else {
            thinkData += chunk;
            let res = marked.parse(thinkData);
            setThinking(res);
          }
        } else {
          aiResponse += chunk;

          let res = marked.parse(aiResponse);
          setResponse(res);
        }
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error in streaming:", error);
      }
    } finally {
      setLoading(false); // Set loading to false after streaming completes or is canceled
    }
  };

  console.log("===", response);

  const clearChat = () => {
    setResponse(""); // Reset the response
    setThinking(""); // Reset the thinking content
    setPrompt("");
  };

  const stopChat = () => {
    setResponse(
      (prevResponse) => prevResponse + "😬 OOPS...!, You have to stop the chat"
    );

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <div className="chat_container row m-0 p-0 justify-content-center">
      <div className="top_section col-12 p-0 m-0">
        {loading ? (
          <span>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Thinking ... 🤔
          </span>
        ) : null}

        {thinking && (
          <>
            <div className="text-secondary">
              I was Talking to My Self, Do you want to check out ...
              <button className="btn_style ms-5" onClick={() => setOpen(!open)}>
                {open ? "No, It's fine" : "Yes, Show me"}
              </button>
            </div>

            {open && (
              <div
                className="thinking my-2"
                id="thinking"
                dangerouslySetInnerHTML={{ __html: thinking }}
              ></div>
            )}
          </>
        )}

        {response && (
          <div
            className="response"
            id="response"
            dangerouslySetInnerHTML={{ __html: response }}
          ></div>
        )}

        {!response && !loading && <div>🚀 Ask me anything...!</div>}
      </div>

      <div className="bottom_section col-11 p-0 m-0">
        <div className="d-flex align-items-center px-3 ">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask something..."
          ></textarea>

          <div className="d-flex align-items-center">
            <button
              disabled={loading || prompt === ""}
              className="btn_style ms-3"
              onClick={handleSubmit}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <FaCircleUp />
              )}
            </button>
            <button className="btn_style ms-3" onClick={stopChat}>
              <FaCircleStop />
            </button>
            <button className="btn_style ms-3" onClick={clearChat}>
              <FaCircleXmark />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
