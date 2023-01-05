import { TextField } from "@mui/material";
import { types } from "packages/esdesign-components/dist";
import { useCallback } from "react";

const StringEditor = (props: { config: types.ArgStringConfig, name: string, onChange?(value?: string): void }) => {

    const { config, onChange } = props

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value || undefined);
    }, [onChange]);

    return (
        <TextField
            fullWidth
            value={config.value ?? ''}
            // disabled={disabled}
            onChange={handleChange}
            label={props.name}
            size='small'
        />
    )
}

export default StringEditor