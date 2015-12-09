'use strict';

// test link
// https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=c5562b851723219b1fbea51790bb347a&user_id=44327319@N06&format=json&nojsoncallback=1&per_page=12

function FlickrAPI(obj){
	this.elementID 		= obj.elementID;	// element to load images
	this.data 			= null;				// json data from flickr
	this.flickrAPIKey 	= obj.flickrAPIKey;	// api key
	this.flickrUserID 	= obj.flickrUserID; // flickr user_id parameter
	this.perPage 		= obj.perPage || 12; // flickr per_page parameter
	this.page 			= obj.page || 1; 	// flickr page parameter
	this.http 			= new HTTP(); 		// create a new http instance

}

FlickrAPI.prototype = {

	//http : new HTTP(),

	emptyContainer : function(){
		document.getElementById(this.elementID).innerHTML='';
	},

	createFlickrURL : function(){
		return 'https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=' + this.flickrAPIKey + '&user_id=' + this.flickrUserID + '&format=json&nojsoncallback=1&per_page=' + this.perPage + '&page=' + this.page;
	},

	fetch : function(){
		this.emptyContainer();

		var self = this;		
		var spinner = document.createElement('span');
			spinner.setAttribute('class', 'fa fa-2x fa-spin fa-spinner');
			document.getElementById(this.elementID).appendChild(spinner);

		this.http.getURL(this.createFlickrURL(), 'json')
		.then(function(data){			
			self.data = data; 
			self.fill();
			var L = new Lightbox({elementID : self.elementID});
				L.init();
		});		
	},

	fill : function(){
			
		// this.data = obj;
		// clear container
		this.emptyContainer();

		var html; 	// html to add to container (contains div and image)
		var p; 		// element in photo array
		var img; 	// img element
		var t; 		// img title

		for(var i=0;i<this.data.photos.photo.length;i++){
			
			p = this.data.photos.photo[i];

			if(p.title == ''){
				t = 'No Title Provided for Image ' + i;
			}else{
				t = p.title;
			}

			html = document.createElement('div');
			html.setAttribute('class', 'col-xs-6 col-sm-6 col-md-3 col-lg-3');

			img = document.createElement('img');
			img.setAttribute('src', 'https://farm'+p.farm+'.staticflickr.com/'+p.server+'/'+p.id+'_'+p.secret+'_m.jpg');
			img.setAttribute('rel', 'lightbox');
			img.setAttribute('class', 'thumbnail');
			img.setAttribute('title', t);

			html.appendChild(img);				

			document.getElementById(this.elementID).appendChild(html);
		}
		this.paginate();
	},

	getPage : function(page){
		this.page = page;
		this.fetch();
	},

	paginate : function(){
		var self = this;
		var createLinkShortcut = function(i){
			return function(e){
				e.preventDefault();
				this.getPage(i);
			}
		}

		var element = document.getElementById(this.elementID);
		var paginationElement = document.createElement('ul');
			paginationElement.setAttribute('class', 'pagination');	

		for(var i=1;i<=this.data.photos.pages;i++){

			var li = document.createElement('li');
			if(i == this.data.photos.page){
				li.setAttribute('class', 'active');	
			}
			
			var a = document.createElement('a');	
				a.setAttribute('href', this.createFlickrURL(12, i) );	
				a.onclick = createLinkShortcut(i).bind(this);
				
			var pageNum = document.createTextNode(i);
				a.appendChild(pageNum);
				li.appendChild(a);
				paginationElement.appendChild(li);
		}
		element.appendChild(paginationElement);
	}

}
