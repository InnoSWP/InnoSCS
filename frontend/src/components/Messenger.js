import { useState, createRef } from "react";

import MessageBubble from "./MessageBubble";
import Main from "./Main";
import MessageBox from "./MessageBox";
/**
 * Messenger component is a main part of the application. It contains Main and MessageBox.
 * @param {{sidebarActivated: boolean, webSocket: WebSocket, addBubble: function, messageBubbles: Array.<MessageBubble>, currentThreadName: string}} props
 * @param {boolean} sidebarActivated represents the state of the SideBar component
 * @param {WebSocket} webSocket current WebSocket connection
 * @param {function} addBubble changes the state of the MessageBubble list
 * @param {Array.<MessageBubble>} messageBubbles list of the messageBubbles
 * @param {string} currentThreadName name of the current thread
 */
export default function Messenger({
  sidebarActivated,
  webSocket,
  addBubble,
  messageBubbles,
  currentThreadName,
}) {
  const [messageTextInput, changeMessageText] = useState(""); // input field text state
  const messagesEndRef = createRef(); // reference to last message

  /**
   * Creates Volunteer Bubble
   *
   * In current implementation is used for {@link webSocket} listener event
   */
  function createVolunteerBubble(event) {
    const type = "message-bubble-volunteer";
    if (event.data) {
      addBubble((bubbles) => [
        <MessageBubble
          key={`message-${bubbles.length + 1}`}
          text={event.data}
          type={type}
          prevSender={bubbles.length === 0 ? null : bubbles[0].props.type}
        />,
        ...bubbles,
      ]);
    }
  }

  /**
   * Scrolls chat to latest message using {@link messagesEndRef} reference
   */
  function scrollToBottom() {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Creates new User Bubble from {@link messageTextInput}
   */
  function createBubble() {
    const type = "message-bubble-user";

    if (messageTextInput !== "") {
      if (webSocket !== null) webSocket.send(messageTextInput);

      addBubble((bubbles) => {
        return [
          <MessageBubble
            key={`message-${bubbles.length + 1}`}
            text={messageTextInput}
            type={type}
            prevSender={bubbles.length === 0 ? null : bubbles[0].props.type}
          />,
          ...bubbles,
        ];
      });

      if (localStorage.getItem(currentThreadName) !== null) {
        var currentThread = JSON.parse(localStorage.getItem(currentThreadName));
        currentThread.messages.push({ text: messageTextInput, sender: type });
        localStorage.setItem(currentThreadName, JSON.stringify(currentThread));
      }
    }
  }
  /**
   * Creates message bubble, scrolls to bottom and changes input field text.
   */
  function sendMessage() {
    createBubble();
    scrollToBottom();
    changeMessageText(() => "");
  }

  return (
    <div
      className={sidebarActivated ? "main-wrapper activated" : "main-wrapper"}
    >
      <Main
        key="main"
        bubbles={messageBubbles}
        messagesEndRef={messagesEndRef}
      />
      <MessageBox
        key="messageBox"
        inputText={messageTextInput}
        sendMessage={sendMessage}
        changeMessageText={changeMessageText}
      />
    </div>
  );
}
