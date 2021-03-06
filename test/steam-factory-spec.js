(function(){
  "use strict";
  var expect  = require('chai').expect,
      sut = require('../lib/steam-factory.js'),
      sinon = require("sinon");

  describe('Factory', function(){
    describe("public API", function(){
      it("define should be a function", function(){
        expect(typeof sut.define).to.equal("function");
      });

      it("alias should be a function", function(){
        expect(typeof sut.define).to.equal("function");
      });

      it("build be a function", function(){
        expect(typeof sut.build).to.equal("function");
      });

      it("attributesFor be a function", function(){
        expect(typeof sut.attributesFor).to.equal("function");
      });

      it("sequence should be a function", function(){
        expect(typeof sut.sequence).to.equal("function");
      });

      it("factories should be a object", function(){
        expect(typeof sut.factories).to.equal("object");
      });

      it("sequences should be a object", function(){
        expect(typeof sut.sequences).to.equal("object");
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

        it("creates a user using multiple factories", function(){
          sut.define("user", {name: "pedro"});
          sut.define("confirmedUser", {confirmed: true});
          sut.define("validUser", ["user", "confirmedUser"]);
          expect(sut.factories.validUser.name).to.equal("pedro");
          expect(sut.factories.validUser.confirmed).to.equal(true);
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

    describe('#alias', function(){
      beforeEach(function(){
        sut.define("user", {name: "pedro"});
      });

      it("should create an alias when passing a string", function(){
        sut.alias("user", "author");
        expect(sut.factories.user).to.equal(sut.factories.author);
      });

      it("should create an alias when passing a string", function(){
        sut.alias("user", ["author", "commenter"]);
        expect(sut.factories.author).to.equal(sut.factories.author);
        expect(sut.factories.user).to.equal(sut.factories.commenter);
      });
    });

    describe('a build interface', function(){
      describe("pass a no arguments", function(){
        beforeEach(function(){
          sut.define("user", {name:"pedro"});
        });

        it("assigns the values to the new object", function(){
          var user = sut.build("user");
          expect(user.name).to.equal("pedro");
        });
      });

      describe("when passing an object", function(){
        beforeEach(function(){
          sut.define("user", {name:"pedro", lastName: "del gallego"});
        });

        it("returns an object with the assigned values", function(){
          var user = sut.build("user", {lastName: "andersen"});
          expect(user.name).to.equal("pedro");
          expect(user.lastName).to.equal("andersen");
        });
      });

      describe("instance generated by a factory with multiple factories, functions or objects", function(){
        it("extend the instance with the properties of the returned objects", function(){
          var states = [function(){return {type: "user"};}, {name:"pedro"} ];
          var user = sut.build("user", states);
          expect(user.name).to.equal("pedro");
          expect(user.type).to.equal("user");
        });

        it("extend the instance with the properties of the returned objects (last position)", function(){
          var states = [{name:"pedro"}, function(){return {type: "user"};}];
          var user = sut.build("user", states);
          expect(user.type).to.equal("user");
          expect(user.name).to.equal("pedro");
        });

        it("use a constructor to create an instance", function(){
          var User = function(){ this.type = "user";};
          var states = [{name:"pedro"}, new User()];
          var user = sut.build("user", states);
          expect(user.type).to.equal("user");
          expect(user.name).to.equal("pedro");
        });

        it("pass the instance to anonymous function", function(){
          var User = function(user){ user.type = "user";};
          var states = [User];
          var user = sut.build("user", states);
          expect(user.type).to.equal("user");
        });
      });
    });

    describe('#attributesFor', function(){
      sut.define("user", {name: "pedro"});
      sut.define("confirmedUser", {confirmed: true});
      sut.define("validUser", ["user", "confirmedUser"]);

      it("passes the dictionary of attributes", function(){
        expect(sut.attributesFor("validUser").name).to.equal("pedro");
        expect(sut.attributesFor("validUser").confirmed).to.equal(true);
      });
    });

    describe('#sequence', function(){
      describe("define a sequence", function(){
        var fun = sinon.spy(function(n){return "email" + n +"@gmail.com";});

        beforeEach(function(){
          sut.sequence("email", fun);
        });

        it("makes a sequence available", function(){
          expect(typeof sut.sequences.email).to.equal("function");
        });

        it("marks the function as malyshev sequence", function(){
          expect(sut.sequences.email.isSteamFactorySequence).to.equal(true);
        });

        it("generates a sequence of unique values", function(){
          expect(sut.sequences.email()).to.equal("email1@gmail.com");
          expect(sut.sequences.email()).to.equal("email2@gmail.com");
        });

        it("overwrites the initial value", function(){
          sut.sequence("email", fun, 100);
          expect(sut.sequences.email()).to.equal("email100@gmail.com");
        });
      });

      describe("adding a sequence using define", function(){
        it("should not call the sequence in the define phase", function(){
          var fun = sinon.spy(function(n){ return "email" + n +"@gmail.com"; });
          fun.isSteamFactorySequence = true;
          sut.define("user", {name: "pedro", email: fun});

          expect(fun.called).to.equal(false);
        });

      });

      describe("building a model using that include a sequence ", function(){
        var fun = function(n){ return "email" + n +"@gmail.com"; },
            generator,
            user;

        beforeEach(function(){
          sut.sequence("email", fun);
          generator = sinon.spy(sut.sequences.email);

          sut.define("user", {name: "pedro", email: generator});
        });

        it("call the sequence in the build phase", function(){
          sut.build("user");
          expect(generator.calledOnce).to.equal(true);

          sut.build("user");
          expect(generator.calledTwice).to.equal(true);
        });

        it("set the property to the generated value", function(){
          user = sut.build("user");
          expect(user.email).to.equal("email1@gmail.com");

          user = sut.build("user");
          expect(user.email).to.equal("email2@gmail.com");
        });
      });
    });

  });
})();
