
module.exports = function(grunt) {


grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    critical: {
        test: {
            options: {
                base: './',
                css: [
                    'css/style.css',
                    'css/print.css'
                ],
                minify:true,
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






/*
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    cssmin: {
  target: {
    files: [{
      expand: true,
      cwd: 'css/',
      src: ['*.css', '!*.min.css'],
      dest: 'css/',
      ext: '.min.css'
    }]
  }
}

});

grunt.loadNpmTasks('grunt-contrib-cssmin');

grunt.registerTask('default', ['cssmin']);

}


/*

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
*/
