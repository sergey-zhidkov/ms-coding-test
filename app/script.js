'use strict';

(function() {
  $(document).ready(function() {
    // load json info
    var dataPromise = $.getJSON('data.json');
    dataPromise.done(function(data, status) {
      var $container = $('.container');
      var $videoContainer = createVideoOverlay(data);
      var $generalView = createGeneralView(data);

      $container.append($videoContainer);
      $container.append($generalView);

      addEvents($container);
    }).fail(function() {
      console.log(arguments);
    });
  });

  function createVideoOverlay(data) {
    var source = $('#video-container-template').html();
    var template = Handlebars.compile(source);
    var html = template(data);
    return html;
  }

  function createGeneralView(data) {
    var source = $('#general-view-template').html();
    var template = Handlebars.compile(source);
    var html = template(data);
    return html;
  }

  function addEvents($mainContainer) {

  }
})();
