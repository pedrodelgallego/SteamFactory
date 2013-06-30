/*
 * A simple factory helper
 */
!(function(exports){

  var models = {},
      factoryDsl = {
        with: function(key, value) {
          this[key] = value;
          return this;
        }
      };

  exports.Factory = {
    create: function(facotryName, model, properties) {
      var instance = (typeof model === "function") ? new model() : {};

      _.extend(instance, models[facotryName], factoryDsl, properties);

      return instance;
    },

    define: function(facotryName, state){
      models[facotryName] = state;
    }
  }
})(window);
