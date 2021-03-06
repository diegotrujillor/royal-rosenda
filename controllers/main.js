/*TMDb API used service: /search/person */
/*****************************************/
/*Date: 3/JAN/2014*/
/*Author: <a href="mailto:diegotrujillor@gmail.com">Diego Fernando Trujillo</a>*/
/*Description: This function allows asynchronously autocomplete actors while type names, i.e: Bill M*/
/****************************************************************************************************/
function getPersons(){
	$("#persons").autocomplete({
		source: function(request, response){
			$.ajax({
				url: 'http://api.themoviedb.org/3/search/person?&query=' + $("#persons").val().replace(/\s+/g,'%20') + '&api_key=f660eb4c7b379f980417e33f5054a807',
				dataType: 'json',
				data: request,
				success: function(data, status){
					response($.map(data.results, function(item){
						return { value:item.name, storeid:item.id };
					}))
				},
				error: function(e){
					console.log('Error: ' + e);
				}
			});
		},
		minLength: 2,
		select: function(event, ui){
			$('#persons').attr("data-id", ui.item.storeid);
		}
	});
}

/*TMDb API used service: /discover/movie */
/*****************************************/
/*Date: 4/JAN/2014*/
/*Author: <a href="mailto:diegotrujillor@gmail.com">Diego Fernando Trujillo</a>*/
/*Description: This module allows fetch recursively the movies data given an actor. (previously selected)*/
/*********************************************************************************************/
(function() {
	angular.module('ngAlertLogicApp', []).controller('mainController', function($scope, $http) {
		$scope.searchPerson = function(page, results){
			if($('#persons').attr("data-id")){
				$http.get('http://api.themoviedb.org/3/discover/movie?with_cast=' + $('#persons').attr("data-id") + '&page=' + page + '&sort_by=release_date.desc&api_key=f660eb4c7b379f980417e33f5054a807')
					.success(function(data){
						if(data.total_pages > 1 && page <= data.total_pages){
							page++;
							$.each(data.results, function(){
								item = {};
								item["id"] = this.id;
								item["release_date"] = this.release_date;
								item["original_title"] = this.original_title;								
								results.push(item);
							});
						  $scope.searchPerson(page, results)
						}else{
							return $scope.persons = results;
						}
					})
					.error(function(data){
						console.log('Error: ' + data)
					});
			}
		};
	});
}());