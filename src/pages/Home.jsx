import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/LayoutContext";
import { callApi, callApiService } from "../utils/Utils";
import GameCard from "/src/components/GameCard";
import NavLinkIcon from "../components/NavLinkIcon";
import Slideshow from "../components/Slideshow";
import CategorySlideshow from "../components/CategorySlideshow";
import GameModal from "../components/GameModal";
import DivLoading from "../components/DivLoading";
import GamesLoading from "../components/GamesLoading";
import LoginModal from "../components/LoginModal";
import CustomAlert from "../components/CustomAlert";
import "animate.css";
import ImgBanner1 from "/src/assets/img/slots.avif";
import ImgBanner2 from "/src/assets/img/live-casino.avif";
import ImgBanner3 from "/src/assets/img/sport.avif";
import ImgMobileBanner1 from "/src/assets/img/mobile-slots.avif";
import ImgMobileBanner2 from "/src/assets/img/mobile-live-casino.avif";
import ImgMobileBanner3 from "/src/assets/img/mobile-sport.avif";

import ImgLobby from "/src/assets/img/lobby.avif";
import ImgHot from "/src/assets/img/hot.avif";
import ImgCrash from "/src/assets/img/crash.avif";
import ImgMegaways from "/src/assets/img/megaways.avif";
import ImgRoulette from "/src/assets/img/roulette.webp";
import ImgPromoCasino from "/src/assets/img/casino-promo.avif";
import ImgPromoLiveCasino from "/src/assets/img/live-casino-promo.avif";
import ImgPromoSport from "/src/assets/img/sport-promo.avif";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let pageCurrent = 0;

