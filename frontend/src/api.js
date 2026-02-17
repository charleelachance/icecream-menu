import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3001',
});

export const getFlavors = (sort = 'name') =>
    API.get(`/flavors?sort=${sort}`);
export const getMenu = (date) => API.get(`/menus/${date}`);
export const updateMenu = (date, flavorIds) => API.put(`/menus/${date}`, { flavorIds });
export const putMenu = (date, body) => API.put(`/menus/${date}`, body);
export const updateFlavorStock = (id, inStock) => API.patch(`/flavors/${id}`, { in_stock: inStock });
