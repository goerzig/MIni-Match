#!/usr/bin/bash

git --git-dir=/root/MIni-Match/.git fetch
git --git-dir=/root/MIni-Match/.git --work-tree=/root/MIni-Match merge origin/master

pm2 restart index
