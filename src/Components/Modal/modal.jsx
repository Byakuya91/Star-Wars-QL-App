import React from "react";

// CSS styles
import "../Modal/modal.css";

// TODO: Create a modal that will work with any form we use for the app
// 1 Code the content of the Modal
// 2) Implement the child props to hold the form component
// 3) CSS styles for the modal to get it out(display component on screen to see the styles and edit them)
// 4) CSS styles for the modal to get it out(display component on screen to see the styles and edit them)
// 3) CSS styles for the modal to get it out(display component on screen to see the styles and edit them)

/
const Modal = ({ children, isOpen, onClose }) => {

  // Close the modal when clicking outside the modal content
  // const handleBackdropClick = (e) => {
  //   if (e.target === e.currentTarget) {
  //     onClose();
  //   }
  // };

  return (
    <div className="modal-container">
      <div className="modal">
        <div className="modal-header">
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="model-content">{children}</div>
        <div className="model-footer">Model Footer</div>
      </div>
    </div>
  );
};

export default Modal;
