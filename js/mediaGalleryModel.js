define([
  'core/js/models/componentModel'
], function(ComponentModel) {

  var MediaGalleryModel = ComponentModel.extend({

    init: function() {
      this.set({
        _media: this.get('_items')[0]._media,
        _originalTranscript: this.get('_transcript')
      });
    }

  });

  return MediaGalleryModel;

});
