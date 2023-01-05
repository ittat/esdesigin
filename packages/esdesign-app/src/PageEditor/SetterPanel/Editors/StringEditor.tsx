import { TextField } from "@mui/material";
import { types } from "packages/esdesign-components/dist";

const StringEditor = (props: { config: types.ArgStringConfig,name:string }) => {

    const { value } = props.config
    return (
        <TextField
            fullWidth
            value={value ?? ''}
            // disabled={disabled}
            // onChange={handleChange}
            label={props.name}
        />
    )
}

export default StringEditor