
<style>
  body{
    /*padding-top: 50px;*/
  }

  #navbar_spacer{
    clear:both;
    height: 75px;
  }

  #navbar{
    /*border-bottom: 2px solid black;*/
    z-index: 10000

  }

  #navbar_aiddata_logo{
    margin:0 10px;
    padding:0;
  }

  #navbar_aiddata_logo img{
    height: 50px;
  }

  #toolbox, #map, #edit_page {
    top: 50px;
  }


  /* force collapsed navbar at desired width */
  @media (max-width: 990px) {
    .navbar-header {
      float: none;
    }
    .navbar-left,.navbar-right {
      float: none !important;
    }
    .navbar-toggle {
      display: block;
      /*float: right;*/
    }
    .navbar-collapse {
      border-top: 1px solid transparent;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
    }
    .navbar-fixed-top {
      top: 0;
      border-width: 0 0 1px;
    }
    .navbar-collapse.collapse {
      display: none!important;
    }
    .navbar-nav {
      float: none!important;
      margin-top: 7.5px;
    }
      .navbar-nav>li {
          float: none;
      }
        .navbar-nav>li>a {
          padding-top: 10px;
          padding-bottom: 10px;
        }
    .collapse.in{
      display:block !important;
    }
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
      <a id="navbar_aiddata_logo" class="navbar-brand" href="http://aiddata.org/"><img src="usr/imgs/aiddata_logo.png"> </a>
    </div>
    <div class="navbar-collapse collapse">
      <ul class="nav navbar-nav">

        <li class="active"><a id="title-link" href=".">Map Portal</a></li>


        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">Menu <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">

              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>

          </ul>
        </li>

        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">Menu <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">

              <li class="dropdown-header">Header</li>
              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>

              <li class="divider"></li>


              <li class="dropdown-header">Header</li>
              <li><a href="#">Link</a></li>

          </ul>
        </li>

        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">Menu <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">

              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
               <li class="divider"></li>

              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>

          </ul>
        </li>

        <li class=""><a href="#">Link</a></li>



      </ul>
      
    <!--   <ul class="nav navbar-nav navbar-right">
        <li><a href="#">About</a></li>
        <li id="temp_reset"><a href="#">Contact</a></li>
      </ul> -->

    </div><!--/.nav-collapse -->
  </div>
</div> <!-- /#navbar -->

