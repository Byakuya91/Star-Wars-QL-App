import React, { ReactNode } from "react";

// CSS styles
import "../Modal/modal.css";

// TODO: Create a modal that will work with any form we use for the app
// 1 Code the content of the Modal
// 2) Implement the child props to hold the form component
// 3) CSS styles for the modal to get it out(display component on screen to see the styles and edit them)
// 4) CSS styles for the modal to get it out(display component on screen to see the styles and edit them)
// 3) CSS styles for the modal to get it out(display component on screen to see the styles and edit them)

//TODO: refactor the modal for typeScript

// ?Define the props interface for the modal(DONE)
interface ModalProps {
  children: ReactNode; // Accepts any valid React nodes as children (e.g., form components)
  isOpen: boolean; // Boolean to determine if the modal is open
  onClose: () => void; // Function type for closing the modal
}

// ?Update the Modal component  to be used for typeScript.
const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  // // If the modal is not open, don't render it
  // if (!isOpen) return null;

  return (
    isOpen && (
      <div className="modal-container">
        <div className="modal">
          <div className="modal-header">
            <span className="close" onClick={onClose}>
              &times;
            </span>
          </div>
          <div className="modal-content">{children}</div>
          <div className="modal-footer">Modal Footer</div>
        </div>
      </div>
    )
  );
};

export default Modal;
