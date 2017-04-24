angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })



  .state('offers', {
    url: '/page8',
    templateUrl: 'templates/offers.html',
    controller: 'offersCtrl'
  })

  

  .state('orders', {
    url: '/orders',
    templateUrl: 'templates/orders.html',
    controller: 'ordersCtrl'
  })
  .state('report', {
    url: '/report',
    templateUrl: 'templates/report.html',
    controller: 'reportCtrl'
  })
 
  
 
  .state('orderDetail', {
    url: '/orderDetail/:id',
    templateUrl: 'templates/orderDetail.html',
    controller: 'orderDetailCtrl'
  })
  .state('settings', {
    url: '/tabLogin2',
    templateUrl: 'templates/settings.html',
    controller: 'settingsCtrl'
  })


$urlRouterProvider.otherwise('login')



});
