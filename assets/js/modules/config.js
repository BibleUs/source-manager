class Config
{
	constructor( fileName ) {
		this.fileName		= fileName;
		this.filePath		= options.gameDirectory + '\\cfg\\' + fileName;
		this.filePrettyName	= Config.prettyName( fileName )

		this.readFile();
	}
	
	readFile() {
		// Vaciamos la lista de comandos
		scope().commands = [];

		// Leemos cada línea del archivo
		console.log('[Config] Reading ' + this.fileName);
		readline.eachLine( this.filePath, this.readLine );
	}

	readLine( line ) {
		let $scope = scope();
		line = line.trim();	

		// Línea no válida
		if ( line.length == 0 || line[0] == '/' ) return;

		// Lo agregamos a la lista
		$scope.commands.push( line );
		$scope.$apply();
	}

	add() {
		let $scope = scope();

		// Comando vacio
		if ( $scope.newCommand.length == 0 ) return;

		// Lo agregamos a la lista
		$scope.commands.push( $scope.newCommand );
		$scope.newCommand = '';
	}

	remove( index ) {
		let $scope = scope();

		// Eliminamos de la lista
		$scope.commands.splice( index, 1 );
		//$scope.$apply();
	}

	save() {
		// Cargando...
		loading.show();

		let $scope = scope();
		let data = '';

		// Ponemos cada comando en una línea diferente
		$.each($scope.commands, function(key, value) {
			data += value + '\n';
		});

		// Guardamos el archivo
		console.log('[Config] Saving ' + $scope.file.fileName + '...');
		fs.writeFileSync( $scope.file.filePath, data );
		console.log($scope.file.filePath);
		console.log(data);

		// Exito
		loading.success();
	}

	static getFiles() {
		let gameDirectory = options.gameDirectory;
		fs.readdir( gameDirectory + '/cfg/', 'utf-8', Config.onFiles );
	}

	static onFiles( err, files ) {
		if ( err ) throw err;

		// Vaciamos la lista de archivos
		let $scope = scope();
		$scope.files = [];

		$.each( files, function(key, file) {
			// Archivo inválido
			if ( file.indexOf('.cfg') == -1 ) return;

			// Información amigable
			let path = file;
			let name = Config.prettyName( file );
			
			// Lo incluimos en la lista de archivos
			$scope.files.push({
				path: path,
				name: name
			});
		});

		$scope.$apply();
	}

	static prettyName( name ) {
		name = name.replace('.cfg', '');
		name = ( name.length < 4 ) ? name.toUpperCase() : strings.ucfirst(name);
		return name;
	}
}