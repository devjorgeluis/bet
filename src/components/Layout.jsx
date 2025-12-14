import { useContext, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "./LayoutContext";
import { callApi } from "../utils/Utils";
import Header from "./Header";
import Footer from "./Footer";
import NavLinkHeader from "../components/NavLinkHeader";
import LoginModal from "./LoginModal";
import LogoutConfirmModal from "./LogoutConfirmModal";
import ChangePasswordModal from "./ChangePasswordModal";
import SupportModal from "./SupportModal";
import { NavigationContext } from "./NavigationContext";
import FullDivLoading from "./FullDivLoading";

const Layout = () => {
    const { contextData } = useContext(AppContext);
    const [selectedPage, setSelectedPage] = useState("lobby");
    const [isLogin, setIsLogin] = useState(contextData.session !== null);
    const [isMobile, setIsMobile] = useState(false);
    const [userBalance, setUserBalance] = useState("");
    const [supportWhatsApp, setSupportWhatsApp] = useState("");
    const [supportTelegram, setSupportTelegram] = useState("");
    const [supportEmail, setSupportEmail] = useState("");
    const [supportParent, setSupportParent] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [supportParentOnly, setSupportParentOnly] = useState(false);
    const [fragmentNavLinksTop, setFragmentNavLinksTop] = useState(<></>);
    const [isSlotsOnly, setIsSlotsOnly] = useState("");
    const [showFullDivLoading, setShowFullDivLoading] = useState(false);
    const navigate = useNavigate();

    const location = useLocation();
    const isSportsPage = location.pathname === "/sports";

    useEffect(() => {
        if (contextData.session != null) {
            setIsLogin(true);
            if (contextData.session.user && contextData.session.user.balance) {
                setUserBalance(contextData.session.user.balance);

                setSupportWhatsApp(contextData.session.support_whatsapp || "");
                setSupportTelegram(contextData.session.support_telegram || "");
                setSupportEmail(contextData.session.support_email || "");
                setSupportParent(contextData.session.support_parent || "");
            }

            refreshBalance();
        }
        getStatus();
    }, [contextData.session]);

    useEffect(() => {
        const checkIsMobile = () => {
            return window.innerWidth <= 767;
        };

        setIsMobile(checkIsMobile());

        const handleResize = () => {
            setIsMobile(checkIsMobile());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const refreshBalance = () => {
        setUserBalance("");
        callApi(contextData, "GET", "/get-user-balance", callbackRefreshBalance, null);
    };

    const callbackRefreshBalance = (result) => {
        setUserBalance(result && result.balance);
    };

    const getStatus = () => {
        callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
    };

    const getPage = (page) => {
        setSelectedPage(page);
        setShowFullDivLoading(true);
        callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
        navigate("/" + (page === "home" ? "" : page));
    };

    const callbackGetPage = () => {
        setShowFullDivLoading(false);
    };

    const callbackGetStatus = (result) => {
        if ((result && result.slots_only == null) || (result && result.slots_only == false)) {
            setIsSlotsOnly("false");
            setFragmentNavLinksTop(
                <>
                    <NavLinkHeader
                        title="Inicio"
                        pageCode="home"
                        icon=""
                    />
                    <NavLinkHeader
                        title="Casino"
                        pageCode="casino"
                        icon=""
                    />
                    <NavLinkHeader
                        title="Casino en Vivo"
                        pageCode="live-casino"
                        icon=""
                    />
                    <NavLinkHeader
                        title="Deportes"
                        pageCode="sports"
                        icon=""
                    />
                </>
            );
        } else {
            setIsSlotsOnly("true");
            setFragmentNavLinksTop(
                <>
                    <NavLinkHeader
                        title="Inicio"
                        pageCode="home"
                        icon=""
                    />
                    <NavLinkHeader
                        title="Casino"
                        pageCode="casino"
                        icon=""
                    />
                </>
            );
        }

        setSupportWhatsApp(result && result.support_whatsapp ? result.support_whatsapp : "");
        setSupportTelegram(result && result.support_telegram ? result.support_telegram : "");
        setSupportEmail(result && result.support_email ? result.support_email : "");
        setSupportParent(result && result.support_parent ? result.support_parent : "");
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLoginSuccess = (balance) => {
        setUserBalance(balance);
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleChangePasswordClick = () => {
        setShowChangePasswordModal(true);
    };

    const handleLogoutConfirm = () => {
        callApi(contextData, "POST", "/logout", (result) => {
            if (result.status === "success") {
                setTimeout(() => {
                    localStorage.removeItem("session");
                    window.location.href = "/";
                }, 200);
            } else {
                setShowLogoutModal(false);
            }
        }, null);
    };

    const openSupportModal = (parentOnly = false) => {
        setSupportParentOnly(Boolean(parentOnly));
        setShowSupportModal(true);
    };

    const closeSupportModal = () => {
        setShowSupportModal(false);
        setSupportParentOnly(false);
    };

    const layoutContextValue = {
        isLogin,
        userBalance,
        supportWhatsApp,
        supportTelegram,
        supportEmail,
        handleLoginClick,
        handleLogoutClick,
        handleChangePasswordClick,
        refreshBalance,
        openSupportModal
    };

    return (
        <LayoutContext.Provider value={layoutContextValue}>
            <NavigationContext.Provider
                value={{ fragmentNavLinksTop, selectedPage, setSelectedPage, getPage, showFullDivLoading, setShowFullDivLoading }}
            >
                <>
                    <FullDivLoading show={showFullDivLoading} />
                    {showLoginModal && (
                        <LoginModal
                            isOpen={showLoginModal}
                            onClose={() => setShowLoginModal(false)}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    )}
                    {showLogoutModal && (
                        <LogoutConfirmModal 
                            onConfirm={handleLogoutConfirm}
                            onClose={() => setShowLogoutModal(false)}
                        />
                    )}
                    {showChangePasswordModal && (
                        <ChangePasswordModal 
                            onClose={() => setShowChangePasswordModal(false)}
                        />
                    )}
                    <>
                        <Header
                            isLogin={isLogin}
                            userBalance={userBalance}
                            handleLoginClick={handleLoginClick}
                            handleLogoutClick={handleLogoutClick}
                            handleChangePasswordClick={handleChangePasswordClick}
                            fragmentNavLinksTop={fragmentNavLinksTop}
                            isSlotsOnly={isSlotsOnly}
                            supportParent={supportParent}
                            openSupportModal={openSupportModal}
                        />
                        <main className="app__main">
                            <Outlet context={{ isSlotsOnly }} />
                        </main>
                        {
                            isMobile && !isSportsPage ? <Footer isSlotsOnly={isSlotsOnly} isSportsPage={isSportsPage} /> :
                                !isMobile ? <Footer isSlotsOnly={isSlotsOnly} isSportsPage={isSportsPage} /> : <></>
                        }
                    </>

                    <SupportModal
                        isOpen={showSupportModal}
                        onClose={closeSupportModal}
                        supportWhatsApp={supportWhatsApp}
                        supportTelegram={supportTelegram}
                        supportEmail={supportEmail}
                        supportParentOnly={supportParentOnly}
                        supportParent={supportParent}
                    />
                </>
            </NavigationContext.Provider>
        </LayoutContext.Provider>
    );
};

export default Layout;