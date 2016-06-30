ember build --env production
cp LICENSE dist/
cd dist
tar -cvzf ../webui-0.1.0.tar.gz . && cd ..
