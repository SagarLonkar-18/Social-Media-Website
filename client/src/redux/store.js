import { configureStore } from '@reduxjs/toolkit'
import serviceReducer from "./slice"

export const store = configureStore({
    reducer: {
        service: serviceReducer,
    },
})