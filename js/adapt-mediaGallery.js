import components from 'core/js/components';
import MediaGalleryView from './mediaGalleryView';
import MediaGalleryModel from './mediaGalleryModel';

export default components.register('mediagallery', {
  model: MediaGalleryModel,
  view: MediaGalleryView
});
