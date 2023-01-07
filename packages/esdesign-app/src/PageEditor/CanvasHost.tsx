import { Box, CircularProgress, NoSsr, styled, Button } from "@mui/material";
import invariant from 'invariant';
import { useRouter } from "next/router";
import { ESDESIGN_COMPONENT } from "packages/esdesign-components/dist";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { __CANVAS_CONTROL_DETECT_OVERLAY__ } from "../globals";
import { getPage, useAppDom } from "../Provider";
import DetectOverlay from "./DetectOverlay";



const CanvasRoot = styled('div')({
    width: '100%',
    position: 'relative',
    height: '100%',
});


const CanvasFrame = styled('iframe')({
    border: 'none',
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexGrow: 1,
});



const CanvasHost = (props: { previewMode?: boolean }) => {

    const frameRef = useRef<HTMLIFrameElement>(null);

    // TODO isLoading  frameLoad hebing
    const [isLoading, setIsLoading] = useState(true);
    const [frameLoad, setFrameLoad] = useState(false)

    const [canvasWindow, setCanvasWindow] = useState<Window | null>(null);
    const [detectOverlay, setDetectOverlay] = useState<HTMLElement | null>(null);
    

    const appDom = useAppDom()
    const page = getPage()


    // fix; 解决preview模式下 iframe 不发送onload事件问题，原因未知
    useEffect(() => {
        if (frameRef.current && !frameLoad && props.previewMode) {
            handleFrameLoad()
        }

    }, [frameRef.current, frameLoad])

    useEffect(()=>{
        return ()=>{
            setFrameLoad(false)

        }
    },[])

    const handleFrameLoad = () => {
        if (frameLoad) { return }

        // setFrameLoad(true)


        invariant(frameRef.current, 'Iframe ref not attached');

        const iframeWindow = frameRef.current.contentWindow;
        // setContentWindow(iframeWindow);
        setIsLoading(false)

        if (!iframeWindow) { return }

        setCanvasWindow(iframeWindow)


        iframeWindow.__ESYOUBE__ = {
            hostDom: appDom,
            pageApi: page,
            previewMode: props.previewMode || false
        }



        props.previewMode && iframeWindow.__ESYOUBE_injured_?.()


        // iframeWindow?.addEventListener('unload', () => { });
    }


    useEffect(() => {
        if (!props.previewMode && canvasWindow) {
          
            setTimeout(() => {
                const overlayDom = canvasWindow.document.getElementById(__CANVAS_CONTROL_DETECT_OVERLAY__)
                overlayDom && setDetectOverlay(overlayDom)
            }, 1500)

        }

    }, [canvasWindow])

 

    return (
        <CanvasRoot
        >

            {
                isLoading ?
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                    : null
            }

            <CanvasFrame
                ref={frameRef}
                name="data-canvas-hosts"
                onLoad={handleFrameLoad}

                src={`/canvas/appId/page/${page.id}`}
            // Used by the runtime to know when to load react devtools
            // data-toolpad-canvas
            />

            {detectOverlay ?
                ReactDOM.createPortal((
                    <NoSsr><DetectOverlay /></NoSsr>

                ), detectOverlay)
                : null}

        </CanvasRoot>
    )
}

export default CanvasHost