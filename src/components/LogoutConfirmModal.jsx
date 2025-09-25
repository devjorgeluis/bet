import IconClose from "/src/assets/svg/close.svg";

const LogoutConfirmModal = ({ onConfirm, onClose }) => {
    return (
        <div className="modal-wrapper_modalWrapper modal-wrapper_shown">
            <div className="modal-wrapper_modalContentWrapper modal-wrapper_hasTitle logout-modal">
                <div className="modal-wrapper-title_modalWrapperTitle">
                    <span>Log out</span>
                    <button onClick={onClose}>
                        <img src={IconClose} />
                    </button>
                </div>
                <div className="logout-modal_logoutModalText">Are you sure you want to log out?</div>
                <div className="modal-footer_modalFooter modal-footer_vertical logout-modal_loginModalFooter">
                    <button className="button_button button_zeusPrimary button_sm" type="button" onClick={onClose}>Back</button>
                    <button className="button_button button_zeusPrimary button_sm logout-modal_logoutBtn" type="button" onClick={onConfirm}>
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmModal;