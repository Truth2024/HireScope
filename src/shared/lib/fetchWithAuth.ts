// import { rootStore } from '@store/RootStore';

// // 1. Переменные вне функции для отслеживания состояния
// let isRefreshing = false;
// let refreshPromise: Promise<string | null> | null = null;

// export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
//   const authStore = rootStore.authStore;
//   let accessToken = authStore.accessToken;
//   console.log('FETCH WITH AUTH CALLED');
//   console.log('INPUT:', input);
//   console.log('ENV:', process.env.NEXT_PUBLIC_API_URL);
//   const res = await fetch(input, {
//     ...init,
//     headers: {
//       ...init?.headers,
//       ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//   });

//   if (res.status !== 401) return res;

//   // 2. Если получили 401, начинаем процесс обновления
//   if (!isRefreshing) {
//     isRefreshing = true;

//     // Создаем промис, который будут ждать все остальные "параллельные" запросы
//     refreshPromise = (async () => {
//       try {
//         const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
//           method: 'POST',
//           credentials: 'include',
//         });

//         if (!refreshRes.ok) throw new Error('Refresh failed');

//         const data = await refreshRes.json();
//         authStore.setUser(data.user, data.accessToken);

//         return data.accessToken as string;
//       } catch (err) {
//         authStore.logout();
//         return null;
//       } finally {
//         // Очищаем состояние после завершения
//         isRefreshing = false;
//         refreshPromise = null;
//       }
//     })();
//   }

//   // 3. Ждем завершения обновления (неважно, были мы первыми или "пристроились" в очередь)
//   const newToken = await refreshPromise;

//   if (!newToken) {
//     // Если обновить не удалось — выкидываем ошибку или возвращаем исходный 401
//     throw new Error('Session expired');
//   }

//   // 4. Повторяем запрос с новым токеном
//   return fetch(input, {
//     ...init,
//     headers: {
//       ...init?.headers,
//       Authorization: `Bearer ${newToken}`,
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//   });
// }
