/**
 * Created by dcoellar on 9/21/15.
 */

(function(){

    //Variables
    var local_root_scope;
    var local_utils;

    //Public "Methods"
    var local_getJson;
    var local_getTransportistaJson;
    var local_getProveedorJson;
    var local_getClienteJson;
    var local_parseProveedorIntoTransportista;
    var local_getNotificationJson;

    //Methods
    var getTimer;

    angular.module("easyRuta")
        .factory('parser', function($rootScope,utils) {

            local_root_scope = $rootScope;
            local_utils = utils;

            return {
                getJson : function(element){return local_getJson(element);},
                getTransportistaJson : function(element){return local_getTransportistaJson(element);},
                getClienteJson : function(element){return local_getClienteJson(element);},
                getProveedorJson : function(element){return local_getProveedorJson(element);},
                parseProveedorIntoTransportista : function(transportistaJson,proveedor){ return local_parseProveedorIntoTransportista(transportistaJson,proveedor) },
                getNotificationJson : function(element){ return local_getNotificationJson(element) }
            };
        });

    //Public "Methods"
    local_getJson = function(element){
        var json = {};
        if (element){
            json =  {
                object : element,
                id : element.id,
                viaje : element.get("CiudadOrigen").get("Nombre") + " - " + element.get("CiudadDestino").get("Nombre"),
                origen : element.get("CiudadOrigen").get("Nombre"),
                origenDireccion : element.get("DireccionOrigen"),
                destino : element.get("CiudadDestino").get("Nombre"),
                destinoDireccion : element.get("DireccionDestino"),
                carga : local_utils.formatDate(element.get("HoraCarga")),
                entrega : local_utils.formatDate(element.get("HoraEntrega")),
                creacion : local_utils.formatDate(element.get("createdAt")),
                asignacion : local_utils.formatDate(element.get("HoraSeleccion")),
                inicio : local_utils.formatDate(element.get("HoraInicio")),
                finalizacion : local_utils.formatDate(element.get("HoraFinalizacion")),
                disponibilidad : local_utils.formatDate(element.get("HoraDisponible")),
                estado :  element.get("Estado"),
                background : "backgroud-photo-" + element.get("CiudadDestino").get("Nombre").toLowerCase(),
                image : "resources/images/" + element.get("CiudadDestino").get("Nombre").toLowerCase() + ".jpg",
                cantidad : "",
                transporte : "Tipo de camion: " + element.get("TipoTransporte"),
                tipoTransporte : element.get("TipoTransporte"),
                transporte_extra : "",
                transporte_image : "icon-" + element.get("TipoTransporte"),
                producto : element.get("Producto"),
                cantidad : "Peso desde: " + element.get("PesoDesde") + "Tn hasta: " + element.get("PesoHasta") + "Tn",
                valores : "Valor: " + local_utils.formatCurrency(element.get("Valor")) + " (Comision: " + local_utils.formatCurrency(element.get("Comision")) + ")",
                valor : local_utils.formatCurrency(element.get("Valor")) + " (Comision: " + local_utils.formatCurrency(element.get("Comision")) + ")"
            }

            if (json.estado == "PendienteConfirmacion" || json.estado == "PendienteConfirmacionProveedor"){
                json.timer = getTimer(element);
            }
            if (element.get("Rate")){
                json.rating = element.get("Rate");
            }
        }
        return json;
    };
    local_getClienteJson = function(element){
        var json = {};
        if (element){
            json =  {
                object : element,
                id : element.id,
                nombre : element.get("Nombre"),
                direccion : element.get("Direccion"),
                telefono : element.get("Telefono"),
                persona_contacto : element.get("PersonaContacto"),
                photo : "resources/images/account_circle.png"
            }

            if (element.get("Imagen")){
                json.photo = element.get("Imagen").url();
            }
        }
        return json;
    };
    local_getProveedorJson = function(element){
        var json = {};
        if (element){
            json =  {
                object : element,
                id : element.id,
                nombre : element.get("Nombre"),
                direccion : element.get("Direccion"),
                telefono : element.get("Telefono"),
                persona_contacto : element.get("PersonaContacto"),
                photo : "resources/images/account_circle.png"
            }

            if (element.get("Imagen")){
                json.photo = element.get("Imagen").url();
            }
        }
        return json;
    };
    local_getTransportistaJson = function(element){
        var json = {};
        if (element){
            json =  {
                object : element,
                id : element.id,
                descripcion : element.get("Descripcion"),
                nombre : element.get("Nombre"),
                photo : "resources/images/account_circle.png",
                estado : element.get("Estado"),
                horaDisponible : local_utils.formatDate(element.get("HoraDisponible")),
                tipoTransporte : element.get("TipoTransporte"),
                refrigerado : element.get("Refrigerado"),
                esTercero : element.get("EsTercero"),
            };

            if (local_root_scope.proveedor){
                json.referencia = json.descripcion;
            }else if(local_root_scope.cliente){
                json.referencia = json.nombre;
            }

            if (element.get("photo")){
                json.photo = element.get("photo").url();
            }
        }
        return json;
    };
    local_parseProveedorIntoTransportista = function(transportistaJson, proveedor){
        transportistaJson.photo = "resources/images/account_circle.png";
        if (proveedor.get("Imagen")){
            transportistaJson.photo = proveedor.get("Imagen").url();
        }
        transportistaJson.referencia = proveedor.get("Nombre") + " (" + transportistaJson.descripcion + ")";
        return transportistaJson;
    };
    local_getNotificationJson = function(element){
        var json = {};
        if (element){
            json =  {
                object : element,
                id : element.id,
                descripcion : element.get("Descripcion"),
                creacion : local_utils.formatDate(element.get("createdAt")),
                leida : element.get("Leida")
            };
        }
        return json;
    };

    //Methods
    getTimer = function(element){
        if (element.get('Estado') == 'PendienteConfirmacion') {
            var horaEnd = new Date(element.get('HoraSeleccion'));
            var horaCurrent = new Date();
            horaEnd.setMinutes(horaEnd.getMinutes() + 30);

            var diffMs = (horaEnd - horaCurrent);
            var diffMins = Math.round(diffMs / 60000); // minutes
            var diffSecs = Math.round((diffMs % 60000) / 1000); // seconds

            return {'minute': diffMins, 'second': diffSecs};
        } else if (element.get('Estado') == 'PendienteConfirmacionProveedor') {
            var horaEnd = element.get('createdAt');
            var horaCurrent = new Date();
            horaEnd.setMinutes(horaEnd.getMinutes() + 30);

            var diffMs = (horaEnd - horaCurrent);
            var diffMins = Math.round(diffMs / 60000); // minutes
            var diffSecs = Math.round((diffMs % 60000) / 1000); // seconds

            if (diffMins < 0) { diffMins = 0 }
            if (diffSecs < 0) { diffSecs = 0 }

            return {'minute': diffMins, 'second': diffSecs};
        } else {
            return null;
        }
    };
})();