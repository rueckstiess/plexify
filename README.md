# plexify [![travis][travis_img]][travis_url] [![npm][npm_img]][npm_url]

A command line tool to rename and move tv shows to [Plex folder structure][plex].

## Installation

```
npm install -g plexify
```

## Example

```
plexify --destination /Volumes/TV_Shows The.Staying.Alive.S05E02.720p.HDTV.x264-KILLERS[rartv].avi
```

Would move the file to

```
/Volumes/TV_Shows/The Staying Alive/Season 5/The Staying Alive - s05e02.avi
```

Multiple destination folders can be specified, the first existing one will be used. This is
useful if you have a portable USB drive plugged in that is not always available. In that case
you can specify a fall-back folder to move the file to. Use with multiple `-d`
(or `--destination`) options.

There is also a test mode to simulate file renames. Use `--test` to activate.

## License

MIT

[travis_img]: https://img.shields.io/travis/rueckstiess/plexify.svg
[travis_url]: https://travis-ci.org/rueckstiess/plexify
[npm_img]: https://img.shields.io/npm/v/plexify.svg
[npm_url]: https://npmjs.org/package/plexify
[plex]: https://support.plex.tv/hc/en-us/articles/200220687-Naming-Series-Season-Based-TV-Shows
