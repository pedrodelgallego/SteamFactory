/*!
 * Malyshev
 *
 * Malyshev is a easy to use minimal factory helper. Malyshev allows
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

  var api,
      objs = {},
      factoryDsl = {
        withArg: function(key, value) {
          this[key] = value;
          return this;
        }
      };

  api = {
		/**
		 * Build an object, and extend it with the predefined attributes
     *
     * @param {String} The factory name that
     * @param {Function or Object}: The constructor type for this
		 * object, or extra properties for the object
     * @param {Object}: extra properties for the object
     *
		 * @return {Object}
		 */
    build: function(facotryName, states) {
      var i, dst = {};

      if ((states === void 0) && (states === null)) {
        extend(dst, objs[facotryName]);
      } else if (Object.prototype.toString.call(states) !== '[object Array]'){
        extend(dst, objs[facotryName], states);
      }  else if (Object.prototype.toString.call(states) === '[object Array]'){
        for (i in states){
          if (typeof states[i] === "object"){
            extend(dst, states[i]);
          } else if (typeof states[i] === "function"){
            extend(dst, states[i]());
          }
        }
      }
      return dst;
    },

    define: function(facotryName, states){
      var i, dst = {};

      if (Object.prototype.toString.call(states) !== '[object Array]'){
         dst = states;
      } else if (Object.prototype.toString.call(states) === '[object Array]'){
        for (i in states){
          if (typeof states[i] === "object"){
            extend(dst, states[i]);
          } else if (typeof states[i] === "string"){
            extend(dst, objs[states[i]]);
          } else if (typeof states[i] === "function"){
            extend(dst, states[i]());
          }
        }
      }

      objs[facotryName] = dst;
    },

    attributesFor: function(factoryName) {
      return objs[factoryName];
    },

    factories: objs
  };

  return api;
});
