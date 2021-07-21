# adapt-mediaGallery

This component extends the functionality of `adapt-contrib-media` by providing a gallery of videos from which the user can select. Each video can be configured with its own poster image and multi-language closed captioning.

This component supports the same device and browser specification as `adapt-contrib-media` and is accessible. Accordingly it follows a similar configuration (see `example.json`). See the `README` of `adapt-contrib-media` for further details.

## Settings Overview

The attributes listed below are used in *components.json* to configure **MediaGallery**, and are properly formatted as JSON in [*example.json*](https://github.com/cgkineo/adapt-mediaGallery/blob/master/example.json).

## Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

### \_component (string):
This must be set to: `"mediagallery"`.

### \_classes (string):
CSS class name(s) to be applied to this component's containing `div`. The class(es) must be predefined in one of the Less files. Separate multiple classes with a space.

### \_layout (string):
Defines the horizontal position of the component in the block. Acceptable values are `"full"`, `"left"` or `"right"`.

### instruction (string):
This optional text appears above the component. It is frequently used to guide the learner’s interaction with the component.

### \_setCompletionOn (string):
Determines when Adapt will register this component as having been completed by the learner. Acceptable values are `play`, `allPlayed`, `ended`, `allEnded`, and `inview`. `play` requires a single media element to be played; `allPlayed` requires all media elements to be played; `ended` requires a single media element to be played through to the end; `allEnded` requires all media elements to be played through to the end; `inview` requires the Media Gallery component to enter the view port completely.

### \_items (array):
This items array contains the following settings:

#### title (string):
Title of the item that appears beneath the item image.

#### subtitle (string):
Subtitle of the item that appears beneath the item title.

#### ariaLabel (string):
This text is associated with the item button. It renders as part of the aria label to give screen readers more information.

#### \_graphic (object):
The graphic object defines the image that displays for each item and contains the following setting:

##### src (string):
File name (including path) of item image. Path should be relative to the `src` folder (e.g., `"course/en/images/c-05.png"`).

#### \_media (object):
The media object will contain different values depending on the type of media: video or audio. See [media object](https://github.com/adaptlearning/adapt-contrib-media#_media-object) for more information.

#### \_transcript (object):
The transcript object contains the following setting:

##### \_inlineTranscript (boolean):
Determines whether the button that toggles the display of the inline transcript text will be displayed or not. Set to `true` to override the global transcript with an item specific transcript.

### \_transcript (object):
This object contains the global transcript attributes that apply to all media elements. See [transcript object](https://github.com/adaptlearning/adapt-contrib-media#_transcript-object) for all available attributes.

# Todo

- add YouTube/Vimeo/ogg/mp3 support

# Known issues

The issues below are all present in `adapt-contrib-media` and some are ultimately issues with `MediaElement.js`.

1. When startLanguage specified captions do not show when moving to fullscreen on iOS.
2. Enabling captions while in fullscreen can result in duplicated captioning when returning from fullscreen on iOS.
3. Changing orientation when captions are enabled can cause position of captions to be misaligned on Android.

----------------------------
**Version number:**  1.0.0<br/>
**Framework versions:**  5.8+<br/>
**Author / maintainer:** Kineo<br/>
**Accessibility support:** TBC<br/>
**RTL support:** TBC<br/>
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, IE11, Safari 14 for macOS/iOS/iPadOS, Opera<br/>
