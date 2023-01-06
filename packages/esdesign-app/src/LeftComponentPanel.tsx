import { TreeItem, TreeView } from "@mui/lab"
import { Box, Button, TextField } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useAppDom } from "./Provider";
import { useEffect, useMemo, useReducer, useState } from "react";
import { IPageNode, Types } from "packages/esdesign-components/dist/types";
import { Stack } from "@mui/system";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getUUID } from "./globals";


const LeftComponentPanel = () => {

    const navigate = useNavigate()

    const appDom = useAppDom()

    const [_, updateUI] = useReducer((x) => x + 1, 0)



    useEffect(() => {

        const farseUpdate = () => {
            updateUI()
        }
        if (appDom) {
            appDom.event.addListener('appdom.update', farseUpdate)
            appDom.event.addListener('appdom.add.customComponents', farseUpdate)
            appDom.event.addListener('appdom.add.page', farseUpdate)
        }

        return () => {
            appDom?.event.removeListener('appdom.update', farseUpdate)
            appDom?.event.removeListener('appdom.add.customComponents', farseUpdate)
            appDom?.event.removeListener('appdom.add.page', farseUpdate)
        }


    }, [appDom])

    const [open, setOpen] = useState<{ state: boolean, name?: string, type?: 'customComponent' | 'page' }>({ state: false });

    const handleAskName = (type: 'customComponent' | 'page') => {
        setOpen({ state: true, type });
    };

    const handleDialogClose = () => {
        setOpen({ state: false });
    };

    const handleDialogOK = () => {
        // 
        const id = getUUID()
        if (open.type == 'customComponent') {
     
            appDom.addcustomElement({
                id: id,
                type: '',
                attrs: {
                    source: {
                        type: 1,
                        value: "import * as React from 'react';\nfunction myComponent() {\n  return (\n  <div style={{fontSize:'30px'}} >lalalalla</div>\n  );\n } \n export default myComponent; \n"
                    },
                    componentName: {
                        type: 1,
                        value: open.name
                    },
                    materialId: `customComponent.${id}`
                },
                parentId: ""
            })
        } else {
            appDom.addPage({
                id: id,
                pageName: open.name,
                domTree: {}
            })
        }





        setOpen({ state: false });
    };

    const { customComps, pages } = useMemo(() => {


        const customComps = appDom.getCustomElements()
        const pages = appDom.getPages()


        return { customComps, pages }
    }, [_])



    return <Box sx={{
        width: '250px',
        display: 'flex',
        flexDirection: 'column'
    }}>
        <Box
            sx={{
                width: '100%',
                height: '48px',
                textAlign: 'center',
                lineHeight: '48px',
            }}
            bgcolor='grey.100'
        >
            LeftComponentPanel
        </Box>
        <TreeView
            aria-label="gmail"
            defaultExpanded={['1', '5']}
            expanded={['1', '5']}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            // defaultEndIcon={<div style={{ width: 24 }} />}
            sx={{ flexGrow: 1, overflowX: 'hidden' }}
        >
            <TreeItem nodeId="1" label={<Stack direction={'row'} justifyContent='space-between'>
                <Box>Custom Components</Box>
                <Button onClick={() => handleAskName('customComponent')}>+</Button>
            </Stack>}>
                {customComps.map(customComp => <Link key={customComp.node.id} to={`/app/appId/codeComponents/${customComp.node.id}`}>
                    <TreeItem nodeId={customComp.node.id} label={customComp.node.attrs.componentName.value} />
                </Link>)}
            </TreeItem>
            <TreeItem nodeId="5" label={<Stack direction={'row'} justifyContent='space-between'>
                <Box>Pages</Box>
                <Button onClick={() => handleAskName('page')}>+</Button>
            </Stack>}>

                {pages.map(page => <Link  key={page.id} to={`/app/appId/page/${page.id}`}>
                    <TreeItem nodeId={page.id} label={page.pageName as string} />
                </Link>)}
            </TreeItem>
        </TreeView>


        {/* add new one */}
        <Dialog
            open={open.state}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"名称"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Let Google help apps determine location. This means sending anonymous
                    location data to Google, even when no apps are running.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                    onChange={(e) => {
                        setOpen(old => ({ ...old, name: e.target.value }))
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Disagree</Button>
                <Button onClick={handleDialogOK} autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>



    </Box>
}


export default LeftComponentPanel

