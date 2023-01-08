import { FormControlLabel, Checkbox } from "@mui/material";
import { types } from "packages/esdesign-components/dist";
import { useCallback, useState } from "react";

const BooleanEditor = (props: { config: types.ArgBooleanConfig, name: string, onChange?(value?: boolean): void }) => {

  const { name, config, onChange } = props
  const { value: defValue, required } = config
  const [value, setValue] = useState(defValue)

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked || undefined);
    setValue(event.target.checked || undefined)
  }, [onChange]);

  return (
    <FormControlLabel
      control={<Checkbox
        checked={!!value}
         disabled={!!config.action}
        onChange={handleChange}
      />}
      label={name}
    />
  )
}

export default BooleanEditor