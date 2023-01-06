import styled from "@emotion/styled"
import { Box, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import { ArgConfig, ICustomComponentConfig } from "packages/esdesign-components/dist/types"
import React, { useCallback } from "react"
import PropEditor from "../PageEditor/SetterPanel/Editors/PropEditor"

const Root = styled(Box)({
    height:'100%',
    width:'100%',
    boxSizing:'border-box',
    marginTop:1,
})

const PropsPreviewPanel = (props: { config?: ICustomComponentConfig<ArgConfig> }) => {

    const { config } = props

    const onChangeHandler = useCallback(() => {

    }, [])



    return <Root border={'5px solid #e7e7e7'} height={'100%'} boxSizing={'border-box'}>
       <Typography  bgcolor='#e7e7e7' textAlign='center'>Props Preview</Typography>

        <Stack direction={'column'} gap={2} padding={3} boxSizing={'border-box'} overflow='auto'>
            {Object.entries(config?.props || {}).map(([name, config]) => {
                return <PropEditor name={name} namespace='props' config={config} onChange={onChangeHandler.bind(this, name, 'props')} />
            })}
        </Stack>
    </Root>

}

export default PropsPreviewPanel