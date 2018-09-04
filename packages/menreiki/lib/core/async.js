import Loadable from 'react-loadable';

let DefaultLoading = function() {
  return null;
};

export default function async(
  module,
  { loading = DefaultLoading, ...rest } = {}
) {
  return Loadable({
    delay: 0,
    ...rest,
    loader: module,
    loading,
  });
}

async.setDefaultLoading = function setDefaultLoading(LoadingComponent) {
  DefaultLoading = LoadingComponent;
};
