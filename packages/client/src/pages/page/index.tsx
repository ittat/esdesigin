import { styled } from "@mui/material";
import LogoSVG from "../../assets/logo.svg";
import {
  ComponentsIcon,
  GlobalIcon,
  LayerIcon,
  PagesIcon,
  QuoteIcon,
  SettingsIcon,
  StyleIcon,
} from "@/assets/Icons";
import Header from "./Header";
import LeftPanel from "./LeftPanel";
import SettingPanel from "./SettingPanel";
import CanvasHost from "./CanvasHost";
import { AppProvider, getAppController } from "@/Provider";
import { useParams } from "react-router-dom";
import { useMemo } from "react";

const Asider = styled("div")`
  width: var(--layout-sider-min-width);
  float: left;

  height: 100vh; // calc(100vw-var(--layout-header-height));

  /* background-color: grey; */
`;
function ASide() {
  return (
    <Asider className="flex flex-col items-center py-3 border-r">
      <div className="w-[35px] mx-5">
        {/* Logo */}
        <img src={LogoSVG} />
      </div>

      <div className="flex flex-col gap-8 my-auto">
        {/* 当前pages 层级 */}
        <LayerIcon width="20" height="20" />
        {/* 自定义组件列表 */}
        <ComponentsIcon width="20" height="20" />
        {/* 全局样式 */}
        <StyleIcon width="20" height="20" />
        {/* 页面 */}
        <PagesIcon width="20" height="20" />
        {/* 多语言 */}
        <GlobalIcon width="20" height="20" />

        {/* 全局变量 */}
        <QuoteIcon width="20" height="20" />
      </div>
      <div className="my-4">
        <SettingsIcon width="20" height="20" />
      </div>
    </Asider>
  );
}

function Main() {
  return (
    <div className="relative">
      <Header />
      <CanvasHost />
      <LeftPanel />

      <SettingPanel />
    </div>
  );
}

function Page() {
  const params = useParams();
  const pageId = params.pageid;
  const appId = params.appid;

  const app = getAppController(appId!);

  const page = useMemo(() => {
    // const pageId = router.query.index[3]

    if (pageId) {
      return app?.pages[pageId];
    } else {
      undefined;
    }
  }, [params]);

  console.log("page", pageId, page, app);

  return (
    <AppProvider.Provider value={{  pageApi:page, appId, appApi: app }}>
      <div>
        <ASide />
        <Main />
      </div>
    </AppProvider.Provider>
  );
}

export default Page;
