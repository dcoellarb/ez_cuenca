
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.beforeSave('Compras', function (request, respond) {
    Parse.Cloud.useMasterKey();
    if (request.object.isNew()) {
        var compra = request.object;
        var valor = compra.get('valor')
        var transportista = compra.get('transportista');
        var proveedor = compra.get('proveedor');
        if (valor != null && (transportista != null || proveedor != null)){
            if (transportista != null && proveedor != null) {
                respond.error("Can't have both transportista and proveedor");
            } else {
                if (transportista != null) {
                    transportista.increment("Saldo", valor);
                    transportista.save();
                    respond.success();
                } else if (proveedor != null) {
                    proveedor.increment("Saldo", valor);
                    proveedor.save();
                    respond.success();
                }
            }
        }else{
            respond.error("Valor and Transportista or Proveedor are required.");
        }
    }else{
        respond.error("Update not supported.");
    }
});

Parse.Cloud.beforeDelete('Compras', function (request, respond) {
    Parse.Cloud.useMasterKey();
    var compra = request.object;
    var valor = compra.get('valor')
    var transportista = compra.get('transportista');
    var proveedor = compra.get('proveedor');
    if (transportista != null && proveedor != null){
        respond.error();
    }else{
        if (transportista != null){
            transportista.increment("Saldo",valor * -1);
            transportista.save();
            respond.success();
        }else if(proveedor != null){
            proveedor.increment("Saldo",valor * -1);
            proveedor.save();
            respond.success();
        }
    }
});

Parse.Cloud.afterSave('Pedido', function (request, respond) {
    Parse.Cloud.useMasterKey();
    var comision = request.object.get("Comision");
    var transportista = request.object.get("Transportista");
    var proveedor = request.object.get("Proveedor");
    if (request.object.get("Estado") == "Activo") {
        if (transportista != null){
            transportista.increment("Saldo", comision * -1);
            transportista.save();
        }else if (proveedor != null){
            proveedor.increment("Saldo", comision * -1);
            proveedor.save();
        }
    }else if (request.object.get("Estado") == "CanceladoCliente"){
        if (transportista != null){
            transportista.increment("Saldo", comision);
            transportista.save();
        }else if (proveedor != null){
            proveedor.increment("Saldo", comision);
            proveedor.save();
        }
    }
});

var countFinalizados = 0;
var sumRatings = 0;
var countCancelados = 0;
var countRatings = 0;

Parse.Cloud.define("transportistaStatistics", function(request, response) {
    Parse.Cloud.useMasterKey();

    var transportistaString = request.params.transportista;

    countFinalizados = 0;
    sumRatings = 0;
    countCancelados = 0;
    countRatings = 0;

    getFinalizados(transportistaString,response);
});

var getFinalizados = function (transportistaString,response){
    var pedido = Parse.Object.extend("Pedido");
    var query = new Parse.Query(pedido);
    query.equalTo("Transportista", {
        __type: "Pointer",
        className: "Transportista",
        objectId: transportistaString
    });
    query.equalTo("Estado", "Finalizado");
    query.find({
        success: function(results) {
            countFinalizados = results.length;
            for(var i=0;i<results.length;i++){
                if (results[i].get("Rate")){
                    countRatings += 1
                    sumRatings += results[i].get("Rate");
                }
            }
            getCancelados(transportistaString,response);
        },
        error: function(error) {
            console.log("Error getting pedidos finalizados: " + error.code + " " + error.message);
        }
    });
};

var getCancelados = function(transportistaString,response){
    var pedido = Parse.Object.extend("Pedido");
    var query = new Parse.Query(pedido);
    query.equalTo("TransportistasCancelados", transportistaString);
    query.find({
        success: function(results) {
            countCancelado = results.length;
            finishTransportistaStatistics(response)
        },
        error: function(error) {
            console.log("Error getting pedidos finalizados: " + error.code + " " + error.message);
        }
    });
};

var finishTransportistaStatistics = function(response){
    var efectividad =  (countFinalizados / (countFinalizados + countCancelado)) * 100;
    var rating = sumRatings / countRatings;
    response.success({efectividad:efectividad,rating:rating});
};
