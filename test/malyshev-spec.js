(function(){
  "use strict";
  var expect  = require('chai').expect,
      sut = require('../lib/malyshev.js');

  it("should be a function", function(){expect(typeof sut.define).to.equal("function");});
  it("should be a object",   function(){ expect(typeof sut.factories).to.equal("object");});
  it("should be a function", function(){expect(typeof sut.build).to.equal("function");});

  describe('Factory', function(){
    describe('#define', function(){

      describe("pass a simple object", function(){
        beforeEach(function(){
          sut.define("user", {name:"pedro"});
        });

        it("should be a create a new factory object in .factories", function(){
          expect(typeof sut.factories.user).to.equal("object");
        });

        it("should preserve the status in the factory", function(){
          expect(sut.factories.user.name).to.equal("pedro");
        });
      });

      describe("pass array of statues", function(){
        var states = [{name:"pedro"}, {surname: "Del Gallego"}];
        beforeEach(function(){
          sut.define("user", states);
        });

        it("should be a create a new factory object in .factories", function(){
          expect(typeof sut.factories.user).to.equal("object");
        });

        it("should preserve the status in the factory", function(){
          expect(sut.factories.user.name).to.equal("pedro");
          expect(sut.factories.user.surname).to.equal("Del Gallego");
        });
      });

      describe("pass array of statues", function(){
        it("should be a preserve the status if the function is on the behind an object", function(){
          var states = [function(){return {type: "user"};}, {name:"pedro"} ];
          sut.define("user", states);
          expect(sut.factories.user.name).to.equal("pedro");
          expect(sut.factories.user.type).to.equal("user");
        });

        it("should preserve the status if the function is on the behind an object", function(){
          var states = [{name:"pedro"}, function(){return {type: "user"};}];
          sut.define("user", states);
          expect(sut.factories.user.type).to.equal("user");
          expect(sut.factories.user.name).to.equal("pedro");
        });

        it("should preserve the status when a constructor is used", function(){
          var User = function(){ this.type = "user";};
          var states = [{name:"pedro"}, new User()];
          sut.define("user", states);
          expect(sut.factories.user.type).to.equal("user");
          expect(sut.factories.user.name).to.equal("pedro");
        });
      });

      describe("pass array of factory references", function(){
        sut.define("user", {name: "pedro"});
        sut.define("confirmedUser", {confirmed: true});

        beforeEach(function(){
          sut.define("validUser", ["user", "confirmedUser"]);
        });

        it("should be a preserve the status if the function is on the behind an object", function(){
          expect(sut.factories.validUser.name).to.equal("pedro");
          expect(sut.factories.validUser.confirmed).to.equal(true);
        });
      });
    });

    describe('.factories', function(){

    });

    describe('#build', function(){

    });

    xdescribe('#attributesFor', function(){
      it("should be a function", function(){
        expect(typeof sut.attributesFor).to.equal("function");
      });
    });

    xdescribe('#sequence', function(){
      it("should be a function", function(){
        expect(typeof sut.sequence).to.equal("function");
      });
    });

  });
})();
