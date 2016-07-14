// Angular
angular.module('SourceManager', ['ui.router'])
	.directive('stringToNumber', function() {
		  return {
		    require: 'ngModel',
		    link: function(scope, element, attrs, ngModel) {
		      ngModel.$parsers.push(function(value) {
		        return '' + value;
		      });
		      ngModel.$formatters.push(function(value) {
		        return parseFloat(value, 10);
		      });
		   }
	   };
	})
	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'templates/home.html',
				controller: function($scope) {
					$scope.options = options;
					$scope.open = Options.open;
				}
			})
			.state('options', {
				url: '/options',
				templateUrl: 'templates/options.html',
				controller: function( $scope ) {
					$scope.options 	= options;
					$scope.gameInfo = gameInfo;

					$scope.saveOptions 	= Options.save;
					$scope.saveGameInfo = GameInfo.save;
				}
			})
			.state('config', {
				url: '/config',
				templateUrl: 'templates/config.html',
				controller: function($scope) {
					$scope.files = [];

					// Obtenemos los archivos
					Config.getFiles();
				}
			})
			.state('config_show', {
				url: '/config/{fileName:string}',
				templateUrl: 'templates/config.show.html',
				controller: function($scope, $stateParams) {
					$scope.commands = [];
					$scope.newCommand = '';

					// Obtenemos la información del archivo
					$scope.file = new Config( $stateParams.fileName );
				
					$scope.add		= $scope.file.add;
					$scope.remove	= $scope.file.remove;
					$scope.save		= $scope.file.save;
				}
			})
			.state('weapons', {
				url: '/weapons',
				templateUrl: 'templates/weapons.html',
				controller: function($scope) {
					$scope.weapons = [];

					// Eliminación
					$scope.remove = function( fileName ) {
						$.each($scope.weapons, function(key, file) {
							if ( fileName != file.fileName ) return;

							// Eliminamos y quitamos de la lista
							file.remove().then(function() {
								$scope.weapons.splice(key, 1);
								$scope.$apply();
							});
						});
					};

					// Obtenemos todas las armas
					Weapon.getFiles();
				}
			})
			.state('weapon_show', {
				url: '/weapons/{fileName:string}',
				templateUrl: 'templates/weapon.show.html',
				controller: function($scope, $stateParams) {
					$scope.error	= '';
					$scope.item		= {};
					$scope.creating	= false;

					// Lista de tipos de vibración
					$scope.rumblesList = rumblesList();

					// Obtenemos el archivo
					$scope.weapon = new Weapon( $stateParams.fileName );
					$scope.weapon.load();

					// Callbacks
					$scope.save = $scope.weapon.save;
				}
			})
			.state('weapon_create', {
				url: '/weapon/create',
				templateUrl: 'templates/weapon.show.html',
				controller: function($scope, $stateParams) {
					$scope.error	= '';
					$scope.item		= {};
					$scope.creating = true;
					$scope.weapon 	= new Weapon();

					// Lista de tipos de vibración
					$scope.rumblesList = rumblesList();

					// Callbacks
					$scope.save = $scope.weapon.save;

					// Edición de la identificación
					$scope.onNameUpdate = function() {
						$scope.weapon.setFileName( 'weapon_' + $scope.fileName + '.txt' );
					};
				}
			})
			.state('weapon_duplicate', {
				url: '/weapon/duplicate/{fileName:string}',
				templateUrl: 'templates/weapon.show.html',
				controller: function($scope, $stateParams) {
					$scope.error	= '';
					$scope.item		= {};
					$scope.creating = true;

					// Lista de tipos de vibración
					$scope.rumblesList = rumblesList();

					// Obtenemos el archivo
					$scope.weapon = new Weapon( $stateParams.fileName );
					$scope.weapon.load();

					// Callbacks
					$scope.save = $scope.weapon.save;

					// Edición de la identificación
					$scope.onNameUpdate = function() {
						$scope.weapon.setFileName( 'weapon_' + $scope.fileName + '.txt' );
					};
				}
			})
			.state('sounds', {
				url: '/sounds',
				templateUrl: 'templates/sounds.html',
				controller: function($scope) {
					$scope.list = [];

					// Eliminación
					$scope.remove = Sound.removeFile;

					// Obtenemos todos los archivos
					Sound.getFiles($scope);
				}
			})
			.state('sound', {
				abstract: true,
				url: '/sound',
				template: '<ui-view/>',
				controller: function($scope, $stateParams) {
					$scope.error	= '';
					$scope.item		= {};
					$scope.creating	= false;
					$scope.list	 	= [];

					$scope.channelList 	= channelList();
					$scope.levelList 	= levelList();

					// Obtenemos el archivo
					$scope.file = new Sound();
					//$scope.file.load();

					// Callbacks
					$scope.save				= $scope.file.save;
					$scope.play				= $scope.file.play;
					$scope.addSound 		= $scope.file.addSound;
					$scope.removeSound	 	= $scope.file.removeSound;
					$scope.addRndSound		= $scope.file.addRndSound;
					$scope.removeRndSound	= $scope.file.removeRndSound;
					$scope.openFolder		= $scope.file.openInFolder;

					// Obtenemos todos los archivos
					Sound.getFiles($scope);
				}
			})
			.state('sound.show', {
				url: '/show/{fileName:string}',
				templateUrl: 'templates/sound.show.html',
				controller: function($scope, $stateParams) {
					// Obtenemos el archivo
					$scope.file = new Sound( $stateParams.fileName );
					$scope.file.load();
				}
			})
			.state('sound.create', {
				url: '/create',
				templateUrl: 'templates/sound.show.html',
				controller: function( $scope ) {
					$scope.creating = true;

					// Edición de la identificación
					$scope.onNameUpdate = function() {
						$scope.file.setFileName( '\\scripts\\sounds\\' + $scope.fileName + '.txt' );
					};
				}
			})
			.state('sound.duplicate', {
				url: '/duplicate/{fileName:string}',
				templateUrl: 'templates/sound.show.html',
				controller: function( $scope, $stateParams ) {
					$scope.creating = true;

					// Obtenemos el archivo
					$scope.file = new Sound( $stateParams.fileName );
					$scope.file.load();

					// Edición de la identificación
					$scope.onNameUpdate = function() {
						$scope.file.setFileName( '\\scripts\\sounds\\' + $scope.fileName + '.txt' );
					};
				}
			});

	});