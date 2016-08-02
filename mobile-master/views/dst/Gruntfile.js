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
           'dist/index.html': 'index2.html'
         }
       }
     },
});

grunt.loadNpmTasks('grunt-contrib-htmlmin');

grunt.registerTask('default', ['htmlmin']);

}














/*
    pkg: grunt.file.readJSON('package.json'),

    critical: {
        test: {
            options: {
                base: './',
                css: [
                    'css/style.min.css',
                    'css/print.min.css'
                ],
                width: 1280,
                height: 768
            },
            src: 'index.html',
            dest: 'index2.html'
        }
    }


});

grunt.loadNpmTasks('grunt-critical');

grunt.registerTask('default', ['critical']);


}
*/