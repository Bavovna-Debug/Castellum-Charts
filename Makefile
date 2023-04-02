all:
	sudo install --owner=root --group=root --mode=0755 --directory /opt/castellum/js
	sudo install --owner=root --group=root --mode=0644 --preserve-timestamps Chart.js /opt/castellum/js/chart.js
	sudo install --owner=root --group=root --mode=0644 --preserve-timestamps LineChart.js /opt/castellum/js/line-chart.js
