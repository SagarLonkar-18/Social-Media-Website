import { Avatar, AvatarGroup, Badge, Stack, Stepper } from '@mui/material'
import React from 'react'

const Post1 = () => {
    return (
        <>
            <Stack flexDirection={"column"} alignItems={"center"} justifyContent={"space-between"}>
                {/* Inside badge there is avatar */}
                <Badge overlap='circular' anchorOrigin={{vertical:"bottom",horizontal:"right"}}
                    badgeContent={
                        <Avatar alt='+' src='' sx={{
                            width:20, height:20, bgcolor:'green', position:'relative', right:4, bottom:4
                        }}> + </Avatar>
                    }
                >
                    <Avatar alt='avatar' src='' sx={{width:40,height:40}}/>
                </Badge>
                <Stack flexDirection={"column"} alignItems={"center"} gap={2} height={"100%"}>
                    <Stepper orientation={'vertical'} activeStep={0} sx={{
                        border:'1px solid gray',
                        width:"0px",
                        height:"100%",
                        marginTop:"5px"
                    }}></Stepper>
                    <AvatarGroup  max={3} sx={{
                        '& .MuiAvatar-root':{
                            width:24,
                            height:24,
                            fontSize:12,
                        }
                    }}>
                        <Avatar src='' alt=''/>
                    </AvatarGroup>
                </Stack>
            </Stack>
        </>
    )
}

export default Post1