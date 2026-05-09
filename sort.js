const fs = require('fs').promises;
const path = require('path');

// 定义包含 .md 文件的目录
const rewardDir = path.join(__dirname, 'reward');

/**
 * 解析并排序 Markdown 表格
 * @param {string} content - Markdown 文件内容
 * @returns {string} 排序后的 Markdown 内容
 */
function sortMarkdownTable(content) {
    // 查找表格头部
    const lines = content.split('\n');
    const headerLineIndex = lines.findIndex(line => line.includes('|---'));
    
    // 如果没有找到表格头部，返回原内容
    if (headerLineIndex === -1) return content;
    
    // 提取表格标题和表头
    const beforeTable = lines.slice(0, headerLineIndex - 1);
    const tableHeader = lines.slice(headerLineIndex - 1, headerLineIndex + 1);
    
    // 提取表格内容行
    const tableRows = lines.slice(headerLineIndex + 1).filter(line => line.trim().startsWith('|'));
    
    // 提取表格后的内容
    const afterTable = lines.slice(headerLineIndex + 1).filter(line => !line.trim().startsWith('|'));
    
    // 按用户名排序表格行
    const sortedRows = tableRows.sort((a, b) => {
        // 提取用户名并转为小写进行比较
        const usernameA = a.split('|')[1]?.trim().toLowerCase() || '';
        const usernameB = b.split('|')[1]?.trim().toLowerCase() || '';
        return usernameA.localeCompare(usernameB);
    });
    
    // 组合所有部分
    return [...beforeTable, ...tableHeader, ...sortedRows, ...afterTable].join('\n');
}

/**
 * 处理单个 Markdown 文件
 * @param {string} filePath - 文件路径
 */
async function processFile(filePath) {
    try {
        // 读取文件内容
        const data = await fs.readFile(filePath, 'utf8');
        
        // 排序表格内容
        const sortedContent = sortMarkdownTable(data);
        
        // 写入排序后的内容
        await fs.writeFile(filePath, sortedContent, 'utf8');
        console.log(`✅ 文件 ${path.basename(filePath)} 排序成功`);
    } catch (error) {
        console.error(`❌ 处理文件 ${path.basename(filePath)} 时出错:`, error);
    }
}

/**
 * 主函数 - 处理所有 Markdown 文件
 */
async function main() {
    try {
        // 读取目录中的所有文件
        const files = await fs.readdir(rewardDir);
        
        // 过滤出 .md 文件并处理
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        // 使用 Promise.all 并行处理所有文件
        await Promise.all(mdFiles.map(file => 
            processFile(path.join(rewardDir, file))
        ));
        
        console.log(`🎉 所有 ${mdFiles.length} 个文件处理完成`);
    } catch (error) {
        console.error('❌ 读取目录时出错:', error);
    }
}

// 执行主函数
main();