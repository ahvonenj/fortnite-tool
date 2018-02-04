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
	});

	$(document).ready(function()
	{
		program = new Program();
	});
	
})();