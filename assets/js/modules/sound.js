/**
 * Maneja los archivos de configuración de Sonidos/Música
 */
class Sound extends GameFile
{
	/**
	 * Reproduce la vista previa de un sonido
	 */
	play( sndData ) {
		let filePath;

		// Sonido al azar
		if ( typeof sndData.rndwave != 'undefined' ) {
			filePath = options.gameDirectory + '\\sound\\' + Sound.cleanWave(sndData.rndwave.wave.rand());
		}
		// Ruta al archivo de sonido
		else {
			filePath = options.gameDirectory + '\\sound\\' + Sound.cleanWave(sndData.wave);
		}

		// ¡No existe!
		if ( !fs.existsSync(filePath) ) {
			alert('¡El sonido "' + sndData.wave + '" no existe!');
			return;
		}

		let pitch 	= ( sndData.pitch != undefined ) ? sndData.pitch : '100';
		let volume 	= ( sndData.volume != undefined ) ? sndData.volume : '1';

		// Pitch al azar
		if ( pitch.indexOf(',') > -1 ) {
			let pitchs = pitch.split(',');
			pitch = pitchs.rand();
		}

		// Pitch
		if ( pitch == 'PITCH_LOW' ) pitch = 95;
		if ( pitch == 'PITCH_NORM' ) pitch = 100;
		if ( pitch == 'PITCH_HIGH' ) pitch = 120;

		// Volumen al azar
		if ( volume.indexOf(',') > -1 ) {
			let volumes = volume.split(',');
			volume = volumes.rand();
		}

		// Volumen
		if ( volume == 'VOL_NORM' ) volume = 1;

		// Creamos el elemento de Audio
		let audio 			= new Audio;
		audio.src			= filePath;
		audio.volume		= volume;
		audio.playbackRate	= (pitch / 100);

		// Reproducimos
		audio.play();
	}

	/**
	 * Muestra el archivo de sonido en la carpeta
	 */
	openInFolder( key, sndName ) {
		let $scope 	= scope();
		let sound 	= $scope.item[sndName].rndwave.wave[key];
		let path 	= options.gameDirectory + '\\sound\\' + sound;

		electron.shell.showItemInFolder( path );
	}

	/**
	 * Agrega un sonido
	 */
	addSound() {
		let $scope = scope();
		let sndName = $scope.newSound.name;
		delete $scope.newSound.name;

		let sndData = $scope.newSound;

		$scope.item[sndName] = sndData;
		$scope.newSound = '';
	}

	/**
	 * Elimina un sonido
	 */
	removeSound( sndName ) {
		let $scope = scope();
		delete $scope.item[sndName];
	}

	/**
	 * Agrega un sonido a la lista de azar
	 */
	addRndSound( newSound, sndName ) {
		let $scope = scope();

		if ( newSound == undefined || sndName == undefined ) {
			alert('Escriba la ruta del sonido');
			return;
		}

		if ( $scope.item[sndName].rndwave == undefined )
			$scope.item[sndName].rndwave = {'wave': []};

		let list	= $scope.item[sndName].rndwave.wave;
		let path	= options.gameDirectory + '\\sound\\' + Sound.cleanWave(newSound);

		newSound = newSound.replace('\\', '\/');

		// El sonido no existe
		if ( !fs.existsSync(path) ) {
			alert('El sonido "' + newSound + '" no existe.');
			return;
		}

		if ( $.inArray(newSound, list) > -1 ) {
			console.warn('El sonido "' + newSound + '" ya existe.');
			$('.new-sound').val('');
			return;
		}

		
		list.push( newSound );

		$('.new-sound').val('');
	}

	/**
	 * Elimina un sonido al azar de la lista
	 */
	removeRndSound( key, sndName ) {
		let $scope = scope();
		$scope.item[sndName].rndwave.wave.splice( key, 1 );
	}

