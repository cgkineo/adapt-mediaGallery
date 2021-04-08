define([
  'core/js/adapt',
  './mediaGalleryModel.js',
  './mediaGalleryView.js'
], function(Adapt, MediaGalleryModel, MediaGalleryView) {

  return Adapt.register('mediagallery', {
    model: MediaGalleryModel,
    view: MediaGalleryView
  });

});
