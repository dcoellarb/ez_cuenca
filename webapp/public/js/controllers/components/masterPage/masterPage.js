/**
 * Created by dcoellar on 9/15/15.
 */

(function(){

    //Variables
    var ctlr;
    var local_rootScope;
    var master_scope;
    var local_window;
    var local_master_page_viewmodel;
    var local_utils;

    //Constructor
    var init;

    //"Public" Methods
    var local_logout;
    var local_scrollTo;
    var local_toggleLogin;

    //Data Callbacks
    var local_get_saldo_callback;

    //Notifications callbacks
    var pedido_confirmado_callback;
    var pedido_confirmado_proveedor_callback;
    var pedido_cancelado_callback;
    var pedido_cancelado_transportista_callback;
    var pedido_iniciado_callback;
    var pedido_cancelado_confirmado_proveedor_callback;

    angular.module("easyRuta")
        .controller('MasterPageController',function($rootScope,$scope,$window,master_page_viewmodel,utils) {

            ctlr = this;
            local_rootScope = $rootScope;
            master_scope = $scope;
            local_window = $window;
            local_master_page_viewmodel = master_page_viewmodel;
            local_utils = utils;

            ctlr.toggleLogin = function(show) { local_toggleLogin(show); };
            ctlr.Logout = function() { local_logout(); };
            ctlr.scrollTo = function(id) { local_scrollTo(id); };

            init()

        });

    //Constructor
    init = function(){
        local_toggleLogin(false);
        local_master_page_viewmodel.get_saldo(local_get_saldo_callback);

        local_rootScope.$on(local_rootScope.channels.pedido_confirmado, pedido_confirmado_callback);
        local_rootScope.$on(local_rootScope.channels.pedido_confirmado_proveedor, pedido_confirmado_proveedor_callback);
        local_rootScope.$on(local_rootScope.channels.pedido_cancelado, pedido_cancelado_callback);
    }

    //"Public" Methods
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
    }

    //Data callbacks
    local_get_saldo_callback = function(error,saldo){
        ctlr.showSaldo = false;
        ctlr.Saldo = 0;
        if (local_rootScope.loggedInRole.getName() == "proveedor"){
            ctlr.showSaldo = true;
            ctlr.Saldo = local_utils.formatCurrency(saldo);
        }
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
})();