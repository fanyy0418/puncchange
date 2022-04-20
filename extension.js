const vscode = require('vscode');

//抄的代码

let count=0;//计数器
let lastChr = '';//初始化最后一个字符收集器
let enter=0;

function activate({ subscriptions }) {
    //文本更改时触发
	
    vscode.workspace.onDidChangeTextDocument(event => {
        lastChr = event.contentChanges[0].text;//获取最后一个字符
		if(lastChr==='\r\n')
		{
			enter=0;
		}
		if(lastChr==='、'&&count===0&&enter===0)
		{
			count++;//计数器加1
		}
		else
		{
			
			correctPunc(event);//调用函数进行符号更改
			count=0;//计数器清零
			lastChr ='';//清空
			enter=1;//证明本行已存在注释
		}
        
            
        if(lastChr!='、')
        {
            lastChr='';//清空
			count=0;//计数器清零
			//enter=0;//enter清空
        }
        
    });
}

//更改函数
function correctPunc(event) {

    //如果已经存在注释，则不进行更改
    if(enter===1)
    {
        return;
    }

    //如果没有改变的内容
    if (!event.contentChanges.length)
    {
        return;
    }

    //lastChr = event.contentChanges[0].text;//获取最后一个字符
    const editor = vscode.window.activeTextEditor;//获取当前编辑器

    //如果没有编辑器
    if (!editor) 
    {
        return;
    }
    
    //修改操作
    editor.edit(editBuilder => {
        const contentChangeRange = event.contentChanges[0].range;//获取起始位置
        const startLine = contentChangeRange.start.line;//获取起始行
        const startCharacter = contentChangeRange.start.character;//获取起始列
        let start;//起始位置
        if (lastChr === '、') {//如果最后一个字符是、
                start = new vscode.Position(startLine, startCharacter - 1);
            }
            const end = new vscode.Position(startLine, startCharacter + 1);
            editBuilder.delete(new vscode.Range(start, end));//删除
        }, 
        {
            undoStopAfter: false,
            undoStopBefore: false,
        }
    ).then(() => {
            vscode.commands.executeCommand("type", { text: '//' });//插入//
        }
    );

    /*
	 *lastChr ='';//清空
     *count=0;//计数器清零
	 *enter=1;//enter清空
	*/
}
    



// 5: 插件被销毁时调用的方法, 比如可以清除一些缓存, 释放一些内存
function deactivate() {}

// 6: 忙活一大堆当然要导出
module.exports = {
    activate,
    deactivate
}
