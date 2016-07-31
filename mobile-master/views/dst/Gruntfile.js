module.exports = function(grunt) {


grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

     htmlmin: {
       dist: {
         options: {
           removeComments: true,
           collapseWhitespace: true
         },
         files: {
           'dist/pizza.html': 'pizza.html'
         }
       }
     },
});

grunt.loadNpmTasks('grunt-contrib-htmlmin');

grunt.registerTask('default', ['htmlmin']);

}