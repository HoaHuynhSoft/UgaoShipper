angular.module('app.controllers', [])

.controller('loginCtrl', function($scope,$window,UserService,$rootScope,$ionicHistory,sharedUtils,$state,$ionicSideMenuDelegate) {
    $rootScope.extras = false; // Ẩn thanh slide menu
    $rootScope.userName = "";
    $scope.user = {};
    /// Khi logout thì xóa hết dữ liệu tạm
    $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope){
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
      }
      var un = $window.localStorage['username'];
      var pass = $window.localStorage['pass'];
      console.log(un+pass);
      if (un != "" && pass != ""){
        var user = {};
        user.UserName = un;
        user.Pass = pass;
        $scope.login(user);
      }
    });
    $scope.login = function(user) {
      if (!(user.UserName)||!(user.Pass)){
        sharedUtils.showAlert("warning","Bạn nhập dữ liệu chưa đúng");
        return;
      }
      UserService.getShipper(user.UserName) // lấy user bằng user name
        .then(function success(data){
            if((user.UserName == data.UserName) && (user.Pass == data.Pass) && data.Type ==3){
              
              $window.localStorage['username'] = user.UserName;
              $window.localStorage['pass'] = user.Pass;
              $window.localStorage['shipperID']=data._id;
              $rootScope.ShipperID=data._id;
              $rootScope.userName =data.FullName;
              $ionicHistory.nextViewOptions({
                historyRoot: true
              });
              UserService.setCurShipper(data);
              $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
              $rootScope.extras = true;
              sharedUtils.hideLoading();
              $state.go('orders', {}, {location: "replace"});
              $scope.user = {};
            }
              else{
                sharedUtils.showAlert("warning","Sai tài khoản và mật khẩu");
              }
        }, function error(msg){
          console.log(msg);
        });
    };



})

.controller('indexCtrl', function($scope,$window,$rootScope,sharedUtils,$ionicHistory,$state,$ionicSideMenuDelegate) {
    $scope.logout=function(){
      $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
        $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $rootScope.extras = false;
        sharedUtils.hideLoading();
        $window.localStorage['username']="";
        $window.localStorage['pass']="";
        
      $state.go('tabLogin.login', {}, {location: "replace"});
    }
  })

