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
echo "> Download package.json";
curl -s https://raw.githubusercontent.com/intendantio/intendant/main/template/package.json > package.json;
echo "> Download index.js";
curl -s https://raw.githubusercontent.com/intendantio/intendant/main/template/index.js > index.js;
echo "> Download intendant.json";
curl -s https://raw.githubusercontent.com/intendantio/intendant/main/template/intendant.json > intendant.json;
echo "> Download intendant.sql";
curl -s https://raw.githubusercontent.com/intendantio/intendant/main/template/intendant.sql > intendant.sql;
echo "> Installation dependencies";
npm --silent --quiet --no-progress --loglevel silent --no-summary --no-tree install ;
echo "> Installation successful";
echo "> Edit the intendant.json file to finish the final configurations";