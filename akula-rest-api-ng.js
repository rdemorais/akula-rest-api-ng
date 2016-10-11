'use strict';
angular.module('akulaRestApiService', ['ngResource'])
    .constant('akConfig', {
        env: 'dev',
        endPoins: {
            //urls de interação com o server vão aqui'
            listaEstados: '/federacao/estados'
        },
        servers: {
            dev: {
                baseUrl: 'http://restapi-akkula.rhcloud.com',
                baseApi: '/api/v1'
            },
            prod: {
                baseUrl: 'http://192.168.0.24:3001',
                baseApi: '/api/v1'
            }
        }
    })
    .provider('akulaRestApiService', akulaRestApiServiceProvider)
    .factory('akService', akService);

    akulaRestApiServiceProvider.$inject = ['akConfig']
    function akulaRestApiServiceProvider(config) {
        Object.defineProperties(this, {
            env: {
                get: function() {return config.env},
                set: function(value) {config.env = value}
            }
        });

        angular.forEach(Object.keys(config.servers), function(server) {
	      this[server] = function(params) {
	        return angular.extend(config.servers[server], params);
	      };
	    }, this);

        this.$get = function(akService) {
            var akServ = {};

            akServ.listaEstados = function() {
                return akService.listaEstados();
            }

            return akServ;
        }
        this.$get.$inject = ['akService'];
    };

    akService.$inject = ['$http', '$q', 'akConfig', '$resource']
    function akService($http, $q, config, $resource) {
        var akS = {};
        var envOpts = config.servers[config.env];
	    var federacaoEstadosApi = $resource(envOpts.baseUrl + envOpts.baseApi + config.endPoins.listaEstados);

        akS.listaEstados = function() {
	  		return federacaoEstadosApi.query().$promise;
	    };

        return akS;
    }