
(function(){

	'use strict';

	// load the app (flickr & lightbox)
	function loadApp(){	

		var elements = ['lightbox1']; //'lightbox2'

		for(var i=0; i<elements.length;i++){
			var appElement = elements[i];

			(function(){
				var obj = {};
					obj.F = new FlickrAPI({
						elementID 	 : appElement,
						flickrAPIKey : 'c5562b851723219b1fbea51790bb347a',
						flickrUserID : '44327319@N06',
					});					
					obj.F.fetch();				
			})();
		}
		
	}

	// wait for browser to be ready before firing up the app
	if(window.attachEvent) {
		document.attachEvent('DOMContentLoaded', function(){
			loadApp(); // IE
		}, false);
	}else{
		document.addEventListener('DOMContentLoaded', function(){
			loadApp(); // ERBODY ELSE
		}, false);
	}

}());

