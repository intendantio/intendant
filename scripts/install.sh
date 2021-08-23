#!/bin/bash
echo " 
 _                            _                  
| |       _                  | |             _   
| |____ _| |_ _____ ____   __| |_____ ____ _| |_ 
| |  _ (_   _) ___ |  _ \ / _  (____ |  _ (_   _)
| | | | || |_| ____| | | ( (_| / ___ | | | || |_ 
|_|_| |_| \__)_____)_| |_|\____\_____|_| |_| \__)
                                                 
";
echo "See more information on https://intendant.io";
echo "";
echo "> Download template.zip";
curl -s https://raw.githubusercontent.com/intendantio/intendant/main/template/console-sql.zip > template.zip;
echo "> Unzip template.zip";
unzip -o -qq template.zip;
echo "> Remove template.zip";
rm template.zip;
echo "> Installation dependencies";
npm --silent --quiet --no-progress  install;
echo "> Installation successful";
echo "> Edit the intendant.json file to finish the final configurations";
echo "> Press enter to finish";
read varname