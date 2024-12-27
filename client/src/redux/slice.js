import { createSlice } from '@reduxjs/toolkit'

export const serviceSlice = createSlice({
    name: 'service',
    initialState:{ 
        openAddPostModal : false,
        openEditProfileModal : false,
        anchorE1 : null,
        anchorE2 : null,
        darkMode : false,
    },
    reducers: {
        addPostModal : (state, action) => {
            // payload means the one which we pass in action
            state.openAddPostModal = action.payload;
        },
        editProfileModal : (state, action) => {
            state.openEditProfileModal = action.payload;
        },
        toggleMainMenu : (state, action) => {
            state.anchorE1 = action.payload;
        },
        toggleMyMenu : (state, action) => {
            state.anchorE2 = action.payload;
        },
        toggleColorMode : (state, action) => {
            state.darkMode = !state.darkMode;
        }
    },
})


export const { addPostModal, editProfileModal, toggleMainMenu, toggleMyMenu , toggleColorMode} = serviceSlice.actions;

export default serviceSlice.reducer;