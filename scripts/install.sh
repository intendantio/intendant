#!/bin/bash
clear
rm -rf index.js intendant.db intendant.js node_modules package.json package-lock.json;
echo " 
    _                            _                  
    | |       _                  | |             _   
    | |____ _| |_ _____ ____   __| |_____ ____ _| |_ 
    | |  _ (_   _) ___ |  _ \ / _  (____ |  _ (_   _)
    | | | | || |_| ____| | | ( (_| / ___ | | | || |_ 
    |_|_| |_| \__)_____)_| |_|\____\_____|_| |_| \__)
                                                
";
echo "  See more information on https://intendant.io";
echo "";
echo '> Download package.json';
curl -s https://raw.githubusercontent.com/intendantio/intendant/main/template/package.json > package.json;
echo "> Download index.js";
curl -s https://raw.githubusercontent.com/intendantio/intendant/main/template/index.js > index.js;
echo "> Download intendant.json";
curl -s https://raw.githubusercontent.com/intendantio/intendant/main/template/intendant.json > intendant.json;
echo "> Download intendant.db";
curl -s https://raw.githubusercontent.com/intendantio/intendant/main/template/intendant.db > intendant.db;
echo "> Installation dependencies";
npm install --silent &>/dev/null;
echo "> Installation successful";
echo "> Start with 'npm start'";
