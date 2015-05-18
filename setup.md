#Setup#


##Copying files to server##

access server directly or via FTP client (eg: FileZilla)
copy contents of main folder to the directory you want them to exist in on server


##Dependencies##
	
__Libraries__  
* Most libraries used by the CCB Mapping Portal (and editor) are stored locally in the “libs” directory
* Some libraries (CartoDB and Google Maps) use a CDN (content delivery network) to download the library when the page loads

__PHP__  
* PHP must be installed on your server
* The “gd” and "Curl" PHP modules must be installed on your server (details on how to install this below)


##Installing PHP package on to server##

* access terminal on server directly, via ssh or contact the server administrator to help you get access or do this for you
enter: “sudo apt-get install php5-gd”
enter: “sudo apt-get install php5-curl”
* restart webserver (for apache, enter: “sudo service apache2 restart”)

