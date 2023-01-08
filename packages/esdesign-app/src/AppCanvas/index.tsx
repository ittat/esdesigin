
import { Box, Button, createTheme, NoSsr, styled, ThemeProvider } from '@mui/material'
import { ESDESIGN_COMPONENT, types, components } from 'packages/esdesign-components/dist';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Routes, Navigate, Route } from "react-router-dom"
import { __CANVAS_CONTROL_DETECT_OVERLAY__ } from '../globals';
import { appConfigProvider, materialProvider, PageProvider } from '../Provider';
import AppConfig from '../states/appConfig';
import PageConfig from '../states/pageConfig';
import { IHostYoube, IModules, RecordStr, Rectangle } from '../types';
import Cavnas from './Cavnas';



export interface IAppCanvasProps {
    pageProps: {
        pageId: string
    }

}


declare global {
    interface Window {
        __ESYOUBE__?: IHostYoube;
        __ESYOUBE_injured_?(): void;
    }
}





const AppRoot = styled('div')({
    position: 'relative',
    display: 'flex',
    height: '100%',
    width: '100%',
    minHeight: '100vh'
})

const ControlDetectOverlay = styled('div')({
    // position: 'absolute',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // backgroundColor: '#EEEEEE99'
})

const darkTheme = createTheme({
    // palette: {
    //     mode: 'dark',
    // },
});



const AppCanvas = (props: IAppCanvasProps) => {


    const [hostDom, setHostDom] = useState<AppConfig | null>(null)
    const [pageApi, setPageApi] = useState<PageConfig | null>(null)
    const [preview, setPreview] = useState<boolean>(false)

    const appRootRef = useRef<HTMLDivElement>();
    const appRootCleanupRef = useRef<() => void>();

    const appRects = useRef<RecordStr<Rectangle>>({});

    const materials = useMemo(() => {
        const results: Record<string, types.IESDesiginComponent> = {}
        for (const key in components.default) {
            results[key] = components.default[key]
        }

        return results
    }, [])

    // fix: for  non preview mode
    useEffect(() => {
        if (window.__ESYOUBE__ && materials) { initEsYoubeInfo() }
    }, [materials])

    // fix: for preview mode
    useEffect(() => {
        window.__ESYOUBE_injured_ = () => { initEsYoubeInfo() }
    }, [])

    const initEsYoubeInfo = () => {
        if (window.__ESYOUBE__) {
            const { pageApi, hostDom, previewMode = false  } = window.__ESYOUBE__
            setHostDom(hostDom)
            setPageApi(pageApi)
            setPreview(previewMode)
        }
    }




    const onAppRoot = useCallback((cavnasRootRef: HTMLDivElement) => {
        console.log("进入onAppRoot");
        if (preview) { return }

        appRootCleanupRef.current?.();
        appRootCleanupRef.current = undefined;

        if (!cavnasRootRef) {
            console.log("cavnasRootRef 不存在");

            return;
        }

        appRootRef.current = cavnasRootRef;

        //   监听这个domTree的属性变化 
        const mutationObserver = new MutationObserver(handleScreenUpdate);
        mutationObserver.observe(cavnasRootRef, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true,
        });

        // 监听尺寸变换
        const resizeObserver = new ResizeObserver(handleScreenUpdate);

        resizeObserver.observe(cavnasRootRef);
        cavnasRootRef.querySelectorAll('*').forEach((elm) => resizeObserver.observe(elm));

        appRootCleanupRef.current = () => {
            // handleScreenUpdate.cancel();
            mutationObserver.disconnect();
            resizeObserver.disconnect();
        };

    }, [preview])



    const handleScreenUpdate = useCallback(() => {
        console.log("handleScreenUpdate!", preview);


        if (preview) { return }

        const allElem = document.getElementsByClassName('node-element')
        const allSoltArea = document.getElementsByClassName('blanks-solt-tips-area')

        const elemRects: RecordStr<Rectangle> = {}
        const slotRects: RecordStr<Rectangle> = {}

        if (allElem.length) {
            for (const elem of allElem) {
                const rect = elem.getBoundingClientRect()
                // @ts-ignore
                const nodeid = elem.dataset.nodeid
                if (nodeid) {
                    elemRects[nodeid] = rect
                }
            }
        }

        if (allSoltArea.length) {
            for (const elem of allSoltArea) {
                const rect = elem.getBoundingClientRect()
                // @ts-ignore
                const nodeid = elem.dataset.soltid
                if (nodeid) {
                    slotRects[nodeid] = rect
                }
            }
        }



        appRects.current = elemRects



        // if (pageApi) {
        //     pageApi.updateRects(elemRects, slotRects)
        // }

        if (window.__ESYOUBE__) {
            const { pageApi, hostDom } = window.__ESYOUBE__
            pageApi && pageApi.updateRects(elemRects, slotRects)
            // 移除没有发现影响 - 23-1-8
            // hostDom && hostDom.event.dispatch('appdom.update', {})
        }


        // if (hostDom) {
        //     console.log("xcihu235");

        //     hostDom.event.dispatch('appdom.update', {})
        // }


    }, [hostDom, pageApi, preview])




    return <NoSsr>
        <appConfigProvider.Provider value={{ appDom: hostDom }}>
            <materialProvider.Provider value={{ materials: materials }}>
                <PageProvider.Provider value={{ page: pageApi }}>
                    <ThemeProvider theme={darkTheme}>
                        <AppRoot ref={onAppRoot}>
                            {/* TODO: 改用react-router */}
                            <Cavnas pageId={props.pageProps.pageId} />
                            {/* Host加载overlay组件使用的的锚点 */}
                            {preview ? null : <ControlDetectOverlay id={__CANVAS_CONTROL_DETECT_OVERLAY__} />}
                        </AppRoot>
                    </ThemeProvider>
                </PageProvider.Provider>
            </materialProvider.Provider>
        </appConfigProvider.Provider>
    </NoSsr>

}

export default AppCanvas



