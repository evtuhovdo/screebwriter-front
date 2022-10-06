import localforage from 'localforage';
// @ts-ignore
import memoryDriver from 'localforage-memoryStorageDriver';
import { setup } from 'axios-cache-adapter';

// `async` wrapper to configure `localforage` and instantiate `axios` with `axios-cache-adapter`
async function axiosWithCache() {
  // Register the custom `memoryDriver` to `localforage`
  await localforage.defineDriver(memoryDriver);

  // Create `localforage` instance
  const forageStore = localforage.createInstance({
    // List of drivers used
    driver: [
      localforage.INDEXEDDB,
      localforage.LOCALSTORAGE,
      memoryDriver._driver,
    ],
    // Prefix all storage keys to prevent conflicts
    name: 'screenwriter-cache',
  });

  // Create `axios` instance with pre-configured `axios-cache-adapter` using a `localforage` store
  return setup({
    cache: {
      debug: false,
      maxAge: 24 * 60 * 60 * 1000,
      store: forageStore, // Pass `localforage` store to `axios-cache-adapter`
      invalidate: async (config, request) => {
        const { url = '' } = request;
        const isPremiumKey = url.indexOf('/lang-checks/check-premium/') !== -1;
        if (isPremiumKey) {
          const regularKey = url.replace('/lang-checks/check-premium/','/lang-checks/check/');
          await forageStore.removeItem(regularKey);
        }
      },
      // key: async (req: AxiosRequestConfig) => {
      //   let key = '';
      //
      //   if (req.url) {
      //     key = req.url;
      //   }
      //
      //   // Если делаем не премиум запрос, то узнаем есть ли в хранилище премиум
      //   if (key?.indexOf('/lang-checks/check/') !== -1) {
      //     const premiumKey = key.replace('/lang-checks/check/','/lang-checks/check-premium/');
      //     const existedPremium = await forageStore.getItem(premiumKey);
      //     console.log('existedPremium', existedPremium);
      //     // if (existedPremium) {
      //     //   key = premiumKey;
      //     // }
      //   }
      //
      //   return key;
      // }
    },
  });
}


export default axiosWithCache;
