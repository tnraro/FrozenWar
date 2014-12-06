// This script loads objects to domain.
var vm = require('vm');
var fs = require('fs');
var path = require('path');

// Load base library first;
var scope = require('../shared/base.js');

var domain = new scope.Domain();
scope.domain = domain;
scope.console = console;

var sandbox = vm.createContext(scope);

// Load ../shared/urls.json
var urls = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../shared/urls.json')));

var sharedPath = path.resolve(__dirname, '../shared/');

urls.forEach(function(value) {
    var source = fs.readFileSync(path.resolve(sharedPath, value));
    vm.runInContext(source, sandbox, value);
});

module.exports = scope.domain;