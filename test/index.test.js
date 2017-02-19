var plexify = require('../');
var assert = require('assert');

describe('plexify', function() {
  it('renames video files correctly', function(done) {
    const fileName = './The.Staying.Alive.S05E02.720p.HDTV.x264-KILLERS[rartv].avi';
    const destRoot = '/Volumes/TV_Shows';
    plexify(fileName, destRoot, (err, res) => {
      assert.ifError(err);
      assert.equal(res.destination, '/Volumes/TV_Shows/The Staying Alive/Season 5/The Staying Alive - s05e02.avi');
      done();
    });
  });
  it('returns all other information', function(done) {
    const fileName = './The.Staying.Alive.S05E02.720p.HDTV.x264-KILLERS[rartv].avi';
    const destRoot = '/Volumes/TV_Shows';
    plexify(fileName, destRoot, (err, res) => {
      assert.ifError(err);
      assert.equal(res.title, 'The Staying Alive');
      assert.equal(res.season, '5');
      assert.equal(res.episode, '2');
      done();
    });
  });
  it('ignores files without season/episode information ', function(done) {
    const fileName = './The.Staying.Alive.S05.720p.HDTV.x264-KILLERS[rartv].avi';
    const destRoot = '/Volumes/TV_Shows';
    plexify(fileName, destRoot, (err) => {
      assert.ok(err);
      assert.ok(err.message.match(/cannot parse filename/));
      done();
    });
  });
});
