import { Box, TextField, Typography, Stack, Divider, Button } from "@mui/material"
import { observer } from "mobx-react"
import { useEffect, useReducer } from "react"
import { getPage } from "../../Provider"
import QuerySetter from "./querySetter"
import ScopeSetter from "./ScopeSetter"


const PageSetter = () => {

    const page = getPage()

    const AddNewQuery = ()=>{
        page.AddQuery()
    }


    const [_, updateUI] = useReducer((x) => x + 1, 0)

    useEffect(() => {
        page.appRoot.event.addListener('page.query.update',updateUI)

        return () => {
            page.appRoot.event.removeListener('page.query.update',updateUI)
        }
      }, [page])


    return <Stack direction={'column'} gap={2}>
        <Stack direction={'column'} gap={1}>
            <TextField
                fullWidth
                value={page.pageName}
                // disabled={!!config.action}
                onChange={(e)=>page.updatePageName(e.target.value)}
                label={'page name'}
                size='small'
            />

        </Stack>

        <Divider />

        <Stack direction={'column'} gap={1}>
            <Typography variant='caption'>State:</Typography>

            <ScopeSetter/>

            <Divider />
            <Typography variant='caption'>Page Query:</Typography>
            <Button onClick={AddNewQuery}>+ Add Query</Button>
            {Object.values(page.query|| {}).map(q=>  <QuerySetter config={q}/>)}

            <Divider />
        </Stack>
    </Stack>
}

export default observer(PageSetter)