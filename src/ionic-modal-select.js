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
                if(iAttrs.compileOnce === 'true'){
                    x();
                }
            }
        );
    };
}])

.directive('modalSelect', ['$ionicModal','$timeout' ,function ($ionicModal, $timeout) {
    return {
        restrict: 'A',
        require : 'ngModel',
        scope: { options:"=", optionGetter:"&"},
        link: function (scope, iElement, iAttrs, ngModelController, transclude) {
            
            var shortList;
            var shortListBreak = iAttrs.shortListBreak ? parseInt(iAttrs.shortListBreak) : 10;
            var setFromProperty= iAttrs.optionProperty;
            var onOptionSelect = iAttrs.optionGetter;
            
            scope.ui = {
                modalTitle : iAttrs.modalTitle || 'Select an option',
                okButton : iAttrs.okButton || 'OK',
                hideReset : iAttrs.hideReset  !== "true" ? false : true,
                resetButton : iAttrs.okButton || 'Reset',
                cancelButton : iAttrs.cancelButton || 'Cancel',
                loadListMessage : iAttrs.loadListMessage || 'Loading',
                modalClass : iAttrs.modalClass || '',
                headerFooterClass : iAttrs.headerFooterClass || 'bar-stable',
                value  : null,
                selectedClass : iAttrs.selectedClass || 'option-selected'
            };

            // getting options template
            var opt = iElement[0].querySelector('.option');
            if(!opt){
                throw new Error({
                    name:'modalSelectError:noOptionTemplate',
                    message:'When using modalSelect directive you must include an element with class "option" to provide a template for your select options.', 
                    toString:function(){
                        return this.name + " " + this.message;
                    }
                });
            }
            scope.inner = angular.element(opt).html();
            opt.remove();
            
            //shortList controls wether using ng-repeat instead of collection-repeat
            if(iAttrs.useCollectionRepeat === "true"){
                shortList = false;
            } else if(iAttrs.useCollectionRepeat === "false") {
                shortList = true;
            } else {
                shortList = scope.options.length < shortListBreak;
            };
            
            ngModelController.$render = function(){
                scope.ui.value = ngModelController.$viewValue;
            };

            var getSelectedValue = scope.getSelectedValue = function(option){
                if(!option){
                    return null;
                }
                if(onOptionSelect){
                    var out = scope.optionGetter({option:option});
                    return out;
                }
                if(setFromProperty){
                    val = option[setFromProperty]
                } else {
                    val = option;    
                }
                return val;
            };

            scope.setOption = function(option){
                var val = getSelectedValue(option);
                ngModelController.$setViewValue(val);    
                ngModelController.$render();
                scope.closeModal();
            };

            scope.unsetValue = function(){
                $timeout(function(){
                    ngModelController.$setViewValue("");
                    ngModelController.$render();
                    scope.modal.hide();
                    scope.showList = false;
                });
            };

            scope.closeModal = function(){
                scope.modal.hide().then(function(){
                    scope.showList = false;    
                });
            };
            
            //loading the modal
            scope.modal = $ionicModal.fromTemplate(
                modalSelectTemplates['modal-template.html'],
                { scope: scope }
            );

            scope.$on('$destroy', function(){
                scope.modal.remove();  
            });

            iElement.on('click', function(){
                if(shortList){
                    scope.showList = true;    
                    scope.modal.show()
                } else {
                    scope.modal.show()
                    .then(function(){
                        scope.showList = true;    
                    });    
                }
            });

            ngModelController.$render();

        }
    };
}])

})();