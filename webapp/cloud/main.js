
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

/*
Parse.Cloud.beforeSave('Compras', function (request, respond) {
    Parse.Cloud.useMasterKey();
    if (!request.object.isNew()){
        respond.error("Only inserts are suported");
        console.log("Current:" + JSON.stringify(request.object));
        var id = request.object.id;
        var Compras = Parse.Object.extend("Compras");
        var query = new Parse.Query(Compras);
        query.get(id).then(
            function (compra) {
                console.log("Previous:" + JSON.stringify(compra));
                var valor = compra.get('valor')
                var transportista = compra.get('transportista');
                var proveedor = compra.get('proveedor');
                if (transportista != null){
                    transportista.increment("Saldo",valor * -1);
                    transportista.save();
                    respond.success();
                }else if(proveedor != null){
                    proveedor.increment("Saldo",valor * -1);
                    proveedor.save();
                    respond.success();
                }else{
                    respond.success();
                }
            },
            function(model,error) {
                console.error("Got an error " + error.code + " : " + error.message);
                respond.error();
            }
        );
    }else{
        respond.success();
    }
});
 */

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
