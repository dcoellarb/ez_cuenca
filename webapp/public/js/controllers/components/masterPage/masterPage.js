/**
 * Created by dcoellar on 9/15/15.
 */

(function(){

    //Variables
    var ctlr;
    var local_rootScope;
    var master_scope;
    var local_window;
    var local_uiModal;
    var local_master_page_viewmodel;
    var local_utils;

    //Constructor
    var init;

    //"Public" Methods
    var local_inicio;
    var local_logout;
    var local_scrollTo;
    var local_toggleLogin;
    var local_showNotifications;

    //Data Callbacks
    var local_get_saldo_callback;
    var local_get_notifications_count_callback;

    //Notifications callbacks
    var pedido_confirmado_callback;
    var pedido_confirmado_proveedor_callback;
    var pedido_cancelado_callback;
    var nueva_notificacion_callback;
    var clear_notifications_callback;

    angular.module("easyRuta")
        .controller('MasterPageController',function($rootScope,$scope,$window,$uibModal,master_page_viewmodel,utils) {

            ctlr = this;
            local_rootScope = $rootScope;
            master_scope = $scope;
            local_window = $window;
            local_uiModal = $uibModal;
            local_master_page_viewmodel = master_page_viewmodel;
            local_utils = utils;

            ctlr.Inicio = function() { local_inicio(); };
            ctlr.toggleLogin = function(show) { local_toggleLogin(show); };
            ctlr.Logout = function() { local_logout(); };
            ctlr.scrollTo = function(id) { local_scrollTo(id); };
            ctlr.showNotifications = function() { local_showNotifications(); };

            init()

        });

    //Constructor
    init = function(){
        local_toggleLogin(false);
        local_master_page_viewmodel.get_saldo(local_get_saldo_callback);
        local_master_page_viewmodel.get_notifications_count(local_get_notifications_count_callback);

        local_rootScope.$on(local_rootScope.channels.pedido_confirmado, pedido_confirmado_callback);
        local_rootScope.$on(local_rootScope.channels.pedido_confirmado_proveedor, pedido_confirmado_proveedor_callback);
        local_rootScope.$on(local_rootScope.channels.pedido_cancelado, pedido_cancelado_callback);
        local_rootScope.$on(local_rootScope.channels.nueva_notificacion, nueva_notificacion_callback);
        local_rootScope.$on(local_rootScope.channels.clear_notifications, clear_notifications_callback);
    };

    //"Public" Methods
    local_inicio = function(){
        if (local_rootScope.cliente) {
            local_window.location = "/#/inicioClientes"
        }
        if (local_rootScope.proveedor) {
            local_window.location = "/#/inicioProveedores"
        }
    };
    local_logout = function(){
        local_rootScope.loggedInRole = undefined;
        local_rootScope.proveedor = undefined;
        local_rootScope.cliente = undefined;
        Parse.User.logOut();
        local_window.location.href = '/';
    };
    local_scrollTo = function(id){
        $('html, body').animate({
            scrollTop: $("#" + id).offset().top
        }, 2000);
    }
    local_toggleLogin = function(show){
        if (show){
            local_scrollTo("content0");
            $("#login").show()
        }else{
            $("#login").hide()
        }
    };
    local_showNotifications = function(){
        var modalInstance = local_uiModal.open({
            animation: master_scope.animationsEnabled,
            templateUrl: 'notifications_center.html',
            controller: 'notifications_center_controller as ctlr'
        });

        //modalInstance.result.then(null, function () {
        //    console.log("Modal canceled.");
        //});
    };

    //Data callbacks
    local_get_saldo_callback = function(error,saldo){
        if (!error){
            ctlr.showSaldo = false;
            ctlr.Saldo = 0;
            if (local_rootScope.loggedInRole.getName() == "proveedor"){
                ctlr.showSaldo = true;
                ctlr.Saldo = local_utils.formatCurrency(saldo);
            }
            master_scope.$apply();
        }
    };
    local_get_notifications_count_callback = function(error,count){
        ctlr.notificationsCount = count;
        master_scope.$apply();
    }

    //Notifications callbacks
    pedido_confirmado_callback = function(m) {
        local_master_page_viewmodel.get_saldo(local_get_saldo_callback);
    };
    pedido_confirmado_proveedor_callback = function(m) {
        local_master_page_viewmodel.get_saldo(local_get_saldo_callback);
    };
    pedido_cancelado_callback = function(m) {
        local_master_page_viewmodel.get_saldo(local_get_saldo_callback);
    };
    nueva_notificacion_callback = function(m) {
        local_master_page_viewmodel.get_notifications_count(local_get_notifications_count_callback);
    };
    clear_notifications_callback = function(m) {
        local_master_page_viewmodel.get_notifications_count(local_get_notifications_count_callback);
    };
})();