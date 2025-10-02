import { useState, useEffect } from "react";
import IconNotification from "/src/assets/svg/notification.svg";

const CustomAlert = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(!!message && Array.isArray(message) && message[1] !== "");

  useEffect(() => {
    setIsVisible(!!message && Array.isArray(message) && message[1] !== "");
  }, [message]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div class="toast_toastWrapper">
      {message && Array.isArray(message) && message[1] !== "" && (
        <div class="toast-card_toastWrapper toast-card_shown">
          <div class="toast-card_toast toast-card_shown">
            <div class="toast-card-header_toastCardHeader">
              <span class="toast-card-header_toastCardHeaderIcon">
                <img src={IconNotification} />
              </span>
              <span class="toast-card-header_toastCardMessage">Notificaciones!</span>
              <button class="toast-card-header_toastCardHeaderCloseButton" onClick={handleClose}>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                  <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.688" d="M9 1 1 9m0-8 8 8"></path>
                </svg>
              </button>
            </div>
            <div class="toast-card_toastContent"><div class="toast-card_toastDescription">{message[1]}</div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomAlert;