module.exports = function(grunt) {


grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

critical: {
  dist: {
    options: {
      base: './',
      dimensions: [{
        width: 1300,
        height: 900
      },
      {
        width: 500,
        height: 900
      }]
    },
    files: [
      {src: ['pizza.html'], dest: 'dist/pizza.html'}
    ]
  }
}

});

grunt.loadNpmTasks('grunt-critical');

grunt.registerTask('default', ['critical']);

}