function LineChart(container, data)
{
	Chart.call(this);

	var chart = this;

	chart.container = container;
	chart.labels = data.labels;
	chart.lines = data.lines;

	chart.svgElement = chart.createSvgElement('svg',
	{
		style: 'font-family: Arial, sans-serif;'
	});
	chart.container.appendChild(chart.svgElement);

	window.addEventListener('resize', function()
	{
		chart.render();
	});

	chart.render();
}

LineChart.prototype = Object.create(Chart.prototype,
{
	constructor:
	{
		value: LineChart
	},

	render:
	{
		value: function()
		{
			var chart = this;

			chart.width = chart.container.clientWidth;
			chart.height = 280;

			chart.svgElement.setAttribute('width', chart.width);
			chart.svgElement.setAttribute('height', chart.height);
			chart.svgElement.setAttribute('viewBox', '0 0 ' + chart.width + ' ' + chart.height);

			while (chart.svgElement.childNodes.length)
			{
				chart.svgElement.removeChild(chart.svgElement.firstChild);
			}

			chart.renderLegend();
			chart.renderAxis();
			chart.renderLines();
		}
	},

	renderLegend:
	{
		value: function()
		{
			var chart = this;

			chart.legend = chart.createSvgElement('g');
			chart.svgElement.appendChild(chart.legend);

			var offset = 0;
			for (var index = 0; index < chart.lines.length; index++)
			{
				var legendItemElement = chart.createSvgElement('g',
				{
					transform: 'translate(' + offset + ', 0)'
				});
				chart.legend.appendChild(legendItemElement);

				var circleElement = chart.createSvgElement('circle',
				{
					cx: 10,
					cy: 8,
					r: 3.5,
					fill: chart.colors[index % chart.colors.length],
					stroke: 'none'
				});
				legendItemElement.appendChild(circleElement);

				var textElement = chart.createSvgElement('text',
				{
					x: 20,
					y: 13,
					'font-size': 14
				});
				legendItemElement.appendChild(textElement);

				textElement.textContent = chart.lines[index].title;

				offset += legendItemElement.getBBox().width + 20;
			}
		}
	},

	renderAxis:
	{
		value: function()
		{
			var chart = this;

			chart.axis =
			{
				x:
				{
					nthLabel: 1
				},
				y:
				{
					maximum: 1,
					step: 1
				}
			};

			for (var lineIndex = 0;
				 lineIndex < chart.lines.length;
				 lineIndex++)
			{
				for (var datumIndex = 0;
					 datumIndex < chart.lines[lineIndex].data.length;
					 datumIndex++)
				{
					chart.axis.y.maximum =
							Math.max(chart.axis.y.maximum, chart.lines[lineIndex].data[datumIndex]);
				}
			}

			while (chart.axis.y.step * 7 < chart.axis.y.maximum)
			{
				chart.axis.y.step *= 10;
			}

			if ((chart.axis.y.step % 2 === 0) && (chart.axis.y.step * 3.5 > chart.axis.y.maximum))
			{
				chart.axis.y.step /= 2;
			}

			chart.axis.y.maximum =
					Math.ceil(chart.axis.y.maximum / chart.axis.y.step) * chart.axis.y.step;

			chart.axis.x.element = chart.createSvgElement('g');
			chart.svgElement.appendChild(chart.axis.x.element);

			chart.axis.y.element = chart.createSvgElement('g');
			chart.svgElement.appendChild(chart.axis.y.element);

			for (var index = 0;
				 index < chart.labels.length;
				 index++)
			{
				chart.axis.x.element.appendChild(chart.renderXAxisLabel(chart.labels[index]));
			}

			for (var y = 0;
				 y <= chart.axis.y.maximum;
				 y += chart.axis.y.step)
			{
				chart.axis.y.element.appendChild(chart.renderYAxisLabel(chart.formatNumber(y)));
			}

			chart.padding =
			{
				top: chart.legend.getBBox().height + 20,
				left: -1 * Math.min(
						chart.axis.x.element.getBBox().x + 20,
						chart.axis.y.element.getBBox().x - 8),
				bottom: chart.axis.x.element.getBBox().height
			};

			chart.axis.x.element.setAttribute(
					'transform',
					'translate(0, ' + (chart.height - chart.padding.bottom) + ')');
			chart.axis.x.stepSize = chart.labels.length > 1
					? (chart.width - chart.padding.left - 40) / (chart.labels.length - 1)
					: 20;

			while (chart.axis.x.stepSize * chart.axis.x.nthLabel < 20)
			{
				chart.axis.x.nthLabel++;
			}

			if (chart.axis.x.nthLabel > 1)
			{
				for (var index = chart.axis.x.element.childNodes.length - 1;
					 index > 0;
					 index--)
				{
					if (index % chart.axis.x.nthLabel)
					{
						chart.axis.x.element.removeChild(chart.axis.x.element.childNodes[index]);
					}
				}
			}

			for (var index = 0;
				 index < chart.axis.x.element.childNodes.length;
				 index++)
			{
				chart.axis.x.element.childNodes[index].setAttribute(
						'transform',
						'translate(' +
						(chart.padding.left + 20 + chart.axis.x.nthLabel * index * chart.axis.x.stepSize) + ', 0)');
			}

			chart.axis.y.element.setAttribute(
					'transform',
					'translate(' + chart.padding.left + ', 0)');

			chart.axis.y.stepSize =
					(280 - chart.padding.bottom - chart.padding.top) / (chart.axis.y.maximum / chart.axis.y.step);

			for (var index = 0;
				 index < chart.axis.y.element.childNodes.length;
				 index++)
			{
				chart.axis.y.element.childNodes[index].setAttribute(
						'transform',
						'translate(0, ' + (280 - chart.padding.bottom - index * chart.axis.y.stepSize) + ')');
			}
		}
	},

	renderXAxisLabel:
	{
		value: function(label)
		{
			var chart = this;

			var labelElement = chart.createSvgElement('g');

			var lineElement = chart.createSvgElement('line',
			{
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 5,
				stroke: '#c0c0c0'
			});
			labelElement.appendChild(lineElement);

			var textElement = chart.createSvgElement('text',
			{
				x: -15,
				y: 7,
				'font-size': 11,
				'text-anchor': 'end',
				transform: 'rotate(-45 0 0)'
			});
			textElement.textContent = label;
			labelElement.appendChild(textElement);

			return labelElement;
		}
	},

	renderYAxisLabel:
	{
		value: function(label)
		{
			var chart = this;

			var labelElement = chart.createSvgElement('g');

			var lineElement = chart.createSvgElement('line',
			{
				x1: 0,
				y1: 0,
				x2: chart.width,
				y2: 0,
				stroke: '#c0c0c0'
			});
			labelElement.appendChild(lineElement);

			var textElement = chart.createSvgElement('text',
			{
				x: -8,
				y: 4,
				'font-size': 11,
				'text-anchor': 'end'
			});
			textElement.textContent = label;
			labelElement.appendChild(textElement);

			return labelElement;
		}
	},

	renderLines:
	{
		value: function()
		{
			var chart = this;

			for (var lineIndex = 0;
				 lineIndex < chart.lines.length;
				 lineIndex++)
			{
				chart.lines[lineIndex].element = chart.createSvgElement('g',
				{
					transform: 'translate(' + (chart.padding.left + 20) + ', ' + (280 - chart.padding.bottom) + ')'
				});
				chart.svgElement.appendChild(chart.lines[lineIndex].element);

				var points = [];
				chart.lines[lineIndex].circles = [];

				for (var datumIndex = 0;
					 datumIndex < chart.lines[lineIndex].data.length;
					 datumIndex++)
				{
					var point =
					{
						x: datumIndex * chart.axis.x.stepSize,
						y: -1 * chart.lines[lineIndex].data[datumIndex] * (chart.axis.y.stepSize / chart.axis.y.step),
					};
					points.push(point.x + ',' + point.y);

					if (chart.axis.x.stepSize >= 10)
					{
						var circleElement = chart.createSvgElement('circle',
						{
							cx: point.x,
							cy: point.y,
							r: 3.5,
							fill: chart.colors[lineIndex % chart.colors.length],
							stroke: 'none'
						});
						chart.lines[lineIndex].element.appendChild(circleElement);
						chart.lines[lineIndex].circles.push(circleElement);
					}
				}

				var lineElement = chart.createSvgElement('polyline',
				{
					points: points.join(' '),
					stroke: chart.colors[lineIndex % chart.colors.length],
					'stroke-width': 2,
					fill: 'none'
				});
				chart.lines[lineIndex].element.appendChild(lineElement);
				chart.lines[lineIndex].line = lineElement;
			}
		}
	}
});
