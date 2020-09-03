# adapt-contrib-mediaWithBenefits

This component extends the functionality of `adapt-contrib-media` by providing a gallery of videos from which the user can select. Each video can be configured with its own poster image and multi-language closed captioning.

This component supports the same device and browser specification as `adapt-contrib-media` and is accessible. Accordingly it follows a similar configuration (see `example.json`). See the `README` of `adapt-contrib-media` for further details.

# Notes

Gallery buttons require the `fixed` class to prevent `jquery.a11y.js::limitedScrollTo` calling `window.scrollTo`; which causes an unnecessary scroll and prevents the click handlers from working.

# Todo

- add YouTube/Vimeo/ogg/mp3 support

# Known issues

The issues below are all present in `adapt-contrib-media` and some are ultimately issues with `MediaElement.js`.

1. When startLanguage specified captions do not show when moving to fullscreen on iOS.
2. Enabling captions while in fullscreen can result in duplicated captioning when returning from fullscreen on iOS.
3. Changing orientation when captions are enabled can cause position of captions to be misaligned on Android.