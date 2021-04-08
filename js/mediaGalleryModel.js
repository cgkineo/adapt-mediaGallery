define([
  'core/js/models/componentModel'
], function(ComponentModel) {

  class MediaGalleryModel extends ComponentModel {

    init() {
      this.set({
        _media: this.get('_items')[0]._media,
        _originalTranscript: this.get('_transcript')
      });
    }

  }

  return MediaGalleryModel;

});
