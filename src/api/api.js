import axios from 'axios'

const api = axios.create({
baseURL: 'https://hrdemo.unitdtechnologies.com:2030',
});

export default api