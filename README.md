# Google Fonts Localifier

This is a progessive web app hosted on Github pages - https://noitidart.github.io/Google-Fonts-Localifier/

This tool was created because I would get fonts from [Google Fonts](https://fonts.google.com/) but it would promote it's "remote" option. For example it would tell me to add this remote stylesheet:

```
<link href="https://fonts.googleapis.com/css?family=Roboto+Slab:100,300,400,700" rel="stylesheet">
```

Or to add a remote import:
```
<style>
@import url('https://fonts.googleapis.com/css?family=Roboto+Slab:100,300,400,700');
</style>
```

The only advantage remote has is that it keeps things up to date without any effort from my part. However it adds lag time. I much prefer to include the assets locally. Using their "download" options bulks up all the unicodes into one big `.ttf ` per font weight/style. It is no longer the nice broken apart `.woff2` per unicode ranges.

Google Fonts Localifier resolves this issue. Provide it the URL to the stylesheet, like `https://fonts.googleapis.com/css?family=Roboto+Slab:100,300,400,700` and then it will give you a zip with all of the `.woff2` broken apart by unicode range, along with the stylesheet. Just use that stylesheet as you normally would and you got your custom font, localified!

### Screencast

Here is a screencast of the usage:

[![Using Google Fonts Localifier Screencast](http://img.youtube.com/vi/4sbPmvvltP8/0.jpg)](http://www.youtube.com/watch?v=4sbPmvvltP8)

## Get it!
* https://noitidart.github.io/Google-Fonts-Localifier/