.controller('ordersCtrl', function($scope,$state,$filter,$rootScope,sharedUtils,OrderService,UserService) {
    $scope.isDisableDangNhan = false;
    $scope.isDisableCanGiao = true;
    $scope.isDisableDaGiao = false;
    $scope.orders = [];
    $scope.shipper = {};
    $scope.numberMaxItem= 10;
    $scope.filterOrder="";
    $rootScope.extras = true;
    $scope.noMoreItemsAvailable = true;
    $scope.$on('$ionicView.enter', function(ev) {
      sharedUtils.showLoading();
      /*$scope.shipper= UserService.getCurShipper();
      console.log(JSON.stringify( $scope.shipper));*/
      $scope.isDisableDangNhan = false;
      $scope.isDisableCanGiao = true;
      $scope.isDisableDaGiao = false;
      OrderService.getOrderByConfirmed()
        .then(function success(data){
           data.forEach(function(item, index){
             if (item.Status === 0)
                item.Status = "Đã hủy";
             else if (item.Status === 1)
                item.Status = "Đang đặt hàng";
             else if (item.Status === 2)
                item.Status = "Đã xác nhận";
             else if (item.Status === 3)
                item.Status = "Đã chuyển đi";
             else if (item.Status === 3)
                item.Status = "Thành công";
           });
           $scope.orders = data;
           $scope.noMoreItemsAvailable = false;
           sharedUtils.hideLoading();
        }, function error(msg){
          sharedUtils.showAlert("warning","Không lấy được danh sách đơn hàng, liên hệ 01649051057 để được hỗ trợ");
            console.log(msg);
            sharedUtils.hideLoading();
        });

    });
    $scope.canGiaoClick = function(){
      $scope.isDisableDangNhan = false;
      $scope.isDisableCanGiao = true;
      $scope.isDisableDaGiao = false;
      sharedUtils.showLoading();
       OrderService.getOrderByConfirmed()
        .then(function success(data){
           data.forEach(function(item, index){
             if (item.Status === 2)
                item.Status = "Đã xác nhận";
           });
           $scope.orders = data;
           $scope.noMoreItemsAvailable = false;
           sharedUtils.hideLoading();
        }, function error(msg){
          sharedUtils.showAlert("warning","Không lấy được danh sách đơn hàng, liên hệ 01649051057 để được hỗ trợ");
            console.log(msg);
            sharedUtils.hideLoading();
        });
    }
      $scope.dangNhanClick = function(){
      $scope.isDisableDangNhan = true;
      $scope.isDisableCanGiao = false;
      $scope.isDisableDaGiao = false;
       $scope.orders = [];
       sharedUtils.showLoading();
       OrderService.getOrderByShipperId(UserService.curShipper._id)
        .then(function success(data){
           data.forEach(function(item, index){
                if (item.Status == 3)
                {
                  item.Status = "Bạn cần chuyển đi";
                  $scope.orders.push(item);
                }
           });
           $scope.noMoreItemsAvailable = false;
           sharedUtils.hideLoading();
        }, function error(msg){
          sharedUtils.showAlert("warning","Không lấy được danh sách đơn hàng, liên hệ 01649051057 để được hỗ trợ");
            console.log(msg);
            sharedUtils.hideLoading();
        });
    }
    $scope.daGiaoClick = function(){
      $scope.isDisableDangNhan = false;
      $scope.isDisableCanGiao = false;
      $scope.isDisableDaGiao = true;
      $scope.orders = [];
      sharedUtils.showLoading();
       OrderService.getOrderByShipperId(UserService.curShipper._id)
        .then(function success(data){
           data.forEach(function(item, index){
                if (item.Status == 4)
                {
                  item.Status = "Thành công";
                  $scope.orders.push(item);
                }
                else if (item.Status == 0)
                {
                  item.Status = "Đã hủy";
                  $scope.orders.push(item);
                }
           });
           $scope.noMoreItemsAvailable = false;
           sharedUtils.hideLoading();
        }, function error(msg){
          sharedUtils.showAlert("warning","Không lấy được danh sách đơn hàng, liên hệ 01649051057 để được hỗ trợ");
            console.log(msg);
            sharedUtils.hideLoading();
        });
    }
    $scope.loadMore = function() {
      console.log('load more');
      if ($scope.numberMaxItem+3<=$scope.orders.length)
       {
         $scope.numberMaxItem+=3
         $scope.noMoreItemsAvailable = false;
       }
      else
        $scope.noMoreItemsAvailable = true;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.orderClick = function(_id){
      $state.go('orderDetail',{id: _id, location: "replace"});
    }

})

.controller('orderDetailCtrl', function($window,UserService,$scope,$state,$rootScope,$stateParams,sharedUtils,OrderService,$ionicPopup) {
  
  $rootScope.extras=true;
  $scope.curOrder = {};
  $scope.curShipper = {};
  $scope.headerInfo = false;
  $scope.isShowNhanButton = false;
  $scope.isShowSuccessButton = false;
  $scope.isShowCancelButton = false;
  $scope.headerInfoClick = function(){ // Hàm xử lí sự kiện click vào dòng info
     if ( $scope.headerInfo == false)
       $scope.headerInfo = true;
    else  $scope.headerInfo = false;
   }
  $scope.$on('$ionicView.enter', function(ev) {
    var orderId = $stateParams.id;
    /*UserService.getShipper($window.localStorage['username'])
    .then(function success(data){
      $scope.curShipper=data;
    },function error(msg){
      console.log(msg);
    });*/
    OrderService.getOrderById(orderId)
    .then(function success(data){
      $scope.isShowSaveButon = false;
      if(data.Status ==2){
        $scope.isShowNhanButton = true;
        $scope.isShowSuccessButton = false;
        $scope.isShowCancelButton = false;
      }
      else if(data.Status ==3){
        $scope.isShowNhanButton = false;
        $scope.isShowSuccessButton = true;
        $scope.isShowCancelButton = true;
      }
      else if(data.Status ==4){
        $scope.isShowNhanButton = false;
        $scope.isShowSuccessButton = false;
        $scope.isShowCancelButton = false;
      }
      else if(data.Status ==0){
        $scope.isShowNhanButton = false;
        $scope.isShowSuccessButton = true;
        $scope.isShowCancelButton = false;
      }
      if (data.Status === 0)
        data.Status = "Đã hủy";
      else if (data.Status === 2)
        data.Status = "Đã xác nhận";
      else if (data.Status === 3)
        data.Status = "Đã chuyển đi";
      else if (data.Status === 4)
        data.Status = "Đã giao thành công";
      $scope.curOrder = data;
      console.log( $scope.curOrder.OrderDetails);
      
    }, function error(msg){
          console.log(msg);
    });
  });
    $scope.confirm=function(){
      $scope.curOrder.Status=3; // xác nhận
      console.log($scope.curShipper._id);
      $scope.curOrder.Shipper=UserService.curShipper;
      console.log($scope.curOrder.Shipper);
      OrderService.updateOrderStatus($scope.curOrder)
      .then(function success(data){
        sharedUtils.showAlert("success","Nhận giao đơn hàng thành công");
        $scope.isShowSaveButon = false;
        $state.go('orders');
      }, function error(msg){
          sharedUtils.showAlert("warning","Đã có lỗi xảy ra!");
      });
    };
   
    $scope.ConfirmSuccess=function(){
      $scope.curOrder.Status=4; // xác nhận
      OrderService.updateOrderStatus($scope.curOrder)
      .then(function success(data){
        sharedUtils.showAlert("success","Xác nhận đơn hàng thành công");
         $state.go('orders');
      }, function error(msg){
          sharedUtils.showAlert("warning","Đã có lỗi xảy ra!");
      });
    };
     $scope.ConfirmCancel=function(){
      $scope.curOrder.Status=0; // xác nhận
      OrderService.updateOrderStatus($scope.curOrder)
      .then(function success(data){
        sharedUtils.showAlert("success","Xác nhận Hủy đơn hàng thành công");
         $state.go('orders');
      }, function error(msg){
          sharedUtils.showAlert("warning","Đã có lỗi xảy ra!");
      });
    };

})
.controller('reportCtrl', function($scope,$window,$rootScope,OrderService,sharedUtils) {

    $rootScope.extras=true;
    var shipperID= $window.localStorage['shipperID'];//$rootScope.ShipperID;
    console.log(shipperID);
    $scope.$on('$ionicView.enter', function(ev) {
    $scope.orders = [];
    $scope.ordersNew = [];
    $scope.numOfOrder=0;
    $scope.currency=0;
    $scope.numOfOrderReceived=0;
    $scope.currencyOfOrderReceived=0;
    OrderService.getOrderByConfirmed()
        .then(function success(data){
           data.forEach(function(item, index){
            if (item.Status === 2)
                item.Status = "Đã xác nhận";
           });
           $scope.ordersNew = data;
           sharedUtils.hideLoading();
        }, function error(msg){
          sharedUtils.showAlert("warning","Không lấy được danh sách đơn hàng, liên hệ 01649051057 để được hỗ trợ");
            console.log(msg);
            sharedUtils.hideLoading();
        });
    OrderService.getOrderByIDate(shipperID)
        .then(function success(data){
           data.forEach(function(item, index){
                if (item.Status == 4)
                {
                  $scope.numOfOrder++;
                  item.Status = "Thành công";
                  $scope.orders.push(item);
                  $scope.currency+=item.Total;
                }
                else if (item.Status == 0)
                {
                  $scope.numOfOrder++;
                  item.Status = "Đã hủy";
                  $scope.orders.push(item);
                }
                else if(item.Status==3)
                {
                  $scope.numOfOrderReceived++;
                   $scope.currencyOfOrderReceived+=item.Total;
                }
           });
           sharedUtils.hideLoading();
        }, function error(msg){
          sharedUtils.showAlert("warning","Không lấy được danh sách đơn hàng, liên hệ 01649051057 để được hỗ trợ");
            console.log(msg);
            sharedUtils.hideLoading();
        });

  });


    

});