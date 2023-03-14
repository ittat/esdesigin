import { Button, Dialog, DialogTitle, DialogActions, DialogContent, Tab, Box } from "@mui/material"
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useMemo, useState } from "react";
import { FamilyRestroomTwoTone } from "@mui/icons-material";
import { getPage } from "../../Provider";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("../../components/MonacoEditor"), {
    ssr: false
})

const TypescriptEditor = dynamic(() => import("../../components/TypescriptEditor"), {
    ssr: false
})

const ScopeSetter = () => {

    const page = getPage()
    const [open, setOpen] = useState(false)

    const [value, setValue] = useState("Page");


    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };


    const handleClose = () => {
        setOpen(false)
    }

    const handleSave = () => {
        handleClose()
    }


    const pageStates = useMemo(() => {
        const copyOne = {};
        if (page) {
            Object.entries(page.scope).forEach(([k, v]) => {
                // 这里只是取值不希望绑定数据，所以直接传入undefined
                copyOne[k] = v(undefined)
            })
        }

        return JSON.stringify(copyOne, null, '\t')
    }, [open])

    const appStates = useMemo(() => {
        const copyOne = {};
        if (page) {
            Object.entries(page.appRoot.appScopes).forEach(([k, v]) => {
                // 这里只是取值不希望绑定数据，所以直接传入undefined
                copyOne[k] = v(undefined)
            })
        }
        console.log(copyOne);

        return JSON.stringify(copyOne, null, '\t')
    }, [open])


    return <>

        <Button onClick={() => setOpen(true)}>Edit Page Scope</Button>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='lg'>
            <DialogTitle>State Editor</DialogTitle>
            <DialogContent>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Page States" value="Page" />
                            <Tab label="App States" value="App" />
                        </TabList>
                    </Box>
                    {/* <TabPanel value="1">Item One</TabPanel>
                    <TabPanel value="2">Item Two</TabPanel> */}

                    <Box sx={{ height: 550 }}>
                        <MonacoEditor
                            language="object"
                            value={value == 'Page' ? pageStates : appStates}
                            // onChange={(newVal) => setValue(newVal)}
                            onChange={() => { }}
                        />
                    </Box>
                </TabContext>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button onClick={handleSave}>OK</Button>
            </DialogActions>
        </Dialog>
    </>


}


export default ScopeSetter