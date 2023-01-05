import { styled, Box, Tab } from "@mui/material"

import { TabContext, TabPanel, TabList } from '@mui/lab'
import { useState } from "react"
import ComponentSetter from "./ComponentSetter"
import { getPage } from "../../Provider"
import { observer } from "mobx-react"

const PanelRoot = styled(Box)({

    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    // backgroundColor:'gray'

})


enum Tabs {
    Component = 'component',
    Theme = 'theme'
}

const SetterPanel = () => {

    const [tabIndex, setTabIndex] = useState<Tabs>(Tabs.Component)
    const page = getPage()

    const selectNode = page.selectedNode


    return <PanelRoot>
        <TabContext value={tabIndex}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={(_, newValue) => { setTabIndex(newValue) }}>
                    <Tab label="Component" value={Tabs.Component} />
                    <Tab label="Theme" value={Tabs.Theme} />
                </TabList>
            </Box>
            <TabPanel value={Tabs.Component} className={''}>
                {selectNode ? <ComponentSetter /> : 'PageSetter'}

            </TabPanel>
            <TabPanel value={Tabs.Theme} className={''}>
                ThemeEditor
            </TabPanel>
        </TabContext>
    </PanelRoot>


}

export default observer(SetterPanel)