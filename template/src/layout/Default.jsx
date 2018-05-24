import React from 'menreiki/react';
import { NavLink } from 'menreiki/router';
import { PropTypes } from 'menreiki';


export default function DefaultLayout({ children }) {
  return (
    <div className="default-layout">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/oldpage">Old Page</NavLink>
      <NavLink to="/notfound">Not Found</NavLink>
      <br />
      {children}
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
