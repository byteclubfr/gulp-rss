var es = require('event-stream');
var _ = require('lodash');
var util = require('gulp-util');
var path = require('path');
var File = require('gulp').File;
var Feed = require('feed');

module.exports = function rss (options) {
  // Default options

  var feedType = (options || {}).render || 'atom-1.0';

  var properties = _.extend({
    data:         'frontMatter',
    title:        'title',
    link:         'permalink',
    description:  'description',
    author:       'author',
    date:         'date',
    image:        'image'
  }, (options || {}).properties || {});
  var dataProperty = properties.data;
  delete properties.data;

  var feedOptions = _.extend({
    title:        null,
    // Basic options required for `feed` to work properly
    link:         '',
    description:  '',
    author:       {}
  }, options || {});
  delete feedOptions.properties;
  delete feedOptions.render;

  if (!feedOptions.title) {
    throw new Error('Required option: `title` (feed title)');
  }


  var feed = new Feed(feedOptions);

  return es.through(

    function data (file) {
      var data = file[dataProperty];
      if (!data) {
        util.log('[rss]', file.path, 'skipped (no data)');
        return;
      }

      var item = {};
      for (var prop in properties) {
        item[prop] = data[prop] || '';
      }

      // 'date' must be a Date object
      if (!item.date) {
        item.date = (file.stat || {}).ctime || new Date();
      } else if (!item.date.toUTCString) {
        item.date = new Date(item.date);
      }

      feed.item(item);
    },

    function end () {
      try {
        var file = new File('feed.xml', './feed.xml');
        file.contents = new Buffer(feed.render(feedType));
      } catch (e) {
        this.emit('error', e);
        return;
      }

      this.emit('data', file);
      this.emit('end');
    }

  );
};
