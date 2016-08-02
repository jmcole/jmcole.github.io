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
                    width: 1280,
                    height: 768
                },
                src: 'pizza.html',
                dest: 'pizza3.html'
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
*/

/*
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
        build: {
            src: 'js/main.js',
            dest: 'js/main.min.js',
        }
    }

});

grunt.loadNpmTasks('grunt-contrib-uglify');

grunt.registerTask('default', ['uglify']);

}
/*

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
           'dist/index.html': 'index2.html'
         }
       }
     },
});

grunt.loadNpmTasks('grunt-contrib-htmlmin');

grunt.registerTask('default', ['htmlmin']);

}


*/












