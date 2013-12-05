[![Build Status](https://travis-ci.org/lmtm/gulp-rss.png?branch=master)](https://travis-ci.org/lmtm/gulp-rss)
[![Dependency Status](https://david-dm.org/lmtm/gulp-rss.png)](https://david-dm.org/lmtm/gulp-rss)

## Information

<table>
<tr>
<td>Package</td><td>gulp-rss</td>
</tr>
<tr>
<td>Description</td>
<td>Generates an RSS file from files with metadata (typically extracted using `gulp-front-matter`)</td>
</tr>
<tr>
<td>Node Version</td>
<td>≥ 0.7</td>
</tr>
</table>

## Usage

```javascript
var frontMatter = require('gulp-front-matter');
var rss = require('gulp-rss')

gulp.task('rss', function() {
  gulp.files('./posts/*.md')  // Read input files
    .pipe(frontMatter())      // Extract YAML Front-Matter
    .pipe(rss(                // Generate RSS data
      // Configuration
      {
        // How we deal with contextual data (typically Front-Matter)
        properties: {
          data:         'frontMatter',  // name of property containing the data, typically extracted front-matter
          // Proparty names mapping
          title:        'title',        // post's title (means plugin will read `file.frontMatter.title`, mandatory)
          link:         'permalink',    // post's URL (mandatory)
          description:  'description',  // post's description (optional)
          author:       'author',       // post's author (optional)
          date:         'date',         // post's publication date (mandatory, default = now)
          image:        'image'         // post's thumbnail (optional)
        },

        // Feed configuration
        render:       'atom-1.0',                     // Feed type (atom-1.0 or rss-2.0)
        title:        'My blog',                      // Feed title (mandatory)
        description:  'My very own blog',             // Feed description (optional)
        link:         'http://my.bl.og',              // Feed link (optional)
        author:       { name: 'Nicolas Chambrier' },  // Blog's author (optional)
        // etc…
      }

    ))
    .pipe(gulp.dest('./public/feed.xml')) // Write output
});
```

See https://github.com/jpmonette/feed for the whole RSS configuration. This is the underlying module.

## LICENSE (BSD 2-Clause)

> Copyright (c) 2013, Nicolas Chambrier
> All rights reserved.
>
> Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
>
> 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
>
> 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
>
> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
