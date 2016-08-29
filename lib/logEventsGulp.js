'use strict';

const gulp = require('gulp');
const chalk = require('chalk');
const gutil = require('gulp-util');
const prettyTime = require('pretty-hrtime');

// Copy from gulp/bin/gulp.js
// Exit with 0 or 1
let failed = false;
process.once('exit', (code) => failed && process.exit(1));

// Format orchestrator errors
const formatError = function (e) {
    if (!e.err)
        return e.message;

    // PluginError
    if (typeof e.err.showStack === 'boolean')
        return e.err.toString();

    // Normal error
    if (e.err.stack)
        return e.err.stack;

    // Unknown (string, number, etc.)
    return e.err; // new Error(String(e.err)).stack;
}

// Wire up logging events
const logEvents = function (gulpInst) {
    // Total hack due to poor error management in orchestrator
    gulpInst.on('err', (err) => failed = true);

    gulpInst.on('task_start', (e) => {
        // TODO: batch these
        // so when 5 tasks start at once it only logs one time with all 5
        gutil.log('Starting', '\'' + chalk.cyan(e.task) + '\'...');
    });

    gulpInst.on('task_stop', (e) => {
        const time = prettyTime(e.hrDuration);
        gutil.log(
            'Finished', '\'' + chalk.cyan(e.task) + '\'',
            'after', chalk.magenta(time)
        );
    });

    gulpInst.on('task_err', (e) => {
        const msg = formatError(e);
        const time = prettyTime(e.hrDuration);
        gutil.log(
            '\'' + chalk.cyan(e.task) + '\'',
            chalk.red('errored after'),
            chalk.magenta(time)
        );
        gutil.log(msg);

        // not watch mode, execute immediately
        if(!settings.watch)
            process.exit(1);
    });

    gulpInst.on('task_not_found', (err) => {
        gutil.log(
            chalk.red(`Task '${err.task}' is not in your gulpfile`)
        );
        gutil.log('Please check the documentation for proper gulpfile formatting');
        process.exit(1);
    });
}

logEvents(gulp);

module.exports = gulp;
