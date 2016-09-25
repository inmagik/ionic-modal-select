angular.module('starter')
.directive('attributeDoc', [function () {
    return {
        restrict: 'A',
        transclude : true,
        scope : {
            attributeDoc : "@",
            attributeType : "@",
            attributeDefault : "@"
        },
        template : require('raw!./attribute-doc.html'),
        replace : true,
        link: function (scope, iElement, iAttrs) {

        }
    };
}])
