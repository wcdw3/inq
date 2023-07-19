module.exports = {
  'src/**/*.{tsx,ts}': [() => 'tsc --noEmit', 'eslint'],
};
