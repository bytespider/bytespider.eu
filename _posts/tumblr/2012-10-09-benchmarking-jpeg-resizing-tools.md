--- 
layout: default
title: Benchmarking jpeg resizing tools
tags: 
- images
- resize
- bash
- programming
- command line
- optimisation
---
### Update2

I ran the following commands utilising -size 8.333% and -scale 1/12:

    
    
    time ( while ((n++ < 100)); do convert 6977576953_8e36188141_o.jpg -size "8.333%" -resize 886 -quality 90 dest_im.jpg; done );
    real	10m27.572s
    user	12m11.340s
    sys	0m56.694s
    
    time ( while ((n++ < 100)); do gm convert 6977576953_8e36188141_o.jpg -size "8.333%" -resize 886 -quality 90 dest_gm.jpg; done );
    real	10m28.351s
    user	13m21.717s
    sys	0m33.366s
    
    time ( while ((n++ < 100)); do djpeg < 6977576953_8e36188141_o.jpg -dct int -scale 1/12 | pnmscalefixed -width 886 | cjpeg -quality 90 -sample 1x1 > dest.jpg; done );
    real	0m31.784s
    user	0m38.853s
    sys	0m1.650s
    

As you can see the djpeg method is blindingly fast, in comparison to the IM
and GM versions, being 95% faster. I feel like I'm being somewhat unfair to IM
and GM by asking them to potentially resizing to a floating point number. So I
re ran them again, this time with -size 886×865, the exact final output size:

    
    
    time ( while ((n++ < 100)); do convert 6977576953_8e36188141_o.jpg -size 886x865 -resize 886 -quality 90 dest_im.jpg; done );
    real	9m35.862s
    user	12m10.302s
    sys	0m56.124s
    
    time ( while ((n++ < 100)); do gm convert 6977576953_8e36188141_o.jpg -size 886x865 -resize 886 -quality 90 dest_gm.jpg; done );
    real	9m22.672s
    user	13m28.120s
    sys	0m33.702s
    
    

So, the effect of resizing to a floating point value, costs in the region of
1s for this test, but it's still not as quick as my djpeg + cjpeg method.

### Update 1

It's been pointed out to me that GraphicsMagick and ImageMagick both have the
-size option that can be used to pre-scale images before any further
manipulation is performed. In that vein, djpeg also has -scale which will pre-
scale an image to a N{1…16}/M fraction, ie 1/8 = 12.5%. I believe this are
equal so wil re-perform the test with these options and record the results
here

# The experiment

In the quest to find the best command line image resizing tool I ran an
original image @ 7668 × 7488, 100 times through each command line tool using
the following method:

    
    
    time ( while ((n++ < 100)); do [/* insert command here */] ; done );
    

I appreciate this isn't exactly scientific, but as a first round it will help
me identify the fastest of the competitors.

## The original

##  [License Some rights reserved by Bobby McCruff](http://www.flickr.com/phot
os/cuyp/6977576953/sizes/o/in/pool-61933023@N00/%22)
![](http://cl.ly/K2Jk/6977576953_8e36188141_o.jpg)

    
    
    du -h original.jpg
    5.9M	original.jpg
    

## ImageMagick

    
    
    time ( while ((n++ < 100)); do 
        convert original.jpg -resize 886 -quality 90 dest_im.jpg; 
    done );
    
    real	9m25.119s
    user	12m14.881s
    sys	1m3.075s
    
    du -h dest_im.jpg
    136K	dest_im.jpg
    

Resultant image:

![](http://cl.ly/K2lK/dest_im.jpg)

## GraphicsMagick

    
    
    time ( while ((n++ < 100)); do 
        gm convert original.jpg -resize 886 -quality 90 dest_gm.jpg; 
    done );
    
    real	9m42.185s
    user	13m24.283s
    sys	0m42.524s
    
    du -h dest_gm.jpg
    140K	dest_gm.jpg
    

Resultant image:

![](http://cl.ly/K2Zg/dest_gm.jpg)

## djpeg + cjepg & pnmscale

    
    
    time ( while ((n++ < 100)); do 
        djpeg < original.jpg -dct int | pnmscalefixed -width 886 | cjpeg -quality 90 -sample 1x1 > dest.jpg; 
    done );
    
    real	4m22.249s
    user	4m33.203s
    sys	0m25.874s
    
    du -h dest.jpg
    132K	dest.jpg
    

Resultant image:

![](http://cl.ly/K2xF/dest.jpg)

# The conclusion

Looking carefully at the images I can see that the djpeg+cjpeg one is slightly
bluer than the original and the other two competitors, but at almost half the
time taken (i casually observed the CPU which was lower as well) this has to
be a viable option when resizing many images.

The file size was also smaller, however this could be due too like colour not
matching. I'll keep investigating if I can improve the colour quality in
future experiments.

What do you think?

