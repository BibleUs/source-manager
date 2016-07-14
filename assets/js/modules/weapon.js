/**
 * Maneja los archivos de configuración de las armas
 */
class Weapon
{
	/**
	 * Constructor
	 */
	constructor( fileName ) {
		this.setFileName( fileName );
	}

	/**
	 * Establece el nombre del archivo
	 */
	setFileName( fileName ) {
		this.fileName = fileName;

		if ( this.fileName != undefined ) {
			this.filePath	= options.gameDirectory + '\\scripts\\' + fileName;
			this.weaponName	= Weapon.getWeaponName( fileName );
		}
	}

	/**
	 * Carga el archivo del arma y guarda su información
	 */
	load() {
		// Leemos el archivo
		console.log('[Weapon] Reading ' + this.fileName);
		fs.readFile( this.filePath, 'utf-8', this.read );
	}

	/**
	 * Lee el archivo
	 */
	read( err, data ) {
		if ( err ) {
			document.location.href = 'index.html#/weapons';
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

		$scope.item = data.WeaponData;
		$scope.$apply();
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
				fs.unlinkSync( self.filePath );
				resolve(0);
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
		let data = VDF.stringify( {'WeaponData': $scope.item}, true );

		// Guardamos el archivo
		console.log('[Weapon] Saving ' + $scope.weapon.fileName + '....');
		fs.writeFileSync($scope.weapon.filePath, data);

		// Exito
		loading.success();
	}

	/**
	 * Devuelve el nombre del arma (usando el nombre del archivo)
	 */
	static getWeaponName( fileName ) {
		fileName = fileName.replace('weapon_', '');
		fileName = fileName.replace('.txt', '');
		return fileName.toUpperCase();
	}

	/**
	 * Busca los archivos
	 */
	static getFiles() {
		let gameDirectory = options.gameDirectory;
		fs.readdir( gameDirectory + '/scripts/', 'utf-8', Weapon.onFiles );
	}

	/**
	 * Procesa los archivos en /scripts/
	 */
	static onFiles( err, files ) {
		if ( err ) throw err;

		// Vaciamos la lista de archivos
		let $scope = scope();
		$scope.weapons = [];

		$.each( files, function(key, file) {
			// Archivo inválido
			if ( file.indexOf('weapon_') == -1 ) return;

			// Instancia
			let weapon = new Weapon( file );
			
			// Lo incluimos en la lista de archivos
			$scope.weapons.push( weapon );
		});

		$scope.$apply();
	}
}