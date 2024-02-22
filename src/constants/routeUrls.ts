export const authApi = {
  BASE_URL: '/auth',
  REGISTER_URL: '/register',
  LOGIN_URL: '/login',
  UPDATE_PASSWORD_URL: '/update-password',
  FORGOT_PASSWORD_URL: '/forgot-password',
  RESET_PASSWORD_URL: '/reset-password',
};

export const userAPI = {
  BASE_URL: '/user',
  ROOT_URL: '/',
  IDS_URL: '/:id',
  NESTED_SHOP_URL: '/:userId/shop',
};

export const shopAPI = {
  BASE_URL: '/shop',
  ROOT_URL: '/',
  IDS_URL: '/:id',
  NESTED_EVENT_URL: '/:shopId/event',
};

export const eventAPI = {
  BASE_URL: '/event',
  ROOT_URL: '/',
  IDS_URL: '/:id',
};

export const eventCategoryAPI = {
  BASE_URL: '/event-categories',
  ROOT_URL: '/',
  IDS_URL: '/:id',
};

export const shopCategoryAPI = {
  BASE_URL: '/shop-categories',
  ROOT_URL: '/',
  IDS_URL: '/:id',
};

export const emailAPI = {
  BASE_URL: '/send-email',
  ROOT_URL: '/',
};
