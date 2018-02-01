var program = null;

(function()
{
	function Program()
	{
		this.$map = $('#fn-map');
		this.mapOriginalWidth = 1024;
		this.mapOriginalHeight = 1024;
		this.mapOriginalPad = 25;
		this.mapOriginalTile = 100;
		this.mapPadRatio = this.mapOriginalWidth / this.mapOriginalPad;
		this.mapTileRatio = this.mapOriginalWidth / this.mapOriginalTile;

		this.$marker = null;
		this.canvas = null;

		this.tileBlacklist = 
		[
			'A1', 'E1', 'F1', 'G1', 'H1',
			'I1', 'J1', 'J2', 'A7', 'A8',
			'B8', 'A9', 'B9', 'C9', 'J9',
			'A10', 'B10', 'C10', 'E10',
			'H10','I10', 'J10', 'A2',
			'J8', 'J3', 'A3', 'A4', 'C8',
			'D10'
		];
	}

	Program.prototype.RandomizePoint = function()
	{
		var offX = this.$map.offset().left;
		var offY = this.$map.offset().top;
		var width = this.$map.outerWidth();
		var height = this.$map.outerHeight();
		var pad = width / this.mapPadRatio;
		var tile = width / this.mapTileRatio;

		if(this.canvas === null)
		{
			this.canvas = document.createElement('canvas');
			this.canvas.width = width + offX;
			this.canvas.height = height + offY;
			this.canvas.getContext('2d').drawImage(this.$map[0], offX, offY, width, height);
		}

		var randomX = chance.integer(
		{
			min: pad,
			max: width - pad * 2
		});

		var randomY = chance.integer(
		{
			min: pad,
			max: height - pad * 2
		});

		randomXoff = randomX + offX;
		randomYoff = randomY + offY;

		while(this.PointInWhichTile(randomXoff, randomYoff) === null || 
			  this.tileBlacklist.indexOf(this.PointInWhichTile(randomXoff, randomYoff).join('')) > -1)
		{
			var randomX = chance.integer(
			{
				min: pad,
				max: width - pad * 2
			});

			var randomY = chance.integer(
			{
				min: pad,
				max: height - pad * 2
			});

			randomXoff = randomX + offX;
			randomYoff = randomY + offY;
		}
		
		var pixelData = this.canvas.getContext('2d').getImageData(randomXoff + 7.5, randomYoff + 7.5, 1, 1).data;

		var marker = $('<div/>',
		{
			class: "fn-marker fn-marker-lg"
		}).css(
		{
			top: (randomYoff + 7.5) + 'px',
			left: (randomXoff + 7.5) + 'px'/*,
			"background-color": 'rgb(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] + ')'*/
		});

		console.log(pixelData)

		marker.appendTo('body');
		setTimeout(function() { marker.removeClass('fn-marker-lg')}, 1)
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

		return [char[dx], dy];
	}

	$(document).on('click', function(e)
	{
		program.PointInWhichTile(e.clientX, e.clientY)
	});

	$(document).ready(function()
	{
		program = new Program();
	});
	
})();