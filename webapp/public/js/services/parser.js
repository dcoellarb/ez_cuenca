/**
 * Created by dcoellar on 9/21/15.
 */

(function(){

    //Variables
    var local_utils;

    //Public "Methods"
    var local_getJson;
    var getTransportistaJson;
    var getProveedorJson;

    //Methods
    var getTimer;

    angular.module("easyRuta")
        .factory('parser', function(utils) {

            local_utils = utils;

            return {
                getJson : function(element){return local_getJson(element);},
                getTransportistaJson : function(element){return getTransportistaJson(element);},
                getProveedorJson : function(element){return getProveedorJson(element);}
            };
        });

    //Public "Methods"
    local_getJson = function(element){
        var json =  {
            object : element,
            id : element.id,
            viaje : element.get("CiudadOrigen").get("Nombre") + " - " + element.get("CiudadDestino").get("Nombre"),
            carga : local_utils.formatDate(element.get("HoraCarga")),
            entrega : local_utils.formatDate(element.get("HoraEntrega")),
            inicio : local_utils.formatDate(element.get("HoraInicio")),
            finalizacion : local_utils.formatDate(element.get("HoraFinalizacion")),
            estado :  element.get("Estado"),
            background : "backgroud-photo-" + element.get("CiudadDestino").get("Nombre").toLowerCase(),
            image : "resources/images/" + element.get("CiudadDestino").get("Nombre").toLowerCase() + ".jpg",
            cantidad : "",
            transporte : "Tipo de camion:" + element.get("TipoTransporte"),
            transporte_extra : "",
            valores : "Valor: " + local_utils.formatCurrency(element.get("Valor")) + " (Comision: " + local_utils.formatCurrency(element.get("Comision")) + ")"

        }

        if (json.estado == "PendienteConfirmacion" || json.estado == "PendienteConfirmacionProveedor"){
            json.timer = getTimer(element);
        }

        if (element.get("TipoUnidad") == "peso"){
            json.cantidad = "Peso desde: " + element.get("PesoDesde") + "Tn hasta: " + element.get("PesoHasta") + "Tn";
        }else{
            json.cantidad = element.get("Unidades") + " unidades";
        }

        if (element.get("TipoTransporte") == "furgon") {
            json.transporte_extra = "Cubicaje Minimo: " + element.get("CubicajeMin") + " m3";
            if (element.get("CajaRefrigerada")){
                json.transporte_extra += " (Requiere caja refrigerada)";
            }
        }else if (element.get("TipoTransporte") == "plataforma"){
            json.transporte_extra = "Extension Minima:" + element.get("ExtensionMin") + " pies";
        }
        if (element.get("Rate")){
            json.rating = element.get("Rate");
        }
        return json;
    };
    getProveedorJson = function(element){
        var json =  {
            object : element,
            id : element.id,
            nombre : element.get("Nombre"),
            photo : "resources/images/account_circle.png"
        }

        if (element.get("ImageURL")){
            json.photo = element.get("photo").url();
        }

        return json;
    };
    getTransportistaJson = function(element){
        var json =  {
            object : element,
            id : element.id,
            nombre : element.get("Nombre"),
            photo : "resources/images/account_circle.png"
        }

        if (element.get("photo")){
            json.photo = element.get("photo").url();
        }
        return json;
    };

    //Methods
    getTimer = function(element){
        if (element.get('Estado') == 'PendienteConfirmacion') {
            var horaEnd = element.get('HoraSeleccion');
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