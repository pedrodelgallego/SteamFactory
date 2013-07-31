/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({
    mochaTest: {
      test: {
        options: { reporter: 'dot', growl: true },
        src: ['test/**/*.js']
      }
    },
    jshint: {
      gruntfile: { src: 'Gruntfile.js' },
      lib_test:  { src: ['lib/**/*.js', 'test/**/*.js'] }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', "mochaTest"]
      }
    }
  });

  require('matchdep').
    filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', ['mochaTest']);

};
