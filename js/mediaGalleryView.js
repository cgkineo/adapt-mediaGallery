import Adapt from 'core/js/adapt';
import offlineStorage from 'core/js/offlineStorage';
import Media from 'components/adapt-contrib-media/js/adapt-contrib-media';

class MediaGalleryView extends Media.view {

  className() {
    // keep mediaGallery visually consistent with the media component
    let str = super.className();
    str += ' media';
    return str;
  }

  events () {
    return {
      ...super.events(),
      'click .js-mediagallery-item': 'onItemClicked'
    };
  }

  onMediaElementPlay(...args) {
    super.onMediaElementPlay(...args);

    this.markItemAsPlayed();
  }

  onMediaElementEnded(...args) {
    super.onMediaElementEnded(...args);

    this.markItemAsWatched();
  }

  onPlayerReady(...args) {
    super.onPlayerReady(...args);

    _.delay(() => {
      this.selectItem(0);
    }, 250);
  }

  checkCompletion() {
    if (this.model.get('_setCompletionOn') === 'allPlayed' && this.areAllItemsVisited()) {
      this.setCompletionStatus();
    } else if (this.model.get('_setCompletionOn') === 'allEnded' && this.areAllItemsWatched()) {
      this.setCompletionStatus();
    }
  }

  checkCompletionByTranscript() {
    if (this.model.get('_originalTranscript')._setCompletionOnView !== true) return;

    if (this.areAllItemsWatched()) {
      this.setCompletionStatus();
    }
  }

  areAllItemsVisited() {
    return this.model.get('_items').every(itemCfg => itemCfg._isPlayed);
  }

  areAllItemsWatched() {
    return this.model.get('_items').every(itemCfg => itemCfg._isWatched);
  }

  markItemAsWatched() {
    const itemCfg = this.model.get('_items')[this.selectedIndex];
    itemCfg._isWatched = true;

    this.checkCompletion();
  }

  markItemAsPlayed() {
    const itemCfg = this.model.get('_items')[this.selectedIndex];
    itemCfg._isPlayed = true;

    this.checkCompletion();
  }

  selectItem(index) {
    // get the selected item configuration
    const itemCfg = this.model.get('_items')[index];
    // get the selected element
    const $selectedItem = this.$('.js-mediagallery-item').eq(index);

    // update classes
    this.$('.js-mediagallery-item').removeClass('is-selected');
    $selectedItem.addClass('is-selected is-visited');

    this.selectedIndex = index;

    // TODO: add support for Youtube/Vimeo sources
    this.mediaElement.setSrc(itemCfg._media.mp4);
    this.mediaElement.load();

    const $mediaElement = $(this.mediaElement);
    $mediaElement.find('track').remove();
    $mediaElement.append(Handlebars.partials.mediaTracks(itemCfg._media.cc));
    this.mediaElement.player.rebuildtracks();

    if (itemCfg._transcript) {
      this.model.set('_transcript', { ...this.model.get('_originalTranscript'), ...itemCfg._transcript });
      this.$('.media__transcript-container').html(Handlebars.partials.transcript(this.model.toJSON()));
    } else {
      this.model.unset('_transcript');
      this.$('.media__transcript-container').empty();
    }

  }

  playSelection() {
    const $selectedItem = this.$('.js-mediagallery-item').eq(this.selectedIndex);

    this.mediaElement.play();

    $selectedItem.addClass('is-visited');
  }

  onItemClicked(e) {
    const index = $(e.currentTarget).data('index');

    if (this.selectedIndex !== index) {
      this.selectItem(index);
    }

    this.playSelection();
  }

  onToggleInlineTranscript(event) {
    this.markItemAsWatched();

    if (event && event.preventDefault) event.preventDefault();

    const $transcriptBodyContainer = this.$('.media__transcript-body-inline');
    const $button = this.$('.media__transcript-btn-inline');
    const $buttonText = this.$('.media__transcript-btn-inline .media__transcript-btn-text');

    if ($transcriptBodyContainer.hasClass('inline-transcript-open')) {
      $transcriptBodyContainer.stop(true, true).slideUp(() => {
        $(window).resize();
      }).removeClass('inline-transcript-open');
      $button.attr('aria-expanded', false);
      $buttonText.html(this.model.get('_transcript').inlineTranscriptButton);
      return;
    }

    $transcriptBodyContainer.stop(true, true).slideDown(() => {
      $(window).resize();
    }).addClass('inline-transcript-open');
    $button.attr('aria-expanded', true);
    $buttonText.html(this.model.get('_transcript').inlineTranscriptCloseButton);

    this.checkCompletionByTranscript();
  }

  onExternalTranscriptClicked(event) {
    this.markItemAsWatched();
    this.checkCompletionByTranscript();
  }

}

MediaGalleryView.template = 'mediagallery';

export default MediaGalleryView;
