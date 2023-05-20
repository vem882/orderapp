import React from 'react';
import { Login } from 'react-admin';
import './App.css';



const LoginPage = (props) => {
  const { classes } = props;
  return (
    <Login
      backgroundImage="" // Poista oletus taustakuva
      classes={classes}
      {...props}
    />
  );
};

export default (LoginPage);
