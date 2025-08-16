import {createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        role: "",
        email: "",
        name: "",
        id: ""
    }
};
export const accountSlice = createSlice({
    name: 'account',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        runLoginAction: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload;
        },
        runGetAccountAction: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers.
            state.isAuthenticated = true;
            state.isLoading = false
            state.user = action.payload.user;
        },
        runLogoutAction: (state, action) => {
            state.isAuthenticated = false;
            localStorage.removeItem('access_token');
            state.user = {
                role: "",
                email: "",
                name: "",
                id: ""
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

export const { runLoginAction, runGetAccountAction, runLogoutAction, doUploadAvatarAction, doUpdateUserAction } = accountSlice.actions;

export default accountSlice.reducer;