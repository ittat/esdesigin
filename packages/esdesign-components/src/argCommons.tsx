import { ArgBooleanConfig, ArgConfig } from "./types";

export const MUISizeConfig = {
    size: {
        type: 'string',
        value: 'medium',
        enums: ["small", "large", "medium"]
    } as ArgConfig
}

export const MUIColorConfig = {
    color: {
        type: 'string',
        value: 'inherit',
        enums: ["inherit", "primary", "secondary", "success", "error", "info", "warning"]
    } as ArgConfig
}

export const disabledConfig = {
    disabled: {
        type: 'boolean',
        value: false,
    } as ArgBooleanConfig
}

export const MUIfullWidthConfig = {
    fullWidth: {
        type: 'boolean',
        value: false,
    } as ArgBooleanConfig
}