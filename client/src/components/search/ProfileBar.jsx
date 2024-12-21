import React from 'react'
import { Avatar, Button, Stack, Typography } from '@mui/material'

const ProfileBar = () => {
    return (
        <>
            <Stack flexDirection={"row"} justifyContent={"space-between"} px={1} py={2} mx={"auto"} boxShadow={"5px 5px 5px gray"}
            width={"90%"} borderRadius={'15px'} sx={{":hover":{cursor:"pointer"}}}>
                <Stack flexDirection={"row"} gap={2}>
                    <Avatar src='' alt=''/>
                    <Stack flexDirection={"column"} >
                        <Typography variant='h6' fontWeight={"bold"} fontSize={"1rem"}>Sagar75</Typography>
                        <Typography variant='caption' color='gray' fontSize={"1.1rem"}>This is bio</Typography>
                        <Typography variant='caption' fontSize={"1rem"}>3 followers</Typography>
                    </Stack>
                </Stack>
                <Button size='medium' sx={{bgcolor:"#1877F2",color:"white",borderRadius:'10px',p:2,height:40}}>Follow</Button>
            </Stack>
        </>
    )
}

export default ProfileBar