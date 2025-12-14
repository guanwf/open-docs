const fs = require('fs');

// 1. 输入：AST (通常来自前端 POST 请求)
const ast = {
    type: 'root',
    children: [
        { type: 'element', tagName: 'div', properties: { class: ['container'] }, children: [
            { type: 'text', value: 'Hello Static World' }
        ]}
    ]
};

// 2. 编译器：AST -> String
function compileToString(node) {
    if (node.type === 'root') {
        // 生成完整的 HTML 骨架
        return `
<!DOCTYPE html>
<html>
<head><title>Generated Page</title></head>
<body>
${node.children.map(compileToString).join('')}
</body>
</html>`;
    }

    if (node.type === 'text') return node.value;

    if (node.type === 'element') {
        // 处理属性
        let propsStr = '';
        if (node.properties) {
            // 处理 Class
            if (node.properties.class) {
                propsStr += ` class="${node.properties.class.join(' ')}"`;
            }
            // 处理 Style
            if (node.properties.style) {
                propsStr += ` style="${node.properties.style}"`;
            }
            // 处理 Events (注意：这里生成的是内联 JS 或者是 React 绑定)
            // 静态生成通常比较难处理复杂的函数引用，通常会生成 onclick="window.actions.submit()"
        }

        const childrenStr = node.children ? node.children.map(compileToString).join('') : '';
        
        return `<${node.tagName}${propsStr}>${childrenStr}</${node.tagName}>`;
    }
}

// 3. 执行生成
const htmlString = compileToString(ast);

// 4. 写入文件
fs.writeFileSync('./dist/index.html', htmlString);
console.log('页面构建完成，已生成 /dist/index.html');