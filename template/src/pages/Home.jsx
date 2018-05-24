import React from 'menreiki/react';
import { Link } from 'menreiki/router';
import { PropTypes, async, connect } from 'menreiki';
import HomeModel from '../model/home';

const Async = async(import('../components/Async'));

function Home({ title }) {
  return (
    <div>
      <h1>{title}</h1>
      Welcome to home page, go to <Link to="/about">About</Link> Page

      <br />

      <Async title="Title From Parent" />
    </div>
  );
}

Home.propTypes = {
  title: PropTypes.string,
};

Home.defaultProps = {
  title: '',
};

// called before init, when component is rendering in route
Home.preInit = function({ app }) {
  // here only sync method is allowed
  app.model(HomeModel);
};

// called after preInit
Home.init = function({ store }) {
  // always return a promise, or else ssr won't work correctly
  return store.dispatch({
    type: 'home/getTitle',
  });
};

function mapStateToProps({ home }) {
  return {
    title: home.title,
  };
}

export default connect(mapStateToProps)(Home);
