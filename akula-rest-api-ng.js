'use strict';
angular.module('akulaRestApiService', ['ngResource'])
    .constant('akConfig', {
        env: 'dev',
        endPoins: {
            //urls de interação com o server vão aqui'
            listaEstados: '/federacao/estados',
            listaMunicipios: '/federacao/estados/:uf/municipios',
            listaBancos: '/bancos',
            listaBancosByCod: '/bancos/codigo/:cod',
            listaBancosByNome: '/bancos/nome/:nome',
            listaFipeMarcas: '/fipe/:tipoVeiculo/marcas',
            listaFipeModelos: '/fipe/:tipoVeiculo/marcas/:codigoMarca/modelos',
            listaFipeAnos: '/fipe/:tipoVeiculo/marcas/:codigoMarca/modelos/:codigoModelo/anos'
        },
        servers: {
            dev: {
                baseUrl: 'http://localhost',
                baseApi: '/api/v1'
            },
            prod: {
                baseUrl: 'http://localhost',
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
            },
            envDev: {
                get: function() {return config.servers.dev},
                set: function(value) {config.servers.dev = value}
            },
            envProd: {
                get: function() {return config.servers.prod},
                set: function(value) {config.servers.prod = value}
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

            akServ.listaMunicipios = function(_uf) {
                return akService.listaMunicipios(_uf);
            }

            akServ.listaBancos = function() {
                return akService.listaBancos();
            }

            akServ.listaBancosByCod = function(cod) {
                return akService.listaBancosByCod(cod);
            }

            akServ.listaBancosByNome = function(nome) {
                return akService.listaBancosByNome(nome);
            }

            akServ.listaFipeMarcas = function(tipoVeiculo) {
                return akService.listaFipeMarcas(tipoVeiculo);
            }

            akServ.listaFipeModelos = function(tipoVeiculo, codigoMarca) {
                return akService.listaFipeModelos(tipoVeiculo, codigoMarca);
            }

            akServ.listaFipeAnos = function(tipoVeiculo, codigoMarca, codigoModelo) {
                return akService.listaFipeAnos(tipoVeiculo, codigoMarca, codigoModelo);
            }

            return akServ;
        }
        this.$get.$inject = ['akService'];
    };

    akService.$inject = ['$http', '$q', 'akConfig', '$resource']
    function akService($http, $q, config, $resource) {
        var akS = {};
        var envOpts = config.servers[config.env];
	    var federacaoEstadosApi = $resource(
                envOpts.baseUrl + 
                envOpts.baseApi + 
                config.endPoins.listaEstados);

        var federacaoMunicipiosApi = $resource(
                envOpts.baseUrl + 
                envOpts.baseApi + 
                config.endPoins.listaMunicipios, 
                    {'uf': ''}
        );

        var bancosApi = $resource(
                envOpts.baseUrl + 
                envOpts.baseApi + 
                config.endPoins.listaBancos
        );

        var bancosByCodApi = $resource(
                envOpts.baseUrl + 
                envOpts.baseApi + 
                config.endPoins.listaBancosByCod,
                   {'cod': ''} 
        );

        var bancosByNomeApi = $resource(
                envOpts.baseUrl + 
                envOpts.baseApi + 
                config.endPoins.listaBancosByNome,
                   {'nome': ''} 
        );

        var listaFipeMarcasApi = $resource(
                envOpts.baseUrl + 
                envOpts.baseApi + 
                config.endPoins.listaFipeMarcas,
                   {'tipoVeiculo': ''} 
        );

        var listaFipeModelosApi = $resource(
                envOpts.baseUrl + 
                envOpts.baseApi + 
                config.endPoins.listaFipeModelos,
                   {'tipoVeiculo': '', 'codigoMarca': ''} 
        );

        var listaFipeAnosApi = $resource(
                envOpts.baseUrl + 
                envOpts.baseApi + 
                config.endPoins.listaFipeAnos,
                   {'tipoVeiculo': '', 'codigoMarca': '', 'codigoModelo': ''} 
        );

        akS.listaEstados = function() {
	  		return federacaoEstadosApi.query().$promise;
	    };

        akS.listaMunicipios = function(_uf) {
	  		return federacaoMunicipiosApi.query({uf: _uf}).$promise;
	    };

        akS.listaBancos = function() {
	  		return bancosApi.query().$promise;
	    };

        akS.listaBancosByCod = function(_cod) {
	  		return bancosByCodApi.query({cod: _cod}).$promise;
	    };

        akS.listaBancosByNome = function(_nome) {
	  		return bancosByNomeApi.query({nome: _nome}).$promise;
	    };

        akS.listaFipeMarcas = function(_tipoVeiculo) {
	  		return listaFipeMarcasApi.query({tipoVeiculo: _tipoVeiculo}).$promise;
	    };

        akS.listaFipeModelos = function(_tipoVeiculo, _codigoMarca) {
	  		return listaFipeModelosApi.query(
                  {tipoVeiculo: _tipoVeiculo, codigoMarca: _codigoMarca})
                  .$promise;
	    };

        akS.listaFipeAnos = function(_tipoVeiculo, _codigoMarca, _codigoModelo) {
	  		return listaFipeAnosApi.query(
                  {tipoVeiculo: _tipoVeiculo, codigoMarca: _codigoMarca, codigoModelo: _codigoModelo})
                  .$promise;
	    };

        return akS;
    }