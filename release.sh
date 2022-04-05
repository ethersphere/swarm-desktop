rm -rf dist/mas-arm64/
npm run dist
cp bee dist/mas-arm64/
chmod +x dist/mas-arm64/bee
cp icon.png dist/mas-arm64/
cp tray.png dist/mas-arm64/
cp tray@2x.png dist/mas-arm64/
cp -r static dist/mas-arm64/