// server.get({path: PATH, version: ['2.0.0', '2.1.0']}, sendV2);

function ExpressVersioning (app) {

    /**
     * This routine adds a route that will add the version
     * to the request object
     */
    app.all('/v:version/*', function(req, res, next) {
        req.version = req.params.version;
        next();
    });
    
    /**
     * This routine adds versioned methods: app.v__VERB__
     *   app.vget, app.vpost, app.vput, app.vpatch, app.vdelete
     */
    var verbs = ['delete', 'get', 'head', 'patch', 'post', 'put'];
    verbs.forEach(function(verb) {

        app['v' + verb] = function(options) {

            if (arguments[0].path !== undefined &&
                (arguments[0].version !== undefined || arguments[0].versions !== undefined)) {

                // Extract path and supported versions
                var path = arguments[0].path;
                var versions;

                /**
                 *  We currently support three ways to specify versions
                 *    - version: number        ==> e. g.: version: 1
                 *    - versions: number array ==> e. g.: versions: [1, 3, 5]
                 *    - versions: number range ==> e. g.: versions: '[1, 5)'
                 */
                if (arguments[0].version) {
                    versions = [arguments[0].version];
                } else if (arguments[0].versions) {
                    if (arguments[0].versions instanceof Array) {
                        versions = arguments[0].versions;
                        
                    } else  /*string*/  {
                        // version parser!
                    }
                }

                var args = arguments;
                var myself = this;

                // Extract callbacks
                // Assume for now everyone uses the same callback

                // Apply them to multiple app.VERB methods
                versions.forEach(function(version) {
                    args[0] = '/v' + version + path;
                    app[verb].apply(myself, args);
                });

                return this;

            } else {

                return app[verb].apply(this, arguments);
            
            }
        };

    });

    /**
     * Helpers
     */
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}

module.exports = ExpressVersioning;
