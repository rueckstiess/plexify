#!/usr/bin/env node

/* eslint no-sync: 0, no-console: 0 */

const plexify = require('../lib');
const _ = require('lodash');
const fs = require('fs');
const mv = require('mv');
const isVideo = require('is-video');
const recursive = require('recursive-readdir');
const rimraf = require('rimraf');

function plexifyFile(fileName, destRoot, test) {
  plexify(fileName, destRoot, (errPlex, res) => {
    if (errPlex) {
      return console.error(errPlex.message);
    }
    if (test) {
      return console.log(`would move ${fileName} -> ${res.destination}`);
    }
    mv(fileName, res.destination, {mkdirp: true}, (errMove) => {
      if (errMove) {
        return console.error(errMove.message);
      }
      return console.log(`${res.title} - Season ${res.season}, Episode ${res.episode}`);
    });
  });
}


const argv = require('yargs')
  .usage('$0 <cmd> [args]')
  .version()
  .help()
  .demandCommand(1)
  .option('t', {
    alias: 'test',
    type: 'boolean',
    default: false,
    describe: 'only simulate rename without moving the file'
  })
  .option('d', {
    alias: 'destination',
    type: 'string',
    default: '.',
    describe: 'destination root directory to move the file to'
  })
  .option('delete', {
    type: 'boolean',
    default: false,
    describe: 'delete directory after moving all containing files'
  })
  .argv;

const filePath = argv._[0];
const destRoot = _.isString(argv.destination) ?
  argv.destination : _.find(argv.destination, (dest) => {
    return fs.existsSync(dest);
  });

if (_.isUndefined(destRoot)) {
  console.error('No destination directory found. Please provide existing destination directory.');
  process.exit(1);
}
if (fs.statSync(filePath).isDirectory()) {
  // directory mode, apply to all files recursively
  recursive(filePath, (err, files) => {
    if (err) {
      return console.error(err);
    }
    files = _.filter(files, (file) => {
      return isVideo(file);
    });
    _.each(files, (file) => {
      plexifyFile(file, destRoot, argv.test);
    });
    if (argv.delete && filePath !== '.') {
      rimraf.sync(filePath);
    }
  });
  return;
}

// single file mode
if (isVideo(filePath)) {
  plexifyFile(filePath, destRoot, argv.test);
}
