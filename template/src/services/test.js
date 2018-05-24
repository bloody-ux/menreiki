import { get } from 'menreiki';

const getTitleUrl = '/title.json';
export const getTitle = () => get(getTitleUrl);
