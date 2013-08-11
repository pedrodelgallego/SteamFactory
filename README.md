Getting Started
===============

Update Your NPM
-------------------

If you're using Node, you'll want to install using npm:

```javascript
npm install steam-factory --save-dev
```
Once your node_module will need to require it.

```javascript
var Factory = require("steam-factory");
```

Using Without NPM
---------------------

If you're not using npm, be sure to load Steam Factory into your enviroment.

Once Required, assuming you have a directory structure of `spec/factories` or `test/factories`, all you'll need load your factories definitions

```javascript
var Factory = require('SteamFactory');

Factory.sequence("userId", function(n) {
  return n;
});

Factory.define("user", function() {
  name: "John Doe",
  userId: Factory.generate("userId");
});
```
Defining factories
------------------

Each factory has a name and a set of attributes, functions and other factories that will define the state of the returned object

```javascript
Factory.define("user", [new User(), {
    name: "John Doe",
    admin: false
}]);

Factory.define("admin", ["user", {
    admin: true
}]);
```
It is highly recommended that you have one factory for each entity that provides the simplest set of attributes necessary to create an instance of that entity. I.e: If you're creating model objects, that means that you should only provide attributes that are required through validations and that do not have defaults. Other factories can be created through inheritance to cover common scenarios for each class.

Attempting to define multiple factories with the same name will raise an error.

Factories can be defined anywhere

Using factories
---------------

SteamFactory supports several different build strategies: build, create, attributes\_for and build\_stubbed:

```javascript
// Returns a User instance that's not saved
user = SteamFactory.build("user")

// Returns a hash of attributes that can be used to build a User instance
attrs = SteamFactory.attributes_for("user")

// Passing a function to any of the methods above will yield the return object
SteamFactory.build("user", function(user){
  User.Save();
}
```

it's possible to override the defined attributes by passing an object, or an array of objects, functions and factories:

```javascript
// Build a User instance and override the firstName property
user = SteamFactory.build(:user, {firstName: "John"})
User.FirstName
// => "John"
```

```javascript
describe("User//fullName", function() {
  var user = Factory.build("user", [new User(), {
      firstName: "John",
      lastName: "Doe"
  }]);

  it("fullName", function() {
      expect(user.fullName).to.equal("John Doe");
  });
});
```

Lazy Attributes
---------------

Most factory attributes can be added using static values that are evaluated when
the factory is defined, but some attributes (such as associations and other
attributes that must be dynamically generated) will need values assigned each
time an instance is generated. These "lazy" attributes can be added by passing a
block instead of a parameter:

```javascript

User.generateActivationCode = function(){ /* Activation code*/ };

Factory.define("activeUser", ["user", function() {
  activationCode: Factory.generates(User.generateActivationCode),
}]);

sequence("randomString", LoremIpsum.generateLine);
sequence("randomParagraph", LoremIpsum.generateParagraph);

Factory.define("post", {
  title: Factory.generate("randomString")
  body:  Factory.generate("randomParagraph")
});
```

Aliases
-------

Aliases allow you to use named associations more easily.

```javascript

Factory.define("user",{
  firstName: "John",
  lastName:  "Doe",
});

Factory.alias("user", [:author, :commenter]);

Factory.define("post",{
  author: Factory.build("author"),
  title: "How to read a book effectively",
  body:  "There are five steps involved."
});

Factory("comment", {
  commenter: Factory.build("commenter")
  body: "Great article!"
});
```

Dependent Attributes
--------------------

Attributes can be based on the values of other attributes using the evaluator that is yielded to lazy attribute blocks:

```javascript
Factory("user", {
  firstName "Joe"
  lastName  "Blow"
  email:  Factory.generates(function(){ return user.firstName + "@example.com" });
}
```

Associations
------------

It's possible to set up associations within factories.

```javascript
Factory.define("post", {
  author: Factory.build("user", {firstName: "Alice"})
});
```

Generating data for a `has_many` relationship is a bit more involved,
depending on the amount of flexibility desired, but here's a surefire example
of generating associated data.

```javascript
// post factory with a `belongs_to` association for the user

Factory.define("post", {title: "Through the Looking Glass"});
Factory.define("user", {name "John Doe"});

Factory.define("userWithPost", ["user", function(user){
    // userWithPost will create post data after the user has been created
    // the functions yields one value the user instance itself
    posts: [
        Factory.build("post", {author: user}),
        Factory.build("post", {author: user}),
        Factory.build("post", {author: user}),
        Factory.build("post", {author: user}),
        Factory.build("post", {author: user})
    ]
}];
```

This allows us to do:

```javascript
SteamFactory.create("user").posts.length;         // 0
SteamFactory.Create("userWithPost").posts.length; // 5
```

Extending Factories
-------------------

You can easily create multiple factories for the same class without repeating common attributes by nesting factories:

```javascript
Factory.define("post", {title: "Through the Looking Glass"});
Factory.define("approvedPost", ["post", {approved: true}]);

approvedPost = SteamFactory.create("approvedPost");
ApprovedPost.title;    // => "A title"
approvedPost.approved; // => true
```

As mentioned above, it's good practice to define a basic factory for each class with only the attributes required to create it. Then, create more specific factories that extend from this basic one. Factory definitions are still code, so keep them DRY.

Sequences
---------

Unique values in a specific format (for example, e-mail addresses) can be
generated using sequences. Sequences are defined by calling sequence in a
definition block, and values in a sequence are generated by calling
SteamFactory.generate:

```Javascript
// Defines a new sequence
SteamFactory.define("email", function(n){ return "person" + n + "@example.com"});

SteamFactory.Generate("email");
// => "person1@example.com"

SteamFactory.generate("email");
// => "person2@example.com"
```

Sequences can be used for attributes:

```javascript
Factory.define("user", {
  email: Factory.generate("email")
});
```

You can also override the initial value:

```javascript
SteamFactory.define("email", function(n){ return "person" + n + "@example.com"}, 100);

SteamFactory.Generate("email");
// => "person100@example.com"
```

Composition
-----------

Composition allow you to group attributes together and then apply them
to any factory.

```javascript
Factory.alias("user", "author");
Factory.define("published", {published: true});
Factory.define("unpublished", {published: true});
Factory.define("weekLongPublishing", {
    startAt:  Factory.generate("aWeekAgo"),
    endAt:    Factory.generate("now")
});

Factory.define("weekLongPublishing", {
    startAt:  Factory.generate("aMonthAgo"),
    endAt:    Factory.generate("now")
});

Factory.define("story", {
  title "My awesome story",
  author: Factory.build("author"),
});

// Define factories by reusing other factories
Factory.define("weekLongPublishedStory",    ["published", "weekLongPublishing"]);
Factory.define("monthLongPublishedStory",  ["published", "monthLongPublishedStory"]);

Factory.define("weekLongUnpublishedStory",  ["unpublished", "weekLongPublishing"]);
Factory.define("monthLongUnpublishedStory", ["unpublished", "monthLongPublishedStory"]);
```

Composition that define the same attributes won't raise AttributeDefinitionErrors;

Building or Creating Multiple Records (WIP)
-------------------------------------

Sometimes, you'll want to create or build multiple instances of a factory at once.

```javascript
built_users   = SteamFactory.build_list("user", 25)
```

These methods will build or create a specific amount of factories and return them as an array.
To set the attributes for each of the factories, you can pass in a hash as you normally would.

```javascript
twenty_year_olds = SteamFactory.build_list(:user, 25, date_of_birth: 20.years.ago)
```

Acknowledge
-----------

This module is inspired by the great gem FactoryGirl by ThoughtBot.
