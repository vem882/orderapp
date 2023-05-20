import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  DeleteButton,
  Filter,
  TextInput,
} from "react-admin";
import { useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';

import dataProvider from '../dataProvider';

const ShipmentFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="orderNumber" alwaysOn />
  </Filter>
);

export const ShipmentList = (props) => {
  const location = useLocation();
  const { data: shipments, isLoading } = useQuery('shipments', () => dataProvider.getList('shipments', {
    pagination: { page: 1, perPage: 10 },
    sort: { field: 'createdAt', order: 'DESC' },
    filter: location.search,
  }));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <List {...props} filters={<ShipmentFilter />}>
      <Datagrid rowClick="edit">
        <TextField source="orderNumber" label="Tilausnumero" />
        <NumberField source="packageCount" label="Pakettien määrä" />
        <TextField source="courier" label="Kuljetusyhtiö" />
        <TextField source="trackingNumber" label="Seurantanumero" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};
