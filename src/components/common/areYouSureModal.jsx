import React from "react";
import Modal from "react-responsive-modal";

function AreYouSureModal(props) {
  return (
    <Modal open={props.open} onClose={props.onClose} center>
      <h2>Are you sure?</h2>
      <p>{props.modalMessage}</p>
      <button className="btn btn-danger" onClick={props.onTrigger}>
        {props.triggerLabel}
      </button>
      <button
        className="btn btn-primary buttonSpacing"
        onClick={props.onClose}
      >
        Cancel
      </button>
    </Modal>
  );
}

export default AreYouSureModal;
