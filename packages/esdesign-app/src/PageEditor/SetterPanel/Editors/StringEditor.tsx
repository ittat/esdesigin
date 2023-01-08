import { TextField } from "@mui/material";
import { types } from "packages/esdesign-components/dist";
import { useCallback, useState } from "react";

const StringEditor = (props: { config: types.ArgStringConfig, name: string, onChange?(value?: string): void }) => {

    const { config, onChange } = props

    const { value : defValue, required } = config
    const [value, setValue] = useState(defValue)
    
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value || undefined);
        setValue(event.target.value || undefined)
    }, [onChange]);

    return (
        <TextField
            fullWidth
            value={value ?? ''}
            disabled={!!config.action}
            onChange={handleChange}
            label={props.name}
            size='small'
        />
    )
}

export default StringEditor