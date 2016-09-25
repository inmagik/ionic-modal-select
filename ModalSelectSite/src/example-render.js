var beautify = require('js-beautify').js_beautify;

angular.module('starter')
.directive('exampleRender', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        scope : {},
        terminal : true,
        link: function (scope, iElement, iAttrs, ctrl, transclude) {

            var data = iElement.html().trim();
            if(iAttrs.mode=='javascript'){
              data = beautify(data);
            }
            scope.aceLoaded = function(_editor) {
                _editor.setOption("maxLines", Infinity);
                _editor.setOption("highlightActiveLine", false);
                _editor.$blockScrolling = Infinity;
                _editor.getSession().setUseWorker(false);
                _editor.setBehavioursEnabled(false);
                _editor.renderer.setScrollMargin(10, 10)
                _editor.setValue(data, -1);
            };

            scope.mode = iAttrs.mode || 'html';
            iElement.empty();
            var tpl = '<div ui-ace="{mode:\'{{mode}}\' ,useWrapMode : true,  theme:\'chaos\', onLoad:aceLoaded}" readonly>';
            var cmpl = $compile(tpl);
            var content = cmpl(scope);
            iElement.append(content);

        }
    };
}])
