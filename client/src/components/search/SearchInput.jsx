import React from 'react'
import {InputAdornment, TextField} from '@mui/material'
import {FaSearch} from 'react-icons/fa'

const SearchInput = () => {
    return (
        <>
            <TextField sx={{
                width:"90%",
                maxWidth:"750px",
                boxShadow:"5px 5px 5px gray",
                borderRadius:"15px",
                px:1, py:1, my:5, mx:"auto",
                "& .MuiOutlinedInput-root":{
                    color:"black",
                    '& fieldset':{
                        border:"none", 
                    }
                }
            }}
            placeholder='Search user' 
            InputProps={{
                startAdornment:(
                    <InputAdornment position='start' sx={{color:"gray"}}>
                        <FaSearch/>
                    </InputAdornment>
                )
            }}
            />
        </>
    )
}

export default SearchInput