const Home = () => {
  const pageTitle = "Home";
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const [selectedPage, setSelectedPage] = useState("lobby");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [topLiveCasino, setTopLiveCasino] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [fragmentNavLinksBody, setFragmentNavLinksBody] = useState(<></>);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messageCustomAlert, setMessageCustomAlert] = useState(["", ""]);
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const refGameModal = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  let imageSlideshow = isMobile ? [ImgMobileBanner1, ImgMobileBanner2, ImgMobileBanner3] : [ImgBanner1, ImgBanner2, ImgBanner3];

  const promos = [
    { name: "casino", link: "/casino", image: ImgPromoCasino },
    { name: "live casino", link: "/live-casino", image: ImgPromoLiveCasino },
    { name: "sport", link: "/sports", image: ImgPromoSport }
  ]

  useEffect(() => {
    const checkIsMobile = () => {
      return window.innerWidth <= 767;
    };

    setIsMobile(checkIsMobile());

    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    setGameUrl("");
    setShouldShowGameModal(false);

    setSelectedPage("home");
    getPage("home");

    getStatus();
  }, [location.pathname]);

  useEffect(() => {
    updateNavLinks();
  }, [selectedPage]);

  const getStatus = () => {
    callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
  };

  const updateNavLinks = () => {
    if ((contextData.slots_only == null) || (contextData.slots_only == false)) {
      setFragmentNavLinksBody(
        <>
          <NavLinkIcon
            title="Lobby"
            pageCode="home"
            icon={ImgLobby}
            active={selectedPage === "home" || selectedPage === "lobby"}
            onClick={() => getPage("home")}
          />
          <NavLinkIcon
            title="Hot"
            pageCode="hot"
            icon={ImgHot}
            active={selectedPage === "hot"}
            onClick={() => getPage("hot")}
          />
          <NavLinkIcon
            title="Habilidad"
            pageCode="arcade"
            icon={ImgCrash}
            active={selectedPage === "arcade"}
            onClick={() => getPage("arcade")}
          />
          <NavLinkIcon
            title="Megaways"
            pageCode="megaways"
            icon={ImgMegaways}
            active={selectedPage === "megaways"}
            onClick={() => getPage("megaways")}
          />
          <NavLinkIcon
            title="Ruleta"
            pageCode="roulette"
            icon={ImgRoulette}
            active={selectedPage === "roulette"}
            onClick={() => getPage("roulette")}
          />
        </>
      );
    } else {
      setFragmentNavLinksBody(
        <>
          <NavLinkIcon
            title="Lobby"
            pageCode="home"
            icon={ImgLobby}
            active={selectedPage === "home" || selectedPage === "lobby"}
            onClick={() => getPage("home")}
          />
          <NavLinkIcon
            title="Hot"
            pageCode="hot"
            icon={ImgHot}
            active={selectedPage === "hot"}
            onClick={() => getPage("hot")}
          />
          <NavLinkIcon
            title="Megaways"
            pageCode="megaways"
            icon={ImgMegaways}
            active={selectedPage === "megaways"}
            onClick={() => getPage("megaways")}
          />
        </>
      );
    }
  };

  const callbackGetStatus = (result) => {
    if (result.status === 500 || result.status === 422) {
      setMessageCustomAlert(["error", result.message]);
    } else {
      setIsLoadingGames(false);
      setTopGames(result.top_slot);
      setTopLiveCasino(result.top_livecasino);
      contextData.slots_only = result && result.slots_only;
      updateNavLinks();
    }
  };

  const getPage = (page) => {
    setIsLoadingGames(true);
    setCategories([]);
    setGames([]);
    setSelectedPage(page);
    callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
  };

  const callbackGetPage = (result) => {
    if (result.status === 500 || result.status === 422) {
      setMessageCustomAlert(["error", result.message]);
    } else {
      setCategories(result.data.categories);
      setPageData(result.data);

      if (pageData.url && pageData.url != null) {
        if (contextData.isMobile) {
          // Mobile sports workaround
        }
      } else {
        if (result.data.page_group_type == "categories") {
          setSelectedCategoryIndex(0);
        }
        if (result.data.page_group_type == "games") {
          loadMoreContent();
        }
      }
      pageCurrent = 0;
    }
  };

  useEffect(() => {
    if (categories.length > 0) {
      let item = categories[0];
      fetchContent(item, item.id, item.table_name, 0, false);
    }
  }, [categories]);

  const loadMoreContent = () => {
    let item = categories[selectedCategoryIndex];
    if (item) {
      fetchContent(item, item.id, item.table_name, selectedCategoryIndex, false);
    }
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage) => {
    let pageSize = 30;

    if (resetCurrentPage == true) {
      pageCurrent = 0;
      setGames([]);
    }

    setSelectedCategoryIndex(categoryIndex);

    callApiService(
      contextData,
      "GET",
      "/games/?page_group_type=categories&page_group_code=" +
      pageData.page_group_code +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=" +
      pageCurrent +
      "&length=" +
      pageSize,
      callbackFetchContent,
      null
    );
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      setMessageCustomAlert(["error", result.message]);
    } else {
      if (pageCurrent == 0) {
        configureImageSrc(result);
        setGames(result.data);
      } else {
        configureImageSrc(result);
        setGames([...games, ...result.data]);
      }
      pageCurrent += 1;
    }
    setIsLoadingGames(false);
  };

  const configureImageSrc = (result) => {
    (result.data || []).forEach((element) => {
      let imageDataSrc = element.image_url;
      if (element.image_local != null) {
        imageDataSrc = contextData.cdnUrl + element.image_local;
      }
      element.imageDataSrc = imageDataSrc;
    });
  };

  const launchGame = (id, type, launcher) => {
    setShouldShowGameModal(true);
    selectedGameId = id != null ? id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    callApi(contextData, "GET", "/get-game-url?game_id=" + selectedGameId, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    if (result.status == "0") {
      switch (selectedGameLauncher) {
        case "modal":
        case "tab":
          setGameUrl(result.url);
          break;
      }
    } else if (result.status == "500" || result.status == "422") {
      setMessageCustomAlert(["error", result.message]);
    }
  };

  const closeGameModal = () => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    setGameUrl("");
    setShouldShowGameModal(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
  };

  const handleAlertClose = () => {
    setMessageCustomAlert(["", ""]);
  };

  return (
    <>
      <CustomAlert message={messageCustomAlert} onClose={handleAlertClose} />
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onConfirm={handleLoginConfirm}
        />
      )}

      {shouldShowGameModal && selectedGameId !== null ? (
        <GameModal
          gameUrl={gameUrl}
          reload={launchGame}
          launchInNewTab={() => launchGame(null, null, "tab")}
          ref={refGameModal}
          onClose={closeGameModal}
        />
      ) : (
        <>
          <Slideshow images={imageSlideshow} />

          <div className="games-tags_gamesTags">
            <div className="games-tags_gamesTagsInner">
              {fragmentNavLinksBody}
            </div>
          </div>

          {
            categories.length > 0 ? <CategorySlideshow
              categories={categories}
              selectedCategoryIndex={selectedCategoryIndex}
              onCategoryClick={fetchContent}
              pageType="home"
            /> : <DivLoading />
          }

          <div className="top-games">
            <div className="games-block-title_gamesBlockTitle">
              <div className="games-block-title_gamesBlockTitleSeparator games-block-title_gamesBlockTitleLeft"></div>
              <p className="games-block-title_gamesBlockTitleText">Top Games</p>
              <div className="games-block-title_gamesBlockTitleSeparator games-block-title_gamesBlockTitleRight"></div>
            </div>
            <div className="games-cards-suspensed_gameCardWrapper">
              <div className="grid_grid grid_sm grid_rowMax3 games-cards-suspensed_gameCardListClassName">
                {topGames &&
                  topGames.map((item, index) => {
                    let imageDataSrc = item.image_url;
                    if (item.image_local != null) {
                      imageDataSrc = contextData.cdnUrl + item.image_local;
                    }
                    return (
                      <GameCard
                        key={index}
                        id={item.id}
                        title={item.name}
                        imageSrc={imageDataSrc}
                        onClick={() =>
                          isLogin
                            ? launchGame(item.id, "slot", "tab")
                            : isMobile
                              ? navigate("/login")
                              : handleLoginClick()
                        }
                      />
                    );
                  })}
              </div>
            </div>
            {isLoadingGames && <GamesLoading />}
            <div className="games-cards-suspensed_seeMoreWrapper">
              <a href="/casino">
                <button className="button_button button_zeusPrimary button_md">See more</button>
              </a>
            </div>
          </div>

          <div className="live-casino">
            <div className="games-block-title_gamesBlockTitle">
              <div className="games-block-title_gamesBlockTitleSeparator games-block-title_gamesBlockTitleLeft"></div>
              <p className="games-block-title_gamesBlockTitleText">Live Casino</p>
              <div className="games-block-title_gamesBlockTitleSeparator games-block-title_gamesBlockTitleRight"></div>
            </div>
            <div className="games-cards-suspensed_gameCardWrapper">
              <div className="grid_grid grid_sm grid_rowMax3 games-cards-suspensed_gameCardListClassName">
                {topLiveCasino &&
                  topLiveCasino.map((item, index) => {
                    let imageDataSrc = item.image_url;
                    if (item.image_local != null) {
                      imageDataSrc = contextData.cdnUrl + item.image_local;
                    }
                    return (
                      <GameCard
                        key={index}
                        id={item.id}
                        title={item.name}
                        imageSrc={imageDataSrc}
                        onClick={() =>
                          isLogin
                            ? launchGame(item.id, "slot", "tab")
                            : isMobile
                              ? navigate("/login")
                              : handleLoginClick()
                        }
                      />
                    );
                  })}
              </div>
            </div>
            {isLoadingGames && <GamesLoading />}
            <div className="games-cards-suspensed_seeMoreWrapper">
              <a href="/live-casino">
                <button className="button_button button_zeusPrimary button_md">See more</button>
              </a>
            </div>
          </div>

          <section className="promo-section_section">
            {promos.map((promo, index) => (
              <div className="promo-section_itemWrapper" key={index}>
                <div className="promo-section_imageWrapper">
                  <div className="promo-section_imageInner">
                    <img loading="lazy" width={360} height={274} src={promo.image} />
                  </div>
                </div>
                <div className="promo-section_buttonWrapper">
                  <a href={promo.link}>
                    <button className="button_button button_zeusPrimary button_sm">{promo.name}</button>
                  </a>
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </>
  );
};

export default Home;