#!/bin/bash

# open curr crontab into a new temp file that we will update and write back
crontab -l > crontab_tmp

path=$(pwd)
echo "*/15 * * * * (cd $path; npm start)" >> crontab_tmp 
crontab crontab_tmp
rm crontab_tmp

