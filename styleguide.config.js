const path = require('path');

module.exports = {
  require: ['normalize.css', path.join(__dirname, './src/Root.style.js')],
  components: 'src/components/**/[A-Z]*.{js,jsx}',
  skipComponentsWithoutExample: true
};
