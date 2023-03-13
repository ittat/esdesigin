import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, SxProps, Tab, Theme } from "@mui/material"
import AddLinkIcon from '@mui/icons-material/AddLink';
import LinkIcon from '@mui/icons-material/Link';
import { ArgConfig, EventActionConfig } from "packages/esdesign-components/dist/types";
import { useCallback, useRef, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import SplitPane from "../../../Layout/SplitPane";
import dynamic from "next/dynamic";
const MonacoEditor = dynamic(() => import("../../../components/MonacoEditor"), {
    ssr: false
})





const JSEditorPanel = (props: {
    value: any,
    onChange?(value: any): void
}) => {

    const [value, setValue] = useState<string>(props.value || JSON.stringify(props.value, null, '\t') || '')

    const trst = useRef(value)


    const onSaveHandle = () => {


        try {

            const val = trst.current //JSON.parse(trst.current)
            console.log('asfasfsaf', val);

            props.onChange?.(val)
        } catch (e) {
            console.warn("Warning!", e);
            console.log(typeof trst.current);


        }
    }


    return <Box height={"100%"}>
        <SplitPane split='horizontal' allowResize size="70%">
            <div style={{ height: '100%' }}>
                <MonacoEditor
                    language="typescript"
                    value={trst.current || value}
                    onChange={(newVal) => {
                        // console.log(newVal);
                        trst.current = newVal
                        setValue(newVal)
                    }}
                    onSave={() => onSaveHandle()}
                />
            </div>
            <div>result:</div>

        </SplitPane>
    </Box>
}
const PropBindControl = (props: {
    sx?: SxProps<Theme>,
    actionConfig?: EventActionConfig,
    onChange?(value: EventActionConfig): void
}) => {

    const [isOpen, setOpen] = useState(false)
    const [tabIndex, setTabIndex] = useState('1')
    const handleClose = useCallback(() => {
        setOpen(false)
    }, [])

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabIndex(newValue);
    };

    const onChangeHandle = useCallback((value: any) => {
        console.log("onChangeHandle");

        props.onChange?.({
            type: 'JSExpression',
            value: value
        })
    }, [props.onChange])


    return <Box sx={props.sx}>
        <Dialog open={isOpen} onClose={handleClose}>

            <DialogTitle> Action Editor</DialogTitle>

            <DialogContent>
                <Box sx={{ width: 550, height: 550 }}>
                    <TabContext value={tabIndex}>
                        <Stack direction={'column'} sx={{ borderBottom: 1, borderColor: 'divider', flexGrow: 1, width: '100%', height: '100%', position: 'relative' }}>
                            <TabList onChange={handleChange} aria-label="TODO">
                                <Tab label="JS" value="1" />
                                <Tab label="Route To" value="2" />
                            </TabList>
                            <TabPanel value="1" sx={{ padding: 0 }} style={{ flexGrow: 1 }}>
                                <JSEditorPanel value={props.actionConfig?.value || ''} onChange={onChangeHandle} />
                            </TabPanel>
                            <TabPanel value="2">
                                navotttt
                            </TabPanel>
                        </Stack>

                    </TabContext>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button color='error' onClick={handleClose}>Remove Bind</Button>
                <Button onClick={handleClose}>Close</Button>
                <Button color='primary' onClick={handleClose}>Update Bind</Button>
            </DialogActions>

        </Dialog>
        {!!props.actionConfig ? <LinkIcon color={'primary'} onClick={() => setOpen(true)} /> : <AddLinkIcon onClick={() => setOpen(true)} />}
    </Box>
}


const ActionEditor = (props: { config: ArgConfig, onChange?(value: EventActionConfig): void }) => {

    const actionConfig = props.config?.action || undefined
    
    return <>
        <PropBindControl
            sx={{
                textAlign: 'center',
                verticalAlign: 'center',
                display: "flex",
                alignItems: 'center',
                mx: 2
            }}
            actionConfig={actionConfig}
            onChange={props.onChange}

        />
    </>

}

export default ActionEditor