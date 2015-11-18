/**
 * Created by dcoellar on 11/17/15.
 */

(function(){

    angular.module("easyRuta")
        .controller('perfilController',function($scope,$location){

            console.log("perfil controller");

            var ctlr = this;

            var Empresa = Parse.Object.extend("Empresa");
            var query = new Parse.Query(Empresa);
            query.equalTo("user", Parse.User.current());
            query.find({
                success: function(results) {
                    if (results.length == 1){
                        ctlr.object = results[0];
                        ctlr.empresa = {
                            id : results[0].id,
                            nombre : results[0].get("Nombre"),
                            direccion : results[0].get("Direccion"),
                            telefono : results[0].get("Telefono"),
                            contacto : results[0].get("PersonaContacto")
                        }
                        if (results[0].get("Imagen")){
                            ctlr.empresa["image_url"] = results[0].get("Imagen").url();
                        }
                        $scope.$apply();
                    }else{
                        //TODO let the user know data could not be retrive
                    }
                },
                error: function(error) {
                    //TODO let the user know data could not be retrive
                }
            });

            $('#image').bind("change", function(e) {
                var files = e.target.files || e.dataTransfer.files;

                var reader = new FileReader();
                reader.onload = function (e) {
                    ctlr.empresa.image_url = e.target.result;
                    $scope.$apply();
                }
                reader.readAsDataURL(files[0]);
            });

            ctlr.Save = function(){
                $('#btnSave').prop('disabled', true);
                $("#btnSave").html('Guardando...');

                ctlr.object.set("Nombre", ctlr.empresa.nombre);
                ctlr.object.set("Direccion", ctlr.empresa.direccion);
                ctlr.object.set("Telefono", ctlr.empresa.telefono);
                ctlr.object.set("PersonaContacto", ctlr.empresa.contacto);

                var fileUploadControl = $("#image")[0];
                if (fileUploadControl.files.length > 0) {
                    var file = fileUploadControl.files[0];
                    var name = file.name;

                    var parseFile = new Parse.File(name, file);
                    parseFile.save().then(function() {
                        ctlr.object.set("Imagen", parseFile);
                        SaveEmpresa(ctlr);
                    }, function(error) {
                        //TODO let the user know data could not be retrive
                    });
                }else{
                    SaveEmpresa(ctlr);
                }
            }

            var SaveEmpresa = function(ctlr){
                ctlr.object.save(null, {
                    success: function(empresa) {
                        $("#btnSave").html('Guardar');
                        $('#btnSave').prop('disabled', false);

                        $location.path("/inicioClientes");
                        $scope.$apply();
                    },
                    error: function(empresa, error) {
                        $('#btnSave').removeClass("disable");

                        console.dir(error);
                        //TODO let the user know data could not be retrive
                    }
                });
            }

        });
})();