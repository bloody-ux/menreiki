/**
 * Model for Home Page
 */
export default {
  namespace: 'home',
  state: {
    title: '',
  },
  effects: {
    * getTitle(_, { put }) {
      // simulate async operation
      const title = yield new Promise(((resolve) => {
        setTimeout(() => {
          resolve('hello world');
        }, 200);
      }));

      yield put({
        type: 'setter',
        payload: {
          title,
        },
      });

      return title;
    },
  },
  reducers: {
    setter(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
