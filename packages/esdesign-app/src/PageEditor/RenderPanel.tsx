import { SearchOutlined } from "@mui/icons-material"
import { Box, Button, styled } from "@mui/material"
import SplitPane from "../Layout/SplitPane"
import CanvasHost from "./CanvasHost"
import ButtomSwiper from "./ButtomSwiper"
import React, { useContext, useMemo, useState } from "react"

import { useRouter } from "next/router"
import { PageProvider, useAppDom } from "../Provider"
import { PageConfig } from "../states/dom"
import SetterPanel from "./SetterPanel/SetterPanel"

const ComponentSetter = styled('div')({
    // width: '250px',
    // backgroundColor: 'gray'
    height:'100%'
})

const RenderPanelContainer = styled('div')({
    display: 'flex',
    position: 'relative',
    width: '100%'
})





const RenderPanel = () => {

    console.log("RenderPanelRenderPanel");

    const router = useRouter()

    const app = useAppDom()

    const page = useMemo(() => {
        const pageId = router.query.index[3]
        if (pageId) {
            return app.pages[pageId]

        } else {
            undefined
        }
    }, [router])





    return <PageProvider.Provider value={{ page: page }}>
        <RenderPanelContainer>
            <SplitPane split="vertical" allowResize size="70%">
                <div style={{ width: '100%', position: 'relative', height: '100%' }}>
                    <CanvasHost />
                    <ButtomSwiper />
                </div>
                <ComponentSetter>
                    <SetterPanel/>
                </ComponentSetter>
            </SplitPane>
            {/* <PageEditor/> */}

        </RenderPanelContainer>
    </PageProvider.Provider>

}


export default RenderPanel
