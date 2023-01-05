
import { Box, Dialog, styled } from "@mui/material";
import { Stack } from "@mui/system";
import { types } from "packages/esdesign-components/dist";
import { useMemo } from "react";

import AddLinkIcon from '@mui/icons-material/AddLink';
import LinkIcon from '@mui/icons-material/Link';
import StringEditor from "./StringEditor";


const PropBindControl = (props: { sx?: any }) => {


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
}

const PropItem = styled(Stack)({
    margin: 1,
    gap: 1,
})

const PropEditor = (props: IProps) => {

    const { config, labelSplite, name, namespace = 'props' } = props

    // TODO
    const showBindIcon = true
    const hasBound = false

    const getConfigInput = useMemo(() => {


        if (config.type == 'string') {

            return config.enum ? 'SelectEditor' : <StringEditor config={config} name={name} /> //<SelectEditor config={config} /> 
        }

        return <></>


    }, [config])




    return <PropItem direction='row'>
        {labelSplite ? name : null}
        {getConfigInput}

        {showBindIcon ? <PropBindControl /> : null}

    </PropItem>
}


export default PropEditor