var program = null;

(function()
{
	function Program()
	{
		var self = this;

		this.mapOriginalWidth = 1024;
		this.mapOriginalHeight = 1024;
		this.mapOriginalPad = 25;
		this.mapOriginalTile = 100;
		this.mapPadRatio = this.mapOriginalWidth / this.mapOriginalPad;
		this.mapTileRatio = this.mapOriginalWidth / this.mapOriginalTile;

		this.$marker = null;
		this.$canvas = $('#fn-map')[0];
		this.ctx = this.$canvas.getContext('2d');
		this.width = 650;
		this.height = 650;

		this.markerRad = 10;
		this.markerCount = 0;

		this.mapImage = null;

		this.random = new Random();

		this.namedLocations = 
		[
			{ x: 125.75, y: 75.5 },
			{ x: 337.75, y: 140.5 },
			{ x: 94.75, y: 151.5 },
			{ x: 531.75, y: 190.5 },
			{ x: 182.75, y: 184.5 },
			{ x: 429.75, y: 204.5 },
			{ x: 282.75, y: 240.5 },
			{ x: 581.75, y: 279.5 },
			{ x: 55.75, y: 300.5 },
			{ x: 377.75, y: 292.5 },
			{ x: 235.75, y: 327.5 },
			{ x: 481.75, y: 344.5 },
			{ x: 141.75, y: 402.5 },
			{ x: 370.75, y: 399.5 },
			{ x: 235.75, y: 405.5 },
			{ x: 386.75, y: 487.5 },
			{ x: 538.75, y: 518.5 },
			{ x: 228.75, y: 555.5 }
		]

		this.extraLocations = 
		[
			{x: 491.75, y: 474.5 },
			{x: 279.75, y: 528.5 },
			{x: 330.75, y: 560.5 },
			{x: 268.75, y: 451.5 },
			{x: 232.75, y: 477.5 },
			{x: 151.75, y: 312.5 },
			{x: 165.75, y: 263.5 },
			{x: 93.75, y: 333.5 },
			{x: 104.75, y: 258.5 },
			{x: 273.75, y: 403.5 },
			{x: 404.75, y: 343.5 },
			{x: 324.75, y: 457.5 },
			{x: 470.75, y: 261.5 },
			{x: 257.75, y: 111.5 },
			{x: 170.75, y: 109.5 },
			{x: 405.75, y: 151.5 },
			{x: 480.75, y: 124.5 },
			{x: 44.75, y: 358.5 },
			{x: 582.75, y: 397.5 },
			{x: 540.75, y: 320.5 },
			{x: 525.75, y: 401.5 }
		]

		this.LoadMap();
	}

	Program.prototype.ClearMarkers = function()
	{
		this.markerCount = 0;
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.LoadMap();
	}

	Program.prototype.LoadMap = function()
	{
		var self = this;

		if(!this.mapImage)
		{
			var request = new XMLHttpRequest();
			request.open('GET', '../res/map3.png', true);
			request.responseType = 'arraybuffer';

			request.onload = function() 
			{
				var blb = new Blob([this.response], {type: 'image/png'});
	    		var url = (window.URL || window.webkitURL).createObjectURL(blb);

				self.mapImage = new Image();

				self.mapImage.onload = function() 
				{
					self.ctx.drawImage(self.mapImage, 0, 0, self.width, self.height);
				};

				self.mapImage.src = url;
			}

			request.send();
		}
		else
		{
			self.ctx.drawImage(self.mapImage, 0, 0, self.width, self.height);
		}
	}

	Program.prototype.RandomizePoint = function()
	{
		var pad = this.width / this.mapPadRatio;

		/*var randomX = chance.integer(
		{
			min: pad,
			max: this.width - pad * 2
		});

		var randomY = chance.integer(
		{
			min: pad,
			max: this.height - pad * 2
		});*/

		var randomX = this.random.uniform(pad, this.width - pad * 2);
		var randomY = this.random.uniform(pad, this.height - pad * 2);

		var pixelData = this.ctx.getImageData(randomX + this.markerRad, randomY + this.markerRad, 1, 1).data;

		/*while(this.PointInWhichTile(randomXoff, randomYoff) === null || 
			  this.tileBlacklist.indexOf(this.PointInWhichTile(randomXoff, randomYoff).join('')) > -1)*/
		while(pixelData[3] < 255)
		{
			/*var randomX = chance.integer(
			{
				min: pad,
				max: this.width - pad * 2
			});

			var randomY = chance.integer(
			{
				min: pad,
				max: this.height - pad * 2
			});*/

			var randomX = this.random.uniform(pad, this.width - pad * 2);
			var randomY = this.random.uniform(pad, this.height - pad * 2);

			pixelData = this.ctx.getImageData(randomX + this.markerRad, randomY + this.markerRad, 1, 1).data;
		}
		
		

		this.ctx.beginPath();
		this.ctx.arc(randomX, randomY, this.markerRad, 0, 2 * Math.PI);
		this.ctx.fillStyle = 'red';
      	this.ctx.fill();
		this.ctx.stroke();

		this.ctx.font = "14px Arial";
		this.ctx.fillStyle = 'white';
		this.ctx.textAlign = "center"; 
		this.ctx.fillText(this.markerCount, randomX, randomY + this.markerRad / 2);

		this.markerCount++;
	}

	Program.prototype.RandomNamedLocation = function()
	{
		//this.ClearMarkers();

		var loc = this.namedLocations[chance.integer({ min: 0, max: this.namedLocations.length - 1 })];

		this.ctx.beginPath();
		this.ctx.arc(loc.x, loc.y, 6, 0, 2 * Math.PI);
		this.ctx.fillStyle = 'cyan';
      	this.ctx.fill();
		this.ctx.stroke();
	}

	Program.prototype.RandomExtraLocation = function()
	{
		//this.ClearMarkers();

		var loc = this.extraLocations[chance.integer({ min: 0, max: this.extraLocations.length - 1 })];

		this.ctx.beginPath();
		this.ctx.arc(loc.x, loc.y, 6, 0, 2 * Math.PI);
		this.ctx.fillStyle = 'cyan';
      	this.ctx.fill();
		this.ctx.stroke();
	}

	Program.prototype.RandomNamedOrExtraLocation = function()
	{
		//this.ClearMarkers();

		var collection = this.namedLocations.concat(this.extraLocations);

		var loc = collection[chance.integer({ min: 0, max: collection.length - 1 })];

		this.ctx.beginPath();
		this.ctx.arc(loc.x, loc.y, 6, 0, 2 * Math.PI);
		this.ctx.fillStyle = 'cyan';
      	this.ctx.fill();
		this.ctx.stroke();
	}

	Program.prototype.RandomizeTile = function()
	{

	}

	Program.prototype.PointInWhichTile = function(x, y)
	{
		var offX = this.$map.offset().left;
		var offY = this.$map.offset().top;
		var width = this.$map.outerWidth();
		var height = this.$map.outerHeight();
		var pad = width / this.mapPadRatio;
		var tile = width / this.mapTileRatio;
		var char = '0ABCDEFGHIJ'.split('');

		x = x - offX;
		y = y - offY;

		var tilesX = 10;
		var tilesY = 10;

		var dx = Math.floor((x / tile)) + 1;
		var dy = Math.floor((y / tile)) + 1;

		console.log(char[dx], dy)

		if(typeof char[dx] === 'undefined')
			return null;

		if(dy > 10)
			return null;

		return [char[dx], dy];
	}

	$(document).on('click', function(e)
	{
		//program.PointInWhichTile(e.clientX, e.clientY)
		var rect = program.$canvas.getBoundingClientRect();
		var x = e.clientX - rect.left;
		var y = e.clientY - rect.top;

		console.log('{x: ' + x + ', y: ' + y + '},')
	});



	$(document).ready(function()
	{
		program = new Program();
	});
	
})();