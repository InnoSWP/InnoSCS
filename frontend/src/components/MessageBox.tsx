import { ChangeEvent } from "react";
import { MouseEventHandler } from "react";
import "./styles/messageBox.css";
/**
 * MessageBox component is a footer part of the application, which sends user message.
 * @param {{changeMessageText: function, inputText: string, sendMessage: function}} props
 * @param {function} changeMessageText function that changes the state of the input field text
 * @param {string} inputText the text of the MessageBox input field
 * @param {function} sendMessage function that sends message
 */

type Props = {
  changeMessageText: (value: string | (() => string)) => void;
  inputText: string;
  sendMessage: MouseEventHandler<HTMLButtonElement>;
};

export default function MessageBox({
  changeMessageText,
  inputText,
  sendMessage,
}: Props) {
  function getText(event: ChangeEvent<HTMLInputElement>) {
    changeMessageText(() => event.target.value);
  }

  return (
    <div className="message-box-wrapper">
      <div className="message-wrapper">
        <input
          data-testid="message-input"
          placeholder="Type your message here..."
          onChange={getText}
          value={inputText}
        />
        <div className="button-attach">
          <svg
            width="19"
            height="20"
            viewBox="0 0 19 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.4336 9.00424L9.23125 17.0647C8.47459 17.8083 7.45354 18.2208 6.39271 18.2115C5.33189 18.2023 4.31819 17.772 3.57462 17.0153C2.83105 16.2587 2.41851 15.2376 2.42777 14.1768C2.43703 13.116 2.86732 12.1023 3.62398 11.3587L12.5396 2.59733C13.0125 2.1326 13.6507 1.87476 14.3137 1.88055C14.9767 1.88634 15.6103 2.15527 16.075 2.62818C16.5397 3.1011 16.7976 3.73925 16.7918 4.40227C16.786 5.06529 16.5171 5.69885 16.0442 6.16358L8.55503 13.5231C8.36586 13.709 8.1106 13.8122 7.84539 13.8098C7.58018 13.8075 7.32676 13.7 7.14087 13.5108C6.95498 13.3216 6.85184 13.0664 6.85416 12.8012C6.85647 12.5359 6.96404 12.2825 7.15321 12.0966L13.9291 5.43799L12.8777 4.36811L6.10185 11.0268C5.62893 11.4915 5.36 12.125 5.35421 12.7881C5.34843 13.4511 5.60626 14.0892 6.07099 14.5621C6.53572 15.0351 7.16929 15.304 7.8323 15.3098C8.49532 15.3156 9.13348 15.0577 9.60639 14.593L17.0955 7.23346C17.8522 6.48988 18.2825 5.47619 18.2917 4.41536C18.301 3.35453 17.8885 2.33348 17.1449 1.57682C16.4013 0.820154 15.3876 0.389864 14.3268 0.380607C13.266 0.371349 12.2449 0.783882 11.4882 1.52745L2.57262 10.2888C1.53221 11.3112 0.940557 12.7051 0.927827 14.1637C0.915098 15.6223 1.48233 17.0263 2.50474 18.0667C3.52715 19.1071 4.92099 19.6988 6.37962 19.7115C7.83826 19.7242 9.24221 19.157 10.2826 18.1346L18.485 10.0741L17.4336 9.00424Z"
              fill="#A4A4A4"
            />
          </svg>
        </div>
      </div>
      <button
        data-testid="button-send"
        className="button-send"
        onClick={sendMessage}
      >
        <svg
          width="21"
          height="18"
          viewBox="0 0 21 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 18L21 9L0 0V7L15 9L0 11V18Z" fill="white" />
        </svg>
      </button>
    </div>
  );
}
