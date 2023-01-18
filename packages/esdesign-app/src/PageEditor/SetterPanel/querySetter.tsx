import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField, Typography } from "@mui/material"
import { observer } from "mobx-react"
import dynamic from "next/dynamic"
import { useState, useRef } from "react"
import QueryConfig from "../../states/queryConfig"
import ParamsEditor from "./Editors/ParamsEditor"
import SelectEditor from "./Editors/SelectEditor"
import StringEditor from "./Editors/StringEditor"

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SplitPane from "../../Layout/SplitPane"
import JsonView from "../../components/JsonView"


const MonacoEditor = dynamic(() => import("../../components/MonacoEditor"), {
    ssr: false
})

const TypescriptEditor = dynamic(() => import("../../components/TypescriptEditor"), {
    ssr: false
})


const QuerySetter = ({ config }: { config: QueryConfig }) => {


    // const [_config, setConfig] = useState(config)

    // const _configRef = useRef(config)
    // const _config = _configRef.current

    const [open, setOpen] = useState(false)

    const parmasRef = useRef(null)

    const handleClose = () => {
        setOpen(false)
    }

    const handleSave = () => {
        const prams = parmasRef.current?.getParams

        if (prams) {
            config.updateProp('params', prams)
        }
        setOpen(false)
    }

    const onRun = () => {

        const prams = parmasRef.current?.getParams

        if (prams) {
            config.updateProp('params', prams)
        }

        config.fetchResult()
    }




    return <>
        <Button fullWidth variant='outlined' color='info' onClick={() => setOpen(true)}>{config.name}</Button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Query</DialogTitle>
            <DialogContent>
                <Stack
                    sx={{
                        width: 550,
                        height: 550,
                        gap: 3,
                        overflowX: 'hidden',
                        paddingTop: 1
                    }}
                    direction='column'
                >
                    <StringEditor name="name" config={{
                        type: 'string',
                        value: config.name
                    }} onChange={val => config.changeName(val)} />

                    <Stack direction={'row'}>
                        <SelectEditor name='method' config={config._attrs.method} onChange={(val) => config.updateProp('method', val)} minWidth />
                        <SelectEditor name='url' config={config._attrs.url} onChange={(val) => config.updateProp('url', val)} />
                    </Stack>

                    <Divider />
                    {
                        config._attrs.method.value == 'POST' ? <>
                            <ParamsEditor name='Params' object={{
                                adads: 'asdasd',
                                er3er: 'df3f5455'
                            }} ref={parmasRef} />
                            <Divider />
                        </> : null
                    }

                    <Button variant='outlined' onClick={onRun}>Run</Button>

                    <Divider />
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                        // id="panel1a-header"
                        >
                            <Typography>Output</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box height={'300px'}>
                                {
                                    config.status == 0 ?
                                        null :
                                        config.status == -1 ?
                                            <Typography> {config.errorData} </Typography> :
                                            <JsonView src={config.rawResult} sx={{ width: '100%', height: '100%', minHeight: '150px' }} />
                                    // <MonacoEditor value={JSON.stringify(config.rawResult, null, '\t')}  disabled />

                                }

                            </Box>
                        </AccordionDetails>
                    </Accordion>
                    <Divider />
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                        // id="panel1a-header"
                        >
                            <Typography>Data Hander</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ height: 350 }}>
                            <Typography>
                                左侧输入js数据处理方法，hou'c
                            </Typography>

                            <SplitPane split="vertical" allowResize size="50%">

                                <TypescriptEditor
                                    // refT={editorRef}
                                    value={config._attrs?.dataHandler?.value || ''}
                                    onChange={() => { }}
                                    onSave={(newValue) => {
                                        config.updateProp('dataHandler', newValue)
                                        config.doDataHandle()
                                    }}
                                // extraLibs={extraLibs}
                                />

                                {/* <MonacoEditor value={JSON.stringify({ test: 'asdsad' }, null, '\t')} disabled /> */}
                                <JsonView src={config.result || {}} sx={{ width: '100%', height: '100%', minHeight: '150px' }} />
                            </SplitPane>



                        </AccordionDetails>
                    </Accordion>

                </Stack>
            </DialogContent>
            <DialogActions>
                {/* <Button onClick={handleClose}>Close</Button> */}
                <Button onClick={handleSave}>OK</Button>
            </DialogActions>
        </Dialog>
    </>
}

export default observer(QuerySetter)