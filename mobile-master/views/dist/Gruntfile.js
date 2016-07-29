module.exports = function(grunt) {


grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    critical: {
        test: {
            options: {
                base: './',
                css: [
                    'css/style.min.css',
                    'css/bootstrap-grid.min.css'
                ],
                width: 320,
                height: 70
            },
            src: 'pizza.html',
            dest: 'pizza2.html'
        }
    }


});

grunt.loadNpmTasks('grunt-critical');

grunt.registerTask('default', ['critical']);

}