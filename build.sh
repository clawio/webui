mkdir -p dist
npm install
bower install
ember build --env production
cp LICENSE dist/
cd dist

tag_value="$(git -C "${git_repo}" describe --abbrev=0 --tags HEAD)"
tar -cvzf ../webui-${tag_value}.tar.gz . && cd ..
