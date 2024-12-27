import { Stack, Typography, useMediaQuery } from '@mui/material'
import React from 'react';
import { IoIosMore } from "react-icons/io";
import Post1 from './post/Post1';
import Post2 from './post/Post2';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMyMenu } from '../../redux/slice';

const Post = () => {

    const { darkMode } = useSelector(state=>state.service); 

    const _300 = useMediaQuery("(min-width:300px)");
    const _400 = useMediaQuery("(min-width:400px)");
    const _700 = useMediaQuery("(min-width:700px)");

    const dispatch = useDispatch();

    const handleOpenMenu = (e) => {
        dispatch(toggleMyMenu(e.currentTarget))
    }

    return (
        <>
            <Stack flexDirection={"row"} justifyContent={"space-between"} borderBottom={"3px solid gray"} p={_700 ? 2 : _400 ? 1 : '5px'} mx={"auto"}
                width={_700 ? "70%" : _300 ? "90%" : "100%"}
                sx={{
                    ":hover":{
                        cursor: "pointer",
                        boxShadow:_700 ? "10px 10px 10px 10px gray" : "",
                        transition:"all ease-in-out 0.3s"
                    }
                }}
            >
                <Stack flexDirection={"row"} gap={_700 ? 2 : 1}>
                    <Post1/>
                    <Post2/>
                </Stack>
                <Stack flexDirection={"row"} justifyContent={"center"} gap={1} fontSize={"1rem"}>
                    <Typography variant='caption' color={darkMode ? 'white' : "GrayText"} fontSize={'1rem'} position={"relative"} top={2}>24hrs</Typography>
                    <IoIosMore size={_700 ? 28 : 20} onClick={handleOpenMenu}/>
                </Stack>
            </Stack>
        </>
    )
}

export default Post