import { styled } from '@mui/material'
import React from 'react'
import RenderPanel from './PageEditor/RenderPanel'

const AppEditorRoot = styled('div')({
    flexGrow: 1,
    // width: '100%',
    // height:'100%',
    display: 'flex',
    // backgroundColor:'green'

})



const AppEditor = () => {
    return <AppEditorRoot>
        <RenderPanel />
    </AppEditorRoot>
}

export default AppEditor