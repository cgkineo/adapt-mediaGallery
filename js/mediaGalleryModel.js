import ComponentModel from 'core/js/models/componentModel';

class MediaGalleryModel extends ComponentModel {

  init() {
    this.set({
      _media: this.get('_items')[0]._media,
      _originalTranscript: this.get('_transcript')
    });
  }

}

export default MediaGalleryModel;
