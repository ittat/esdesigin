import { SearchOutlined } from "@mui/icons-material"
import { Box, Button, styled } from "@mui/material"
import SplitPane from "../Layout/SplitPane"
import CanvasHost from "./CanvasHost"
import ButtomSwiper from "./ButtomSwiper"
import React, { useContext, useMemo, useState } from "react"
import { useParams } from 'react-router-dom';
import { PageProvider, useAppDom } from "../Provider"
import SetterPanel from "./SetterPanel/SetterPanel"

const ComponentSetter = styled('div')({
    // width: '250px',
    // backgroundColor: 'gray'
    height: '100%'
})

const RenderPanelContainer = styled('div')({
    display: 'flex',
    position: 'relative',
    width: '100%'
})





const RenderPanel = () => {


    // const router = useRouter()

    const app = useAppDom()

    const params =  useParams()


    const page = useMemo(() => {


        // const pageId = router.query.index[3]

        const pageId = params.nodeId

        if (pageId) {
            return app.pages[pageId]

        } else {
            undefined
        }
    }, [params])





    return <PageProvider.Provider value={{ page: page }}>
        <RenderPanelContainer>
            <SplitPane split="vertical" allowResize size="70%">
                <div style={{ width: '100%', position: 'relative', height: '100%' }}>
                    <CanvasHost previewMode={false}/>
                    <ButtomSwiper />
                </div>
                <ComponentSetter>
                    <SetterPanel />
                </ComponentSetter>
            </SplitPane>
            {/* <PageEditor/> */}

        </RenderPanelContainer>
    </PageProvider.Provider>

}


export default RenderPanel
