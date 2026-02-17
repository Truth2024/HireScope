/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  tabWidth: 2, // размер отступа
  printWidth: 100, // перенос строк после 100 символов
  singleQuote: true, // использовать одинарные кавычки
  semi: true, // точка с запятой в конце
  trailingComma: 'es5', // запятые в многострочных объектах/массивах
  useTabs: false, // отступы пробелами
};

export default config;
