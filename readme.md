# 2D Visibility Algorithm

This is a 2d visibility agolrithm described in [this article](http://www.redblobgames.com/articles/visibility/), ported by hand to JavaScript (ES2016) and refactored significantly to suit my taste better. I went for a more functional approach and renamed/reorganized some things, so it's not quite a 1-to-1 port.

I highly suggest reading the article. It's very well explained with some really awesome interactive examples and provides the code in multiple languages. The original code was wrriten in Haxe, which can compile into JavaScript but I found the generated JS to be rather difficult to read and comes with an (unncessary) doubly linked list implementation.

# Building the demo

![Screenshot of demo](http://i.imgur.com/PIljyGJ.png)

Clone the repo, `npm install` then run `webpack-dev-server --content-base .` and navigate to `localhost:8080`
