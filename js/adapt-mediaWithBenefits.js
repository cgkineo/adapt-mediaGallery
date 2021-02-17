define([
  'core/js/adapt',
  'core/js/models/componentModel',
  'components/adapt-contrib-media/js/adapt-contrib-media'
], function(Adapt, ComponentModel, Media) {

  var MediaWithBenefitsModel = ComponentModel.extend({
    init: function() {
      this.set({
        _media: this.get('_items')[0]._media,
        _originalTranscript: this.get('_transcript')
      });
    }
  });

  var MediaWithBenefitsView = Media.view.extend({

    className: function() {
      // keep mediawithbenefits visually consistent with the media component
      var str = Media.view.prototype.className.apply(this, arguments);
      str += ' media__component';
      return str;
    },

    events: function() {
      return _.extend({
        'click .js-mediawithbenefits-item': 'onItemClicked'
      }, Media.view.prototype.events);
    },

    onMediaElementPlay: function() {
      Media.view.prototype.onMediaElementPlay.apply(this, arguments);

      this.markItemAsPlayed();
    },

    onMediaElementEnded: function() {
      Media.view.prototype.onMediaElementEnded.apply(this, arguments);

      this.markItemAsWatched();
    },

    onPlayerReady: function() {
      Media.view.prototype.onPlayerReady.apply(this, arguments);

      this.selectItem(0);
    },

    checkCompletion:function() {
      if (this.model.get('_setCompletionOn') === 'allPlayed' && this.areAllItemsVisited()) {
        this.setCompletionStatus();
      } else if (this.model.get('_setCompletionOn') === 'allEnded' && this.areAllItemsWatched()) {
        this.setCompletionStatus();
      }
    },

    checkCompletionByTranscript:function() {
      if (this.model.get('_originalTranscript')._setCompletionOnView !== true) return;

      if (this.areAllItemsWatched()) {
        this.setCompletionStatus();
      }
    },

    areAllItemsVisited:function() {
      return this.model.get('_items').every(itemCfg => itemCfg._isPlayed);
    },

    areAllItemsWatched:function() {
      return this.model.get('_items').every(itemCfg => itemCfg._isWatched);
    },

    markItemAsWatched:function() {
      var itemCfg = this.model.get('_items')[this.selectedIndex];
      itemCfg._isWatched = true;

      this.checkCompletion();
    },

    markItemAsPlayed:function() {
      var itemCfg = this.model.get('_items')[this.selectedIndex];
      itemCfg._isPlayed = true;

      this.checkCompletion();
    },

    selectItem:function(index) {
      // get the selected item configuration
      var itemCfg = this.model.get('_items')[index];
      // get the selected element
      var $selectedItem = this.$('.js-mediawithbenefits-item').eq(index);

      // update classes
      this.$('.js-mediawithbenefits-item').removeClass('is-selected');
      $selectedItem.addClass('is-selected is-visited');

      this.selectedIndex = index;

      // TODO: add support for Youtube/Vimeo sources
      this.mediaElement.setSrc(itemCfg._media.mp4);
      this.mediaElement.load();

      // set up transcript
      if (itemCfg._transcript) {
        this.model.set('_transcript', _.extend({}, this.model.get('_originalTranscript'), itemCfg._transcript));
        this.$('.media__transcript-container').html(Handlebars.partials.transcript(this.model.toJSON()));
      } else {
        this.model.unset('_transcript');
        this.$('.media__transcript-container').empty();
      }

      // setup poster image

      $(this.mediaElement).attr('poster', itemCfg._media.poster);
      this.mediaElement.player.setPoster(itemCfg._media.poster);

      var selectedTrack = this.mediaElement.player.selectedTrack;
      var selectedLang = selectedTrack ? selectedTrack.srclang || 'none' : 'none';

      // restore last language selection if applicable
      this.mediaElement.player.options.startLanguage = selectedLang;

      $(this.mediaElement).find('track').remove();
      $(this.mediaElement).append(Handlebars.partials.mediaTracks(itemCfg._media.cc));
      this.mediaElement.player.rebuildtracks();
    },

    playSelection:function() {
      var $selectedItem = this.$('.js-mediawithbenefits-item').eq(this.selectedIndex);

      this.mediaElement.play();

      $selectedItem.addClass('is-visited');
    },

    onItemClicked:function(e) {
      var index = $(e.currentTarget).data('index');

      if (this.selectedIndex != index) {
        this.selectItem(index);
      }

      this.playSelection();
    },

    onToggleInlineTranscript: function(event) {
      this.markItemAsWatched();

      if (event) event.preventDefault();
      var $transcriptBodyContainer = this.$('.media__transcript-body-inline');
      var $button = this.$('.media__transcript-btn-inline');
      var $buttonText = this.$('.media__transcript-btn-inline .media__transcript-btn-text');

      if ($transcriptBodyContainer.hasClass('inline-transcript-open')) {
        $transcriptBodyContainer.stop(true,true).slideUp(function() {
          $(window).resize();
        }).removeClass('inline-transcript-open');
        $button.attr('aria-expanded', false);
        $buttonText.html(this.model.get('_transcript').inlineTranscriptButton);
      } else {
        $transcriptBodyContainer.stop(true,true).slideDown(function() {
          $(window).resize();
        }).addClass('inline-transcript-open');
        $button.attr('aria-expanded', true);
        $buttonText.html(this.model.get('_transcript').inlineTranscriptCloseButton);
        this.checkCompletionByTranscript();
      }
    },

    onExternalTranscriptClicked: function(event) {
      this.markItemAsWatched();
      this.checkCompletionByTranscript();
    },
  }, {
    template: 'mediawithbenefits'
  });

  return Adapt.register('mediawithbenefits', {
    model: MediaWithBenefitsModel,
    view: MediaWithBenefitsView
  });

});
