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

  events() {
    // the template binds its own click handlers, so stop older media versions
    // from also binding their transcript handlers to the same buttons
    return {};
  }

  preRender() {
    super.preRender();

    _.bindAll(this, 'onItemClicked', 'onToggleInlineTranscript', 'onExternalTranscriptClicked');

    this.model.set('_isInlineTranscriptOpen', false);
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
    itemCfg._isVisited = true;

    this.selectedIndex = index;

    // TODO: add support for Youtube/Vimeo sources
    this.mediaElement.setSrc(itemCfg._media.mp4);
    this.mediaElement.load();

    this.updateTracks(itemCfg._media.cc);

    if (itemCfg._transcript) {
      this.model.set('_transcript', { ...this.model.get('_originalTranscript'), ...itemCfg._transcript });
    } else {
      this.model.unset('_transcript');
    }

    // re-renders the item classes and resets the transcript for the new item
    this.model.set({
      _selectedIndex: index,
      _isInlineTranscriptOpen: false
    });
  }

  updateTracks(cc = []) {
    const player = this.mediaElementInstance || this.mediaElement.player;
    // mediaelement owns the video, so its tracks are swapped here rather than in the template
    const $video = $(player.node || this.mediaElement);
    $video.find('track').remove();
    $video.append(cc.map(({ src, srclang }) => $('<track>', {
      kind: 'subtitles',
      src,
      type: 'text/vtt',
      srclang
    })));

    // mediaelement 2 (adapt-contrib-media < v7)
    if (player.rebuildtracks) return player.rebuildtracks();

    // mediaelement 7 has no rebuildtracks, so rescan the tracks and rebuild the
    // captions button. Its addControlElement fails when the button was first in
    // the controls, so append the new button and move it to the old one's place
    const oldButton = player.captionsButton;
    const nextSibling = oldButton?.parentNode && oldButton.nextSibling;
    const position = player.featurePosition.tracks;
    delete player.featurePosition.tracks;
    player.trackFiles = null;
    player.buildtracks(player, player.controls, player.layers, player.media);
    if (nextSibling && player.captionsButton) nextSibling.before(player.captionsButton);
    if (position !== undefined) player.featurePosition.tracks = position;
  }

  playSelection() {
    this.mediaElement.play();
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

    const isOpen = this.model.get('_isInlineTranscriptOpen');
    this.model.set('_isInlineTranscriptOpen', !isOpen);

    const $transcriptBodyContainer = this.$('.media__transcript-body-inline').stop(true, true);

    if (isOpen) {
      $transcriptBodyContainer.slideUp(() => {
        $(window).resize();
      });
      return;
    }

    $transcriptBodyContainer.slideDown(() => {
      $(window).resize();
    });

    this.checkCompletionByTranscript();
  }

  onExternalTranscriptClicked(event) {
    window.open(this.model.get('_transcript').transcriptLink);
    this.markItemAsWatched();
    this.checkCompletionByTranscript();
  }

}

MediaGalleryView.template = 'mediagallery.jsx';

export default MediaGalleryView;
