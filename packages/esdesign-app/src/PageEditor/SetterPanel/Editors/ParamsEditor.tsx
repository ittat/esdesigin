import { Button, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { getUUID } from "packages/esdesign-app/src/globals";
import { RecordStr } from "packages/esdesign-app/src/types";
import { types } from "packages/esdesign-components/dist";
import { ArgStringConfig } from "packages/esdesign-components/dist/types";
import { forwardRef, useCallback, useState, useImperativeHandle } from "react";

const KeyValuePair = ({ id,tkey, value, onChange }: { id: string, tkey?: string, value?: string, onChange?(id,key, value): void }) => {


    const [_key, setKey] = useState(tkey)
    const [_value, setValue] = useState(value)

    const onBlur = useCallback(() => {
        if (_value) {
            onChange?.(id,_key, _value)
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


type IParams = RecordStr<{
    key: ArgStringConfig<string>;
    value: ArgStringConfig<string>;
}>
const ParamsEditor = forwardRef((props: {
    params?: IParams,
    name: string,
}, ref) => {



    const [object, setObject] = useState(props.params || {})


    const updateObject = (id:string,key: string, value: string) => {
        if(id){
            setObject(obj => {
                obj[id] = {
                    'key':{
                        type:'string',
                        value:key
                    },
                    'value':{
                        type:'string',
                        value:value
                    }
                }
                return { ...obj }
            })
        }
       
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
            Object.entries(object).map(([id, keyValue]) => <KeyValuePair key={id} id={id} tkey={keyValue.key.value} value={keyValue.value.value} onChange={updateObject} />) // keyValuePair({ key, value, onChange: updateObject }))
        }
        <Button onClick={() => updateObject(getUUID().slice(0, 8),`default_key`, '')}>ADD</Button>
    </>

    )
})

export default ParamsEditor