import { get } from '../common/fetch';

const getTitleUrl = '/title.json';
export const getTitle = () => get(getTitleUrl);
