(function(window){

	'use strict';

	// make Lightbox global
	window.Lightbox = function(){

		this.overlay 		= null; // lightbox overlay
		this.lightbox 		= null; // lightbox container

		this.title 			= null; // lightbox title
		this.imageContainer	= null; // lightbox image container
		this.image 			= document.createElement('img'); 	// lightbox image
		this.imageList 		= null; // lightbox image list

		this.nextButton 	= null; // lightbox next button
		this.prevButton 	= null; // lightbox prev button
		this.closeButton 	= null; // lightbox close button

		// lightbox default settings
		var defaults = {
			elementID : 'lightbox',
			imageIndex : 0,
			height: 395, // 395 'auto' is optional (could be if i get back to it)
			width: 500,
		}

		this.options = defaults;

		if(arguments[0] && typeof arguments[0] === 'object'){
			this.options = extendDefaults(defaults, arguments[0]);
		}
		
		// link the images
		//this.init();

	}

	// Lightbox public methods
	Lightbox.prototype = {
		openLightbox : function(imageIndex){
			this.options.imageIndex = imageIndex;
			buildLightbox.call(this);
			loadMyImage.call(this);		
			initEvents.call(this);		
		},
		next : function(){
			if(this.options.imageIndex + 1 > this.imageList.length-1){
				this.options.imageIndex = 0;
			}else{
				this.options.imageIndex++;
			}	
			loadMyImage.call(this);
		},
		prev : function(){
			if(this.options.imageIndex - 1 < 0){
				this.options.imageIndex = this.imageList.length-1;
			}else{
				this.options.imageIndex--;
			}	
			loadMyImage.call(this);
		},
		close : function(){
			document.body.removeChild(this.overlay);
			document.body.removeChild(this.lightbox);
		},
		init : function(){
			var createLightboxShortcut = function(i){
				return function(){
					this.openLightbox(i);
				}
			}
			this.imageList 		= document.getElementById(this.options.elementID).querySelectorAll('[rel=lightbox]'); 
			for(var i=0;i<this.imageList.length;i++){
				this.imageList[i].onclick = createLightboxShortcut(i).bind(this);
			}
		},
		repositionLightbox : function(){

			var wh = window.innerHeight;
			var ww = window.innerWidth;
			var h = this.options.height;
			var w = this.options.width;
				h = h > wh ? wh - 60 : h;
				w = w > ww ? ww - 60 : w;

			this.lightbox.style.top = (window.pageYOffset) + wh / 2 - h / 2 +'px';
			this.lightbox.style.left = ww / 2 - w / 2 +'px';
			this.lightbox.style.height = h +'px';
			this.lightbox.style.width = w +'px';
		},
		checkKey : function(e){
			if(e.which == 37){
				this.prev();
			}
			if(e.which == 39){
				this.next();
			}
			return true;
		}
	}

	// Lightbox internal methods

	function extendDefaults(oDefaults, oUserDefaults){
		var property;
		for(property in oUserDefaults){
			if(oDefaults.hasOwnProperty(property)){
				oDefaults[property] = oUserDefaults[property];
			}
		}
		return oDefaults;
	}

	function buildLightbox(){

		var span;

		// overlay
		this.overlay = document.createElement('div');
		this.overlay.setAttribute('class', 'lightbox-overlay');
		this.overlay.style.height = document.body.clientHeight +'px';
		this.overlay.style.width = document.body.clientWidth +'px';
		document.body.appendChild(this.overlay);

		// container
		this.lightbox = document.createElement('div');
		this.lightbox.setAttribute('class', 'lightbox-container');
		this.repositionLightbox();

		this.titleContainer = document.createElement('div');
		this.titleContainer.setAttribute('class', 'lightbox-title');
		this.titleContainer.setAttribute('id', 'lightbox-title');
		this.titleContainer.appendChild(document.createTextNode('&nbsp;'));
		this.lightbox.appendChild(this.titleContainer);

		// image
		this.imageContainer = document.createElement('div');
		this.imageContainer.setAttribute('class', 'lightbox-image');
		
		this.image = document.createElement('img');
		this.image.setAttribute('src', this.imageList[this.options.imageIndex].getAttribute('src'));
		this.imageContainer.appendChild(this.image);

		this.lightbox.appendChild(this.imageContainer);

		// prev button
		this.prevButton = document.createElement('div');
		this.prevButton.setAttribute('class', 'lightbox-prev');
		span = document.createElement('span');
		span.setAttribute('class', 'fa fa-2x fa-chevron-left');
		this.prevButton.appendChild(span);
		this.lightbox.appendChild(this.prevButton);

		// next button
		this.nextButton = document.createElement('div');
		this.nextButton.setAttribute('class', 'lightbox-next');
		span = document.createElement('span');
		span.setAttribute('class', 'fa fa-2x fa-chevron-right');
		this.nextButton.appendChild(span);
		this.lightbox.appendChild(this.nextButton);

		// close button
		this.closeButton = document.createElement('div');
		this.closeButton.setAttribute('class', 'lightbox-close');
		span = document.createElement('span');
		span.setAttribute('class', 'fa fa-2x fa-times-circle');
		this.closeButton.appendChild(span);
		this.lightbox.appendChild(this.closeButton);

		// append lightbox to body
		document.body.appendChild(this.lightbox);

	}

	function getElementOuterHeight(element){
		var styles = window.getComputedStyle(element);
		var margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);
		return Math.ceil(element.offsetHeight+margin);
	}

	function loadMyImage(){
		//this.image = ;
		this.title = this.imageList[this.options.imageIndex].getAttribute('title');
		this.image.setAttribute('src', this.imageList[this.options.imageIndex].getAttribute('src').replace('_m.jpg','.jpg')); 
		this.image.style['max-height'] = (this.options.height - 60 - getElementOuterHeight( document.getElementById('lightbox-title') )) + 'px';
		document.getElementsByClassName('lightbox-image')[0].innerHTML = '';
		document.getElementsByClassName('lightbox-image')[0].appendChild(this.image);
		document.getElementsByClassName('lightbox-title')[0].innerHTML = this.title;
	}

	function initEvents(){

		/****************************************/
		/* reposition lightbox on window resize */
		/****************************************/
		if(window.attachEvent) {
			// IE
			this.closeButton.attachEvent('click', this.close.bind(this));	
			this.overlay.attachEvent('click', this.close.bind(this));	
			this.prevButton.attachEvent('click', this.prev.bind(this));	
			this.nextButton.attachEvent('click', this.next.bind(this));
			window.attachEvent('keyup', this.checkKey.bind(this), false);
		    window.attachEvent('onresize', this.repositionLightbox.bind(this));
		}
		else if(window.addEventListener) {
			// OTHERS
			this.closeButton.addEventListener('click', this.close.bind(this));	
			this.overlay.addEventListener('click', this.close.bind(this));	
			this.prevButton.addEventListener('click', this.prev.bind(this));	
			this.nextButton.addEventListener('click', this.next.bind(this));
			window.addEventListener('keyup', this.checkKey.bind(this), false);
			window.addEventListener('resize', this.repositionLightbox.bind(this));
		}
		else {
		    //The browser does not support Javascript event binding
		}

	}
	

})(window);