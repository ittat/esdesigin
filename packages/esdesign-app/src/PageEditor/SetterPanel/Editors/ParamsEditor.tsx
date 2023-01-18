import { Button, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { getUUID } from "packages/esdesign-app/src/globals";
import { RecordStr } from "packages/esdesign-app/src/types";
import { types } from "packages/esdesign-components/dist";
import { forwardRef, useCallback, useState, useImperativeHandle } from "react";

const KeyValuePair = ({ tkey, value, onChange }: { tkey?: string, value?: string, onChange?(key, value): void }) => {


    const [_key, setKey] = useState(tkey)
    const [_value, setValue] = useState(value)

    const onBlur = useCallback(() => {
        if (_value) {
            onChange?.(_key, _value)
        }
    }, [_value])

    if (!_key) {

        return <TextField size="small" sx={{ width: '48.5%' }} onBlur={onBlur} onChange={e => setKey(e.target.value || '')} />
    }


    return <Stack direction={'row'} gap={2} >
        <TextField label='key' placeholder="key" value={_key} size="small" fullWidth onBlur={onBlur} onChange={e => setKey(e.target.value || '')} />
        <TextField label='value' placeholder="value" value={_value} size="small" fullWidth onBlur={onBlur} onChange={e => setValue(e.target.value || '')} />
    </Stack>


}

const ParamsEditor = forwardRef((props: { object: RecordStr<string>, name: string }, ref) => {



    const [object, setObject] = useState(props.object)


    const updateObject = (key: string, value: string) => {
        setObject(obj => {
            obj[key] = value.toString().trim()
            return { ...obj }
        })
    }


    useImperativeHandle(
        ref,
        () => ({
            get getParams() {
                return object;
            }
        }),
        [object]
    )

    return (<>
        <Typography variant='body2'>{props.name}</Typography>
        {
            Object.entries(object).map(([key, value]) => <KeyValuePair key={key} tkey={key} value={value} onChange={updateObject} />) // keyValuePair({ key, value, onChange: updateObject }))
        }
        <Button onClick={() => updateObject(`default_${getUUID().slice(0, 8)}`, '')}>ADD</Button>
    </>

    )
})

export default ParamsEditor