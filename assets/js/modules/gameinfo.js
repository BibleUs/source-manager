/**
 * Maneja el archivo GameInfo
 */
class GameInfo
{
	/**
	 * Carga el archivo
	 */
	static load() {
		console.log('[GameInfo] Loading GameInfo in ' + options.gameDirectory + '/GameInfo.txt');

		let gameDirectory = options.gameDirectory;
		let data = fs.readFileSync( gameDirectory + '/GameInfo.txt', 'utf-8');
		
		let $scope = scope();

		try {
			// Parseamos el archivo
			data = VDF.parse( data );
		}
		catch( why ) {
			// Mostramos el error
			if ( $scope != undefined ) {
				$scope.gameInfo.error = why.message;
				$scope.$apply();
			}
			else {
				console.error( why.message );
			}

			return;
		}

		// Guardamos la información
		if ( $scope == undefined ) {
			gameInfo = data.GameInfo;
		}
		else {
			$scope.gameInfo = gameInfo = data.GameInfo;
			$scope.gameInfo.error = '';
			$scope.$apply();
		}

		console.log('[GameInfo] Loaded!');
	}

	/**
	 * Guarda los nuevos cambios
	 */
	static save() {
		// Cargando...
		loading.show();

		// Eliminamos el campo de error
		let $scope = scope();
		delete $scope.gameInfo.error;

		// Convertimos la información a ValveDataFormat
		let data = VDF.stringify( {'GameInfo': $scope.gameInfo}, true );
		let gameDirectory = scope().options.gameDirectory;

		// Guardamos el archivo
		console.log('[GameInfo] Saving GameInfo...');
		fs.writeFileSync(gameDirectory + '/GameInfo.txt', data);

		// Exito
		loading.success();
	}
}

// Cargamos
GameInfo.load();