	/**
	 * Convierte la información actual a ValveDataFormat
	 */
	stringify() {
		let $scope = scope();
		let data = {};

		$.each($scope.item, function(key, values) {
			let name = values.name;
			delete values.name;

			data[name] = values;
		});

		// Convertimos la información a ValveDataFormat
		return VDF.stringify( data, true );
	}

	/**
	 * Guarda los cambios en el archivo
	 */
	save() {
		let $scope = scope();
		let result = super.save();

		// Guardado éxitoso, ahora debemos incluirlo en el manifesto
		if ( result ) {
			let exists = false;

			// Verificamos si ya existe
			$.each( $scope.list, function(key, file) {
				if ( file.fileName == $scope.file.fileName ) {
					// Sí
					exists = true;
				}
			});

			// No existe, agregamos a lista y la guardamos
			if ( !exists ) {
				$scope.file.data = $scope.item;
				$scope.list.push( $scope.file );

				Sound.saveManifest();
			}
		}
	}

	/**
	 * Busca los archivos
	 */
	static getFiles( $scope ) {
		// Leemos el manifesto
		let sounds = fs.readFileSync( GameFile.baseDir() + 'game_sounds_manifest.txt', 'utf-8' );

		// Transformamos a objeto
		sounds = VDF.parse( sounds );

		// Vaciamos la lista de archivos
		//let $scope = scope();
		$scope.list = [];

		// Miramos cada archivo en el manifesto
		$.each(sounds.game_sounds_manifest.precache_file, function(key, file) {
			// Instancia
			let item = new Sound( file );

			// Lo incluimos en la lista de archivos
			$scope.list.push( item );
		});
	}

	/**
	 * Guarda el manifesto con la lista de scripts de sonido actual
	 */
	static saveManifest() {
		// Lista con las rutas de los archivos
		let sndsData = [];
		let $scope = scope();

		console.log('[Sound] Saving Manifest...');

		// Pasamos por cada instancia [Sound] y agregamos
		// la ruta a la lista
		$.each( $scope.list, function(key, file) {
			let path = file.fileRoute.replace('\\', '\/');

			if ( path.indexOf('/') == 0 ) {
				path = path.substr(1);
			}

			sndsData.push( path );
		});

		// Convertimos la información a ValveDataFormat
		let data = VDF.stringify( {'game_sounds_manifest': {'precache_file': sndsData}}, true );

		try {
			fs.writeFileSync( GameFile.baseDir() + 'game_sounds_manifest.txt', data );
		}
		catch( why ) {
			alert('Ha ocurrido un problema al guardar el archivo en el manifesto. Verifica que la carpeta de destino exista y pueda escribirse en ella.');
			console.error( why.message );
		}
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
					setTimeout( Sound.saveManifest, 500 );
					resolve(0);
				}
				catch( why ) {
					setTimeout( Sound.saveManifest, 500 );
					reject( why.message );
				}
			});
		});
	}

	/**
	 * Devuelve un nombre lindo para el archivo
	 */
	static getPrettyName( fileName ) {
		fileName = strings.ucfirst( fileName );
		fileName = fileName.replace('.txt', '');

		if ( fileName.length < 4 ) {
			fileName = fileName.toUpperCase();
		}

		return fileName;
	}

	/**
	 * Limpia la ruta del sonido de SoundCharacters
	 */
	static cleanWave( filePath ) {
		filePath = filePath.replace('*', '');
		filePath = filePath.replace('#', '');
		filePath = filePath.replace('@', '');
		filePath = filePath.replace('>', '');
		filePath = filePath.replace('<', '');
		filePath = filePath.replace('^', '');
		filePath = filePath.replace(')', '');
		filePath = filePath.replace('}', '');
		filePath = filePath.replace('$', '');
		filePath = filePath.replace('!', '');
		filePath = filePath.replace('?', '');
		return filePath;
	}

	/**
	 * Devuelve la información con el nombre indicado
	 */
	static find( sndName ) {
		let $scope = scope();
		return $scope.item[sndName];
	}
}