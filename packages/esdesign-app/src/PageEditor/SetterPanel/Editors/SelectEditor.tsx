import { MenuItem, TextField, Select } from "@mui/material";
import { observer } from "mobx-react";
import { types } from "packages/esdesign-components/dist";
import { useCallback, useState } from "react";

const SelectEditor = (props: { config: types.ArgStringConfig, name: string, onChange?(value?: string): void }) => {


    const { name, config, onChange } = props
    const { value : defValue, required, enums } = config

    const [value, setValue] = useState(defValue)

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value || undefined);
        setValue(event.target.value || undefined)
    }, [onChange]);


    return (
        <TextField
            select
            fullWidth
            label={name}
            value={value ?? ''}
            disabled={!!config.action}
            onChange={handleChange}
            required={required}
            size='small'
        >
            <MenuItem value="">-</MenuItem>
            {enums?.map((item) => (
                <MenuItem key={item} value={item}>
                    {item}
                </MenuItem>
            ))}
        </TextField>

    )
}

export default SelectEditor