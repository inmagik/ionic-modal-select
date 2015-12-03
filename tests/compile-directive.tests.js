describe('compile directive', function(){

    var elm, elm2, scope;

  beforeEach(module('ionic-modal-select'));

  beforeEach(inject(function($rootScope, $compile) {
        elm = angular.element('<div compile="inner"></div>')
        elm2 = angular.element('<div compile="inner" compile-once="true"></div>')

        scope = $rootScope;
        scope.a = "some inner content";
        scope.b = "some new inner content";
        scope.inner = "<a>{{a}}</a>";
        
        $compile(elm)(scope);
        $compile(elm2)(scope);

        scope.$digest();

    }));

    it('should compile inner content', function(){
        var a = elm.find('a');
        
        expect(a.length).toBe(1);
        expect(a.eq(0).text()).toBe("some inner content");
    });

    it('should compile inner content again if something changes', function(){
        var a;
        scope.inner = "<a>{{b}}</a>";
        scope.$digest();
        a = elm.find('a');

        expect(a.length).toBe(1);
        expect(a.eq(0).text()).toBe("some new inner content");
    });

    it('should not compile inner content again if something changes but compile-once attr is set to "true"', function(){
        var a, a2;
        scope.inner = "<a>{{a}}</a>";
        scope.$digest();
        scope.inner = "<a>{{b}}</a>";
        scope.$digest();
        a = elm.find('a');
        a2 = elm2.find('a');
        
        expect(a.eq(0).text()).toBe("some new inner content");
        expect(a2.eq(0).text()).toBe("some inner content");
    });

});