/**
 * Maneja el archivo de opciones
 */
class Options
{
	/**
	 * Carga el archivo
	 */
	static load() {
		console.log('[Options] Loading options.json');

		let data = fs.readFileSync('./options.json', 'utf-8');
		data = JSON.parse( data );

		let $scope = scope();

		if ( $scope == undefined ) {
			options = data;
		}
		else {
			$scope.options = options = data;
			//$scope.$apply();
		}

		console.log('[Options] Loaded!');
		$(document).trigger('options.loaded');
	}

	/**
	 * Valida la información antes de guardar
	 */
	static validate() {
		let $scope = scope();

		// El directorio no existe
		if ( !fs.existsSync($scope.options.gameDirectory) ) {
			return 'El directorio del juego no existe.';
		}

		if ( !fs.existsSync($scope.options.engineDirectory) ) {
			return 'El directorio del motor no existe.';
		}

		if ( !fs.existsSync($scope.options.gameDirectory + '\\GameInfo.txt') ) {
			return 'El directorio del juego no tiene ningún juego válido (GameInfo.txt)';
		}

		if ( !fs.existsSync($scope.options.engineDirectory + '\\hl2.exe') && !fs.existsSync($scope.options.engineDirectory + '\\swarm.exe') ) {
			return 'El directorio del motor no tiene un ejecutable válido (hl2.exe/swarm.exe)';
		}

		return true;
	}

	/**
	 * Guarda los nuevos cambios
	 */
	static save() {
		// Cargando...
		loading.show();

		let validated = Options.validate();

		// El directorio no existe
		if ( validated != true ) {
			loading.hide();
			this.options.error = validated;
			return;
		}

		this.options.error = '';

		// Guardamos el archivo
		console.log('Saving Options...');
		fs.writeFileSync('./options.json', JSON.stringify(this.options));

		// Volvemos a cargar
		Options.load();

		// Exito
		loading.success();
	}

	/**
	 * Párametros predeterminados
	 */
	static params() {
		return '-game "' + options.gameDirectory + '" -console -developer';
	}

	/**
	 * Abre un programa del Juego
	 */
	static open( program ) {
		let execPath 	= '';
		let parameters 	= [];

		parameters.push('-game');
		parameters.push( options.gameDirectory );

		// Hammer Editor
		if ( program == 'hammer' ) {
			execPath = options.engineDirectory + '\\bin\\hammer.exe';
		}

		// Model Viewer
		if ( program == 'viewer' ) {
			execPath = options.engineDirectory + '\\bin\\hlmv.exe';
		}

		// Model Viewer
		if ( program == 'sdk' ) {
			execPath = options.engineDirectory + '\\bin\\SDKLauncher.exe';
			parameters = [];
		}

		// Game
		if ( program == 'game' ) {
			execPath = options.engineDirectory + '\\swarm.exe';

			parameters.push('-console');
			parameters.push('-dev');
			parameters.push('+toggleconsole');
		}

		// Game
		// TODO: Hacer funcionar
		if ( program == 'code' ) {
			let files = fs.readdirSync( options.sourceDirectory );
			
			$.each( files, function( key, file ) {
				if ( file.indexOf('.sln') == -1 ) return;
				execPath = options.sourceDirectory + '\\' + file;
			});

			parameters = [];
		}

		console.log('[Open] Opening ' + program + ' with ' + parameters.join('') + '...');
		execFile( execPath, parameters, function( err, data ){
			if ( err ) {
				alert( err );
				throw err;
			}
		});

		//electron.shell.beep();
	}
}

// Cargamos
Options.load();