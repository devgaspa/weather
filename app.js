$(document).ready(function() {
	var urlIconWeatherRunLocked = 'http://www.weatherunlocked.com/Images/icons/2/';

	$('#getLocation').modal({
		backdrop: 'static',
		keyboard: false
	});

	$('#cityName').on('keypress', function(e) {
		if ("Enter" === e.key) {
			getBySearch()
		}
	});
	$('#citySearch').on('click', function() {
		getBySearch()
	});
	$('#geoNavigator').on('click', function() {
		getByNavigator()
	});

	var getBySearch = function() {
		var cityName = $('#cityName').val();
		if (cityName) {
			$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + cityName, function(res) {
				if ('OK' !== res.status) {
					console.log(res.status);
					return false;
				};
				console.log(res);
				$('#cityName').val(getAddress(res.results));
				getWeather(res.results[0].geometry.location.lat, res.results[0].geometry.location.lng);
				return true;
			});
		};
	};

	var getByNavigator = function() {
		navigator.geolocation.getCurrentPosition(function(res) {
			getWeather(res.coords.latitude, res.coords.longitude);

			$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + res.coords.latitude.toFixed(2) + ',' + res.coords.longitude.toFixed(2), function(res) {
				if ('OK' !== res.status) {
					console.log(res.status);
					return false;
				};
				$('#cityName').val(getAddress(res.results));
				return true;
			});
		}, function(res) {
			console.log(res);
		});
	};

	var getWeather = function(lat, lng) {
		/*$.getJSON('https://api.sunrise-sunset.org/json?lat=' + lat + '&lng=' + lng + '&date=today', function(res) {
			if ('OK' !== res.status) {
				console.log(res.status);
				return false;
			};
			console.log(res);
		});*/

		var urlMyWeather2 = 'http://www.myweather2.com/developer/forecast.ashx?uac=mR9rVt3eKr&output=json&query=' + lat + ',' + lng,
			urlWunderground = 'http://api.wunderground.com/api/Your_Key/geolookup/q/' + lat + ',' + lng + '.json',
			urlOpenWeatherMap = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&appid=e144707097a4f86da75f46f2dd83c3c3',
			urlWeatherRunLocked = 'http://api.weatherunlocked.com/api/current/' + lat + ',' + lng + '?app_id=8209d1dc&app_key=306293331a8b4d2ffff84c8a3f8c0013';

		$.ajax({
			headers: {
				Accept: 'application/json'
			},
			url: urlWeatherRunLocked,
			type: 'GET',
			dataType: 'JSON',
			success: function(parsedResponse, statusText, jqXhr) {

				console.log(parsedResponse, statusText);

				if ('success' === statusText) {

					if (parsedResponse.wx_icon.indexOf('Night') !== -1) {
						$('body').addClass('night').removeClass('day');
					} else {
						$('body').addClass('day').removeClass('night');
					};

					$('#getLocation').modal('hide')
				}

			},
			error: function(error) {
				console.log(error);
			}
		});
	};

	var getAddress = function(results) {
		var address = 'Address not found';
		results.forEach(function(result) {
			var types = result.types;
			if (2 === types.length && 'locality' === types[0] && 'political' === types[1]) {
				address = result.formatted_address;
			}
		});
		return address;
	};
});