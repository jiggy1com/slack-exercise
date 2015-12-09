
(function(){

	'use strict';

	function loadApp(){

		var elements = ['lightbox1']; //'lightbox2'

		for(var i=0; i<elements.length;i++){
			var appElement = elements[i];

			(function(){
				var obj = {};
					obj.F = new FlickrAPI({
						elementID : appElement,
						flickrAPIKey : 'c5562b851723219b1fbea51790bb347a',
						flickrUserID : '44327319@N06',
					});					
					obj.F.fetch();				
			})();
		}
	}

	if(window.attachEvent) {
		document.attachEvent('DOMContentLoaded', function(){
			loadApp();
		}, false);
	}else{
		document.addEventListener('DOMContentLoaded', function(){
			loadApp();
		}, false);
	}

}());

