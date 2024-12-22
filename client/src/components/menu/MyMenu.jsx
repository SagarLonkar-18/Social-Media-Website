import React from 'react'
import Menu from '@mui/material/Menu';
import { MenuItem } from '@mui/material';
const MyMenu = () => {

    const handleClose = () => {}
    const handleDeletePost = () => {}

    return (
        <>
            <Menu anchorEl={""} open={true} onClose={handleClose} anchorOrigin={{vertical:'bottom',horizontal:'right'}}
                transformOrigin={{vertical:'top',horizontal:'right'}}
            >
                <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>
            </Menu>
        </>
    )
}

export default MyMenu