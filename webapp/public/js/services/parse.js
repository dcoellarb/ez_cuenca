/**
 * Created by dcoellar on 11/18/15.
 */

(function() {

    //Variable
    var local_root_scope;
    var user_context_initialization_in_progress = false;
    var user_context_initialization_quebe;

    //Constructor
    var constructor;

    //"Public" Methods
    var local_guardar_pedidos;
    var local_get_cliente_proveedores;
    var local_get_plantillas;
    var local_get_plantilla;
    var local_delete_plantilla;
    var local_get_ciudades;
    var local_pedidos_pendientes;
    var local_pedidos_activos;
    var local_pedidos_en_curso;
    var local_get_pedidos_completados;
    var local_confirmar_pedido;
    var local_rechazar_pedido;
    var local_transportista_statistics;
    var local_transportistas_proveedor;
    var local_initializar_user_context;
    var local_proveedor_tomar_pedido;
    var local_proveedor_confirmar_pedido;
    var local_proveedor_rechazar_pedido;
    var local_timeout_pedido_cliente;
    var local_timeout_pedido_proveedor;
    var local_cancelar_pedido;
    var local_cancelar_pedido_proveedor;
    var local_iniciar_pedido;
    var local_finalizar_pedido;

    //Methods:
    var get_current_user_role;
    var get_current_user_proveedor;
    var get_current_user_cliente;

    //Reference callbacks
    var get_pedido_empresa_callback;
    var get_pedido_transportista_callback;

    //Adicional Queries
    var get_pedido_empresa;
    var get_pedido_transportista;

    //Data callbacks
    var timeout_pedido_proveedor_callback;
    var cancelar_pedido_proveedor_callback;
    var rechazar_pedido_callback;
    var proveedor_confirmar_pedido_get_empresa_callback;
    var proveedor_confirmar_pedido_callback
    var proveedor_rechazar_pedido_callback;
    var proveedor_tomar_pedido_get_empresa_callback
    var proveedor_tomar_pedido_callback;

    //Helpers
    var increment_transportista_pedidos_completados;
    var increment_transportista_pedidos_cancelados;

    angular.module("easyRuta")
        .run(function($rootScope){

            local_root_scope = $rootScope;

            //Parse.initialize("LRW3NBrk3JYLeAkXrpTF2TV0bDPn5HQTndrao8my", "e6v72X3KgdBeXe0JZ5cWrSBMmHZ1GIqtEIRICcp3");//PROD
            Parse.initialize("2hLYHTAUJ9QXMWxQTXsOIZ2jXJLGtMauw2QN34fE", "xSiGu1HbOBQvzcd7ItdgGGyMq2IcpvKmCAFjhY2T");//QA

            if (Parse.User.current()) {
                user_context_initialization_quebe = new Array();
                user_context_initialization_in_progress = true;
                local_initializar_user_context([],function(params,error,result){
                    user_context_initialization_in_progress = false;
                    user_context_initialization_quebe.forEach(function(element,index,array){
                        if (element.function){
                            element.function(element.params,element.callback);
                        }else if (element.callback){
                            element.callback(params,error,result);
                        }
                    });
                });
            }

            local_root_scope.pedidos_estados = {
                Pendiente : "Pendiente",
                PendienteConfirmacion : "PendienteConfirmacion",
                PendienteConfirmacionProveedor : "PendienteConfirmacionProveedor",
                Activo : "Activo",
                EnCurso : "EnCurso",
                Completado : "Completado",
                Cancelado : 'Cancelado',
                CanceladoCliente : 'CanceladoCliente'
            };
        })

        .factory('data_services',function() {
            return constructor;
        });

    //Constructor
    constructor = {
        guardar_pedidos : function(params,callback) {
            local_guardar_pedidos(params,callback);
        },
        get_cliente_proveedores : function(params,callback) {
            if (!user_context_initialization_in_progress){
                local_get_cliente_proveedores(params,callback);
            }else{
                user_context_initialization_quebe.push({function:local_get_cliente_proveedores,params:params,callback:callback});
            }
        },
        get_plantillas : function(params,callback) {
            local_get_plantillas(params,callback);
        },
        get_plantilla : function(params,callback){
            local_get_plantilla(params,callback)
        },
        delete_plantilla : function(params,callback){
            local_delete_plantilla(params,callback);
        },
        get_ciudades : function(params,callback) {
            local_get_ciudades(params,callback);
        },
        get_pedidos_pendientes : function(params,callback) {
            if (!user_context_initialization_in_progress){
                local_pedidos_pendientes(params,callback);
            }else{
                user_context_initialization_quebe.push({function:local_pedidos_pendientes,params:params,callback:callback});
            }
        },
        get_pedidos_activos : function(params,callback) {
            if (!user_context_initialization_in_progress){
                local_pedidos_activos(params,callback);
            }else{
                user_context_initialization_quebe.push({function:local_pedidos_activos,params:params,callback:callback});
            }
        },
        get_pedidos_en_curso : function(params,callback) {
            if (!user_context_initialization_in_progress){
                local_pedidos_en_curso(params,callback);
            }else{
                user_context_initialization_quebe.push({function:local_pedidos_en_curso,params:params,callback:callback});
            }
        },
        get_pedidos_completados : function(params,callback) {
            if (!user_context_initialization_in_progress){
                local_get_pedidos_completados(params,callback);
            }else{
                user_context_initialization_quebe.push({function:local_get_pedidos_completados,params:params,callback:callback});
            }
        },        confirmar_pedido : function(params,callback) { local_confirmar_pedido(params,callback); },
        rechazar_pedido : function(params,callback) { local_rechazar_pedido(params,callback); },
        transportista_statistics : function(params,callback) { local_transportista_statistics(params,callback); },
        transportistas_proveedor : function(params,callback) {
            if (!user_context_initialization_in_progress){
                local_transportistas_proveedor(params,callback);
            }else{
                user_context_initialization_quebe.push({function:local_transportistas_proveedor,params:params,callback:callback});
            }
        },
        initializar_user_context : function(params,callback) {
            if (!user_context_initialization_in_progress){
                local_initializar_user_context(params,callback);
            }else{
                user_context_initialization_quebe.push({function:null,params:params,callback:callback});
            }
        },
        proveedor_tomar_pedido : function(params,callback) {
            local_proveedor_tomar_pedido(params,callback);
        },
        proveedor_confirmar_pedido : function(params,callback) {
            local_proveedor_confirmar_pedido(params,callback);
        },
        proveedor_rechazar_pedido : function(params,callback) {
            local_proveedor_rechazar_pedido(params,callback);
        },
        timeout_pedido_cliente : function(params,callback) {
            local_timeout_pedido_cliente(params,callback);
        },
        timeout_pedido_proveedor : function(params,callback) {
            local_timeout_pedido_proveedor(params,callback);
        },
        cancelar_pedido : function(params,callback) {
            local_cancelar_pedido(params,callback);
        },
        cancelar_pedido_proveedor : function(params,callback) {
            local_cancelar_pedido_proveedor(params,callback);
        },
        iniciar_pedido  : function(params,callback) {
            local_iniciar_pedido(params,callback);
        },
        finalizar_pedido  : function(params,callback) {
            local_finalizar_pedido(params,callback);
        }
    };

    //"Public" Methods
    local_guardar_pedidos = function(params,callback){
        var data = params[0];
        var cliente = params[1];
        var proveedor = params[2];
        var copias = params[3];

        var Pedido = Parse.Object.extend("Pedido");
        var pedido = new Pedido();

        var CiudadOrigen = Parse.Object.extend("Ciudad");
        var ciudadOrigen = new CiudadOrigen();
        ciudadOrigen.id = data.CiudadOrigen
        pedido.set("CiudadOrigen", ciudadOrigen);
        pedido.set("DireccionOrigen", data.DireccionOrigen);

        var CiudadDestino = Parse.Object.extend("Ciudad");
        var ciudadDestino = new CiudadDestino();
        ciudadDestino.id = data.CiudadDestino
        pedido.set("CiudadDestino", ciudadDestino);
        pedido.set("DireccionDestino", data.DireccionDestino);

        pedido.set("Plantilla", data.Plantilla);
        pedido.set("HoraCarga", data.HoraCarga);
        pedido.set("HoraEntrega", data.HoraEntrega);
        pedido.set("Producto", data.Producto);
        pedido.set("TipoUnidad", data.TipoUnidad);
        pedido.set("PesoDesde", data.PesoDesde);
        pedido.set("PesoHasta", data.PesoHasta);
        pedido.set("Unidades", data.Unidades);
        pedido.set("Valor", data.Valor);
        pedido.set("TipoTransporte", data.TipoTransporte);
        pedido.set("CajaRefrigerada", data.CajaRefrigerada);
        pedido.set("CubicajeMin", data.CubicajeMinimo);
        pedido.set("ExtensionMin", data.ExtensionMinima);
        pedido.set("empresa", cliente);

        if (proveedor) {
            pedido.set("Proveedor", proveedor);
        }

        if (data.Estado == "Plantilla"){
            copias = 1;
            pedido.setACL(new Parse.ACL(Parse.User.current()));
        } else {
            var acl = new Parse.ACL(Parse.User.current());
            if (proveedor){
                pedido.set("Estado", "PendienteConfirmacionProveedor");
                pedido.set("Comision", 0);

                acl.setReadAccess(proveedor.get("user").id, true);
                acl.setWriteAccess(proveedor.get("user").id, true);
                pedido.setACL(acl);
            }else{
                pedido.set("Estado", "Pendiente");
                pedido.set("Comision", data.Valor * 0.04);

                acl.setRoleReadAccess("transportistaIndependiente", true);
                acl.setRoleReadAccess("proveedor", true);
                acl.setRoleReadAccess("transportista", true);
                acl.setRoleWriteAccess("transportistaIndependiente", true);
                acl.setRoleWriteAccess("proveedor", true);
                acl.setRoleWriteAccess("transportista", true);
                pedido.setACL(acl);
            }
        }

        var pedidoArray = [];
        for(var i=1;i<=copias;i++){
            var newPedido = pedido.clone();
            pedidoArray.push(newPedido);
        }

        Parse.Object.saveAll(pedidoArray, {
            success: function(pedidos) {
                callback(params,null,pedidos);
            },
            error: function(error) {
                console.log(error.message);
                callback(params,error,null);
            }
        });
    };
    local_get_cliente_proveedores = function(params,callback) {
        var cliente = params[0];
        if (!cliente){
            cliente = local_root_scope.cliente;
        }

        if (cliente.get("Proveedores") && cliente.get("Proveedores").length > 0){
            var proveedores = new Array();
            var count = 0;
            cliente.get("Proveedores").forEach(function(element,index,array){
                count++;
                var Proveedor = Parse.Object.extend("Proveedor");
                var query = new Parse.Query(Proveedor);
                query.equalTo("objectId", element);
                query.find({
                    success: function(results) {
                        if (results && results.length > 0){
                            proveedores.push(results[0]);
                        }

                        if (count == cliente.get("Proveedores").length){
                            callback(params,null,proveedores);
                        }
                    },
                    error: function(error) {
                        console.log("Error: " + error.code + " " + error.message);
                        if (count == cliente.get("Proveedores").length){
                            callback(params,null,proveedores);
                        }
                    }
                });
            });
        }
    };
    local_get_plantillas = function(params,callback) {
        var pedido = Parse.Object.extend("Pedido");
        query = new Parse.Query(pedido);
        query.greaterThan("Plantilla", "");
        query.find({
            success: function(results) {
                callback(params,null,results);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    }
    local_get_plantilla = function(params,callback){
        var pedido = Parse.Object.extend("Pedido");
        var query = new Parse.Query(pedido);
        query.get(params[0], {
            success: function (results) {
                callback(params,null,results);
            },
            error: function (error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    };
    local_delete_plantilla = function(params,callback){
        var pedido = Parse.Object.extend("Pedido");
        var query = new Parse.Query(pedido);
        query.get(params[0], {
            success: function (plantillaObject) {
                plantillaObject.destroy({
                    success: function (object) {
                        callback(params,null,results);
                    },
                    error: function (myObject, error) {
                        console.log("Error: " + error.code + " " + error.message);
                        callback(params,error,null);
                    }
                });
            },
            error: function (error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    };
    local_get_ciudades = function(params,callback) {
        var ciudad = Parse.Object.extend("Ciudad");
        query = new Parse.Query(ciudad);
        query.find({
            success: function (results) {
                callback(params,null,results);
            },
            error: function (error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    }
    local_pedidos_pendientes = function(params,callback) {
        var Pedido = Parse.Object.extend("Pedido");

        var queryPendientes = new Parse.Query(Pedido);
        queryPendientes.equalTo("Estado", "Pendiente");
        var queryPendientesConfirmacion = new Parse.Query(Pedido);
        queryPendientesConfirmacion.equalTo("Estado", "PendienteConfirmacion");
        var queryPendientesConfirmacionProveedor = new Parse.Query(Pedido);
        queryPendientesConfirmacionProveedor.equalTo("Estado", "PendienteConfirmacionProveedor");

        var mainQuery = Parse.Query.or(queryPendientes, queryPendientesConfirmacion, queryPendientesConfirmacionProveedor);
        if (local_root_scope.loggedInRole.getName() == "proveedor") {
            mainQuery.notEqualTo("ProveedoresBloqueados",local_root_scope.proveedor.id);
        }
        mainQuery.include("CiudadOrigen");
        mainQuery.include("CiudadDestino");
        mainQuery.include("Transportista");
        mainQuery.addAscending("createdAt");
        mainQuery.find({
            success: function(results) {
                callback(params,null,results);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    };
    local_pedidos_activos = function(params,callback) {
        var pedido = Parse.Object.extend("Pedido");
        var query = new Parse.Query(pedido);
        query.equalTo("Estado", "Activo");
        query.include("CiudadOrigen");
        query.include("CiudadDestino");
        query.include("Transportista");
        query.find({
            success: function(results) {
                callback(params,null,results);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    };
    local_pedidos_en_curso = function(params,callback) {
        var pedido = Parse.Object.extend("Pedido");
        var query = new Parse.Query(pedido);
        query.equalTo("Estado", "EnCurso");
        query.include("CiudadOrigen");
        query.include("CiudadDestino");
        query.include("Transportista");
        query.find({
            success: function(results) {
                callback(params,null,results);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    };
    local_get_pedidos_completados = function(params,callback) {
        var date = new Date();
        date.setDate(date.getDate()-1);

        var pedido = Parse.Object.extend("Pedido");
        var query = new Parse.Query(pedido);
        query.equalTo("Estado", "Finalizado");
        query.greaterThan("HoraFinalizacion", date);
        query.include("CiudadOrigen");
        query.include("CiudadDestino");
        query.include("Transportista");
        query.find({
            success: function(results) {
                callback(params,null,results);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    };
    local_confirmar_pedido = function(params,callback){
        params[0].set('Estado',local_root_scope.pedidos_estados.Activo);
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
        get_pedido_empresa_callback = callback;
        get_pedido_empresa(params,rechazar_pedido_callback)
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
    };
    local_transportistas_proveedor = function(params,callback) {
        var Transportista = Parse.Object.extend("Transportista");
        var query = new Parse.Query(Transportista);
        query.equalTo("proveedor",params[0]);
        //TODO - agregar filtro por tipo de transporte y extra
        query.addAscending("Nombre");
        query.find({
            success: function(results) {
                callback(params,null,results);
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    };
    local_initializar_user_context = function(params,callback) {
        get_current_user_role([],function(params,error,result){
            if (!error){
                switch (local_root_scope.loggedInRole.getName()){
                    case "cliente":
                        get_current_user_cliente([],function(params,error,result){
                            callback(params,error,result);
                        });
                        break;
                    case "proveedor":
                        get_current_user_proveedor([],function(params,error,result){
                            callback(params,error,result);
                        });
                        break;
                }
            }
        });
    };
    local_proveedor_tomar_pedido = function(params,callback){
        get_pedido_empresa_callback = callback;
        get_pedido_empresa(params,proveedor_tomar_pedido_get_empresa_callback)
    };
    local_proveedor_confirmar_pedido = function(params,callback){
        get_pedido_empresa_callback = callback;
        get_pedido_empresa(params,proveedor_confirmar_pedido_get_empresa_callback);
    };
    local_proveedor_rechazar_pedido = function(params,callback){
        get_pedido_empresa_callback = callback;
        get_pedido_empresa(params,proveedor_rechazar_pedido_callback);
    };
    local_iniciar_pedido = function(params,callback){
        params[0].set('Estado','EnCurso');
        params[0].save(null, {
            success: function(pedidoUpdated) {
                callback(params,null,pedidoUpdated);
            },
            error: function(error){
                console.log(error);
                callback(params,error,null);
            }
        });
    };
    local_finalizar_pedido = function(params,callback){
        params[0].set('Estado','Finalizado');
        params[0].set("HoraFinalizacion", new Date());
        params[0].save(null, {
            success: function(pedidoUpdated) {
                increment_transportista_pedidos_completados(params[0]);
                callback(params,null,pedidoUpdated);
            },
            error: function(error){
                console.log(error);
                callback(params,error,null);
            }
        });
    };
    local_timeout_pedido_proveedor = function(params,callback){
        get_pedido_empresa_callback = callback;
        get_pedido_empresa(params,timeout_pedido_proveedor_callback)
    };
    local_cancelar_pedido = function(params,callback){
        if (params[0].get('Estado') == local_root_scope.pedidos_estados.Pendiente
            || params[0].get('Estado') == local_root_scope.pedidos_estados.PendienteConfirmacion
            || params[0].get('Estado') == local_root_scope.pedidos_estados.PendienteConfirmacionProveedor){

            params[0].set('Estado',local_root_scope.pedidos_estados.Cancelado);

        }else{

            params[0].set('Estado',local_root_scope.pedidos_estados.CanceladoCliente);

        }
        params[0].save(null, {
            success: function(pedidoUpdated) {
                callback(params,null,pedidoUpdated);
            },
            error: function(error){
                console.log(error);
                callback(params,error,null);
            }
        });
    };
    local_cancelar_pedido_proveedor = function(params,callback){
        if (params[0].get('Estado') == local_root_scope.pedidos_estados.Activo){
            get_pedido_empresa_callback = callback;
            get_pedido_empresa(params,cancelar_pedido_proveedor_callback)
        }else{
            params[0].set('Estado',local_root_scope.pedidos_estados.Cancelado);
            params[0].save(null, {
                success: function(pedidoUpdated) {
                    increment_transportista_pedidos_cancelados(params[0]);
                    callback(params,null,pedidoUpdated);
                },
                error: function(error){
                    console.log(error);
                    callback(params,error,null);
                }
            });
        }
    };

    //Methods
    get_current_user_role = function(params,callback){
        var query = new Parse.Query(Parse.Role);
        query.equalTo("users", Parse.User.current()).find({
            success: function(results) {
                if (results.length > 0) {
                    var role = results[0];
                    local_root_scope.loggedInRole = role;
                }
                callback(params,null,results)
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    };
    get_current_user_proveedor = function(params,callback){
        var Proveedor = Parse.Object.extend("Proveedor");
        var query = new Parse.Query(Proveedor);
        query.equalTo("user", Parse.User.current());
        query.find({
            success: function(results) {
                if (results.length == 1) {
                    local_root_scope.proveedor = results[0];
                }
                callback(params,null,results);
            },
            error: function(error) {
                callback(params,error,null);
            }
        });
    };
    get_current_user_cliente = function(params,callback){
        var Cliente = Parse.Object.extend("Empresa");
        var query = new Parse.Query(Cliente);
        query.equalTo("user", Parse.User.current());
        query.find({
            success: function(results) {
                if (results.length == 1){
                    local_root_scope.cliente = results[0];
                }
                callback(params,null,results);
            },
            error: function(error) {
                callback(params,error,null);
            }
        });
    };

    //Adicional Queries
    get_pedido_empresa = function(params,callback){
        var Empresa = Parse.Object.extend("Empresa");
        var query = new Parse.Query(Empresa);
        query.equalTo("objectId", params[0].get("empresa").id);
        query.include("user");
        query.find({
            success: function(results) {
                if (results && results.length > 0){
                    callback(params,null,results[0]);
                }else{
                    console.log("Error: empresa not found.");
                    callback(params,{error:"empresa not found."},null);
                }
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    };
    get_pedido_transportista = function(params,callback){
        var Transportista = Parse.Object.extend("Transportista");
        var query = new Parse.Query(Transportista);
        query.equalTo("objectId", params[1].id);
        query.include("user");
        query.find({
            success: function(results) {
                if (results && results.length > 0){
                    callback(params,null,results[0]);
                }else{
                    console.log("Error: empresa not found.");
                    callback(params,{error:"empresa not found."},null);
                }
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    };

    //Data callbacks
    timeout_pedido_proveedor_callback = function(params,error,result){
        if (!error){
            params[0].set('Estado',local_root_scope.pedidos_estados.Pendiente);
            params[0].unset('Proveedor');

            var acl = new Parse.ACL(result.get("user"));
            acl.setRoleReadAccess("transportistaIndependiente", true);
            acl.setRoleReadAccess("proveedor", true);
            acl.setRoleReadAccess("transportista", true);
            acl.setRoleWriteAccess("transportistaIndependiente", true);
            acl.setRoleWriteAccess("proveedor", true);
            acl.setRoleWriteAccess("transportista", true);
            params[0].setACL(acl);

            params[0].save(null, {
                success: function(pedidoUpdated) {
                    get_pedido_empresa_callback(params,null,pedidoUpdated);
                },
                error: function(error){
                    console.log(error);
                    get_pedido_empresa_callback(params,error,null);
                }
            });
        }else{
            get_pedido_empresa_callback(params,null,null);
        }
    };
    cancelar_pedido_proveedor_callback = function(params,error,result){
        if (!error){
            params[0].set('Estado',local_root_scope.pedidos_estados.Pendiente);
            params[0].unset("Proveedor");
            params[0].unset("Transportista");

            var acl = new Parse.ACL(result.get("user"));
            acl.setRoleReadAccess("transportistaIndependiente", true);
            acl.setRoleReadAccess("proveedor", true);
            acl.setRoleReadAccess("transportista", true);
            acl.setRoleWriteAccess("transportistaIndependiente", true);
            acl.setRoleWriteAccess("proveedor", true);
            acl.setRoleWriteAccess("transportista", true);
            params[0].setACL(acl);

            params[0].save(null, {
                success: function(pedidoUpdated) {
                    get_pedido_empresa_callback(params,null,pedidoUpdated);
                },
                error: function(error){
                    console.log(error);
                    get_pedido_empresa_callback(params,error,null);
                }
            });
        }else{
            get_pedido_empresa_callback(params,null,null);
        }
    };
    rechazar_pedido_callback = function(params,error,result){
        if (!error){
            params[0].add('TransportistasBloqueados',params[0].get('Transportista').id);
            params[0].unset('Transportista');
            params[0].set('Estado',local_root_scope.pedidos_estados.Pendiente);

            var acl = new Parse.ACL(result.get("user"));
            acl.setRoleReadAccess("transportistaIndependiente", true);
            acl.setRoleReadAccess("proveedor", true);
            acl.setRoleReadAccess("transportista", true);
            acl.setRoleWriteAccess("transportistaIndependiente", true);
            acl.setRoleWriteAccess("proveedor", true);
            acl.setRoleWriteAccess("transportista", true);
            params[0].setACL(acl);

            params[0].save(null, {
                success: function(pedidoUpdated) {
                    get_pedido_empresa_callback(params,null,pedidoUpdated);
                },
                error : function(error){
                    get_pedido_empresa_callback(params,error,null);
                }
            });
        }else{
            get_pedido_empresa_callback(params,null,null);
        }
    };
    proveedor_confirmar_pedido_get_empresa_callback = function(params,error,result) {
        if (!error) {
            params.push(result);
            get_pedido_transportista_callback = get_pedido_empresa_callback;
            get_pedido_transportista(params, proveedor_confirmar_pedido_callback)
        } else {
            get_pedido_empresa_callback(params, null, null);
        }
    }
    proveedor_confirmar_pedido_callback = function(params,error,result) {
        if (!error) {
            params[0].set('Estado','Activo');
            params[0].set('Transportista',params[1]);

            var acl = new Parse.ACL(params[2].get("user"));
            acl.setReadAccess(Parse.User.current().id, true);
            acl.setWriteAccess(Parse.User.current().id, true);
            if (result.get("user")){ //Sometimes transportistas don't have users
                acl.setReadAccess(result.get("user").id, true);
                acl.setWriteAccess(result.get("user").id, true);
            }
            params[0].setACL(acl);

            params[0].save(null, {
                success: function(pedidoUpdated) {
                    get_pedido_transportista_callback(params,null,pedidoUpdated);
                },
                error: function(error){
                    console.log(error);
                    get_pedido_transportista_callback(params,error,null);
                }
            });
        } else {
            get_pedido_empresa_callback(params, null, null);
        }
    };
    proveedor_rechazar_pedido_callback = function(params,error,result) {
        if (!error) {
            params[0].set('Estado','Pendiente');
            params[0].unset('Proveedor');
            params[0].add('ProveedoresBloqueados',params[1].id);

            var acl = new Parse.ACL(result.get("user"));
            acl.setRoleReadAccess("transportistaIndependiente", true);
            acl.setRoleReadAccess("proveedor", true);
            acl.setRoleReadAccess("transportista", true);
            acl.setRoleWriteAccess("transportistaIndependiente", true);
            acl.setRoleWriteAccess("proveedor", true);
            acl.setRoleWriteAccess("transportista", true);
            params[0].setACL(acl);

            params[0].save(null, {
                success: function(pedidoUpdated) {
                    get_pedido_empresa_callback(params,null,pedidoUpdated);
                },
                error: function(error){
                    console.log(error);
                    get_pedido_empresa_callback(params,error,null);
                }
            });
        } else {
            get_pedido_empresa_callback(params, null, null);
        }
    };
    proveedor_tomar_pedido_get_empresa_callback = function(params,error,result) {
        if (!error) {
            params.push(result);
            get_pedido_transportista_callback = get_pedido_empresa_callback;
            get_pedido_transportista(params, proveedor_tomar_pedido_callback)
        } else {
            get_pedido_empresa_callback(params, null, null);
        }
    }
    proveedor_tomar_pedido_callback = function(params,error,result){
        if (!error) {

            params[0].set('Estado','PendienteConfirmacion');
            params[0].set('Transportista',params[1]);
            params[0].set('Proveedor',params[2]);
            params[0].set('HoraSeleccion',new Date());

            var acl = new Parse.ACL(params[3].get("user"));
            acl.setReadAccess(Parse.User.current().id, true);
            acl.setWriteAccess(Parse.User.current().id, true);
            if (result.get("user")){ //Sometimes transportistas don't have users
                acl.setReadAccess(result.get("user").id, true);
                acl.setWriteAccess(result.get("user").id, true);
            }
            params[0].setACL(acl);

            params[0].save(null, {
                success: function(pedidoUpdated) {
                    get_pedido_transportista_callback(params,null,pedidoUpdated);
                },
                error: function(error){
                    console.log(error);
                    get_pedido_transportista_callback(params,error,null);
                }
            });
        } else {
            get_pedido_transportista_callback(params, null, null);
        }
    }

    //Helpers
    increment_transportista_pedidos_completados = function(pedido){
        var Transportista = Parse.Object.extend("Transportista");
        var query = new Parse.Query(Transportista);
        query.equalTo("objectId", pedido.get("Transportista").id);
        query.find({
            success: function(results) {
                if (results && results.length > 0){
                    results[0].increment("PedidosCompletados",1);
                    results[0].save(null, {
                        success: function (pedidoUpdated) {
                            console.log("Transportista pedidos completados incremented.")
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });
                }else{
                    console.log("Error: empresa not found.");
                    callback(params,{error:"empresa not found."},null);
                }
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    };
    increment_transportista_pedidos_cancelados = function(pedido){
        var Transportista = Parse.Object.extend("Transportista");
        var query = new Parse.Query(Transportista);
        query.equalTo("objectId", pedido.get("Transportista").id);
        query.find({
            success: function(results) {
                if (results && results.length > 0){
                    results[0].increment("PedidosCancelados",1);
                    results[0].save(null, {
                        success: function (pedidoUpdated) {
                            console.log("Transportista pedidos cancelados incremented.")
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });
                }else{
                    console.log("Error: empresa not found.");
                    callback(params,{error:"empresa not found."},null);
                }
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
                callback(params,error,null);
            }
        });
    };

})();