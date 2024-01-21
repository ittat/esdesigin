// import { Box, CircularProgress, NoSsr, styled, Button } from "@mui/material";
// import invariant from "invariant";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import DetectOverlay from "./DetectOverlay";
import { styled } from "@mui/material";
import { __CANVAS_CONTROL_DETECT_OVERLAY__ } from "@/lib/utils";
import { getAppApi,getPageApi } from "@/Provider";
import { LoadingIcon } from "@/assets/Icons";

const CanvasRoot = styled("div")({
  width: "calc(100vw - var(--layout-sider-min-width))",
  position: "relative",
  height: "calc(100vh - var(--layout-header-height))",
  paddingLeft: "var(--layout-sider-min-width)",
});

const CanvasFrame = styled("iframe")({
  border: "none",
  position: "absolute",
  width: "100%",
  height: "100%",
  flexGrow: 1,
});

const CanvasHost = (props: { previewMode?: boolean }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);

  // TODO isLoading  frameLoad hebing
  const [isLoading, setIsLoading] = useState(true);
  const [frameLoad, setFrameLoad] = useState(false);

  const [canvasWindow, setCanvasWindow] = useState<Window | null>(null);
  const [detectOverlay, setDetectOverlay] = useState<HTMLElement | null>(null);

  // const appConfig = useAppConfig();
  const { appApi } =  getAppApi()
  const page = getPageApi();


  

  // fix; 解决preview模式下 iframe 不发送onload事件问题，原因未知
  useEffect(() => {
    if (frameRef.current && !frameLoad && props.previewMode) {
      handleFrameLoad();
    }
  }, [frameRef.current, frameLoad]);

  useEffect(() => {
    return () => {
      setFrameLoad(false);
    };
  }, []);

  const handleFrameLoad = () => {
    if (frameLoad) {
      return;
    }

    // setFrameLoad(true)

    // invariant(frameRef.current, "Iframe ref not attached");

    const iframeWindow = frameRef.current?.contentWindow;
    // setContentWindow(iframeWindow);
    setIsLoading(false);

    if (!iframeWindow) {
      return;
    }

    setCanvasWindow(iframeWindow);

    iframeWindow.__ESYOUBE__ = {
      appApi,
      pageApi: page,
      previewMode: props.previewMode || false,
    };

    props.previewMode && iframeWindow.__ESYOUBE_injured_?.();

    // iframeWindow?.addEventListener('unload', () => { });
  };

  useEffect(() => {
    if (!props.previewMode && canvasWindow) {
      setTimeout(() => {
        const overlayDom = canvasWindow.document.getElementById(
          __CANVAS_CONTROL_DETECT_OVERLAY__
        );
        overlayDom && setDetectOverlay(overlayDom);
      }, 1500);
    }
  }, [canvasWindow]);

  return (
    <CanvasRoot>
      {isLoading ? (
        <div className="fixed top-[50%] left-[50%]">
          <LoadingIcon width="30" height="30" className=" animate-spin" />
        </div>
      ) : null}

      <CanvasFrame
        ref={frameRef}
        name="data-canvas-hosts"
        onLoad={handleFrameLoad}
        src={`/canvas/${appApi.id}/${page.id}`}
        // Used by the runtime to know when to load react devtools
        // data-toolpad-canvas
      />

      {detectOverlay
        ? ReactDOM.createPortal(
            <DetectOverlay   />,
            detectOverlay
          )
        : null}
    </CanvasRoot>
  );
};

export default CanvasHost;
