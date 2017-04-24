angular.module('app.services', [])

.factory("UserService", function($http,$q){ // Service cho user
  var self = { 
    'curShipper' : {},
    'getCurShipper':function(){
        return self.curShipper;
    },
    'setCurShipper':function(shipper){
        self.curShipper=shipper;
    },
    'getShipper': function(username){  // Hàm lấy user
        var d = $q.defer();
        $http.get("http://172.20.10.3:3000/api/users/"+username)
        .success(function(data){
          d.resolve(data);
        })
        .error(function(msg){
            d.reject("error");
        });
        return d.promise;
    }
  };
  return self;
})
.factory("ItemService", function($http,$q){ // Service cho post
  var self = {  // tạo một đối tượng service, chứa các hàm và biến
    'items' : [], // chứa posts lấy về
    'getItemById': function(itemId){ // Hàm lấy tất cả bài của một userId
        var d = $q.defer();
        $http.get("http://172.20.10.3:3000/api/items")
        .success(function(data){
          d.resolve(data);
        })
        .error(function(msg){
            d.reject("error");
        });
        return d.promise;
    },
    'getAllItems': function(){ // Hàm lấy tất cả các bài post hiện tại
        var d = $q.defer();
        $http.get("http://172.20.10.3:3000/api/items")
        .success(function(data){
          d.resolve(data);
        })
        .error(function(msg){
            d.reject("error");
        });
        return d.promise;
    }
  };
  return self;
})
.factory('sharedUtils',function($ionicLoading,toaster){
    var functionObj={};
    functionObj.showLoading=function(){ 
      $ionicLoading.show({
        content: '<i class=" ion-loading-c"></i> ', // The text to display in the loading indicator
        animation: 'fade-in', // The animation to use
        showBackdrop: true, // Will a dark overlay or backdrop cover the entire view
        maxWidth: 200, // The maximum width of the loading indicator. Text will be wrapped if longer than maxWidth
        showDelay: 0 // The delay in showing the indicator
      });
    };
    functionObj.hideLoading=function(){
      $ionicLoading.hide();
    };
    functionObj.showAlert = function(type,message) {
        toaster.pop({ type: type, body: message, timeout: 2000 });
    };

    return functionObj;

})
.factory('OrderService', function($http,$q){
    var self = {  // tạo một đối tượng service, chứa các hàm và biến
    'getOrderByShipperId': function(shipperId){ // lấy các đơn hàng shipper đã nhận    
        var d = $q.defer();
        $http.get("http://172.20.10.3:3000/api/orders/2/"+shipperId)    
        .success(function(data){
          d.resolve(data);
        })
        .error(function(msg){
            d.reject("error");
        });
        return d.promise;
    },
    'getOrderByConfirmed': function(){ // Hàm lấy tất cả bài của một userId      
        var d = $q.defer();
        $http.get("http://172.20.10.3:3000/api/orders/3/"+2)    
        .success(function(data){
          d.resolve(data);
        })
        .error(function(msg){
            d.reject("error");
        });
        return d.promise;
    },
    'getOrderById': function(itemId){ // Hàm lấy tất cả bài của một userId
        var d = $q.defer();
        $http.get("http://172.20.10.3:3000/api/orders/"+itemId)
        .success(function(data){
          d.resolve(data);
        })
        .error(function(msg){
            d.reject("error");
        });
        return d.promise;
    },
    'getOrderByIDate': function(shipperId){ // Hàm lấy tất cả bài của một userId      
        var d = $q.defer();
        $http.get("http://172.20.10.3:3000/api/ordersbyIDate/"+shipperId)    
        .success(function(data){
          d.resolve(data);
        })
        .error(function(msg){
            d.reject("error");
        });
        return d.promise;
    },
    'updateOrder': function(order){ // Hàm cập nhật thông tin user
        var d = $q.defer();
        $http.put("http://172.20.10.3:3000/api/orders/"+order._id,order)
        .success(function(data){
          d.resolve("success");
        })
        .error(function(msg){
            d.reject("error");
        });
        return d.promise;
    },
    'updateOrderStatus': function(order){ // Hàm cập nhật thông tin user
        var d = $q.defer();
        $http.put("http://172.20.10.3:3000/api/ordersStatus/"+order._id,order)
        .success(function(data){
          d.resolve("success");
        })
        .error(function(msg){
            d.reject("error");
        });
        return d.promise;
    },
    'addOrder': function(newOrder){ // Hàm thêm một order mới
        var d = $q.defer();
        $http.post("http://172.20.10.3:3000/api/orders/",newOrder) 
        .success(function(data){
          d.resolve("success");
        })
        .error(function(msg){
            d.reject("error");
        });
        return d.promise;
    }
  };
  return self;
  });

