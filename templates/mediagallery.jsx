import React from 'react';
import { classes, compile, templates } from 'core/js/reactHelpers';

const VIDEO_DIMENSIONS = {
  square: { width: 640, height: 640 },
  portrait: { width: 540, height: 960 },
  default: { width: 640, height: 360 }
};

function MediaPlayer(props) {
  const {
    _media,
    _aspectRatio,
    _playsinline,
    _useClosedCaptions
  } = props;

  if (_media?.mp3) {
    return (
      <>
        {_media.poster &&
          <img className='media_poster is-audio' src={_media.poster} alt='' />
        }
        <audio src={_media.mp3} type='audio/mp3' style={{ width: '100%', height: '100%' }} />
      </>
    );
  }

  if (_media?.ogg) {
    return <audio src={_media.ogg} type='audio/ogg' style={{ width: '100%', height: '100%' }} />;
  }

  const { width, height } = VIDEO_DIMENSIONS[_aspectRatio] || VIDEO_DIMENSIONS.default;

  return (
    <video
      aria-hidden='true'
      preload='none'
      width={width}
      height={height}
      playsInline={_playsinline || undefined}
      poster={_media?.type === 'video/vimeo' ? undefined : (_media?.poster || '')}
      style={{ width: '100%', height: '100%' }}
      controls
    >
      {_media?.source
        ? <source src={_media.source} type={_media.type} />
        : <>
          {_media?.mp4 && <source src={_media.mp4} type='video/mp4' />}
          {_media?.ogv && <source src={_media.ogv} type='video/ogg' />}
          {_media?.webm && <source src={_media.webm} type='video/webm' />}
        </>
      }
      {_useClosedCaptions && _media?.cc?.map((track, index) =>
        <track
          key={index}
          kind='subtitles'
          src={track.src}
          type='text/vtt'
          srcLang={track.srclang}
        />
      )}
    </video>
  );
}

// Never re-render: mediaelement takes over this DOM, and items swap the source in JS
const MemoMediaPlayer = React.memo(MediaPlayer, () => true);

function Transcript(props) {
  const {
    _transcript,
    _isInlineTranscriptOpen,
    onToggleInlineTranscript,
    onExternalTranscriptClicked
  } = props;

  return (
    <>
      {_transcript._inlineTranscript &&
        <button
          className='media__transcript-btn media__transcript-btn-inline js-media-inline-transcript-toggle'
          onClick={onToggleInlineTranscript}
          aria-expanded={!!_isInlineTranscriptOpen}
        >
          <span className='media__transcript-btn-text'>
            {_isInlineTranscriptOpen
              ? _transcript.inlineTranscriptCloseButton
              : _transcript.inlineTranscriptButton}
          </span>
        </button>
      }

      {_transcript._externalTranscript &&
        <button
          className='media__transcript-btn media__transcript-btn-external js-media-external-transcript-click'
          onClick={onExternalTranscriptClicked}
        >
          <span className='media__transcript-btn-text'>
            {_transcript.transcriptLinkButton || _transcript.transcriptLink}
          </span>
        </button>
      }

      {_transcript._inlineTranscript &&
        <div
          className={classes([
            'media__transcript-body-inline',
            _isInlineTranscriptOpen && 'inline-transcript-open'
          ])}
          role='region'
          aria-label={_transcript.inlineTranscriptButton || _transcript.transcriptLink}
        >
          <div
            className='media__transcript-body-inline-inner'
            dangerouslySetInnerHTML={{ __html: compile(_transcript.inlineTranscriptBody || '') }}
          />
        </div>
      }
    </>
  );
}

export default function MediaGallery(props) {
  const {
    _id,
    _items,
    _media,
    _aspectRatio,
    _playsinline,
    _useClosedCaptions,
    _transcript,
    _selectedIndex,
    onItemClicked
  } = props;

  return (
    <div className='component__inner media__inner'>

      <templates.header {...props} />

      <div className='component__widget media__widget'>

        <div className='mediagallery__item-container'>

          {_items.map(({ _graphic, title, subtitle, ariaLabel, _isVisited }, index) =>
            <button
              key={index}
              id={`${_id}-${index}-mediagallery-item`}
              className={classes([
                'mediagallery__item',
                'js-mediagallery-item',
                index === _selectedIndex && 'is-selected',
                _isVisited && 'is-visited'
              ])}
              data-index={index}
              aria-label={ariaLabel}
              onClick={onItemClicked}
            >

              {_graphic?.src &&
                <div className='mediagallery__item-image-container'>
                  <img className='mediagallery__item-image' src={_graphic.src} alt='' />
                </div>
              }

              {title &&
                <div className='mediagallery__item-title'>
                  <div
                    className='mediagallery__item-title-inner'
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                </div>
              }

              {subtitle &&
                <div className='mediagallery__item-subtitle'>
                  <div
                    className='mediagallery__item-subtitle-inner'
                    dangerouslySetInnerHTML={{ __html: subtitle }}
                  />
                </div>
              }

            </button>
          )}

        </div>

        <MemoMediaPlayer
          _media={_media}
          _aspectRatio={_aspectRatio}
          _playsinline={_playsinline}
          _useClosedCaptions={_useClosedCaptions}
        />

      </div>

      <div className='media__transcript-container'>
        {/* the transcript only shows once an item is selected; a new key resets it per item */}
        {_transcript && _selectedIndex !== undefined &&
          <Transcript key={_selectedIndex} {...props} />
        }
      </div>

    </div>
  );
}
