# 2D Visibility Algorithm Demo

This is a 2d visibility agolrithm described in [this article](http://www.redblobgames.com/articles/visibility/), ported by hand to JavaScript (ES2016) and refactored significantly to suit my taste better. I went for a more functional approach and renamed/reorganized some things, so it's not quite a 1-to-1 port.

I highly suggest reading the article. It's very well explained with some really awesome interactive examples and provides the code in multiple languages. The original code was wrriten in Haxe, which can compile into JavaScript but I found the generated JS to be rather difficult to read and comes with an (unncessary) doubly linked list implementation.

# Building the demo

![Screenshot of demo](http://i.imgur.com/PIljyGJ.png)

Clone the repo, `npm install` then run `webpack-dev-server --content-base .` and navigate to `localhost:8080`

## License

The MIT License (MIT)

Copyright (c) 2016 Cyril Silverman

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
