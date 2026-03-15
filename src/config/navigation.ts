export const siteNavigation = {
  // Базовая навигация
  home: '/',
  vacancies: '/vacancies',
  candidates: '/candidates',
  terms: '/terms',
  privacy: '/privacy',
  started: '/started',
  login: '/login',
  register: '/register',
  profile: '/profile',
  candidateDetail: (id: string) => `/candidates/${id}`,
  vacancyDetail: (id: string) => `/vacancies/${id}`,
  notification: '/profile/notification',
  // Навигация для HR
  hr: {
    notification: '/profile/hr/notification',
    vacancies: '/profile/hr/vacancies',
    vacancyCreate: '/profile/hr/vacancies/create',
    vacancyDetail: (id: string) => `/profile/hr/vacancies/${id}`,
    candidateDetail: (id: string) => `/candidates/${id}`,
    vacancyCandidates: (id: string) => `/profile/hr/vacancies/${id}/candidates`,
    vacancyEdit: (id: string) => `/profile/hr/vacancies/${id}`,
  },
  // Навигация для кандидатов
  candidate: {
    main: '/profile/main',
  },
};
