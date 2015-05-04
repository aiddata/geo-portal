<!DOCTYPE html>
<html>
  <head>

    <meta charset="UTF-8">
    <title>Toolbox Editor - The Center for Conservation Biology</title>
    <link rel="icon" type="image/png" href="">

    <link href="libs/treema/treema.css?nocache"  rel="stylesheet" type="text/css" />

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css" />

    <!-- <link href="index.css?nocache" rel="stylesheet" type="text/css" /> -->
    <link href="edit.css?nocache"  rel="stylesheet" type="text/css" />

  </head>

  <body>

    <div id="background-container"></div>

    <?php include("nav.php"); ?>  

    <div id="edit_page">

      <div id="message"></div>

      <div id="editor">
        <div id="data"></div>
        <div id="submit"><button>Submit</button></div>
      </div>



      <!-- // <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> -->
      <script src="libs/jquery.min.js"></script>
      <script src="libs/jquery-ui.min.js"></script>

      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>


      <script src="libs/underscoremin.js"></script>
      <script src="libs/tv4.min.js"></script>
      <script src="libs/treema/treema.js"></script>

      <script src="edit.js"></script>

    </div>

  </body>
</html>
