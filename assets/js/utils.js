/**
 * Representa una notificación
 */
class Notification
{
	constructor( message, fail, type ) {
		this.type		= type;
		this.message	= message;
		this.fail 		= ( typeof fail == 'string' ) ? fail : 'Ha ocurrido un problema.';
		this.item 		= null;

		this.create();
	}

	create() {
		let item = $('<div>');
		item.addClass('notification ');
		
		if ( this.item != null ) {
			this.item.hide().remove();
		}

		this.item = item;
		this.reset();

		setTimeout(function() {
			$('body').append( item );
		}, 500);
	}

	reset() {
		let item = this.item;
		item.html('<i class="fa fa-spinner" aria-hidden="true"></i>');
		item.removeClass('is-sucess is-error is-warning').addClass( this.type );

		return this;
	}

	show( message, type ) {
		let item = this.item;

		if ( typeof message != 'undefined' ) {
			item.html( message );
		}

		if ( typeof type != 'undefined' ) {
			item.removeClass('is-sucess is-error is-warning').addClass( type );
		}

		if ( typeof message == 'undefined' && typeof type == 'undefined' ) {
			this.reset();
		}

		item.fadeIn('fast');
		return this;
	}

	hide() {
		this.item.fadeOut('slow');
		return this;
	}

	success() {
		this.show( this.message, 'is-success' );

		let item = this.item;
		setTimeout(function() {
			item.fadeOut('slow');
		}, 3500);

		return this;
	}

	failure( message ) {
		if ( typeof message == 'undefined' ) {
			message = this.fail;
		}

		this.show( message, 'is-error' );

		let item = this.item;
		setTimeout(function() {
			item.fadeOut('slow');
		}, 3500);

		return this;
	}
}

/**
 * Devuelve el Scope del controlador actual
 */
function scope( name ) {
	if ( typeof name == 'undefined' ) {
		return angular.element( document.querySelector('.controller') ).scope();
	}
	else {
		return angular.element( document.querySelector('.controller[data-controller="' + name + '"]') ).scope();
	}
}

function rumblesList() {
	return {
		1	: 'Pistola',
		2	: '357',
		3	: 'SMG1',
		4	: 'AR2',
		5	: 'Escopeta',
		6	: 'Escopeta (Doble disparo)',
		7	: 'AR2 Alt Fire',
		8	: 'Misil RPG',
		9	: 'Cuerpo a cuerpo',
		10	: 'Arma del Bote',
		11	: 'Aram del Jeep',
		12	: 'Izquierda',
		13	: 'Derecha',
		14	: 'Ambos',
		25	: 'PortalGun Izquierda',
		26	: 'PortalGun Derecha',
		27	: 'PortalGun Falló'
	};
}

function channelList() {
	return {
		'CHAN_AUTO'			: 'Automatico',
		'CHAN_WEAPON'		: 'Arma',
		'CHAN_VOICE'		: 'Voz',
		'CHAN_ITEM'			: 'Objeto usable',
		'CHAN_BODY'			: 'Cuerpo',
		'CHAN_STREAM'		: 'Stream',
		'CHAN_STATIC'		: 'Estático/Fondo',
		'CHAN_USER_BASE1'	: 'Custom 1',
		'CHAN_USER_BASE2'	: 'Custom 2',
		'CHAN_USER_BASE3'	: 'Custom 3',
	};
}

function levelList() {
	return {
		'SNDLVL_NONE'	: 'En todas partes',
		'SNDLVL_20dB'	: 'Hojas de arbol',
		'SNDLVL_25dB'	: 'Susurro',
		'SNDLVL_30dB'	: 'Librería',
		'SNDLVL_35dB'	: '35dB',
		'SNDLVL_40dB'	: '40dB',
		'SNDLVL_45dB'	: 'Refrigerador',
		'SNDLVL_50dB'	: 'Hogar',
		'SNDLVL_55dB'	: '55dB',
		'SNDLVL_IDLE'	: 'Conversación',
		'SNDLVL_65dB'	: 'Lavadora',
		'SNDLVL_STATIC'	: 'Estatico',
		'SNDLVL_70dB'	: 'Carro/Aspiradora',
		'SNDLVL_NORM'	: 'Tráfico',
		'SNDLVL_80dB'	: 'Despertador/Ruido de restaurante',
		'SNDLVL_TALKING': 'Conversación alta',
		'SNDLVL_85dB'	: 'Rasuradora',
		'SNDLVL_90dB'	: 'Grito de niño/Motocicleta',
		'SNDLVL_95dB'	: '95dB',
		'SNDLVL_100dB'	: 'Tren/Camión',
		'SNDLVL_105dB'	: 'Helicoptero',
		'SNDLVL_110dB'	: 'Dentro de un barco de motor',
		'SNDLVL_120dB'	: 'Claxon/Aeronave',
		'SNDLVL_125dB'	: '125dB',
		'SNDLVL_130dB'	: 'Sirena',
		'SNDLVL_GUNFIRE': 'Disparos',
		'SNDLVL_140dB'	: '140dB',
		'SNDLVL_145dB'	: '145dB',
		'SNDLVL_150dB'	: '150dB',
		'SNDLVL_180dB'	: 'Lanzamiento de cohete'
	};
}

Array.prototype.rand = function() {
	return this[Math.floor(Math.random()*this.length)];
};

!function(n,t){"use strict";var r=n.fn.val;n.fn.val=function(n){if(!arguments.length)return r.call(this);var e=r.call(this,n);return t.element(this[0]).triggerHandler("input"),e}}(window.jQuery,window.angular);