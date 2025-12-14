# open-docs
open-docs

https://aistudio.google.com/prompts/1LgDWpy-9_pbVB_HMrLoaRE85npqdcOwf

2025-12-13

# 使用 npx 直接运行 terser
# -c (compress): 启用代码压缩
# -m (mangle): 混淆变量名（把 longVariableName 变成 a）
npx terser script.js -o script.min.js -c -m


#
# 全局安装 javascript-obfuscator
npm install -g javascript-obfuscator


--------------------------
#用命令行压缩
npx terser ./js/index.js -o ./js/index.min.js -c -m

#混淆
javascript-obfuscator ./js/index.js -o ./js/index.min.js
用下面这个-ok
javascript-obfuscator ./js/index.js -o ./js/index.min.js --config obfuscator-config.json

npx clean-css-cli -o ./style/style.min.css ./style/style.css
--------------------------


javascript-obfuscator script.js --output script.min.js \
    --compact true \
    --control-flow-flattening true \
    --string-array true \
    --string-array-encoding 'base64' \
    --split-strings true




javascript-obfuscator ./js/index.js --output ./js/index.min.js --compact true --control-flow-flattening true --string-array true --string-array-encoding 'base64' --split-strings true


javascript-obfuscator ./js/index.js -o ./js/index.min.js --compact true
javascript-obfuscator ./js/index.js -o ./js/index.min.js --compact true --string-array true --string-array-encoding 'base64' --split-strings true
javascript-obfuscator ./js/index.js -o ./js/index.min.js --compact true --string-array true --string-array-encoding base64 --split-strings true