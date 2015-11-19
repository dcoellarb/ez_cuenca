/**
 * Created by dcoellar on 11/18/15.
 */

(function() {

    //Constructor
    var constructor;

    //"Public" Methods
    var local_pedidos_pendientes;
    var local_confirmar_pedido;
    var local_rechazar_pedido;
    var local_transportista_statistics;

    angular.module("easyRuta")
        .run(function($rootScope){
            //Parse.initialize("LRW3NBrk3JYLeAkXrpTF2TV0bDPn5HQTndrao8my", "e6v72X3KgdBeXe0JZ5cWrSBMmHZ1GIqtEIRICcp3");//PROD
            Parse.initialize("2hLYHTAUJ9QXMWxQTXsOIZ2jXJLGtMauw2QN34fE", "xSiGu1HbOBQvzcd7ItdgGGyMq2IcpvKmCAFjhY2T");//QA

            var currentUser = Parse.User.current();
            if (currentUser) {
                $rootScope.loggedInUser = currentUser.id;
                console.dir(currentUser);
            }
        })

        .factory('data_services',function() {
            return constructor;
        });

    //Constructor
    constructor = {
        get_pedidos_pendientes : function(params,callback) { local_pedidos_pendientes(params,callback); },
        confirmar_pedido : function(params,callback) { local_confirmar_pedido(params,callback); },
        rechazar_pedido : function(params,callback) { local_rechazar_pedido(params,callback); },
        transportista_statistics : function(params,callback) { local_transportista_statistics(params,callback); }
    };

    //"Public" Methods
    local_pedidos_pendientes = function(params,callback){
        var Pedido = Parse.Object.extend("Pedido");

        var queryPendientes = new Parse.Query(Pedido);
        queryPendientes.equalTo("Estado", "Pendiente");
        var queryPendientesConfirmacion = new Parse.Query(Pedido);
        queryPendientesConfirmacion.equalTo("Estado", "PendienteConfirmacion");

        var mainQuery = Parse.Query.or(queryPendientes, queryPendientesConfirmacion);
        mainQuery.include("CiudadOrigen");
        mainQuery.include("CiudadDestino");
        mainQuery.include("Transportista");
        mainQuery.addDescending("createdAt");
        mainQuery.find({
            success: function(results) {
                callback(params,null,results);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    }
    local_confirmar_pedido = function(params,callback){
        params[0].set('Estado','Activo');
        params[0].save(null, {
            success: function(pedidoUpdated) {
                callback(params,null,pedidoUpdated);
            },
            error: function(error){
                console.log(error);
                callback(params,error,null);
            }
        });
    }
    local_rechazar_pedido = function(params,callback){
        params[0].add('TransportistasBloqueados',params[0].get('Transportista').id);
        params[0].unset('Transportista');
        params[0].set('Estado','Pendiente');
        params[0].save(null, {
            success: function(pedidoUpdated) {
                callback(params,null,pedidoUpdated);
            },
            error : function(error){
                callback(params,error,null);
            }
        });
    };
    local_transportista_statistics = function(params,callback){
        Parse.Cloud.run('transportistaStatistics', { transportista: params[0]}, {
            success: function(statistics) {
                callback(params,null,statistics);
            },
            error: function(error) {
                callback(params,error,null);
            }
        });
    }
})();