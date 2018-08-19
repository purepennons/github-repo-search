const path = require('path');

module.exports = {
  require: ['normalize.css'],
  components: 'src/components/**/[A-Z]*.{js,jsx}',
  skipComponentsWithoutExample: true
};
