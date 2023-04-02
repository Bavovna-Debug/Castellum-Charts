function Chart()
{ }

Chart.prototype =
{
	colors: ['#14568a', '#8a1616', '#dddb2f', '#1d7e07', '#2c4a4a'],

	createSvgElement: function(tag, attributes)
	{
		var element = document.createElementNS('http://www.w3.org/2000/svg', tag);
		for (var key in attributes)
		{
			element.setAttribute(key, attributes[key]);
		}
		return element;
	},

	formatNumber: function(number)
	{
		var string = '';

		number = number + '';
		while (number.length > 3)
		{
			string = '.' + number.substr(number.length - 3) + string;
			number = number.substr(0, number.length - 3);
		}
		string = number + string;

		return string;
	}
};
