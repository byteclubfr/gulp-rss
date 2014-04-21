"use strict";

var es = require('event-stream'),
  _ = require('lodash'),
  util = require('gulp-util'),
  path = require('path'),
  Feed = require('feed');

module.exports = function rss(options) {
  // Default options

  options = options || {};
  _.defaults(options, {
    render: "atom-1.0",
    data: "frontMatter",
    filename: "feed.xml",
    feedOptions: {},
    properties: {}
  });

  var properties = options.properties,
    feedOptions = options.feedOptions,
    feed;
  
  _.defaults(properties, {
    title:        'title',
    link:         'permalink',
    description:  'description',
    author:       'author',
    date:         'date',
    image:        'image'
  });

  _.defaults(feedOptions, {
    title:        null,
    // Basic options required for `feed` to work properly
    link:         '',
    description:  '',
    author:       {}
  });

  if (feedOptions.link[feedOptions.link.length - 1] !== "/") {
    feedOptions.link += "/";
  }

  if (!feedOptions.title) {
    throw new Error('Required option: `title` (feed title)');
  }


  feed = new Feed(feedOptions);

  return es.through(

    function (file) {
      var data = file[options.data],
        item = {},
        prop;
      
      if (!data) {
        util.log('[rss]', file.path, 'skipped (no data)');
        return;
      }

      Object.keys(properties).forEach(function (prop) {
        item[prop] = data[properties[prop]] || '';
      });

      // check to see if the link looks like a URL. If not, add the
      // rest of the URL
      if (item.link.indexOf(":") === -1) {
        item.link = feedOptions.link + item.link;
      }

      // 'date' must be a Date object
      if (!item.date) {
        item.date = (file.stat || {}).ctime || new Date();
      } else if (!item.date.toUTCString) {
        item.date = new Date(item.date);
      }

      if (!item.title && !item.description) {
        util.log('[rss]', file.path, 'skipped (no title or description)');
        return;
      }
      feed.addItem(item);
    },

    function () {
      var file;
      try {
        file = new util.File({
          cwd: process.cwd(),
          base: process.cwd(),
          path: path.join(process.cwd(), options.filename),
          contents: new Buffer(feed.render(options.render))
        });
      } catch (e) {
        this.emit('error', e);
        return;
      }

      this.emit('data', file);
      this.emit('end');
    }

  );
};
