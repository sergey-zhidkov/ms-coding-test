'use strict';

(function() {
  $(document).ready(function() {
    // load json data
    var dataPromise = $.getJSON('data.json');
    dataPromise.done(function(data) {
      var $container = $('.container');
      var $videoContainer = createVideoOverlay(data);
      var $generalContainer = createGeneralView(data);
      var $termsContainer = createTermsOverlay(data);

      $container.append($videoContainer);
      $container.append($generalContainer);
      $container.append($termsContainer);

      addEvents($container);
    }).fail(function() {
      console.log(arguments);
    });
  });

  function createViewFromTemplate(selector, data) {
    var source = $(selector).html();
    var template = Handlebars.compile(source);
    var html = template(data);
    return html;
  }

  function createVideoOverlay(data) {
    return createViewFromTemplate('#video-container-template', data);
  }

  function createGeneralView(data) {
    return createViewFromTemplate('#general-view-template', data);
  }

  function createTermsOverlay(data) {
    return createViewFromTemplate('#terms-template', data);
  }

  function addEvents($mainContainer) {
    var $videoContainer = $mainContainer.find('.video-container');
    var $generalContainer = $mainContainer.find('.general-view-container');
    var $termsContainer = $mainContainer.find('.terms-container');

    var $video = $videoContainer.find('video');
    var video = $video[0];
    var audio = $generalContainer.find('audio')[0];

    $video.on('play', function() {
      $videoContainer.show();
    });

    $video.on('ended', function() {
      $videoContainer.find('.skip-video').click();
    });

    $videoContainer.find('.skip-video').on('click', function() {
      video.pause();
      exitFullScreen();
      $videoContainer.hide();
      $generalContainer.show();
      audio.currentTime = 0;
      //audio.play();
    });

    function isInFullScreen() {
      return !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement);
    }

    function isFullScreenAvailable() {
      return !!(
          document.fullscreenEnabled ||
          document.webkitFullscreenEnabled ||
          document.mozFullScreenEnabled ||
          document.msFullscreenEnabled);
    }

    function exitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
      else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }

    function enterFullScreen() {
      var videoContainer = $videoContainer[0];
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
      } else if (videoContainer.mozRequestFullScreen) {
        videoContainer.mozRequestFullScreen();
      } else if (videoContainer.webkitRequestFullScreen) {
        videoContainer.webkitRequestFullScreen();
      }
    }

    $videoContainer.find('.fullscreen-video').on('click', function() {
      if (!isFullScreenAvailable()) {
        return;
      }
      if (isInFullScreen()) {
        exitFullScreen();
      } else {
        enterFullScreen();
      }
    });

    $videoContainer.on('fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange', function() {
      if (isInFullScreen()) {
        $videoContainer.find('.fullscreen-video').html('Exit Fullscreen');
      } else {
        $videoContainer.find('.fullscreen-video').html('Fullscreen Video');
      }
    });

    $generalContainer.find('.replay-video').on('click', function() {
      audio.pause();
      $generalContainer.hide();
      $videoContainer.show();
      video.currentTime = 0;
      video.play();
    });

    $generalContainer.find('.terms').on('click', showTermsOverlay);
    $termsContainer.find('.close-terms').on('click', function() {
      $termsContainer.hide();
    });

    function showTermsOverlay() {
      $termsContainer.show();
    }
  }
})();
