import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <>
            <div className="me-content_meContent">
                <h2 className="me-content_title">My Data</h2>
                <p className="me-content_subTitle">Personal Data</p>
                <div className="me-content_meContentInner">
                    <div className="me-content_contentTextCard">
                        <p className="me-content_contentTextCardTitle">User ID</p>
                        <p className="me-content_contentTextCardText">{contextData?.session?.user?.id || '******'}</p>
                    </div>
                    <div className="me-content_separator"></div>
                    <div className="me-content_contentTextCard">
                        <p className="me-content_contentTextCardTitle">User</p>
                        <p className="me-content_contentTextCardText">{contextData?.session?.user?.name || 'Guest'}</p>
                    </div>
                    <div className="me-content_separator"></div>
                    <div className="me-content_contentTextCard">
                        <p className="me-content_contentTextCardTitle">Mail</p>
                        <p className="me-content_contentTextCardText">{contextData?.session?.user?.email || ''}</p>
                    </div>
                    <div className="me-content_separator"></div>
                    <div className="me-content_contentTextCard">
                        <p className="me-content_contentTextCardTitle">Currency</p>
                        <p className="me-content_contentTextCardText">ARS</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;