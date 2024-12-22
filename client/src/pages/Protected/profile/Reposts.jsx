import React from 'react'
import {Stack, useMediaQuery} from '@mui/material'
import Post from '../../../components/home/Post'

const Reposts = () => {
    const _700 = useMediaQuery("(min-width:700)");  
    return (
        <>
            <Stack flexDirection={"column"} gap={2} marginBottom={10} width={_700 ? "800px" : "90%"} mx={"auto"}>
                <Post/>
                <Post/>
            </Stack>
        </>
    )
}

export default Reposts