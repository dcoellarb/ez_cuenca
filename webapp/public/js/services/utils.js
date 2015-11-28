/**
 * Created by dcoellar on 9/21/15.
 */

(function(){

    angular.module("easyRuta")
        .factory('utils', function() {
            var utilsService = {
                formatDate : function(date){
                    if (date){
                        var monthNames = [
                            "Enero", "Febrero", "Marzo",
                            "Abril", "Mayo", "Junio", "Julio",
                            "Agosto", "Septiembre", "Octubre",
                            "Noviembre", "Diciembre"
                        ];
                        var dayNames = [
                            "Domingo","Lunes", "Martes", "Miercoles",
                            "Jueves", "Viernes", "Sabado"
                        ];
                        var dayName = dayNames[date.getDay()];
                        var day = date.getDate();
                        var month = monthNames[date.getMonth()];
                        var year = date.getFullYear();
                        var hour = date.getHours();
                        var minute = date.getMinutes();

                        return dayName + ' ' +  day + ' de ' + month.substr(0,3) + "." + ' del ' + year + ' a las ' + hour + ':' + minute;
                    }else{
                        return ""
                    }
                },
                formatCurrency : function(value){
                    return '$' + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                }
            };
            return utilsService;
        });

})();