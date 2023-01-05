import { Box, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import { observer } from "mobx-react"
import { isArgConfig } from "packages/esdesign-components/dist"
import { useCallback } from "react"
import { getPage } from "../../Provider"
import PropEditor from "./Editors/PropEditor"

const ComponentSetter = () => {


    const page = getPage()

    const selectNode = page.selectedNode

    const onChangeHandler = useCallback((name: string, namespace: string, value: any) => {

        if (selectNode && (namespace in selectNode) && (name in selectNode[namespace])) {
            const arg = selectNode[namespace][name]

            if (isArgConfig(arg)) {
                const oldValue = arg.value
                arg.value = value

                page.appRoot.event.dispatch('component.props.update', { id: selectNode.id, name, oldValue, value })
            }

        }

    }, [selectNode])


    return <Stack direction='column' sx={{ gap: 1 }}>
        <Stack direction='column'>
            <Typography variant="body1" fontWeight='bolder'>Component:</Typography>
            <Typography variant="body1" fontWeight='bolder' noWrap textAlign='center'>{selectNode.attrs.componentName.value}</Typography>

        </Stack>
        <Stack direction='row'>
            <Typography variant="caption">ComponentId:</Typography>
            <Typography variant="caption" noWrap>{selectNode.id}</Typography>

        </Stack>

        props:

        {Object.entries(selectNode.props || {}).map(([name, config]) => {

            return <PropEditor name={name} namespace='props' config={config} onChange={onChangeHandler.bind(this, name, 'props')} />
        })}


    </Stack>
}

export default observer(ComponentSetter)