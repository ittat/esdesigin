import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import dynamic from "next/dynamic";

import { types } from "packages/esdesign-components/dist";
import { useCallback, useState } from "react";

const MonacoEditor = dynamic(() => import("../../../components/MonacoEditor"), {
    ssr: false
})


const JSONEditor = (props: { config: types.ArgJsonConfig, name: string, onChange?(value?: Array<any> | object): void }) => {

    const { config, onChange } = props

    const { value: defValue, required } = config
    const [value, setValue] = useState(JSON.stringify(defValue, null, '\t'))


    const [isOpen, setOpen] = useState(false)

    const handleSave = useCallback(() => {
        try {
            const val = JSON.parse(value)
            onChange?.(val);
            setOpen(false);
        } catch (e) {
            console.warn("Error!");

        }

    }, [onChange]);

    const handleClose = useCallback(() => {
        setOpen(false)
    }, [])



    return (
        <>
            <Button fullWidth variant='outlined' color='info' disabled={!!config.action} onClick={() => setOpen(true)}>{props.name}</Button>
            <Dialog open={isOpen} onClose={handleClose}>
                <DialogTitle>Editor</DialogTitle>
                <DialogContent>
                    <Box sx={{ width: 550, height: 550 }}>
                        <MonacoEditor
                            // language="object"
                            value={value}
                            onChange={(newVal) => setValue(newVal)}
                        />;
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>

    )
}

export default JSONEditor