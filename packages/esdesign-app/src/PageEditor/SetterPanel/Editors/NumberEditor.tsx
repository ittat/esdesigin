import { TextField } from "@mui/material";
import { types } from "packages/esdesign-components/dist";
import { useCallback, useState } from "react";

// TODO: range 没实现
const NumberEditor = (props: { config: types.ArgNumberConfig, name: string, onChange?(value?: number): void }) => {

    const { config, onChange } = props

    const { value: defValue, required } = config
    const [value, setValue] = useState(defValue)

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(event.target.value)
        onChange?.(val || 0);
        setValue(val || 0)
    }, [onChange]);

    return (
        <TextField
            type={'number'}
            fullWidth
            value={value ?? ''}
            disabled={!!config.action}
            onChange={handleChange}
            label={props.name}
            size='small'
        />
    )
}

export default NumberEditor