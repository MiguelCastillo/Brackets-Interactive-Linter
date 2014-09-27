/**
 * Interactive Linter Copyright (c) 2014 Miguel Castillo.
 *
 * Licensed under MIT
 */


define(function(require, exports, module) {
    'use strict';

    var FileSystem   = brackets.getModule("filesystem/FileSystem");
    var pluginLoader = require("pluginLoader");
    var spromise     = require("libs/js/spromise");


    /**
    * pluginManager is the processor for loading up plugins in the plugins directory in
    * make sure they are smoothly running in a worker thread.
    */
    function pluginManager() {
        // Build plugin list that the worker thread needs to load
        return getPluginsMeta(module.uri.substring(0, module.uri.lastIndexOf("/")) + "/plugins").then(function(pluginsMeta) {
            return pluginLoader(pluginManager, pluginsMeta);
        });
    }


    function getPluginsMeta(path) {
        var result = spromise.defer();

        FileSystem.getDirectoryForPath(path).getContents(function(err, entries) {
            if (err) {
                result.reject(err);
            }

            var entry, directories = [];
            for (var i = 0; i < entries.length; i++) {
                entry = entries[i];
                if (entry.isDirectory) {
                    directories.push(entry.name);
                }
            }

            result.resolve({
                directories: directories,
                path: path
            });
        });

        return result.promise;
    }


    return pluginManager;
});

