import { AppBar, Box, Button, Stack, styled, Toolbar } from "@mui/material"
import { Outlet, useNavigate } from "react-router-dom"
import LeftComponentPanel from "../LeftComponentPanel"
// import {OpenInNewIcon,RocketLaunchIcon} from '@mui/icons-material';

const Loyout = styled('div')({
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column'
})

const TitleBar = styled('div')({
    minHeight: '48px'
})

const Footer = styled('div')({
    minHeight: '48px',
    backgroundColor: 'gray'
})

// const LeftComponentPanel = styled('div')({
//     width: '250px'
// })

const MainPanel = styled('div')({
    display: 'flex',
    flexGrow: 1,
    // width: '250px'
})




const AppEditorShell = () => {

   

    return <Loyout className="erwerw">
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ zIndex: 2, borderBottom: 1, borderColor: 'divider' }}
        >
            <Toolbar>
                <Stack direction="row" gap={1} alignItems="center">
                    <Button
                        variant="outlined"
                        // endIcon={<OpenInNewIcon />}
                        color="primary"
                        component="a"
                        href={`/preview/appid/page/d23d2d-4g45-2d21d-h44`}
                        target="_blank"
                    >
                        Preview
                    </Button>
                    <Button
                        variant="outlined"
                        // endIcon={<RocketLaunchIcon />}
                        color="primary"
                    // onClick={handleCreateReleaseDialogOpen}
                    >
                        Deploy
                    </Button>
                </Stack>


            </Toolbar>
        </AppBar>

        <MainPanel>

            <LeftComponentPanel />
            <Outlet />
        </MainPanel>

        <Footer />
    </Loyout>
}

export default AppEditorShell