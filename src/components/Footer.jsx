import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ImgLogo from "/src/assets/img/logo.png";
import IconFacebook from "/src/assets/svg/facebook.svg";
import IconInstagram from "/src/assets/svg/instagram.svg";
import IconTelegram from "/src/assets/svg/telegram.svg";
import Icon18 from "/src/assets/svg/18.svg";
import IconGt from "/src/assets/svg/gt-logo-ganaencasa.svg";
import IconChat from "/src/assets/svg/chat.svg";
import TermsModal from "./TermsModal";
import PrivacyModal from "./PrivacyModal";
import ResponsibleGamingModal from "./ResponsibleGamingModal";

const Footer = ({ isSlotsOnly }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [isResponsibleGamingModalOpen, setIsResponsibleGamingModalOpen] = useState(false);

    return (
        <>
            <footer className="footer_footer">
                <section>
                    <div className="footer_headerLinksWrapper">
                        <div className="footer_headerLinks">
                            <div className="footer_headerLinksInfo">
                                <a onClick={() => navigate("/")}>
                                    <img alt="" loading="lazy" width="118" height="48" decoding="async"  className="logo_logo" src={ImgLogo} />
                                </a>
                                <p>2025 all rights reserved.This site operates under license of Curacao - Netherlands Antilles</p>
                            </div>
                            <div className="footer_headerLinksBlock">
                                <div className="footer_linksItem">
                                    <span className="footer_linksItemTitle">SECTIONS</span>
                                    <a onClick={() => navigate("/")}>
                                        <span className={`footer-link_footerLink ${location.pathname === '/' ? 'footer-link_active' : ''}`}>Home</span>
                                    </a>
                                    <a onClick={() => navigate("/casino")}>
                                        <span className={`footer-link_footerLink ${location.pathname === '/casino' ? 'footer-link_active' : ''}`}>Casino</span>
                                    </a>
                                    {
                                        isSlotsOnly === "false" && <>
                                            <a onClick={() => navigate("/live-casino")}>
                                                <span className={`footer-link_footerLink ${location.pathname === '/live-casino' ? 'footer-link_active' : ''}`}>Live Casino</span>
                                            </a>
                                            <a onClick={() => navigate("/sports")}>
                                                <span className={`footer-link_footerLink ${location.pathname === '/sports' ? 'footer-link_active' : ''}`}>Sport</span>
                                            </a>
                                        </>
                                    }
                                    <a href="/docs/betting-rules.pdf" target="_blank" rel="noopener noreferrer">
                                        <span className="footer-link_footerLink">Betting Regulations</span>
                                    </a>
                                </div>
                                <div className="footer_linksItem">
                                    <span className="footer_linksItemTitle">US</span>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setIsTermsModalOpen(true); }}>
                                        <span className="footer-link_footerLink">Terms and conditions</span>
                                    </a>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setIsPrivacyModalOpen(true); }}>
                                        <span className="footer-link_footerLink">Privacy Policy</span>
                                    </a>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setIsResponsibleGamingModalOpen(true); }}>
                                        <span className="footer-link_footerLink">Responsible gaming</span>
                                    </a>
                                </div>
                            </div>
                            <div className="footer_linksItem">
                                <span className="footer_linksItemTitle">Follow us on our social networks</span>
                                <div className="footer_socialLinks">
                                    <a className="footer-social-link_footerSocialLink" onClick={() => navigate("/")}>
                                        <img src={IconFacebook} />
                                    </a>
                                    <a className="footer-social-link_footerSocialLink" onClick={() => navigate("/")}>
                                        <img src={IconInstagram} />
                                    </a>
                                    <a className="footer-social-link_footerSocialLink" onClick={() => navigate("/")}>
                                        <img src={IconTelegram} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer_warningWrapper">
                        <div className="footer_warning">
                            <div className="footer_warningItem">
                                <div className="footer_forbiddenAgeBlock">
                                    <img src={Icon18} />
                                </div>
                                <p className="footer_warningInfo">Exclusive site for people over 18</p>
                            </div>
                            <div className="footer_warningItem">
                                <div className="footer_warningIcon">
                                    <img alt="gt logo" loading="lazy" width="50" height="50" decoding="async" data-nimg="1" src={IconGt} />
                                </div>
                                <p className="footer_warningInfo">Please play responsibly. For more information visit: GamblingTherapy.org</p>
                            </div>
                        </div>
                    </div>
                    <div className="chat-with-us app-mode-chat">
                        <div className="tawk-min-container">
                            <button type="button" aria-label="Widget de Chat" title="Widget de Chat" className="tawk-custom-color tawk-custom-border-color tawk-outline tawk-button tawk-button-circle tawk-button-large">
                                <img className="tawk-min-chat-icon" src={IconChat} />
                            </button>
                        </div>
                    </div>
                </section>
            </footer>

            <TermsModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
            />
            <PrivacyModal
                isOpen={isPrivacyModalOpen}
                onClose={() => setIsPrivacyModalOpen(false)}
            />
            <ResponsibleGamingModal
                isOpen={isResponsibleGamingModalOpen}
                onClose={() => setIsResponsibleGamingModalOpen(false)}
            />
        </>
    );
};

export default Footer;