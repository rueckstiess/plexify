#!/usr/bin/env node

/* eslint no-sync: 0, no-console: 0 */

const plexify = require('../lib');
const _ = require('lodash');
const fs = require('fs');
const isVideo = require('is-video');
const recursive = require('recursive-readdir');

function plexifyFile(fileName, destRoot, test) {
  plexify(fileName, destRoot, (errPlex, dest) => {
    if (errPlex) {
      return console.error(errPlex.message);
    }
    if (test) {
      return console.log(`would move ${fileName} -> ${dest}`);
    }
    fs.rename(fileName, dest, (errMove) => {
      if (errMove) {
        return console.error(errMove.message);
      }
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
    type: 'array',
    default: '.',
    describe: 'destination root directory to move the file to'
  })
  .argv;

const filePath = argv._[0];
const destRoot = _.find(argv.destination, (dest) => {
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
  });
  return;
}

// single file mode
if (isVideo(filePath)) {
  plexifyFile(filePath, destRoot, argv.test);
}
