#!/bin/sh
cd "$(dirname "$0")"
PERM=${1:-0.85}
cat a_head.html m1_core.js m2_mach.js m3_sets.js m3b_rooms.js m4_data.js m5_app.js | sed "s/__PERM__/$PERM/" > index.html
# iceberg e foguista vão embutidos na página: não dependem de arquivos separados na hospedagem
python3 - <<'PY'
p='../index.html';s=open(p).read()
for f in ('iceberg','foguista'):
    tag='<script src="assets/models/%s.js"></script>'%f
    assert tag in s
    s=s.replace(tag,'<script>'+open('../assets/models/%s.js'%f).read()+'</script>')
open(p,'w').write(s)
PY
cat m1_core.js m2_mach.js m3_sets.js m3b_rooms.js m4_data.js m5_app.js | sed -e '/^<\/script>/,$d' -e "s/__PERM__/$PERM/" > /tmp/t_all.js && node --check /tmp/t_all.js && echo SYNTAX_OK && wc -c index.html
