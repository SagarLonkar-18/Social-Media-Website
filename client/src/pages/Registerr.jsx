import { Button, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'

const Registerr = () => {

    const _700 = useMediaQuery("(min-width:700px)");
    
    const [login,setLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const toggleLogin = () => {
        setLogin((pre)=>!pre);
    }

    const handleLogin = () => {
        const data = {
            // These are identifiers
            // username : username (identifier:value) if both are same then we can write single only
            email,
            password
        }
        console.log(data);
    }

    const handleRegister = () => {
        const data = {
            username,
            email,
            password
        }
        console.log(data);
    }

    return (
        <>
            <Stack width={"100%"} height={"97vh"} flexDirection={"row"} justifyContent={"center"} alignContent={"center"} 
                sx = {_700 ? {
                    backgroundImage:'url("/register-bg.webp")',
                    backgroundRepeat:'no-repeat',
                    backgroundSize:'100% 450px',
                } : null}
            >
                <Stack flexDirection={"column"} width={_700 ? "40%" : "90%"} gap={2} mt={_700 ? 30 : 10}>
                    <Typography variant='h5' fontSize={_700 ? "1.5rem" : "1.2rem"} fontWeight={"bold"} alignSelf={"center"}>
                        {login ? "Login with email" : "Register with mail"}
                    </Typography>
                    {
                        login ? null : <TextField variant='outlined' placeholder='Enter your username' onChange={(e)=>{setUsername(e.target.value)}}/>
                    }
                    <TextField variant='outlined' placeholder='Enter your email' onChange={(e)=> setEmail(e.target.value)}/>
                    <TextField variant='outlined' placeholder='Enter your password' onChange={(e)=>{setPassword(e.target.value)}}/>
                    <Button size='large' sx={{
                        width:"100%",
                        height:52,
                        backgroundColor:"green",
                        color:"white",
                        fontSize:"1rem",
                        ":hover":{
                            bgcolor:"blue",
                            cursor:"pointer"
                        }
                    }} onClick={login ? handleLogin : handleRegister}>{login ? "Login" : "Sign Up"}</Button>
                    <Typography variant='subtitle2' fontSize={_700 ? "1.3rem" : "1rem"} alignSelf={"center"}>
                        {login ? "Don't have an account? " : "Already have an account? "}<span className='login-link' onClick={toggleLogin}>{login ? "Sign Up" : "Login"}</span>
                    </Typography>
                </Stack>
            </Stack>
            
        </>
    )
}

export default Registerr