$(function() {


  // --------------------------------------------------  
  // browser check

  var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
  // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
  var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
  var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
  // At least Safari 3+: "[object HTMLElementConstructor]"
  var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
  var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6

  // --------------------------------------------------
  // var init
  
  var active_layers, afterPrint, beforePrint, close_toolbox, control, 
      do_open_hashtag, drawnItems, filter_list, group, hash_change, 
      init_map, layer_colors, layer_list, map, map_defaultzoommax, mediaQueryList, 
      open_hashtag, open_toolbox, refresh_layers, sql, toggle_filter, 
      toggle_layer, validate, zoom_limit;

  var temp_key, temp_title;

  var CARTO_USER, mc, mz;

  readJSON("toolbox.json", function (request, status, error){
    // var json = request
    if (error) {
      console.log(status);
      console.log(error);
      $('#toolbox .body').append("Error Reading Data");
      return 1;
    }

    // custom setup
    // move all this to a json file 
    // add title, icon, page header info (background image, link names/hrefs, etc.), report text, etc.

    $('#title-link').html(request.config.title);

    if (request.config.pagename) {
      document.title = request.config.pagename;
    } else { 
      document.title = request.config.title;
    }

    // body_css = {};

    // if (request.config.background_image) {
    //   body_css["background-image"] = "url('"+request.config.background_image+"')";
    // }

    // body_css["background-color"] = "rgb("+
    //       (request.config.background_color_red ? request.config.background_color_red : 100) +
    //       ","+ (request.config.background_color_blue ? request.config.background_color_blue : 100) +
    //       ","+ (request.config.background_color_green ? request.config.background_color_green : 100) +
    //       ")";
    

    // $(document.body).css(body_css);
    
    // if (request.config.logo && request.config.logo_link) {
    //   $('#identity').attr('href', request.config.logo_link);
    //   $('#identity img').attr('src', request.config.logo);
    // }

    // carto user account id
    CARTO_USER = request.config.user;
    sql = new cartodb.SQL({
      user: CARTO_USER
    });
    // map center [lat, lng]
    mc = [request.config.start_lat, request.config.start_lon];
    // map zoom level
    mz = request.config.start_zoom;

  })

  active_layers = {};
  layer_list = [];
  filter_list = [];
  group = {};
  hash_change = 1;
  layer_colors = {};
  map = void 0;
 
  validate = {};
  zoom_limit = {};

  // --------------------------------------------------
  // initialize map

  var baseMaps = {
    "Street Map (OSM)":           L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { 
                                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap contributors</a>'
                                  }),
    "Aerial Imagery (MapQuest)":  L.tileLayer('http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
                                    attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
                                    subdomains: '1234'
                                  }),
    "Street Map (MapQuest)":      L.tileLayer('http://oatile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
                                    attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
                                    subdomains: '1234'
                                  }),
    "Grayscale (Stamen)":         L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
                                    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                                  })
  };

  var overlayMaps = {};

  map = new L.map('map', {
    // measureControl: true, // measure distance tool
    center: mc,
    zoom: mz,
    layers: [baseMaps["Street Map (MapQuest)"]],
    attributionControl: false
  });
  
  map.options.minZoom = 3;
  map_defaultzoommax = 18;

  L.control.attribution({position: 'topright'}).addTo(map);

  L.control.scale().addTo(map);

  control = L.control.layers(baseMaps, overlayMaps);
  control.addTo(map);

  map.on('baselayerchange',function(e){
    map._layers[_.keys(map._layers)[0]].bringToBack();
  });

  // measure tool
  // this MUST be after the baselayerchange function above
  L.control.measure({
    position:'topleft',
    activeColor: '#FF0066',
    completedColor: '#FF0000'
  }).addTo(map);

  // handle map drawing tools
  drawnItems = L.featureGroup().addTo(map);

  var drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems
      }
  });

  map.addControl(drawControl);

  map.on('draw:created', function(event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);
  });

  // --------------------------------------------------
  // map buttons

  var mb_html = 
  mb_html += '<div id="map_buttons">';
  mb_html += '<div id="mb_tools" class="map_button">Toggle Draw Tools</div>';
  mb_html += '<div id="mb_link" class="map_button">Generate Link</div>';
  mb_html += '<div id="mb_print" class="map_button">Print Report</div>';
  mb_html += '<div id="search-link" class="map_button">Search</div>';
  mb_html += '</div>';
  $('#map').append(mb_html);


  $('#mb_link').on('click', function () {


    var url_search = {
                        layer: layer_list,
                        filters: filter_list,
                        zoom: map.getZoom(), 
                        lat: map.getCenter().lat, 
                        lng: map.getCenter().lng
                      }

    if ( $('.legend_tab_active').length == 1 ) {
      url_search.legend = $('.legend_tab_active').attr('id')
    }

    $(".active_layer").each(function() {
      var title = $(this).data('title')
      var sel = $(this).parent().find('.field_select')
      if ( sel.length == 1) {

        // add fields array to url_search if it does not exist
        if (_.keys(url_search).indexOf("fields") == -1) {
          url_search.fields = [];
        }

        url_search.fields.push(title +"_||_"+ sel.val());
        // console.log(title+" : "+sel.val())

      }
    });

    var keys = _.keys(baseMaps);
    for ( var i=0, ix=keys.length; i<ix; i++ ) {
      if ( map.hasLayer(baseMaps[ keys[i] ]) ) {
        url_search.base = keys[i];      
      }
    }

    var url_new = URI(document.URL).addSearch(url_search)
    hash_change = 0;
    window.location.hash = url_new.query()
    
  })

  $('#mb_print').on('click', function () {
    console.log("print")

    var build_report = confirm("Generating your report may take a minute. \n\nPlease be sure all visible map tiles have loaded before printing. \n\nContinue?");

    if (!build_report) {
      return;
    }
    map.spin(true);

    console.log("generating report")

    if ( $('#mb_report').length > 0 ) {
      $('#mb_report').remove();
    }

    // update link
    $('#mb_link').click();

    // generate tile data

    var offsetX = parseInt(map._container.offsetLeft);
    var offsetY = parseInt(map._container.offsetTop);
    var size  = map.getSize();

    // console.log('sizex: '+size.x+'  sizey: '+size.y+'  ox: '+offsetX+'  oy: '+offsetY)

    var tiles = [];

    var te = {
      x: {
        min:null,
        max:null
      }, 
      y: {
        min:null,
        max:null
      },
      diff: {
        x: null,
        y: null
      },
      min: {
        x: null,
        y: null
      }
    };

    // go through all layers, and collect a list of objects
    $('.leaflet-layer').each ( function () {

      var tile_layer = false; 
      var tmp_tiles = [];
      var t0 = 1;

      $(this).find('.leaflet-tile-container').each( function () {
        
        if ( $(this).children().length > 0 && tile_layer == false ) {
          
          tile_layer = true;

          $(this).find('img').each( function () {

            // var tileposraw = $(this)[0].style.transform.replace(/translate|\)|\(| |px/g,'').split(',');
            var tileposraw = [$(this).offset().left, $(this).offset().top];

            // get the number of tiles at least partially in view
            //  - used to determine size of canvas
            //  - only needs to be done for 1 layer
            // get x and y min values based on viewport
            //  - used to set "origin" tile to (0,0)
            if ( t0 == 1 && parseInt(tileposraw[0]) > offsetX-256 && parseInt(tileposraw[1]) > offsetY-256 && parseInt(tileposraw[0]) < offsetX+size.x+256 && parseInt(tileposraw[1]) < offsetY+size.y+256 ) {

              var ti = [null,null,null]
              ti[2] = $(this)[0].src.lastIndexOf('.');
              ti[1] = $(this)[0].src.lastIndexOf('/');

              ti[0] = $(this)[0].src.lastIndexOf('/', ti[1]-1);

              var tx = parseInt($(this)[0].src.substr( ti[0]+1, ti[1]-ti[0]-1 ));
              var ty = parseInt($(this)[0].src.substr( ti[1]+1, ti[2]-ti[1]-1 ));

              te.x.min = tx < te.x.min || te.x.min == null ? tx : te.x.min;
              te.x.max = tx > te.x.max || te.x.max == null ? tx : te.x.max;
              te.y.min = ty < te.y.min || te.y.min == null ? ty : te.y.min;
              te.y.max = ty > te.y.max || te.y.max == null ? ty : te.y.max;

              te.min.x = tileposraw[0] < te.min.x || te.min.x == null ? tileposraw[0] : te.min.x;
              te.min.y = tileposraw[1] < te.min.y || te.min.y == null ? tileposraw[1] : te.min.y;

            }

          })

          $(this).find('img').each( function () {

            // var tileposraw = $(this)[0].style.transform.replace(/translate|\)|\(| |px/g,'').split(',');
            var tileposraw = [$(this).offset().left, $(this).offset().top];

            if ( parseInt(tileposraw[0]) > offsetX-256 && parseInt(tileposraw[1]) > offsetY-256 && parseInt(tileposraw[0]) < offsetX+size.x+256 && parseInt(tileposraw[1]) < offsetY+size.y+256 ) {
              tmp_tiles.push({
                url: $(this)[0].src,
                x: parseInt(tileposraw[0]) - te.min.x,
                y: parseInt(tileposraw[1]) - te.min.y
              })
            }

          })

          if ( t0 == 1 ) {
            te.diff.x = te.x.max - te.x.min + 1;
            te.diff.y = te.y.max - te.y.min + 1
            t0 = 0;
          }

          tiles.push(tmp_tiles)
          // console.log(te)

        }
      })
    })
    // console.log( tiles )

    // hand off the list to our server-side script, which will do the heavy lifting
    var tiles_json = JSON.stringify(tiles);

    // get active legend html if a legend is active
    var legend_info = [];
    var active_legend_name = '';
    $('.cartodb-legend-stack').each(function () {
      if ( $(this).css('display') == 'block' ) {

        active_legend_name = $(this).data('layer');

        $(this).find('li').each( function () {

          var item_name = $(this)[0].innerHTML.substr( $(this)[0].innerHTML.lastIndexOf('</div>') + 6 );
          var item_color;

          $(this).find('div').each( function () {
            item_color = $(this)[0].style['background-color'];
          })

          legend_info.push([item_name, item_color]);
        })


      }
    });

    // var scale_info = [];
    // $('.leaflet-control-scale-line').each( function () {

    //   var scale = $(this).html().split(" ")[0];
    //   var unit = $(this).html().split(" ")[1];
    //   var size = $(this).css('width').replace("px","");

    //   scale_info.push( [unit, scale, size] );

    // })

    // var tileData = { call: "tiles", width: size.x, height: size.y, tiles: tiles_json };
    var tileData = { 
      call: "tiles", 
      width: te.diff.x * 256, 
      height: te.diff.y * 256, 
      tiles: tiles_json, 
      legend: legend_info,
      // scale: scale_info,
      active: active_legend_name,
      layers: layer_list,
      centerlat: map.getCenter().lat, 
      centerlng: map.getCenter().lng,
      link: document.URL
    };
    // console.log(tileData);  

    // pass tile data to php
    $.ajax ({
      url: "process.php",
      data: tileData,
      type: "post",
      async: true,
      success: function (result) {
        console.log("Tiles Done");
        console.log(result);
        var link = 'tmp/'+result;
        // give user report download link
        window.open(link);

        // $('#map_buttons').append('<div id="mb_report" class="map_button"><a href="'+link+'">Link to Report</a></div>');
        map.spin(false);

      },
      error: function (request, status, error) {
        console.log("Tiles Error");
        console.log(error);
        map.spin(false);

      }
    })
    
    map.spin(false);

  })

  $('#mb_tools').on('click', function () {

    $('.leaflet-draw').each( function () {
      $(this).toggle()
    })

    $('.leaflet-control-measure').each( function () {
      $(this).toggle()
    })

  })

  // --------------------------------------------------
  // hash change

  // check hashtag on page load or on change
  open_hashtag();
  $(window).on('hashchange', open_hashtag);

  // --------------------------------------------------
  // toolbox json validation / html builder

  validate.json = function(json) {
    for (var i=0, ix=json.categories.length; i<ix; i++) {
      var cat = json.categories[i];
      validate.cat(cat);
    }
  }

  validate.cat = function(cat) {
    // CATEGORY VALIDATION
    if ( cat == "" || cat.layers.length == 0 ) {
      return 1;
    }
    // CHECK FIRST LAYER
    var zlayer = cat.layers[0];
    if ( zlayer.title == "" || zlayer.group == "" || zlayer.type == "" || zlayer.key == "" ) {
      return 2;
    }

    validate.cat_html += '<div class="category">' + cat.title;
    for (var j=0, jx=cat.layers.length; j< jx; j++) {
      var layer = cat.layers[j];
      validate.layer(layer);
    }
    validate.cat_html += '</div>';
  }

  validate.layer = function(layer) {
    // LAYER SPECIFIC VALIDATION
    if (  layer.title == "" || layer.group == "" || layer.type == "" || layer.key == "" ) {
      return 1
    }

    validate.cat_html += '<div class="layer">';

    validate.cat_html += '<div class="layer_toggle"'
    validate.cat_html += 'data-hashtag="'+layer.hashtag+'"';
    validate.cat_html += 'data-key="'+layer.key+'"';
    validate.cat_html += 'data-group="'+layer.group+'"';
    validate.cat_html += 'data-type="'+layer.type+'"';
    validate.cat_html += 'data-title="'+layer.title+'"';
    validate.cat_html += 'data-sql="'+layer.sql+'"';

    if (layer.centerlon && layer.centerlat && layer.zoom) {
      validate.cat_html += 'data-centerlon="'+layer.centerlon+'"';
      validate.cat_html += 'data-centerlat="'+layer.centerlat+'"' ;
      validate.cat_html += 'data-zoom="'+layer.zoom+'"';
    }

    if (layer.maxzoom) {
      validate.cat_html += 'data-maxzoom="'+layer.maxzoom+'"';
    } else {
      validate.cat_html += 'data-maxzoom="'+map_defaultzoommax+'"';
    }

    validate.cat_html += '>' + layer.title + '</div>';

    // validate.cat_html += '<div class="layer_content">';


    if (layer.centerlon && layer.centerlat && layer.zoom) {
    
      validate.cat_html += '<div class="layer_extent">Zoom to Extents</div>';

    }

    validate.cat_html += (layer.description ? '<div class="layer_description">' + layer.description + '</div>' : '');
    validate.cat_html += (layer.link ? '<div class="layer_info"><a href="'+layer.link+'" target="_blank">More info</a></div>' : '');

    // validate.cat_html += '</div>';

    if (layer.fields && layer.fields.length > 0) {
      validate.fields(layer.fields);
    }

    if (layer.filters && layer.filters.length > 0) {
      for (var k=0, kx=layer.filters.length; k<kx; k++) {
        var filter = layer.filters[k];
        validate.filter(filter);
      }
    }

    validate.cat_html += '</div>';
  }

  validate.fields = function(fields) {
    
    validate.cat_html += '<select class="field_select">';

    for (var k=0, kx=fields.length; k<kx; k++) {
      var field = fields[k];

      if ( field != "" ) {
        validate.cat_html += '<option class="field_item" value="' + field + '">' + field +'</option>';
      }

    }

    validate.cat_html += '</select>';

  }

  validate.filter = function(filter) {

    if ( filter.sql == "" || filter.title == "" ) {
      return 1
    }

    // FILTER SPECIFIC VALIDATION HERE
    validate.cat_html += '<div class="filter_toggle" data-sql="'+filter.sql+'">' + filter.title +'</div>';
  }


  // build toolbox html
  readJSON("toolbox.json", function (request, status, error){
    // var json = request
    if (error) {
      console.log(status);
      console.log(error);
      $('#toolbox .body').append("Error Reading Data");
      return 1;
    }

    validate.cat_html = ''
    validate.json(request)

    $('#layers').append(validate.cat_html);
  })


  // --------------------------------------------------
  // search box

  // marker for search result (lat / long or address)
  var geocode_result;

  // manage search box display
  $("#search-box").hide();

  $("#search-link").on("click", function() {
    $("#search-box").toggle();
  });

  // update map for search address
  $("#search_address").on("change", function() {
    var geocoder, v;
    geocoder = new google.maps.Geocoder();
    v = $("#search_address").val();
    console.log("geocode " + v);
    geocoder.geocode({
      'address': v
    }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        console.log('got result');
        $("#search_lat").val(results[0].geometry.location.lat());
        $("#search_long").val(results[0].geometry.location.lng());
        console.log('sending result');
        geocode_result(results[0].geometry.location);
        console.log('done result');
      }
    });
  }); 

  // update map for lat / long search
  $("#search_lat").on("change", function() {
    $("#search_address").val("");
    geocode_result(new google.maps.LatLng($("#search_lat").val(), $("#search_long").val()));
  });
  $("#search_long").on("change", function() {
    $("#search_address").val("");
    geocode_result(new google.maps.LatLng($("#search_lat").val(), $("#search_long").val()));
  });

  // clear search box
  $("#search-clear").on("click", function() {
    $("#search_address").val("");
    $("#search_long").val("");
    $("#search_lat").val("");
    map.setView(mc, mz);
    if (window.marker !== void 0) {
      map.removeLayer(window.marker);
    }
    window.marker = void 0;
  });

  $("#search-clear").click();

  function geocode_result(position) {
    var position = _.values(position);

    if (window.marker === void 0) {

      window.marker = new L.marker(position, {draggable:'true'});

      window.marker.on('dragend', function(event){
        $("#search_lat").val(window.marker.getLatLng().lat);
        $("#search_long").val(window.marker.getLatLng().lng);
        $("#search_address").val("");
        
      });

      map.addLayer(window.marker);

    }

    window.marker.setLatLng(position);
    map.setView(position, 8);
  };

  // --------------------------------------------------
  // manage toolbox interactions


  // init toolbox
  $("#toolbox").each(function () {
    var pos, tb;
    tb = $(this);
    if (tb.data('layers') === 'active') {
      $(".layer_toggle").each(function () {
        toggle_layer($(this));
      });
    }
    if (tb.data('snap')) {
      $("#toolbox").css('position', 'absolute');
      pos = $("#map").position();
      $("#toolbox").css('left', pos.left + 10);
      $("#toolbox").css('top', pos.top + 10);
      $("#toolbox").css('height', $("#map").height() / 2);
      close_toolbox();
    }
  });


  // init layer signs
  $(".layer").each(function() {
    $(this).prepend("<div class='layer_sign'></div>");
  });

  // init filter signs
  $(".filter_toggle").each(function() {
    $(this).prepend("<div class='filter_sign'></div>");
  });

  // show / hide toolbox
  // $("#toolbox .title").click(function() {
  $('#toolbox_toggle').click(function(){

    var collapsed = $('#toolbox').data("collapsed");
    if (collapsed) {
      open_toolbox();
    } else {
      close_toolbox();
    }

  });

  // layer click
  $(".layer_toggle").click(function() {
    toggle_layer($(this));
    // if ( !$(this).hasClass("layer_animation") ){
    //   toggle_layer($(this));
    // } else {
      // toggle_animation($(this));
    //}
  });

  $(".field_select").on("change", function () {
    toggle_field($(this))
  })

  // sub layer filter click
  $(".filter_toggle").click(function () {
    var layer_name = $(this).parent().find('.layer_toggle').data('title');
    $(this).find(".filter_sign").toggleClass("active_filter_sign");
    if ( $(this).find(".filter_sign").hasClass("active_filter_sign") ) {
      // add to filter list
      filter_list.push(layer_name+"_||_"+$(this).data('sql'));
    } else {
      // remove from filter list
      var filter_index = filter_list.indexOf(layer_name+"_||_"+$(this).data('sql'));
      if (filter_index > -1) {
        filter_list.splice(filter_index, 1);
      }
    }
    toggle_filter($(this));
  });

  $('.layer_extent').click( function () {
    var new_lat = $(this).prev().data('centerlat'),
        new_lon = $(this).prev().data('centerlon'),
        new_zoom = $(this).prev().data('zoom');

    // console.log( new_lat, new_lon, new_zoom)
    if ( new_lat && new_lon && new_zoom ) {
      map.setView([new_lat, new_lon], new_zoom);
    }

  })


  $('#legend_tabs').on('click', '.legend_tab', function () {

    $('.cartodb-legend-stack').each(function (){
      $(this).hide();
    });

    $('#'+$(this).attr('id').replace('tab_', '')).show();

    var hide = false
    if ( $(this).hasClass("legend_tab_active") ) {
      hide = true;
      $('#'+$(this).attr('id').replace('tab_', '')).hide();
    }
      
    $('.legend_tab').each(function(){
      $(this).removeClass('legend_tab_active');
    });

    if (hide != true) {
      $(this).addClass('legend_tab_active');
    }
  })

  $('#map').on('DOMNodeInserted', function(e) {
      if ( $(e.target).is('.cartodb-legend-stack') && temp_key && $(e.target)[0].style.display != 'none') {
        // console.log($(e.target)[0].style.display)
        $(e.target)[0].id = 'legend_'+temp_key 
        
        $('#legend_'+temp_key ).data('layer', temp_title);
        
        $('#legend_tabs').append('<div id="legend_tab_'+ temp_key +'" class="legend_tab" title="'+ temp_title +'">'+ temp_title +'</div>')
        $('#legend_tab_'+ temp_key).click();

        $('#legend_label').html('Toggle Legends')

        // console.log(temp_title)
      }
  });

  // open toolbox up from minimized state
  function open_toolbox() {
    var pan = map.getCenter();

    $('#toolbox_toggle').removeClass('fa-chevron-right')
    $('#toolbox_toggle').addClass('fa-chevron-left')

    $("#toolbox").animate({
      left: 0
    });
    $("#map").animate({
      left: 230
    }, function () {
      map.invalidateSize();
      map.panTo(pan, {animate:true, duration:1.0});
    });
    $("#toolbox").data("collapsed", false);
  };

  // minimize toolbox to left of screen
  function close_toolbox() {
    var pan = map.getCenter();

    $('#toolbox_toggle').removeClass('fa-chevron-left')
    $('#toolbox_toggle').addClass('fa-chevron-right')

    $("#toolbox").animate({
      left: -200
    });
    $("#map").animate({
      left: 30
    }, function () {
      map.invalidateSize();
      map.panTo(pan, {animate:true, duration:1.0});
    });
    $("#toolbox").data("collapsed", true);
  };

 function updateJenksBins(column_name, how_many_bins, table_name, sublayer) {
    map.spin(true)

    sql.execute('select CDB_JenksBins(array_agg(' + column_name + '::numeric), ' + how_many_bins + ') from ' + table_name + ' where ' + column_name + ' is not null')
            .done(function (data) {
                // console.log(data.rows[0].cdb_jenksbins);

                var jbins = data.rows[0].cdb_jenksbins;

                // var css_old = sublayer.getCartoCSS()

                var css_new = '' +

                    '#'+table_name+'{ polygon-fill: #FFFFB2; polygon-opacity: 0.7; line-color: #000000; line-width: 0.5; line-opacity: 0.5; }' +
                    '#'+table_name+' [ '+column_name+' <= '+jbins[6]+'] { polygon-fill: #B10026; }' +
                    '#'+table_name+' [ '+column_name+' <= '+jbins[5]+'] { polygon-fill: #E31A1C; }' +
                    '#'+table_name+' [ '+column_name+' <= '+jbins[4]+'] { polygon-fill: #FC4E2A; }' +
                    '#'+table_name+' [ '+column_name+' <= '+jbins[3]+'] { polygon-fill: #FD8D3C; }' +
                    '#'+table_name+' [ '+column_name+' <= '+jbins[2]+'] { polygon-fill: #FEB24C; }' +
                    '#'+table_name+' [ '+column_name+' <= '+jbins[1]+'] { polygon-fill: #FED976; }' +
                    '#'+table_name+' [ '+column_name+' <= '+jbins[0]+'] { polygon-fill: #FFFFB2; }' +

                '';

                // update carto css
                sublayer.setCartoCSS(css_new);

                // update hover tooltip
                // sublayer.setInteractivity(‘cartodb_id, name, …’)

                // update legend
                //

                // add year to map or something
                //
                map.spin(false);


            })
            .error(function (errors) {
                // errors contains a list of errors
                console.log("error:" + errors);
                map.spin(false);
            })

  }

  function toggle_field(el) {

    var field, nbins, t, key, sublayer, tn;

    field = el.val();
    nbins = 7

    $(".cartodb-tooltip").hide();
    $(".cartodb-infowindow").hide();
    $(".cartodb-popup").remove();

    t = el.parent().find('.layer_toggle');
    key = $(t).data('key');
    sublayer = active_layers[key].getSubLayer(0);
    tn = sublayer.get('layer_name');

    updateJenksBins(field, nbins, tn, sublayer);

  }

  // filter layer using toolbox (sub list) as selector
  function toggle_filter(f) {

    var filter, key, sublayer, t, tn;

    $(".cartodb-tooltip").hide();
    $(".cartodb-infowindow").hide();
    $(".cartodb-popup").remove();

    t = f.parent().find('.layer_toggle');

    key = $(t).data('key');
    sublayer = active_layers[key].getSubLayer(0);
    tn = sublayer.get('layer_name');

    filter = ""
    
    var layer_name = t.data('title');
    var sub_filter_list = [];
    for (var i=0, ix=filter_list.length; i<ix; i++) {
      if (filter_list[i].substr(0, filter_list[i].indexOf("_||_")) == layer_name) {
        sub_filter_list.push(filter_list[i].substr(filter_list[i].indexOf("_||_")+4))
      }
    }
    var sql_string = "";
    if (sub_filter_list.length == 0) {
      sql_string = "SELECT * from " + tn;

      if (t.data('sql') && t.data('sql') != "") {
        sql_string += " WHERE " + t.data('sql')
      }

    } else {

      sql_string = "SELECT * from " + tn + " WHERE "

      if (t.data('sql') && t.data('sql') != "") {
        sql_string += "(" + t.data('sql') + ") AND "
      }

      for (var i=0, ix=sub_filter_list.length; i<ix; i++) {
        filter += ( i == 0 ? "" : " OR ");
        filter += sub_filter_list[i];
      }

      sql_string += "(" + filter + ")";
    }


    console.log(sql_string)
    sublayer.setSQL(sql_string);

  };

  function layer_slider(el, state) {

    // slide fields
    var sf = $('.layer_extent, .layer_description, .layer_info, .filter_toggle, .field_select');

    if (state == "up") {
        el.find(sf).slideUp();

    } else if (state == "down") {
        el.find(sf).slideDown();

    } else {
      console.log("invalid state option in layer_slider function");
    }

  }

  // toggle map layer using toolbox as selector
  function toggle_layer(t, force, callback) {

    var sublayer = ( t.data('type') == "sublayer" );
    var animation =  ( t.data('type') == "animation" );

    temp_key = t.data("key");
    temp_title = t.data("title");

    group.old = group.new;
    group.new = t.data('group');

    // force when layer is from hashtag link data  
    force = ( force == null ? false : force);

    // true when opening (from hash or toolbox), false when closing
    var needs_load = force || !t.hasClass("active_layer");

    if ( animation && needs_load) {
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      $(".leaflet-left").css("visibility", "hidden");
      $('.cartodb-legend-stack').remove();
      $('#map_buttons').hide();

    } else {
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      $(".leaflet-left").css("visibility", "visible");
      $('#map_buttons').show();

    }


    // remove layer legend and tab (when manually closing a layer)
    if ( $('#legend_'+t.data("key")).length > 0 ) {
      $('#legend_'+t.data("key")).remove();
      $('#legend_tab_'+t.data("key")).remove();

      // remove legend tabs label if no tabs exist
      if ( ! $('.legend_tab')[0] ) {
        $('#legend_label').empty()
      }
    }

    // $('.cartodb-legend-stack').each(function(){
    //   $(this).hide();
    // });
    

    // manage removing layer from current group
    if ( sublayer && t.hasClass("active_layer") ) {
      var undefined;
      var layer = active_layers[t.data("key")];
      if (layer != undefined) {
        layer.hide();
        layer.remove();
        delete active_layers[t.data("key")];
      }
      layer_list.splice( layer_list.indexOf(t.data('title')), 1 );
      t.removeClass("active_layer");
      t.parent().find(".layer_sign").removeClass("active_layer_sign");
      t.parent().find(".filter_sign").removeClass("active_filter_sign");

      // t.parent().find('.layer_content').slideUp();
      layer_slider(t.parent(), "up");

      // _gaq.push(['_trackEvent', 'Layers', 'Hide', $(this).data("key")]);
    }


    if ( !sublayer || group.new != group.old) {
      // clear filter list on group change
      filter_list = [];
      // manage previously active layer when switching layer groups
      $(".filter_sign").removeClass("active_filter_sign");

      $('#legend_label').empty();
      $('.legend_tab').each( function () {
        $(this).remove();
      });
      $('.cartodb-legend-stack').each(function(){
        $(this).hide();
      });

      zoom_limit = {};
      layer_list = [];
      $(".layer_sign").removeClass("active_layer_sign");
      $(".active_layer").each(function() {
        var undefined;
        var layer = active_layers[$(this).data("key")];
        if (layer != undefined) {
          layer.hide();
          layer.remove();
          delete active_layers[$(this).data("key")];
        }
        active_hashtag = undefined;
        $(this).removeClass("active_layer");

        // t.parent().find('.layer_content').slideUp();
        layer_slider($(this).parent(), "up");

        // _gaq.push(['_trackEvent', 'Layers', 'Hide', $(this).data("key")]);
      });

    }

    // general map cleanup
    $(".cartodb-tooltip").hide();
    $(".cartodb-infowindow").hide();
    $(".cartodb-popup").remove();
    $(".cartodb-timeslider").remove();

    var layerUrl = "http://"+CARTO_USER+".cartodb.com/api/v2/viz/" + t.data("key") + "/viz.json";

    // check link before loading
    validate.url = 0;
    $.ajax ({
      url: "process.php",
      data: {call: "url", url: layerUrl},
      dataType: "json",
      type: "post",
      async: false,
      success: function (result) {
        // console.log("done");
        // console.log(result);
        if ( result != null ) {
          validate.url = 1;
        } else {
          console.log("invalid url");    
        }

      },
      error: function (result) {
        console.log("error checking url");
        // console.log(result);
      }
    })
    
    zoom_limit[t.data("key")] = map_defaultzoommax;

    // manage loading a layer
    if (needs_load && validate.url) {

      zoom_limit[t.data("key")] = t.data("maxzoom");

      t.parent().find(".layer_sign").addClass("active_layer_sign");

      layer_list.push( $(t).data('title') );

      // update page title for new layer
      // window.document.title = ( $(t).data('group') != "layer" ? $(t).data('group') : t.html() );
      window.document.title = $(t).data('group') ;

      map.spin(true);

      // create layer
      var newLayer = cartodb.createLayer(map, layerUrl);

      newLayer.on("done", function (layer) {
        active_layers[t.data("key")] = layer;
        addCursorInteraction(layer);

        if ( $(t).data('hashtag') ) {
          active_hashtag = $(t).data('hashtag');
        }

        map.spin(false);

        // if layer has fields, set cartocss using current field
        t.parent().find(".field_select").change();


        // callback is for managing filters from hashtag links only 
        if (callback) {
          callback();
        }
      });

      newLayer.addTo(map);
      map._layers[_.keys(map._layers)[0]].bringToBack();

      // update toolbox for new layer
      t.addClass("active_layer");

      // t.parent().find('.layer_content').slideDown();
      layer_slider(t.parent(), "down");


      // _gaq.push(['_trackEvent', 'Layers', 'Show', t.data("key")]);

    }

    map.options.maxZoom = Math.min.apply(Math, _.values(zoom_limit));
    map.setZoom(map.getZoom());

  };

  function addCursorInteraction(layer) {
    var hovers = [];

    layer.bind('featureOver', function (e, latlon, pxPos, data, layer) {
      hovers[layer] = 1;
      if(_.any(hovers)) {
        $('#map').css('cursor', 'pointer');
      }
    });

    layer.bind('featureOut', function (m, layer) {
      hovers[layer] = 0;
      if(!_.any(hovers)) {
        $('#map').css('cursor', 'auto');
      }
    });
  }

  // refresh map by searching toolbox for loaded layer
  function refresh_layers() {
    $(".layer_toggle").each(function() {
      var layer, t;
      t = $(this);
      if (t.data("loaded")) {
        layer = active_layers[t.data("key")];
        layer.invalidate();
      }
    });
  };

  // --------------------------------------------------
  // manage hashtag data links

  function do_open_hashtag() {

    var url = document.URL.replace("#", "?"),
        url_query = URI(url).query(true),
        h;

    if (url_query.base) {
      // console.log(url_query.base)
      // console.log(baseMaps)
      var keys = _.keys(baseMaps);
      for ( var i=0, ix=keys.length; i<ix; i++ ) {
        if ( map.hasLayer(baseMaps[ keys[i] ]) ) {
          map.removeLayer( baseMaps[ keys[i] ] );      
        }
      }
      map.addLayer( baseMaps[url_query.base] )
    }

    if (url_query.layer){
      h = url_query.layer;
    } else {
      // old hash filter
      h = window.location.hash.substring(1);
    }

    h = [].concat(h)

    if (url_query.zoom && url_query.lat && url_query.lng) {
      map.setView([url_query.lat, url_query.lng], url_query.zoom);
    }
    
    $(".layer_toggle").each(function(index) {
      
      if ( h.indexOf( $(this).data('hashtag') ) > -1 || h.indexOf( $(this).data('title') ) > -1 ) {
      
        // autozoom to extents for hashtag layers (when extent data is available - single layer links only. ie: old hashtag link)
        if ( h.length == 1 && h.indexOf( $(this).data('hashtag') ) > -1 && $(this).data('centerlon') && $(this).data('centerlat') && $(this).data('zoom') ) {
          map.setView([$(this).data('centerlat'), $(this).data('centerlon')], $(this).data('zoom'));

        } // else if (url_query.zoom && url_query.lat && url_query.lng) {
        //   map.setView([url_query.lat, url_query.lng], url_query.zoom);
        // }


        // manage layers, filters, sublayers
        var $layer = $(this);

        setTimeout( function() {
          toggle_layer($layer, true, function(){
            
            if ( active_layers[$layer.data("key")] && url_query.filters && url_query.filters.length > 0 ) {

              var layer_name =  $layer.parent().find('.layer_toggle').data('title');

              $layer.parent().find('.filter_toggle').each(function () {
                if ( url_query.filters.indexOf( layer_name+"_||_"+$(this).data('sql') ) > -1 ) {
                  $(this).click();
                }
              });
            }


            if ( active_layers[$layer.data("key")] && url_query.fields && url_query.fields.length > 0 ) {

              url_query.fields = [].concat(url_query.fields)
              var layer_name =  $layer.parent().find('.layer_toggle').data('title');

              for (var i=0, ix=url_query.fields.length; i<ix; i++) {
                console.log(url_query.fields[i])
                var tmp_name = url_query.fields[i].substr(0, url_query.fields[i].indexOf("_||_"));
                var tmp_val = url_query.fields[i].substr(url_query.fields[i].indexOf("_||_") + 4);
                console.log(tmp_name)
                console.log(tmp_val)
                if (layer_name == tmp_name) {
                  $layer.parent().find('.field_select').val(tmp_val);
                  $layer.parent().find('.field_select').change();
                }
              }

              // $layer.parent().find('.filter_toggle').each(function () {
              //   if ( url_query.filters.indexOf( layer_name+"_||_"+$(this).data('sql') ) > -1 ) {
              //     $(this).click();
              //   }
              // });
            }
          });

          if (url_query.legend) {
            setTimeout(function () {
              $('.legend_tab').each(function () {
                if ($(this).attr('id') == url_query.legend && $(this).hasClass('legend_tab_active') == false) {
                  $(this).click()
                }
              })
            }, 250); // bad fix for updating active legend from link. this is probably going to break
          }

        }, 250*index) // bad fix for overlap issue when generating legend tabs from link. this is probably going to break


      }

    });

  };

  // function link_legend(leg_id) {
  //   console.log("call leg")
  //   // add active legend if exists
  //   if ($('#'+leg_id).length == 1) {
  //     // console.log(leg_id)

  //     $('.legend_tab').each(function () {
  //       console.log($(this).attr('id'))
  //       $(this).removeClass("legend_tab_active");
  //     })
  //     // $('#'+leg_id).click()
  //     $('#'+leg_id).addClass("legend_tab_active");
  //   }
  // }

  // check hashtag (called on page load or on hashtag change)
  function open_hashtag() {
    // check for hash_change variable to avoid reloads when hash change was generate by page
    if (window.location.hash !== '' && hash_change == 1) {
      setTimeout(do_open_hashtag, 200);
    }
    hash_change = 1;
  };

  // --------------------------------------------------
  // general functions  

  function readJSON(file, callback) {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: file,
      async: false,
      success: function (request) {
        callback(request, "good", 0);
      },    
      error: function (request, status, error) {
        callback(request, status, error);
      }
    }) 
  };

  // --------------------------------------------------

})
