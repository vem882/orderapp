import axios from 'axios';
import { fetchUtils } from 'react-admin';

const httpClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

const dataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${resource}?${fetchUtils.queryParameters(query)}`;

    const response = await httpClient.get(url);
    return {
      data: response.data,
      total: parseInt(response.headers['x-total-count']),
    };
  },

  getOne: async (resource, params) => {
    const response = await httpClient.get(`${resource}/${params.id}`);
    return { data: response.data };
  },

  getMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${resource}?${fetchUtils.queryParameters(query)}`;

    const response = await httpClient.get(url);
    return { data: response.data };
  },

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({ ...params.filter, [params.target]: params.id }),
    };
    const url = `${resource}?${fetchUtils.queryParameters(query)}`;

    const response = await httpClient.get(url);
    return {
      data: response.data,
      total: parseInt(response.headers['x-total-count']),
    };
  },

  update: async (resource, params) => {
    const response = await httpClient.put(`${resource}/${params.id}`, params.data);
    return { data: response.data };
  },

  updateMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const response = await httpClient.put(`${resource}?${fetchUtils.queryParameters(query)}`, params.data);
    return { data: response.data };
  },

  create: async (resource, params) => {
    const response = await httpClient.post(resource, params.data);
    return { data: { ...params.data, id: response.data.id } };
  },

  delete: async (resource, params) => {
    await httpClient.delete(`${resource}/${params.id}`);
    return { data: { id: params.id } };
  },

  deleteMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    await httpClient.delete(`${resource}?${fetchUtils.queryParameters(query)}`);
    return { data: params.ids };
  },
};

export default dataProvider;
