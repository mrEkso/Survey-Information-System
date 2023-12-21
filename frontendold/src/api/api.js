import axios from "axios";

const urls = {
    auth: {
        register: 'register/',
        login: 'login/',
        logout: 'logout/',
    },
};

const defaultConfig = {
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
};

export const DefaultApiInstance = axios.create(defaultConfig);

export const AuthApi = {
    register(name, surname, email, phone, password) {
        const url = urls.auth.register;
        const data = {name, surname, email, phone, password};
        return DefaultApiInstance.post(url, data);
    },

    login(email, password) {
        const url = urls.auth.login;
        const data = {email, password};
        return DefaultApiInstance.post(url, data);
    },

    logout() {
        const url = urls.auth.logout;
        return DefaultApiInstance.post(url);
    },
};