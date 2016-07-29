module.exports = function(grunt) {


grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
        build: {
            src: 'js/move.js',
            dest: 'js/move.min.js',
        }
    }

});

grunt.loadNpmTasks('grunt-contrib-uglify');

grunt.registerTask('default', ['uglify']);

}