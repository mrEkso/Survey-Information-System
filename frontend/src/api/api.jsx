import axios from "axios";

const urls = {
    auth: {
        register: 'register',
        login: 'login',
        logout: 'logout',
    },
    surveys: {
        surveys: 'surveys',
    },
};

const defaultConfig = {
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'withCredentials': 'false',
        'x-api-key': import.meta.env.VITE_APP_SECRET_KEY
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

export const SurveysApi = {
    all() {
        const url = urls.surveys.surveys;
        return DefaultApiInstance.get(url);
    },
    get(id) {
        const url = urls.surveys.surveys + id;
        return DefaultApiInstance.get(url);
    },
    create(title, subtitle, is_on) {
        const url = urls.surveys.surveys;
        const data = {title, subtitle, is_on};
        return DefaultApiInstance.post(url, data);
    },
    update(id, title, subtitle, is_on) {
        const url = urls.surveys.surveys;
        const data = {id, title, subtitle, is_on};
        return DefaultApiInstance.put(url, data);
    },
    delete(id) {
        const url = urls.surveys.surveys + id;
        return DefaultApiInstance.put(url);
    },
};