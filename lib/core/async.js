import universal from 'react-universal-component';

export default function async(module, { loading, error } = {}) {
  return universal(module, {
    loading,
    error,
  });
}
