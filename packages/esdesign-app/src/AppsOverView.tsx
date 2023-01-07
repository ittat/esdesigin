import { Avatar, Box, Divider, FormControlLabel, FormLabel, IconButton, Input, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import AppsIcon from '@mui/icons-material/Apps';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { ArrowRight } from '@mui/icons-material';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import InputIcon from '@mui/icons-material/Input';
import { Link } from 'react-router-dom';

/**
 * 两列布局
 *  左侧 所有apps
 *  右侧 选中的app的所有pages
 *  
 *  底部 有个有添加按钮
 *  
 *  pages列表的每个page右侧有三个选项，一个是编辑，一个是预览 ， 一个删除
 * @returns 
 */

function generate(element: React.ReactElement) {
    return [0, 1, 2].map((value) =>
        React.cloneElement(element, {
            key: value,
        }),
    );
}

const AppsList = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    // const [selectIndex, setSelectedIndex] = React.useState<>();
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return <List dense={false} sx={{ minHeight: '100%', width: 300, backgroundColor: '#e3e2e2' }}>
        <ListItem
            secondaryAction={
                <IconButton edge="end" aria-label="add" onClick={handleClick}>
                    <AddIcon />
                </IconButton>
            }
        >
            <ListItemText
                sx={{ my: 0, mx: 1 }}
                primary="APPS List"
                primaryTypographyProps={{
                    fontSize: 20,
                    fontWeight: 'medium',
                    letterSpacing: 0,
                }}
            />
        </ListItem>


        <ListItemButton selected={true}>
            <ListItemAvatar>
                <Avatar>
                    <AppsIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary="APP item"
                secondary={'Secondary text'}
            />

            {/* <IconButton edge="end" aria-label="Settings">
                    <SettingsIcon />
                </IconButton> */}

            <Tooltip title="Project Settings">
                <IconButton
                    onClick={handleClick}
                    size="large"
                    sx={{
                        '& svg': {
                            // color: 'rgba(255,255,255,0.8)',
                        }
                    }}
                >
                    <SettingsIcon />
                </IconButton>
            </Tooltip>

        </ListItemButton>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
    </List>
}


const PagesList = () => {


    return <>
        <List dense={false} >


            {generate(
                <ListItemButton

                >
                    <ListItemAvatar>
                        <Avatar>
                            <DescriptionIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary="Page item"
                        secondary={'Secondary text'}
                    />
                    <Divider />

                    <Tooltip title='Preview'>
                        <IconButton edge="end" aria-label="Preview">
                            <Link target={'_blank'} to='/preview/appid/page/d23d2d-4g45-2d21d-h44'>
                                <VisibilityIcon />
                            </Link>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title='Edit'>
                        <IconButton edge="end" aria-label="Edit">
                            <Link  target={'_blank'} to='/app/appId/page/d23d2d-4g45-2d21d-h44'>
                                <EditIcon />
                            </Link>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title='Delete'>
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </ListItemButton>,
            )}




        </List>
        <Tooltip title='Add Page'>
            <IconButton
                size='large'
                sx={{
                    position: "absolute",
                    bottom: 20,
                    right: 30
                }} edge="end" aria-label="Add Page">
                <AddIcon />
            </IconButton>
        </Tooltip>

    </>
}


const MainContainer = () => {

    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return <Stack>
        <Box sx={{ padding: 2 }}>

            <Typography variant='h6'>App Name</Typography>



            <Typography variant='body2' textAlign={'end'}>version: 0.0.1</Typography>


        </Box>

        <Divider />
        <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', flexGrow: 1, width: '45vw', position: 'relative' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Pages" value="1" />
                    <Tab label="Custom Components" value="2" />
                </TabList>
                <TabPanel value="1" sx={{

                    padding: 0

                }}>
                    <PagesList />
                </TabPanel>
                <TabPanel value="2">Custom Components</TabPanel>
            </Box>

        </TabContext>
    </Stack>
}

const AppsOverView = () => {

    return <Box height={'100vh'} display={'flex'} justifyContent='center' alignItems={'center'}>


        <Stack direction={'row'} minHeight={550} margin={'auto'} boxShadow='2px 2px 10px 0px #cbc6c6'>
            <AppsList />
            <MainContainer />
        </Stack>
    </Box>
}

export default AppsOverView