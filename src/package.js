Package.describe({
  name: 'lawrentiy:materialDataTable',
  version: '0.0.1',
  summary: 'MaterialDataTable - it`s pretty react + material-ui ',
  git: '',
  documentation: 'README.md'
});

Npm.depends({
  "react": "15.1.0",
  "material-ui": "0.15.0"
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use('ecmascript');
  api.mainModule('dataTable.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('lawrentiy:material-ui-dataTable');
  api.mainModule('tests.js');
});
