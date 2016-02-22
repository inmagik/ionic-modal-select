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

.directive('modalSelect', ['$ionicModal','$timeout', '$filter', '$parse', function ($ionicModal, $timeout, $filter, $parse) {
    return {
        restrict: 'A',
        require : 'ngModel',
        scope: { initialOptions:"=options", optionGetter:"&", onSelect:"&", onReset:"&" },
        link: function (scope, iElement, iAttrs, ngModelController, transclude) {
            
            var shortList = true;
            var shortListBreak = iAttrs.shortListBreak ? parseInt(iAttrs.shortListBreak) : 10;
            var setFromProperty= iAttrs.optionProperty;
            var onOptionSelect = iAttrs.optionGetter;
            var clearSearchOnSelect = iAttrs.clearSearchOnSelect !== "false" ? true : false;

            
            //#todo: multiple is not working right now
            var multiple = iAttrs.multiple  ? true : false;
            if (multiple) {
                scope.checkedItems = [];
            }
            
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
                //search stuff
                hasSearch : iAttrs.hasSearch  !== "true" ? false : true,
                searchValue : '',
                searchPlaceholder : iAttrs.searchPlaceholder || 'Search',
                subHeaderClass : iAttrs.subHeaderClass || 'bar-stable',
                cancelSearchButton : iAttrs.cancelSearchButton || 'Clear',

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
                        allOptions = angular.copy(nv);
                        scope.options = angular.copy(nv);
                        updateListMode();   
                        
                    }, 
                    true
                );

            } else {
                scope.$watch('initialOptions', function(nv){
                    allOptions = angular.copy(nv);
                    scope.options = angular.copy(nv);
                    updateListMode();
                });
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
                };
                
                scope.ui.shortList = shortList;   
            }
            
            ngModelController.$render = function(){
                scope.ui.value = ngModelController.$viewValue;
            };

            var getSelectedValue = scope.getSelectedValue = function(option){
                if (option === null || option === undefined) {
                    return option;
                }
                if (onOptionSelect) {
                    var out = scope.optionGetter({option:option});
                    return out;
                }
                if (setFromProperty) {
                    val = option[setFromProperty]
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
                       if(clearSearchOnSelect){
                            scope.ui.searchValue = '';
                        }
                    }
                });
                
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

            scope.closeModal = function(){
                scope.modal.hide().then(function(){
                    scope.showList = false;    
                });
            };

            scope.compareValues = function(a, b){
                return angular.equals(a, b);
            };
            
            //loading the modal
            var modalTpl = multiple ? 'modal-template-multiple.html' : 'modal-template.html';
            scope.modal = $ionicModal.fromTemplate(
                modalSelectTemplates[modalTpl],
                { scope: scope }
            );

            scope.$on('$destroy', function(){
                scope.modal.remove();  
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
                    scope.options = $filter('filter')(allOptions, nv);
                });
                scope.clearSearch = function(){
                    scope.ui.searchValue = '';
                };
            }
            
            //#TODO ?: WRAP INTO $timeout?
            ngModelController.$render();

        }
    };
}])

})();