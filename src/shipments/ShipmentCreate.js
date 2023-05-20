// src/shipments/ShipmentCreate.js
import * as React from "react";
import { Create, SimpleForm, TextInput, NumberInput } from "react-admin";

export const ShipmentCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="orderNumber" label="Tilausnumero" />
      <NumberInput source="packageCount" label="Pakettien määrä" />
      <TextInput source="courier" label="Kuljetusyhtiö" />
      <TextInput source="trackingNumber" label="Seurantanumero" />
    </SimpleForm>
  </Create>
);
