
<style>

  body {
    height: 100%;
    width: 100%;
    background-image: url('http://www.ccbbirds.org/wp-content/uploads/2013/01/bird-migration-background.jpg');
    background-position: center top;
    background-repeat: no-repeat;
    margin: 0px;
    border: 0px;
    font-family: MuseoSans_500, Tahoma, Helvetica, Arial, sans-serif;
  }
  img {
    border: none;
  }
  @font-face{

    font-weight:normal;
    font-style:normal;
  }
  #web-header {
    position: relative;
    display: block;
    width: 960px;
    height: 130px;
    margin-top: 0px;
    margin-left: auto;
    margin-right: auto;
  }
  #identity {
    position: absolute;
    left: 0px;
    top: 0px;
  }
    #identity img {
      max-height: 130px;
    }
  #pseudo-nav {
    position: absolute;
    right: 150px;
    top: 20px;
    }
    #pseudo-nav li {
      display: inline-block;
      font-family: MuseoSans_500, Tahoma, Helvetica, Arial, sans-serif;
      font-size: 15px;
      font-weight: normal;
    }
    #pseudo-nav li a {
      color: white;
      text-decoration: none;
      padding: 11px;
      padding-top: 15px;
      padding-bottom: 15px;
      background: black;
      border-right: 1px solid white;
      margin: 0px;
    }
    #pseudo-nav .highlight {
      border-right: none;
      color: rgb(116, 201, 194);
    }

  #page-help {
    position: absolute;
    right: 75px;
    top: 60px; 
  }

  #page-title {
    color: white;
    font-family: MuseoSans_500, Tahoma, Helvetica, Arial, sans-serif;
    font-size: 32px;
    font-weight: normal;
    text-transform: uppercase;
    position: absolute;
    left: 305px;
    top: 60px;
  }
    #title-link, #title-link:hover, #title-link:active {
      text-decoration: none;
      color:white;
    }
    .hf {
      display: block;
      float: left;
      text-decoration: none;
      margin-top: 4px;
      font-size: 16px;
      font-weight: bold;
      padding: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
      color: #000;
      background: #FFFF00;
      border-radius: 20px;
      margin-right: 130px;
    }

  #toolbox, #map, #edit_page {
    top: 130px;
  }

</style>


<!-- Add navbar_spacer div to html in file nav.php is being included with -->
<!-- <div id="navbar_spacer"></div> -->


<div id="web-header">
  <a href="" id="identity">
    <img alt="Home" src="http://www.ccbbirds.org/wp-content/uploads/2012/09/ccb-logo-vertical-shadow.png" />
  </a>
  
  <ul id="pseudo-nav">
    <li>
      <a href="http://www.ccbbirds.org/about-us">About Us</a>
    </li>
    <li>
      <a href="http://www.ccbbirds.org/what-we-do">What We Do</a>
    </li>
    <li>
      <a href="http://www.ccbbirds.org/resources">Resources</a>
    </li>
    <li>
      <a href="http://www.ccbbirds.org/news-room">News Room</a>
    </li>
    <li>
      <a class="highlight" href="http://www.ccbbirds.org/give-to-ccb">Give to CCB</a>
    </li>
  </ul>

  <div id="page-help">
    <a class="hf" href="http://www.ccbbirds.org/resources/mapping-portal-information-and-faq/" target="_blank">
      Help / FAQ 
    </a>
  </div>

  <div id="page-title"><a id="title-link" href="."></a></div>

</div>