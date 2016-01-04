/**
 * Created by dcoellar on 11/17/15.
 */

(function(){

    //Variable
    var ctlr;
    var local_root_scope;
    var local_scope;
    var local_window;
    var local_perfil_viewmodel;

    //Contructor
    var init;

    //"Public" Methods
    var save;
    var load_image;

    //Methods

    //Data Callbacks
    var save_perfil_callback;
    var get_proveedor_callback;
    var get_cliente_callback;

    //Helpers
    var load_empresa;

    angular.module("easyRuta")
        .controller('perfilController',function($rootScope,$scope,$window,perfil_viewmodel){

            ctlr = this;
            local_root_scope = $rootScope;
            local_scope = $scope;
            local_window = $window;
            local_perfil_viewmodel = perfil_viewmodel;

            ctlr.Save = save;
            ctlr.LoadImage = load_image;

            init();
        });

    //Constructor
    init = function(){
        $('#image').bind("change", ctlr.LoadImage);
        local_perfil_viewmodel.get_cliente(get_cliente_callback);
    };

    //"Public" Methods
    save  = function(){
        $('#btnSave').prop('disabled', true);
        $("#btnSave").html('Guardando...');

        local_perfil_viewmodel.save(ctlr.object,ctlr.selectedImage,save_perfil_callback)
    };
    load_image = function(e) {
        var files = e.target.files || e.dataTransfer.files;

        var reader = new FileReader();
        reader.onload = function (e) {
            ctlr.object.photo = e.target.result;
            local_scope.$apply();
        }
        reader.readAsDataURL(files[0]);
        ctlr.selectedImage = files[0];
    }
    //Methods

    //Data Callbacks
    save_perfil_callback = function(error,resutls){
        if (!error){
            local_window.history.back();
        }else{
            //TODO - Show error to user
            $('#btnSave').prop('disabled', false);
            $("#btnSave").html('Guardar');
        }
    };
    get_proveedor_callback = function(error,results){
        if(!error && results){
            load_empresa(results)
        }
    };
    get_cliente_callback = function(error,results){
        if(!error && results) {
            load_empresa(results)
        }
    };

    //Helpers
    load_empresa = function(object){
        ctlr.object = object;
        local_scope.$apply();
    }

})();