#!/bin/sh
cd /home/claude/titanic
PERM=${1:-0.85}
cat a_head.html m1_core.js m2_mach.js m3_sets.js m3b_rooms.js m4_data.js m5_app.js | sed "s/__PERM__/$PERM/" > index.html
cat m1_core.js m2_mach.js m3_sets.js m3b_rooms.js m4_data.js m5_app.js | sed -e '/^<\/script>/,$d' -e "s/__PERM__/$PERM/" > /tmp/t_all.js && node --check /tmp/t_all.js && echo SYNTAX_OK && wc -c index.html
