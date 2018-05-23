import React from 'react';
import { Redirect } from 'react-router-dom';

export default function redirect({ to, push, exact, strict, from }) {
  const C = () => (
    <Redirect
      from={from}
      to={to}
      push={push}
      exact={exact}
      strict={strict}
    />
  );

  C.displayName = `redirect(${from || ''}) => ${to}`;

  return C;
}
