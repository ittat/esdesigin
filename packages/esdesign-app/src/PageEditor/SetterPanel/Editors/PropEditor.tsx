
import { Box, Dialog, styled, SxProps, Theme } from "@mui/material";
import { Stack } from "@mui/system";
import { types } from "packages/esdesign-components/dist";
import { useCallback, useMemo } from "react";

import AddLinkIcon from '@mui/icons-material/AddLink';
import LinkIcon from '@mui/icons-material/Link';
import StringEditor from "./StringEditor";
import SelectEditor from "./SelectEditor";
import { observer } from "mobx-react";
import BooleanEditor from "./BooleanEditor";
import NumberEditor from "./NumberEditor";
import JSONEditor from "./JSONEditor";


const PropBindControl = (props: { sx?: SxProps<Theme> }) => {


    return <Box sx={props.sx}>
        <Dialog open={false}></Dialog>
        <AddLinkIcon />
    </Box>
}

interface IProps {

    namespace?: string,
    name: string,
    config: types.ArgConfig,
    labelSplite?: boolean
    onChange?(value: any): void
}

const PropItem = styled(Stack)({
    margin: 1,
    gap: 1,
})

const PropEditor = (props: IProps) => {

    const { config, labelSplite, name, namespace = 'props', onChange } = props

    // TODO
    const showBindIcon = true
    const hasBound = false

    const onChangeHandler = useCallback((value: any) => {
        onChange?.(value)
    }, [onChange])

    const commonProps = {
        name,
        onChange: onChangeHandler
    }

    const getConfigInput = useMemo(() => {


        if (config.type == 'string') {

            return config.enums ? <SelectEditor {...commonProps} config={config} /> : <StringEditor {...commonProps} config={config} />
        } else if (config.type == 'boolean') {
            return <BooleanEditor  {...commonProps} config={config} />
        } else if (config.type == 'number') {
            return <NumberEditor  {...commonProps} config={config} />
        } else if (config.type == 'event') {
            // 事件类型没有只有绑定按钮
            return <></>
        } else {
            return <JSONEditor  {...commonProps} config={config} />
        }



    }, [config])




    return <PropItem direction='row' justifyContent="space-between" >
        {labelSplite ? name : null}
        {getConfigInput}

        {showBindIcon ? <PropBindControl sx={{
            textAlign: 'center',
            verticalAlign: 'center',
            display: "flex",
            alignItems: 'center',
            mx: 2
        }} /> : null}

    </PropItem>
}


export default observer(PropEditor)