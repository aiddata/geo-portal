<?php

$root_dir = dirname(__FILE__);

/* gets the data from a URL */
// http://davidwalsh.name/curl-download
function get_data($url) {
	$ch = curl_init();
	$timeout = 5;
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
	$data = curl_exec($ch);
	curl_close($ch);
	return $data;
}
		

switch ($_POST['call']) {

	// check cartodb link before loading layer
	case 'url':
		$url = $_POST['url'];

		$file = file_get_contents( $url , true );

		if ($file == NULL || $file == FALSE) {
			$file = get_data($url);
		}

		$json = json_decode($file);
		echo json_encode($json);
		break;

	// simple password check for json editor
	case 'pass':
		$pwd = "toolboxpass";
		$out = false;
		if ($_POST['pass'] == $pwd) {
			$out = true;
		}
		echo json_encode($out);
		break;
		
	// update json based on changes made in json editor
	case 'json':
		$json = $_POST["json"]; 

		if (version_compare(phpversion(), '5.4.0', '>=')) {
			$json = json_encode(json_decode($_POST["json"]), JSON_PRETTY_PRINT); 
		}

		$file = $root_dir."/usr/toolbox.json";
		file_put_contents($file, $json);
		echo $json;
		break;

	case 'tiles':

		// BUILD IMAGE FROM TILES
		// based on: http://trac.osgeo.org/openlayers/wiki/TileStitchingPrinting
		
		$random = md5(microtime().mt_rand());

		$TEMP_DIR = $root_dir .'/tmp';

		if (!file_exists($TEMP_DIR) && !is_dir($TEMP_DIR)) {
			$old_mask = umask(0);
			mkdir($TEMP_DIR, 0775, true);
		}

		$TEMP_URL = sprintf("tmp_%s", $random );

		$image_url = sprintf("%s/tmp_%s.jpg", $TEMP_DIR, $random );
		$report_url = sprintf("%s/tmp_%s.pdf", $TEMP_DIR, $random );

		$width = $_POST['width'];
		$height = $_POST['height'];
		$tiles = json_decode($_POST['tiles']);

		$image = imagecreatetruecolor($width, $height);

		imagefill($image, 0, 0, imagecolorallocate($image,0,0,0) );

		imagesavealpha($image, true);
		imagealphablending($image, true);

		foreach ($tiles as $layer) {
			foreach ($layer as $tile) {

				$tile_url = get_data($tile->url);
				// $tile_url = $tile->url;

				// list($tilewidth,$tileheight,$tileformat) = @getimagesize($tile_url);

			 //    if (!$tileformat) continue;

			 //    // load the tempfile's image, and blit it onto the canvas
			 //    switch ($tileformat) {
			 //        case IMAGETYPE_GIF:
			 //           $tileimage = imagecreatefromgif($tile_url);
			 //           break;
			 //        case IMAGETYPE_JPEG:
			 //           $tileimage = imagecreatefromjpeg($tile_url);
			 //           break;
			 //        case IMAGETYPE_PNG:
			 //           $tileimage = imagecreatefrompng($tile_url);
			 //           break;
			 //    }

				$tileimage = imagecreatefromstring($tile_url);

				imagecopy($image, $tileimage, $tile->x, $tile->y, 0, 0, 256, 256);

			}
		}

		imagejpeg($image, $TEMP_DIR.'/'.$TEMP_URL.'.jpg', 100);


		include 'report.php';


		// convert markdownextra to html
		require_once $root_dir . '/libs/php/Michelf/MarkdownExtra.inc.php';

		// use \Michelf\MarkdownExtra;
		// $parser = new MarkdownExtra();
		// $html = $parser->transform($raw);

		$html = \Michelf\MarkdownExtra::defaultTransform($raw);

		// file_put_contents($TEMP_DIR.'/'.$TEMP_URL.'.html', $html);

		// convert html to pdf
		include $root_dir . '/libs/php/mpdf/mpdf.php';
		$mpdf = new mPDF();
		$mpdf->WriteHTML($html);
		$mpdf->Output($TEMP_DIR.'/'.$TEMP_URL.'.pdf', "F");

		// delete temp jpg of map
		unlink($TEMP_DIR.'/'.$TEMP_URL.'.jpg');

		print $TEMP_URL.'.pdf';

		break;
}

?>
