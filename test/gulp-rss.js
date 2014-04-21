/*global describe, it*/

"use strict";

var gulp = require('gulp');
var expect = require('chai').expect;

var es = require('event-stream');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var frontMatter = require('gulp-front-matter');
var rss = require('../');


var input = __dirname + '/fixtures/*.md';

function test(input, options, check) {
  return function (done) {
    gulp.src(input)
      // Extract front matter
      .pipe(frontMatter())
      // Generate RSS
      .pipe(rss(_.extend({
        feedOptions: {
          title: 'My blog',
          link: 'http://my.bl.og',
          author: {name: 'Bob'}
        }
      },
        options || {})))
      // Test
      .pipe(es.map(check).on('end', done));
  };
}


describe('gulp-rss', function () {

  it('should generate an atom feed', test(input, {}, function (file, cb) {
    var contents = String(file.contents);
    expect(contents).to.match(/<feed /);
    expect(contents).not.to.match(/<rss /);
    cb();
  }));

  it('should generate an rss-2.0 feed', test(input, {render: 'rss-2.0'}, function (file, cb) {
    var contents = String(file.contents);
    expect(contents).to.match(/<rss version="2\.0"/);
    expect(contents).not.to.match(/<feed /);
    cb();
  }));

  it('should generate a feed with two items', test(input, {}, function (file, cb) {
    expect(String(file.contents).match(/<entry/g)).to.have.length(2);
    cb();
  }));

});
