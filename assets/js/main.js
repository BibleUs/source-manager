// requires
const electron	= require('electron');
const strings	= require('locutus/php/strings');
const readline	= require('line-reader');

// File
const fs 		= electron.remote.require('fs');
const execFile 	= electron.remote.require('child_process').execFile;

// Notificación de carga
const loading = new Notification('¡Tus cambios han sido guardados con éxito!', '¡Ha ocurrido un problema!', 'is-warning');

// Opciones e información del Juego
var gameInfo	= {};
var options		= {};

/**
 * Clase principal
 */
class Main
{
	static ready() {
		$('body').on('drop', '[data-drag-copy]', Main.onDrop);

		// Redimensión de pantalla
		Main.resize();
		$('body').on('resize', Main.resize);
	}

	static onDrop( e ) {
		e.preventDefault();
		e.stopPropagation();

		let button = $(this).parent().find('button');
		let self = $(this);

		$.each( e.originalEvent.dataTransfer.files, function( key, file ) {
			let path	= file.path;
			path		= path.replace( options.gameDirectory, '' );
			path		= path.replace( 'sound\\', '' );

			self.val( path );
			self.trigger('input');

			if ( button.length == 1 ) {
				button.click();
			}
		});
	}

	static resize() {
		let width  = window.outerWidth;
		let height = window.outerHeight;

		$('[data-fullheight]').height( height );
	}
}

// Documento listo
$( Main.ready );