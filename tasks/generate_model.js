var fs = require('fs');

exports.task = function(grunt) {
    return function() {
        grunt.log.writeln('Generating a model...');
        var done = this.async();
        fs.writeFile("./banana.js", "Hey there!", function(err) {
            if(err) {
                grunt.log.writeln(err);
            } else {
                grunt.log.writeln("The file was saved!");
            }
            done();
        }); 
    };
};
