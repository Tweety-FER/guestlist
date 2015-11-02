var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.sass('app.scss');
    mix.scripts([
      'angular.js',
      'angular-resource.js',
      'ui-route.min.js',
      'ui-bootstrap-tpls-0.14.3.min.js',
      'app.js',
      'auth.factory.js',
      'undo.factory.js',
      'auth.controller.js',
      'form.controller.js',
      'list.controller.js',
      'navbar.controller.js',
      'modal.controller.js',
      'modal.factory.js'
    ]);
});
