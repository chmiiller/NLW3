import axios from 'axios';

const api = axios.create({
    baseURL: 'http://199.198.0.130:3333',
});

export default api;
