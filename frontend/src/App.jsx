import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Chat from "./chat";
import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa6";

function App() {
    const [selectedLLM, setSelectedLLM] = useState("llama3.2:3b");

    return (
        <div className="container-fluid ">
            <div className="row ">
                <div className="col-2 side_nav ">
                    <h3 className="text-center mt-3">
                        <img src="./logo.png" className="img-fluid" alt="" />
                    </h3>
                    <p className="text-center mt-3">Select your LLM</p>

                    <div
                        className="link"
                        onClick={() => setSelectedLLM("llama3.2:3b")}
                    >
                        Llama (3 billion)
                        {selectedLLM === "llama3.2:3b" && (
                            <FaCircleCheck className="text-success" />
                        )}
                        {selectedLLM !== "llama3.2:3b" && (
                            <FaCircle className="text-info" />
                        )}
                    </div>
                    <div
                        className="link"
                        onClick={() => setSelectedLLM("phi:2.7b")}
                    >
                        Phi (2.7 billion)
                        {selectedLLM === "phi:2.7b" && (
                            <FaCircleCheck className="text-success" />
                        )}
                        {selectedLLM !== "phi:2.7b" && (
                            <FaCircle className="text-info" />
                        )}
                    </div>
                    <div
                        className="link"
                        onClick={() => setSelectedLLM("gemma:2b")}
                    >
                        Gemma (2 billion)
                        {selectedLLM === "gemma:2b" && (
                            <FaCircleCheck className="text-success" />
                        )}
                        {selectedLLM !== "gemma:2b" && (
                            <FaCircle className="text-info" />
                        )}
                    </div>
                    <div
                        className="link"
                        onClick={() => setSelectedLLM("deepseek-r1:1.5b")}
                    >
                        Deepseek (1.5 billion)
                        {selectedLLM === "deepseek-r1:1.5b" && (
                            <FaCircleCheck className="text-success" />
                        )}
                        {selectedLLM !== "deepseek-r1:1.5b" && (
                            <FaCircle className="text-info" />
                        )}
                    </div>
                </div>
                <div className="col-10 p-0">
                    <div className="all_chat">
                        <Chat selectedLLM={selectedLLM} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
