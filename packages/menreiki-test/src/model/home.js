/**
 * Model for Home Page
 */

import { getTitle } from '../services/test';

export default {
  namespace: 'home',
  state: {
    title: '',
  },
  effects: {
    * getTitle({ payload }, { put }) {
      // simulate async operation
      const { data } = yield getTitle({
        ...payload,
      });

      yield put({
        type: 'setter',
        payload: {
          title: data.title,
        },
      });
    },
  },
  reducers: {
    setter(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
