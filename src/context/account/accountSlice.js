import {createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: {
        id: "",
        email: "",
        fullName: "",
        role: "",
    }
};
export const accountSlice = createSlice({
    name: 'account',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        runLoginAction: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers.
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        runGetAccountAction: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers.
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        runLogoutAction: (state, action) => {
            state.isAuthenticated = false;
            localStorage.removeItem('access_token');
            state.user = {
                id: "",
                emai: "",
                fullName: "",
                role: ""
            }
        },
        doUpdateUserAction: (state, action) => {
            state.user.avatar = action.payload.avatar;
            state.user.name = action.payload.name;
            state.user.phone = action.payload.phone
        }
    },
    extraReducers: (builder) => {

    },
});

export const { runLoginAction, runGetAccountActon, runLogoutAction, doUploadAvatarAction, doUpdateUserAction } = accountSlice.actions;

export default accountSlice.reducer;