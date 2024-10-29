import "./css/chat.css";
import { useState } from "react";
import { IMessage, useStompClient, useSubscription } from "react-stomp-hooks";

interface Message {
  content: string;
  sender: string;
}

export default function Chat() {
  const stompClient = useStompClient();
  const [listOfMessages, setListOfMessages] = useState<Message[]>([]);

  useSubscription("/topic/chat", (message: IMessage) => {
    try {
      const parsed: Message = JSON.parse(message.body);
      setListOfMessages((prevMessages) => [...prevMessages, parsed]);
    } catch (e) {
      console.error("Fel:", e);
      console.error("Invalid JSON message:", message.body);
    }
  });

  const sendMessage = (message: string) => {
    if (message.length === 0) {
      console.log("Message missing");
    } else {
      console.log("Sending message");
      if (stompClient) {
        stompClient.publish({
          destination: "/app/chat",
          body: JSON.stringify({
            content: message,
            sender: localStorage.getItem("username") || "Unknown",
          }),
        });
      }
    }
  };

  return (
    <div>
      <div className="chat-container">
        <ul>
          {listOfMessages.map((message, index) => (
            <li
              key={index}
              className={
                message.sender === localStorage.getItem("username")
                  ? "right"
                  : "left"
              }
            >
              <p>
                {message.sender === localStorage.getItem("username")
                  ? message.content
                  : message.sender + ": " + message.content}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <input id="chatMessageInput" className="chatInput" type="text" />

        <button
          onClick={() => {
            const inputElement = document.getElementById(
              "chatMessageInput"
            ) as HTMLInputElement;
            sendMessage(inputElement.value);
            inputElement.value = "";
          }}
        >
          Skicka
        </button>
      </div>
    </div>
  );
}
