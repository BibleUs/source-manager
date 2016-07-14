class GameFile
{
	/**
	 * Directorio base
	 */
	static baseDir() {
		return options.gameDirectory + '\\scripts\\';
	}

	/**
	 * Constructor
	 */
	constructor( fileName ) {
		this.masterKey = '';
		this.data = {};
		
		this.setFileName( fileName );
	}

	/**
	 * Establece el nombre del archivo
	 */
	setFileName( fileName ) {
		this.fileName = this.originalName = fileName;

		let className = this.constructor.name;

		if ( this.fileName != undefined ) {
			// Es una ruta
			if ( fileName.indexOf('\\') > -1 || fileName.indexOf('/') > -1 ) {
				this.fileRoute 	= this.fileName;
				this.filePath 	= options.gameDirectory + this.fileName;
				this.fileName 	= this.fileName.replace(/^.*[\\\/]/, '');
			}
			else {
				this.filePath = eval( className + '.baseDir()') + fileName;	
			}

			// Nombre bonito para el archivo
			this.prettyName	= eval( className + '.getPrettyName("' + this.fileName + '")' );
		}
	}

	/**
	 * Carga el archivo y guarda su información
	 */
	load() {
		// Leemos el archivo
		console.log('[GameFile] Loading ' + this.fileName);
		fs.readFile( this.filePath, 'utf-8', this.read );
	}

	/**
	 * Lee el archivo
	 */
	read( err, data ) {
		// Ha ocurrido un error
		if ( err ) {
			window.history.back();
			throw err;
		}

		let $scope = scope();

		try {
			// Parseamos el archivo
			data = VDF.parse( data );
		}
		catch( why ) {
			// Mostramos el error
			$scope.error = why.message;
			$scope.$apply();
			return;
		}

		if ( $scope.file.masterKey.length > 0 ) {
			$scope.item = $scope.file.data = data[$scope.file.masterKey];
		}
		else {
			$scope.item = $scope.file.data = data;
		}

		$scope.$apply();
		console.log('[GameFile] Loaded!');
	}

	/**
	 * Elimina el archivo
	 */
	remove() {
		let $scope 	= scope();
		let self 	= this;

		return new Promise(function(resolve, reject) {
			swal({
				title: '¿Estas seguro?',
				text: 'No se podrá recuperar el archivo',
				showCancelButton: true,
				confirmButtonText: 'Eliminar',
				cancelButtonText: 'Cancelar'
			}).then(function() {
				try {
					fs.unlinkSync( self.filePath );
					resolve(0);
				}
				catch( why ) {
					reject( why.message );
				}
			});
		});
	}

	/**
	 * Guarda los cambios en el archivo
	 */
	save() {
		// Cargando...
		loading.show();

		let $scope = scope();

		// Convertimos la información a ValveDataFormat
		let data = $scope.file.stringify();

		// Guardamos el archivo
		console.log('[GameFile] Saving ' + $scope.file.fileName + '....');

		try {
			fs.writeFileSync( $scope.file.filePath, data );
		}
		catch( why ) {
			alert('Ha ocurrido un problema al guardar el archivo. Verifica que la carpeta de destino exista y pueda escribirse en ella.');
			console.error( why.message );
			return false;
		}

		// Exito
		loading.success();
		return true;
	}

	/**
	 * Convierte la información actual a ValveDataFormat
	 */
	stringify() {
		let $scope = scope();

		// Convertimos la información a ValveDataFormat
		return VDF.stringify( {'WeaponData': $scope.item}, true );
	}

	/**
	 * Devuelve un nombre lindo para el archivo
	 */
	static getPrettyName( fileName ) {
		fileName = fileName.replace('weapon_', '');
		fileName = fileName.replace('.txt', '');
		return fileName.toUpperCase();
	}

	/**
	 * Busca los archivos
	 */
	static getFiles() {
		fs.readdir( this.baseDir(), 'utf-8', this.onFiles );
	}

	/**
	 * Procesa los archivos
	 */
	static onFiles( err, files ) {
		if ( err ) throw err;

		// Vaciamos la lista de archivos
		let $scope = scope();
		$scope.list = [];

		$.each( files, function(key, file) {
			// Archivo inválido
			if ( !this.isValidFile() ) return;

			// Instancia
			let item = new this( file );
			
			// Lo incluimos en la lista de archivos
			$scope.list.push( item );
		});

		$scope.$apply();
	}

	/**
	 * Devuelve si el nombre del archivo es válido para
	 * contar dentro de la lista
	 */
	static isValidFile( fileName ) {
		if ( file.indexOf('weapon_') == -1 ) return false;
		return true;
	}

	/**
	 * Elimina el archivo
	 */
	static removeFile( fileName ) {
		let $scope = scope();

		$.each($scope.list, function(key, file) {
			if ( fileName != file.fileName ) return;

			// Eliminamos y quitamos de la lista
			file.remove().then(function() {
				$scope.list.splice(key, 1);
				$scope.$apply();
			}, function() {
				$scope.list.splice(key, 1);
				$scope.$apply();
			});
		});
	}
}