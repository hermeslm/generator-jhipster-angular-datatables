(function() {
    'use strict';

    angular
        .module('UDT', [])
        .factory('GUIUtils', GUIUtils);

    function GUIUtils () {

        var service = {
            getActionsTemplate: getActionsTemplate
        };

        return service;

        /**
         * Return a Action Template for grid bootstrap based
         * @param data
         * @param entity
         * @param buttons
         * @returns {string}
         */
        function getActionsTemplate (data, entity, buttons) {
            var stButtons = '';
            for (var i = 0, len = buttons.length; i < len; i++) {
                switch(buttons[i]) {
                    case 'view': {
                        stButtons += '<button class="btn-sm btn-primary " ui-sref="' + entity + '-detail({id:' + data.id + '})">' +
                            '   <i class="fa fa-eye"></i></button>';
                        break;
                    }
                    case 'update': {
                        if (stButtons.length != 0)
                            stButtons += '&nbsp;'

                        stButtons += '<button class="btn-sm btn-warning" ui-sref="' + entity + '.edit({id:' + data.id + '})">' +
                            '   <i class="fa fa-edit"></i></button>';
                        break;
                    }
                    case 'delete': {
                        if (stButtons.length != 0)
                            stButtons += '&nbsp;'

                        stButtons += '<button class="btn-sm btn-danger" ui-sref="' + entity + '.delete({id:' + data.id + '})">' +
                            '   <i class="fa fa-trash"></i></button>';
                        break;
                    }
                    case 'all' : {
                        stButtons += '<a class="btn-sm btn-primary" ui-sref="' + entity + '-detail({id:data.id})" href="#/' + entity + '/' + data.id + '">' +
                            '   <i class="fa fa-eye"></i></a>&nbsp;';
                        stButtons += '<a class="btn-sm btn-warning" ui-sref="' + entity + '.edit({id:' + data.id + '})" href="#/' + entity + '/' + data.id + '/edit">' +
                            '   <i class="fa fa-edit"></i></a>&nbsp;';
                        stButtons += '<a class="btn-sm btn-danger" ui-sref="' + entity + '.delete({id:' + data.id + '})"  href="#/' + entity + '/' + data.id + '/delete">' +
                            '   <i class="fa fa-trash"></i></a>';
                    };
                }
            }

            return stButtons;
        }
    }
})();
