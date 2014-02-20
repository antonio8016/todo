var generate_controller = require('./tasks/generate_controller'),
    generate_model = require('./tasks/generate_model'),
    shell = require('shelljs');

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

    /**
     * Loading any npm tast
     */ 
    grunt.loadNpmTasks('grunt-contrib-jshint');

    /**
     * <grunt report> opens the last coverage report in your browser
     */
    grunt.registerTask('report', function() {
        shell.exec('open coverage/lcov-report/index.html');
    });

    /**
     * <grunt startdb> or <grunt startdbs> starts MongoDB
     */
    var startdbTask = function() {
        shell.exec('mongod -dbpath ~/data/db');
    };
    grunt.registerTask('startdb', startdbTask);
    grunt.registerTask('startdbs', startdbTask);

    /**
     * <grunt test> runs <npm test>
     */
    grunt.registerTask('test', function() {
        shell.exec('npm test');
    });

    /**
     * Experimental tasks for code generation
     */
    grunt.registerTask('gen-controller', generate_controller.description, generate_controller.task(grunt));
    grunt.registerTask('gen-model', generate_model.description, generate_model.task(grunt));
    grunt.registerTask('gen', function(type, name) {
        var properties = grunt.option('properties');
    });

};
