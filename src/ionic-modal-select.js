(function(){

	angular.module('ionic-modal-select', [])

		.directive('compile', ['$compile', function ($compile) {
			return function(scope, iElement, iAttrs) {
				var x = scope.$watch(
					function(scope) {
						// watch the 'compile' expression for changes
						return scope.$eval(iAttrs.compile);
					},
					function(value) {
						// when the 'compile' expression changes
						// assign it into the current DOM
						iElement.html(value);

						// compile the new DOM and link it to the current
						// scope.
						// NOTE: we only compile .childNodes so that
						// we don't get into infinite loop compiling ourselves
						$compile(iElement.contents())(scope);

						//deactivate watch if "compile-once" is set to "true"
						if (iAttrs.compileOnce === 'true') {
							x();
						}
					}
				);
			};
		}])

		.directive('modalSelect', ['$ionicModal','$timeout', '$filter', '$parse', '$templateCache',
			function ($ionicModal, $timeout, $filter, $parse, $templateCache ) {

				return {
					restrict: 'A',
					require : 'ngModel',
					scope: {
						initialOptions:"=options",
						optionGetter:"&",
						searchFilters: "=searchFilters",
						searchProperties:'=',
						onSelect: "&",
						onSearch: "&",
						onReset: "&",
						onClose: "&",
					},
					link: function (scope, iElement, iAttrs, ngModelController, transclude) {

						var shortList = true;
						var shortListBreak = iAttrs.shortListBreak ? parseInt(iAttrs.shortListBreak) : 10;
						var setFromProperty= iAttrs.optionProperty;
						var onOptionSelect = iAttrs.optionGetter;
						var clearSearchOnSelect = iAttrs.clearSearchOnSelect !== "false" ? true : false;
						var searchProperties = scope.searchProperties  ? scope.searchProperties : false;

						//multiple values settings.
            var multiple = iAttrs.multiple  ? true : false;
            if (multiple) {
                scope.isChecked = {};
            }
            var multipleNullValue = iAttrs.multipleNullValue ? scope.$eval(iAttrs.multipleNullValue) : [];

						scope.ui = {
							modalTitle : iAttrs.modalTitle || 'Select an option',
							okButton : iAttrs.okButton || 'OK',
							hideReset : iAttrs.hideReset  !== "true" ? false : true,
							resetButton : iAttrs.resetButton || 'Reset',
							cancelButton : iAttrs.cancelButton || 'Cancel',
							loadListMessage : iAttrs.loadListMessage || 'Loading',
							modalClass : iAttrs.modalClass || '',
							headerFooterClass : iAttrs.headerFooterClass || 'bar-stable',
							value  : null,
							selectedClass : iAttrs.selectedClass || 'option-selected',
							itemClass: iAttrs.itemClass || 'item item-text-wrap',
							searchTemplate: iAttrs.searchTemplate || (multiple ? 'modal-template-multiple.html' : 'modal-template.html'),

							//search stuff
							hasSearch : iAttrs.hasSearch  !== "true" ? false : true,
							searchValue : '',
							searchPlaceholder : iAttrs.searchPlaceholder || 'Search',
							subHeaderClass : iAttrs.subHeaderClass || 'bar-stable',
							cancelSearchButton : iAttrs.cancelSearchButton || 'Clear'

						};

						var allOptions = [];
						scope.options = [];

            if (iAttrs.optionsExpression) {
                var optionsExpression = iAttrs.optionsExpression;
                var match = optionsExpression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                if (!match) {
                    throw new Error("collection-repeat expected expression in form of '_item_ in " +
                                      "_collection_[ track by _id_]' but got '" + iAttrs.optionsExpression + "'.");
                }
                var keyExpr = match[1];
                var listExpr = match[2];
                var listGetter = $parse(listExpr);
                var s = iElement.scope();

                scope.$watch(
                    function(){
                        return listGetter(s);
                    },
                    function(nv, ov){
                        initialOptionsSetup(nv);
                        updateListMode();
                    },
                    true
                );

            } else {
                scope.$watchCollection('initialOptions', function(nv){
                    initialOptionsSetup(nv);
                    updateListMode();
                });
            }

            //#TODO: this is due to different single vs multiple template
            //but adds lots of complexity here and in search
            function initialOptionsSetup(nv){
								nv = nv || [];
                if ( !multiple ) {
                    allOptions = angular.copy(nv);
                    scope.options = angular.copy(nv);
                } else {
                    allOptions = nv.map(function(item, idx){
                        return [idx, angular.copy(item)]
                    });
                    scope.options = angular.copy(allOptions);
                }
            }

						// getting options template
						var opt = iElement[0].querySelector('.option');
						if (!opt) {
							throw new Error({
								name:'modalSelectError:noOptionTemplate',
								message:'When using modalSelect directive you must include an element with class "option" to provide a template for your select options.',
								toString:function(){
									return this.name + " " + this.message;
								}
							});
						}
						scope.inner = angular.element(opt).html();

						//add support for .remove for older devices
						if (!('remove' in Element.prototype)) {
							Element.prototype.remove = function() {
								this.parentNode.removeChild(this);
							};
						}

						angular.element(opt).remove();

						var notFound = iElement[0].querySelector('.not-found');
						if(notFound) {
							scope.notFound = angular.element(notFound).html();
							angular.element(notFound).remove();
						}

						function updateListMode(){
							//shortList controls wether using ng-repeat instead of collection-repeat
							if (iAttrs.useCollectionRepeat === "true") {
								shortList = false;
							} else if (iAttrs.useCollectionRepeat === "false") {
								shortList = true;
							} else {
								if (typeof(scope.options) !=="undefined"){
									shortList = !!(scope.options.length < shortListBreak);
								}
							}

							scope.ui.shortList = shortList;
						}

						ngModelController.$render = function(){
							scope.ui.value = ngModelController.$viewValue;
						};

						var getSelectedValue = scope.getSelectedValue = function(option){
							var val = null;
							if (option === null || option === undefined) {
								return option;
							}
							if (onOptionSelect) {
								return scope.optionGetter({option:option});
							}
							if (setFromProperty) {
								val = option[setFromProperty];
							} else {
								val = option;
							}
							return val;
						};

						scope.setOption = function(option){
							var oldValue = ngModelController.$viewValue;
							var val = getSelectedValue(option);
							ngModelController.$setViewValue(val);
							ngModelController.$render();

							if (scope.onSelect) {
								scope.onSelect({ newValue: val, oldValue: oldValue });
							}
							scope.modal.hide().then(function(){
								scope.showList = false;
								if (scope.ui.hasSearch) {
									if(clearSearchOnSelect) {
										scope.ui.searchValue = '';
									}
								}
							});
						};

						// Filter object {id: <filterId>, active: <boolean>}
						// Used as auxiliary query params when querying server for search results
						scope.setFilter = function(filterId) {
							angular.forEach(scope.searchFilters, function(filter) {
								if(filter.id == filterId) {
									filter.active = !filter.active;
								} else {
									filter.active = false;
								}
							});

							// Trigger another search when the search filters change
							if(scope.onSearch) {
								scope.onSearch({query: scope.ui.searchValue});
							}
						};

						scope.unsetValue = function(){
							$timeout(function(){
								ngModelController.$setViewValue("");
								ngModelController.$render();
								scope.modal.hide();
								scope.showList = false;
								if (scope.onReset && angular.isFunction(scope.onReset)) {
									scope.onReset();
								}
							});
						};

            scope.setValues = function(){
                var checkedItems = [];
                angular.forEach(scope.isChecked, function(v, k){
                    if(v){
                        checkedItems.push(allOptions[k][1])
                    }

                });
                var oldValues = ngModelController.$viewValue;
                var vals = checkedItems.map(function(item){
                    return getSelectedValue(item);
                });
                ngModelController.$setViewValue(vals);
                ngModelController.$render();

                if (scope.onSelect) {
                    scope.onSelect({ newValue: vals, oldValue: oldValues });
                }
                scope.modal.hide().then(function(){
                    scope.showList = false;
                    if (scope.ui.hasSearch) {
                       if(clearSearchOnSelect){
                            scope.ui.searchValue = '';
                        }
                    }
                });

            };

            scope.unsetValues = function(){
                $timeout(function(){
                    ngModelController.$setViewValue(multipleNullValue);
                    ngModelController.$render();
                    scope.modal.hide();
                    scope.showList = false;
                    if (scope.onReset && angular.isFunction(scope.onReset)) {
                        scope.onReset();
                    }
                });
            };

						scope.closeModal = function(){
							scope.modal.hide().then(function(){
								scope.showList = false;
							});
						};


						scope.compareValues = function(a, b){
							return angular.equals(a, b);
						};

						//loading the modal
						var modalTpl = null;
						if(iAttrs.searchTemplate) {
							scope.modal = $ionicModal.fromTemplate(
								$templateCache.get(iAttrs.searchTemplate),
								{ scope: scope }
							);
						} else {
							modalTpl = multiple ? 'modal-template-multiple.html' : 'modal-template.html';
							scope.modal = $ionicModal.fromTemplate(
								modalSelectTemplates[modalTpl],
								{ scope: scope }
							);
						}

						scope.$on('$destroy', function(){
							scope.modal.remove();
						});

						scope.$on('modal.hidden', function(){
							if (scope.onClose && angular.isFunction(scope.onClose)) {
								scope.onClose();
							}
						});

						iElement.on('click', function(){
							if (shortList) {
								scope.showList = true;
								scope.modal.show();
							} else {
								scope.modal.show()
									.then(function(){
										scope.showList = true;
										scope.ui.shortList = shortList;
									});
							}
						});


                        //filter function
						if (scope.ui.hasSearch) {
							scope.$watch('ui.searchValue', function(nv){
	              var whatToSearch;
	              if ( !multiple  ) {
	                  whatToSearch = allOptions;
	              } else {
	                  whatToSearch = allOptions.map(function(item){
	                      return item[1];
	                  });
	              }

								if(iAttrs.onSearch) {
                    scope.onSearch({query: nv});
								} else {
                    var filteredOpts = $filter('filter')(whatToSearch, nv, function(actual, expected) {
										if(!actual){
											// if actual is an empty string,empty object,null,or undefined
											return false;
										}
										if (searchProperties){
											if (typeof actual == 'object'){
												for (var i = 0; i < searchProperties.length; i++){
													if (actual[searchProperties[i]] && actual[searchProperties[i]].toLowerCase().indexOf(expected.toLowerCase()) >= 0){
														return true;
													}
												}
											}
											return false;
										} else {
											if(actual.toString().toLowerCase().indexOf(expected.toLowerCase()) >= 0){
												return true;
											}
										}
										return false;
									});

                  var oldLen = scope.options.length;
                  if ( !multiple ){
                      scope.options = filteredOpts;

                  } else {
                      //#TODO: lots of loops here!
                      var newOpts = [];
                      angular.forEach(filteredOpts, function(item){
                          var originalItem = allOptions.find(function(it){
                              return it[1] == item;
                          });
                          if( originalItem ){
                              newOpts.push(originalItem);
                          }
                      });
                      scope.options = newOpts;
                  }
                  if(oldLen != scope.options.length){
                    //#todo: should resize scroll or scroll up here
                  }
								}
							});
							scope.clearSearch = function(){
								scope.ui.searchValue = '';
							};
						}

						//#TODO ?: WRAP INTO $timeout?
						ngModelController.$render();

					}
				};
			}
		]
	);
})();
