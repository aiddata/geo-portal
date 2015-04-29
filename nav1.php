
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" />
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css" />

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>



<style>
  body{
    padding-top: 50px;
  }

  #navbar_spacer{
    clear:both;
    height: 75px;
  }

  #navbar{
    /*border-bottom: 2px solid black;*/
  }

  #navbar_aiddata_logo{
    margin:0 10px;
    padding:0;
  }

  #navbar_aiddata_logo img{
    height: 50px;
  }

  #toolbox, #map {
    top: 50px;
  }
</style>

<!-- Add navbar_spacer div to html in file nav.php is being included with -->
<!-- <div id="navbar_spacer"></div> -->

<!-- Fixed navbar -->
<div id="navbar" class="navbar navbar-default navbar-fixed-top" role="navigation">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a id="navbar_aiddata_logo" class="navbar-brand" href="http://aiddata.org/"><img src="http://labs.aiddata.org/aiddata/imgs/ACDP logo transparent large.png"> </a>
    </div>
    <div class="navbar-collapse collapse">
      <ul class="nav navbar-nav">

        <li class="active"><a href=".">Nepal Info Portal</a></li>


        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">Help Map <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">

              <!-- <li class="dropdown-header">Get Data</li> -->
              <li><a href="http://www.tomnod.com/">Damage (Tomnod)</a></li>
              <li><a href=" http://kathmandulivinglabs.org/blog/earthquake-relief-in-nepal-how-can-maps-help/">Infrastructure (OSM)</a></li>

          </ul>
        </li>

        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">Contribute <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">

              <!-- <li class="dropdown-header">Internal</li> -->
              <li><a href="http://www.savethechildren.org/site/apps/nlnet/content2.aspx?c=8rKLIXMGIpI4E&b=9241341&ct=14620557&notoc=1">Save the Children</a></li>
              <li><a href="mailto:drunfola@aiddata.org">Send Us Data</a></li>

              <!-- <li class="divider"></li> -->


              <!-- <li class="dropdown-header">External</li> -->
              <!-- <li><a href="/aiddata/CCB/test">Center for Conservation Biology</a></li> -->

          </ul>
        </li>

        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">Get Data <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">

              <!-- <li class="dropdown-header">Media</li> -->
              <li><a href="http://www.opencitiesproject.org/cities/kathmandu/">Open Cities Project</a></li>
              <li><a href="http://aiddata.org/geocoded-datasets">AidData</a></li>
              <li><a href="http://wiki.openstreetmap.org/wiki/Downloading_data">OSM</a></li>
              <li><a href="https://docs.google.com/spreadsheets/d/1dajjXd1eVs8VMetD7qTLUjSSZ1-NvsEteSCVlKqIRm4/edit?usp=sharing">News Reports</a></li>
          <!--     <li class="divider"></li>

              <li class="dropdown-header">Research</li>
              <li><a href="#">Evaluating the Impact of Open Aid Data</a></li>
              <li class="divider"></li>

              <li class="dropdown-header">Outreach</li>
              <li><a href="#">New Data Collection Methods</a></li> -->

          </ul>
        </li>

        <li class=""><a href="https://google.org/personfinder/global/home.html">Google Person Finder</a></li>

   <!--      <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">Alerts <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">
              <li><a href="#">Current Alerts</a></li>
              <li><a href="#">Current Warnings</a></li>
              <li class="divider"></li>
              <li><a href="#">Previous Alerts</a></li>
              <li><a href="#">Previous Warnings</a></li>
              <li><a href="#">Overview of Previous Events</a></li>
              <li class="divider"></li>
              <li><a href="#">How Alerts are Generated</a></li>
              <li><a href="#">Get Raw Data</a></li>
          </ul>
        </li> -->

      </ul>
    <!--   <ul class="nav navbar-nav navbar-right">
        <li><a href="#">About</a></li>
        <li id="temp_reset"><a href="#">Contact</a></li>
      </ul> -->
    </div><!--/.nav-collapse -->
  </div>
</div> <!-- /#navbar -->

