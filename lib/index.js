const ptn = require('parse-torrent-name');
const path = require('path');
const _ = require('lodash');
const leftPad = require('left-pad');

/**
 *
 * @api public
 *
 * @param {String} filePath  path to file that needs to be renamed and moved
 * @param {String} destRoot  destination root directory to move the file to
 * @param {Function} cb  callback function with (err, res) arguments
 *
 * @return {Undefined}  nothing, use async callbacks
 */
module.exports = function(filePath, destRoot, cb) {
  const infos = path.parse(filePath);
  _.assign(infos, ptn(infos.name));

  // make sure we have all information to parse the file name
  if (!_.every(['episode', 'season', 'title', 'ext'], (key) => {
    return _.has(infos, key);
  })) {
    return cb(new Error(`cannot parse filename ${filePath}. Make sure it is a TV show with episode information.`));
  }

  // rename according to https://support.plex.tv/hc/en-us/articles/200220687-Naming-Series-Season-Based-TV-Shows
  const seasonStr = `s${leftPad(infos.season, 2, '0')}`;
  const episodeStr = `e${leftPad(infos.episode, 2, '0')}`;
  const dest = path.normalize(path.join(destRoot, infos.title, `Season ${infos.season}`,
    `${infos.title} - ${seasonStr}${episodeStr}${infos.ext}`));

  return cb(null, dest);
};
