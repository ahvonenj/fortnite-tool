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
	}

	Program.prototype.RandomizePoint = function()
	{
		var offX = this.$map.offset().left;
		var offY = this.$map.offset().top;
		var width = this.$map.outerWidth();
		var height = this.$map.outerHeight();
		var pad = width / this.mapPadRatio;
		var tile = width / this.mapTileRatio;

		var randomX = Math.floor(Math.random() * (width - offX - pad)) + offX + pad;
		var randomY = Math.floor(Math.random() * (width - offY - pad)) + offY + pad;

		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		canvas.getContext('2d').drawImage(this.$map[0], 0, 0, width, height);
		var pixelData = canvas.getContext('2d').getImageData(randomX, randomY, 1, 1).data;

		console.log(pixelData)

		this.$marker = $('<div/>',
		{
			class: "fn-marker"
		}).css(
		{
			top: randomX + 'px',
			left: randomY + 'px',
			"background-color": 'rgb(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] + ')'
		});
		this.$marker.appendTo('body');
	}

	Program.prototype.RandomizeTile = function()
	{

	}

	$(document).ready(function()
	{
		program = new Program();
	});
	
})();