/** @type {import('@lingui/conf').LinguiConfig} */
const linguiConfig = {
  locales: ['en', 'zh'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
  compileNamespace: 'ts',
  fallbackLocales: {
    default: 'en'
  }
}

export default linguiConfig
