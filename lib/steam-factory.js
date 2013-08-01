/*!
 * SteamFactory
 *
 * SteamFactory is a easy to use minimal factory helper. SteamFactory allows
 * you to build JavaScript objects, mostly useful for setting up test data
 *
 * Copyright: Pedro Del Gallego
 * Licenced under the BSD License.
 */
(function(factory) {

	//AMD
	if(typeof define === 'function' && define.amd) {
		define(factory);

	//NODE
	} else if(typeof module === 'object' && module.exports) {
		module.exports = factory();

	//GLOBAL
	} else {
		window.LucidJS = factory();
	}

})(function(){

  /**
   * @function
   *
   * @description
   * Extends the destination object `dst` by copying all of the
   * properties from the `src` object(s) to `dst`. You can specify
   * multiple `src` objects.
   *
   * @param {Object} dst Destination object.
   * @param {...Object} src Source object(s).
   * @returns {Object} Reference to `dst`.
   */
  function extend(dst) {
    var i, j, obj, value, key;

    for (i in arguments) {
      obj = arguments[i];

      if (obj !== dst) {
        for (key in obj) {
          dst[key] = obj[key];
        }
      }
    }

    return dst;
  }


  function  executeSequences(dst) {
    var i, j, fn;

    for (i in dst) {
      fn = dst[i];
      if (fn.isSteamFactorySequence){
        dst[i] = fn();
      }
    }

    return dst;
  }

  function isArray(array){
    return Object.prototype.toString.call(array) === '[object Array]';
  }

  function  isObejct(obj){
    return typeof obj === "object";
  }

  function isString(obj){
    return typeof obj === "string";
  }

  function  isFunction(fn){
    return typeof fn === "function";
  }

  function   isBlank(obj){
    return (obj === void 0) || (obj === null) || (obj === "");
  }

  var api,
      factories = {},
      sequences = {},
      factoryDsl = {
        withArg: function(key, value) {
          this[key] = value;
          return this;
        }
      };

  api = {
    build: function(facotryName, states) {
      var i, dst = {};

      if (isBlank(states)) {
        extend(dst, factories[facotryName]);
      } else if (isArray(states)) {
        for (i in states){
          if (isObejct(states[i])){
            extend(dst, states[i]);
          } else if (isFunction(states[i])){
            extend(dst, states[i](dst));
          }
        }
      } else{
        extend(dst, factories[facotryName], states);
      }

      executeSequences(dst);
      return dst;
    },

    define: function(facotryName, states){
      var i, dst = {};

      if (isArray(states)){
        for (i in states){
          if (isObejct(states[i])){
            extend(dst, states[i]);
          } else if (isString(states[i])){
            extend(dst, factories[states[i]]);
          } else if (isFunction(states[i])){
            extend(dst, states[i](dst));
          }
        }
      } else {
         dst = states;
      }

      factories[facotryName] = dst;
    },

    attributesFor: function(factoryName) {
      return factories[factoryName];
    },

    sequence: function(sequenceName, fn, initial){
      var memo = initial || 1;
          sequence = function() { return fn(memo++); };

      sequence.isSteamFactorySequence = true;
      sequences[sequenceName] = sequence;
    },

    alias: function(oldName, alias){
      var i;
      if (isArray(alias)){
        for (i in alias) {
          factories[alias[i]] = factories[oldName];
          console.log(factories[alias[i]]);
        }
      } else {
        factories[alias] = factories[oldName];
      }
    },

    factories: factories,
    sequences: sequences
  };

  return api;
});
