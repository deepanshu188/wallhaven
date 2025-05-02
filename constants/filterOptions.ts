import * as SecureStore from 'expo-secure-store';
const hasApiKey = SecureStore.getItem('apiKey');

const order = [
  { label: 'Desc', value: 'desc' },
  { label: 'Asc', value: 'asc' }
];
const sorting = ['Random', 'Views', 'Favorites', 'Toplist']
  .map(sorting => ({ label: sorting, value: sorting.toLowerCase() }));

const purity = [
  { label: 'SFW', value: '100' },
  { label: 'All', value: '111', disabled: hasApiKey ? false : true },
  { label: 'Sketchy', value: '010' }, { label: 'SFW + Sketchy', value: '110' }
];

const categories = [
  { label: 'All', value: '111' },
  { label: 'General', value: '100' },
  { label: 'Anime', value: '010' },
  { label: 'People', value: '001' },
  { label: 'Gen + People', value: '101' }
];

const filterOptions = { sorting, purity, categories, order };

export default filterOptions;
