import { atomWithLocalStorage } from './utils';

const isTemporary = atomWithLocalStorage('isTemporary', false);
const defaultTemporaryChat = atomWithLocalStorage('defaultTemporaryChat', false);

export default {
  isTemporary,
  defaultTemporaryChat,
};
