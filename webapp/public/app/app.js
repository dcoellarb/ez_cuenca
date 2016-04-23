/**
 * Created by dcoellar on 9/14/15.
 */

angular.module("easyRuta",['ngRoute','ngMaterial','ngMaterialDatePicker','ngMessages','ngMap','LocalStorageModule','ez-Data','ez-RealTime'])
    .constant('collectionsEnum',{
        role:'_Role',
        user:'_User',
        proveedorCarga:'ProveedorCarga',
        proveedorCargaRutas:'ProveedorCargaRutas',
        transportista:'Transportista',
        transportistaRutas:'transportistaRutas',
        chofer:'Chofer',
        pedido:'Pedido',
        broker:'Broker',
        notificacion: 'Notificacion'
    })
    .constant('pedidoEstadosEnum',{
        pendiente:'Pendiente',
        activo:'Activo',
        enCurso:'EnCurso',
        finalizado:'Finalizado',
        cancelado:'Cancelado'
    })
    .constant('choferEstadosEnum',{
        disponible:'Disponible',
        enViaje:'EnViaje',
        deshabilitado:'Deshabilitado'
    })
    .constant('uiEventsEnum',{
        pedidosTabChanged:'pedidosTabChanged'
    })
    .constant('uiContextEnum',{
        proveedorCargaPedidos:'proveedorCargaPedidos'
    })
    .constant('rolesEnum',{
        proveedorCarga:'proveedorCarga',
        broker:'broker',
        transportista:'transportista',
        chofer:'chofer'
    })
    .constant('localStorageKeys',{
        role:'role',
        proveedorCarga:'proveedorCarga',
        broker:'broker',
        transportista:'transportista'
    })
    .constant('realtimeChannels',{
        pedidoCreado: "pedidoCreado",
        pedidoAsignado: "pedidoAsignado",
        pedidoIniciado: "pedidoIniciado",
        pedidoFinalizado: "pedidoFinalizado",
        pedidoCancelado: "pedidoCancelado"
    });
