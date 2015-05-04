<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title></title>
    <link rel="icon" type="image/png" href="">

    <link href="http://libs.cartocdn.com/cartodb.js/v3/themes/css/cartodb.css" rel="stylesheet" />
    <!--[if lte IE 8]><link rel="stylesheet" href="http://libs.cartocdn.com/cartodb.js/v3/themes/css/cartodb.ie.css" /><![endif]-->
    
    <link href="libs/font-awesome-4.3.0/css/font-awesome.css" rel="stylesheet" />

    <link href="libs/Leaflet.draw-master/dist/leaflet.draw.css" rel="stylesheet" />

    <!-- <link href="libs/leaflet.measure/leaflet.measure.css" rel="stylesheet" /> -->
    <link href="libs/leaflet-measure-master/dist/leaflet-measure.css" rel="stylesheet" />

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css" />

    <!-- <link href="index.css?nocache"      media="screen, projection, print" rel="stylesheet" type="text/css" /> -->
    <link href="maps-style.css?nocache" media="screen, projection" rel="stylesheet" type="text/css" />
    <!-- <link href="maps-print.css?nocache" media="print"              rel="stylesheet" type="text/css" /> -->

  </head>

  <body>

    <?php include("nav.php"); ?>  

    <div id="toolbox">
      <span id="toolbox_toggle" class="fa fa-chevron-left" title="toggle toolbox display"></span>      
      <div class="title">Layers</div>
      <div id="layers" class="body"></div>
    </div>

    
    <div id="map"></div>

    <div id="legend_tabs">
      <div id="legend_label"></div>
    </div>


    <div id="search-box">
      <div>
        LAT <input id="search_lat" type="text" />&#160; / &#160; LONG <input id="search_long" type="text" />
        (decimal degrees)       
      </div>
      <div>
        ADDRESS (street, county, park name, etc.) <input id="search_address" type="text" />
      </div>
      <div id="search-clear">
        Clear
      </div>
    </div>


    <script type="text/javascript">
    //   var _gaq = _gaq || [];
    //   _gaq.push(['_setAccount', 'UA-35437390-1']);
    //   _gaq.push(['_trackPageview']);
      
    //   (function() {
    //     var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    //     ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    //     var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    //   })();
    </script>


    <script src="libs/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>

    <!-- // <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script> -->
    <script src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
    <script src="http://libs.cartocdn.com/cartodb.js/v3/cartodb.js"></script>


    <script src="libs/underscoremin.js"></script>

    <script src="libs/URI.js"></script>
  
    <script src="libs/leaflet.spin.js"></script>
    <script src="libs/spin.min.js"></script>
    
    <!-- // <script src="libs/leaflet.measure/leaflet.measure.js"></script> -->
    <script src="libs/leaflet-measure-master/dist/leaflet-measure.min.js"></script>

    <script src="libs/Leaflet.draw-master/src/Leaflet.draw.js"></script>
    <script src="libs/Leaflet.draw-master/src/Toolbar.js"></script>
    <script src="libs/Leaflet.draw-master/src/Tooltip.js"></script>
    <script src="libs/Leaflet.draw-master/src/ext/GeometryUtil.js"></script>
    <script src="libs/Leaflet.draw-master/src/ext/LatLngUtil.js"></script>
    <script src="libs/Leaflet.draw-master/src/ext/LineUtil.Intersect.js"></script>
    <script src="libs/Leaflet.draw-master/src/ext/Polygon.Intersect.js"></script>
    <script src="libs/Leaflet.draw-master/src/ext/Polyline.Intersect.js"></script>
    <script src="libs/Leaflet.draw-master/src/draw/DrawToolbar.js"></script>
    <script src="libs/Leaflet.draw-master/src/draw/handler/Draw.Feature.js"></script>
    <script src="libs/Leaflet.draw-master/src/draw/handler/Draw.SimpleShape.js"></script>
    <script src="libs/Leaflet.draw-master/src/draw/handler/Draw.Polyline.js"></script>
    <script src="libs/Leaflet.draw-master/src/draw/handler/Draw.Circle.js"></script>
    <script src="libs/Leaflet.draw-master/src/draw/handler/Draw.Marker.js"></script>
    <script src="libs/Leaflet.draw-master/src/draw/handler/Draw.Polygon.js"></script>
    <script src="libs/Leaflet.draw-master/src/draw/handler/Draw.Rectangle.js"></script>
    <script src="libs/Leaflet.draw-master/src/edit/EditToolbar.js"></script>
    <script src="libs/Leaflet.draw-master/src/edit/handler/EditToolbar.Edit.js"></script>
    <script src="libs/Leaflet.draw-master/src/edit/handler/EditToolbar.Delete.js"></script>
    <script src="libs/Leaflet.draw-master/src/Control.Draw.js"></script>
    <script src="libs/Leaflet.draw-master/src/edit/handler/Edit.Poly.js"></script>
    <script src="libs/Leaflet.draw-master/src/edit/handler/Edit.SimpleShape.js"></script>
    <script src="libs/Leaflet.draw-master/src/edit/handler/Edit.Circle.js"></script>
    <script src="libs/Leaflet.draw-master/src/edit/handler/Edit.Rectangle.js"></script>
    <script src="libs/Leaflet.draw-master/src/edit/handler/Edit.Marker.js"></script>

    <script src="map_layers.js"></script>

  </body>
</html>
