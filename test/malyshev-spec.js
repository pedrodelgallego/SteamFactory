(function(){
  "use strict";
  var expect  = require('chai').expect,
  sut = require('../lib/malyshev.js');

  describe('Factory', function(){
    describe("public API", function(){
      it("define should be a function", function(){
        expect(typeof sut.define).to.equal("function");
      });

      it("factories should be a object", function(){
        expect(typeof sut.factories).to.equal("object");
      });

      it("build be a function", function(){
        expect(typeof sut.build).to.equal("function");
      });

      it("attributesFor be a function", function(){
        expect(typeof sut.attributesFor).to.equal("function");
      });
    });

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

      describe("pass array of states", function(){
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

      describe("pass array of states", function(){
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

    describe('#build', function(){
      describe("pass a no arguments", function(){
        beforeEach(function(){
          sut.define("user", {name:"pedro"});
        });

        it("should return an object with the defualt values", function(){
          var user = sut.build("user");
          expect(user.name).to.equal("pedro");
        });
      });

      describe("pass an object", function(){
        beforeEach(function(){
          sut.define("user", {name:"pedro", lastName: "del gallego"});
        });

        it("should return an object with the defualt values, except the common with the objects", function(){
          var user = sut.build("user", {lastName: "andersen"});
          expect(user.name).to.equal("pedro");
          expect(user.lastName).to.equal("andersen");
        });
      });

      describe("pass array of states", function(){
        it("should be a preserve the status if the function is on the behind an object", function(){
          var states = [function(){return {type: "user"};}, {name:"pedro"} ];
          var user = sut.build("user", states);
          expect(user.name).to.equal("pedro");
          expect(user.type).to.equal("user");
        });

        it("should preserve the status if the function is on the behind an object", function(){
          var states = [{name:"pedro"}, function(){return {type: "user"};}];
          var user = sut.build("user", states);
          expect(user.type).to.equal("user");
          expect(user.name).to.equal("pedro");
        });

        it("should preserve the status when a constructor is used", function(){
          var User = function(){ this.type = "user";};
          var states = [{name:"pedro"}, new User()];
          var user = sut.build("user", states);
          expect(user.type).to.equal("user");
          expect(user.name).to.equal("pedro");
        });
      });
    });

    describe('#attributesFor', function(){
      sut.define("user", {name: "pedro"});
      sut.define("confirmedUser", {confirmed: true});
      sut.define("validUser", ["user", "confirmedUser"]);

      it("should be a preserve the status if the function is on the behind an object", function(){
        expect(sut.attributesFor("validUser").name).to.equal("pedro");
        expect(sut.attributesFor("validUser").confirmed).to.equal(true);
      });
    });

    xdescribe('#sequence', function(){
      it("should be a function", function(){
        expect(typeof sut.sequence).to.equal("function");
      });
    });

  });
})();
