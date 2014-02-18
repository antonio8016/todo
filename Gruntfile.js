var generate_controller = require('./tasks/generate_controller'),
    generate_model = require('./tasks/generate_model');

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'lib/*.js', 'controllers/*.js', 'config/*.js', 'constraints/*.js', 'tasks/*.js', 'test/*.js', 'test/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['jshint']);

    grunt.registerTask('gen-controller', '<<NOTHING>>', generate_controller.task(grunt));
    grunt.registerTask('gen-model', '<<NOTHING>>', generate_model.task(grunt));
};
