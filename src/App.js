import React from 'react';
import { Admin, Resource, fetchUtils } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { ShipmentList, ShipmentCreate, ShipmentEdit } from './shipments';
import authProvider from './authProvider';
import LoginPage from './LoginPage';

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }

  const token = localStorage.getItem('token');
  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }

  return fetchUtils.fetchJson(url, options);
};

const dataProvider = jsonServerProvider("/api", httpClient);

const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider} loginPage={LoginPage}>
    <Resource name="shipments" list={ShipmentList} edit={ShipmentEdit} create={ShipmentCreate} />
  </Admin>
);

export default App;
