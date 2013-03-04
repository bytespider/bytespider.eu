--- 
layout: default
title: Why make Promises
tags: 
- javascript
- programming
- promises
---
Whatever you may call them, Promises, Futures or even Deferred the concept is
the same. You ask an asynchronous task to do something, and it gives you a
promised result back instantly which you can then act upon.

Take this trivial example in javascript:

    
    
    var results = searchTwitter("Starwars");
    filterByAuthor("@darthvader1977", results);
    displayTweets(results);
    

Now wouldn't that be great? Looks synchronous but behaves asynchronously?
Sadly, I believe that this would require a language construct not native to
most programming languages.

There are a few promise libraries written in Javascript that provide an API we
can utilise on our previous example.

    
    
    searchTwitter("Starwars").
        then(filterBydarthvader1977).
        then(displayTweets);
    

An heres where I'm confused. Why is this better then doing:

    
    
    searchTwitter("Starwars", function (results) {
        displayTweets(filterByAuthor("@darthvader1977", results));
    });
    

Yes I guess, yes it does look prettier and more concise, and the API is
explicit in its intent, but is that enough? This covers the [Promises/A
proposal](http://wiki.commonjs.org/wiki/Promises/A) as detailed on the
CommonJS wiki. In my opinion pretty useless, at least in Javascript. From what
I can tell, all of the proposals seem require the supply of a callback of some
sort. This to me is interesting as I thought the whole idea behond promises
was to get rid of the layers of nested callback, not just to reduce them.

So this leads me to an idea, which after a conversation with a collegue seems
to make sense. So lets start with an example.

    
    
    var tweets = searchTwitter("Startwars");
    tweets.filterByAuthor("@darthvader1977");
    tweets.display();
    

As you can see, we call method on the tweets variable. I'm assuming that the
`searchTwitter` method instantly returns a tweets object, with each method
queuing the call until the asynchronous call to `searchTwitter` completes,
which then calls each method in turn in the order it was invoked.

Now I'm certain this isn't a new idea, and there must be a library out there
or a specification, can someone tell me where?

