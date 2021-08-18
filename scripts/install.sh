#!/bin/bash
echo "Intendant - install.sh";
echo "See more information on https://intendant.io";
echo "";
echo "> Download template.zip";
curl -s  https://raw.githubusercontent.com/intendantio/intendant/main/template/console-sql.zip > template.zip;
echo "> Unzip template.zip";
unzip -o -qq template.zip;
echo "> Remove template.zip";
rm template.zip;
echo "> Installation dependencies";
npm --silent install;
echo "> Installation successful";
echo "> Edit the install.json file to finish the final configurations";
echo "> Press enter to finish";
read varname