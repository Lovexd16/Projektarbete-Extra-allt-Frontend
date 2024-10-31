import "./css/chat.css";
import { useState } from "react";
import { IMessage, useStompClient, useSubscription } from "react-stomp-hooks";

//Interface som ska innehålla själva meddelandet samt användaren
interface Message {
  content: string;
  sender: string;
}

export default function Chat() {
  const stompClient = useStompClient();
  const [messages, setMessages] = useState<Message[]>([]);

  //Subscribe till /topic/chat endpointen i backend
  useSubscription("/topic/chat", (message: IMessage) => {
    try {
      const parsed: Message = JSON.parse(message.body);
      setMessages((prevMessages) => [...prevMessages, parsed]);
    } catch (e) {
      console.error("Fel:", e);
      console.error("Fel JSON:", message.body);
    }
  });

  //Metod för att skicka meddelande
  const sendMessage = (message: string) => {
    //Log ifall inget meddelande skrivits när man försöker skicka
    if (message.length === 0) {
      console.log("Tomt meddelande");
    } else {
      console.log("Sending message");
      if (stompClient) {
        stompClient.publish({
          destination: "/app/chat",
          body: JSON.stringify({
            //Sätter content till skrivna meddelandet. Sätter sender till användaren genom att hämta från localStorage
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
          {messages.map((message, index) => (
            <li
              key={index}
              className={
                //Lägger meddelandet till höger eller vänster beroende på om man själv skrivit det
                message.sender === localStorage.getItem("username")
                  ? "right"
                  : "left"
              }
            >
              <p>
                {/*Visar även username på vem som skickade meddelandet beroende på om man själv skrivit meddelandet eller inte*/}
                {message.sender === localStorage.getItem("username")
                  ? message.content
                  : message.sender + ": " + message.content}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/*Input och knapp för att skicka meddelande*/}
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
