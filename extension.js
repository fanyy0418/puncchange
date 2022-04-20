const vscode = require('vscode');

//抄的代码

//let count=0;//计数器
let lastChr = '';//最后一个字符收集器
let enter=0;//统计换行

let first,second//记录时间


function activate({ subscriptions }) {
    
    //插件已加载
    vscode.window.showInformationMessage(`转换插件已加载`);
    
    second=first=0;//初始化
    //vscode.window.showInformationMessage(`初始化:now${now};dis:${did};second:${second};first:${first}`);
    //上述函数可以弹出右下角通知弹窗

    //文本更改时触发
    vscode.workspace.onDidChangeTextDocument(event => {
        
        
        //now=new Date().getTime();//获取当前时间
        
        lastChr=event.contentChanges[0].text;//获取最后一个字符
        //vscode.window.showInformationMessage(`获取到最后一个字符${lastChr}`);

        if(lastChr==='、'){

            if(first===0){

                //**记录第一次输入的时间，并清空缓存区，防止重复刷新**//

                first=new Date().getTime();//获取第一次输入的时间
                lastChr='';//清空
                //vscode.window.showInformationMessage(`第一次输入已记录`);
                //vscode.window.showInformationMessage(`first:${first}`);

            }
            else if(second===0){

                //**记录第二次输入的时间，并清空缓存区，防止重复刷新**//

                second=new Date().getTime();//获取第二次输入的时间
                lastChr='';//清空
                //vscode.window.showInformationMessage(`第二次输入已记录`);
                //vscode.window.showInformationMessage(`second:${second}`);

                //**时间判断**//

                if((second-first)<=1000){//如果两次输入的时间小于1秒
                    correctPunc(event);//调用函数进行符号更改
                    lastChr ='';//清空
                    //vscode.window.showInformationMessage(`时间差:${second-first}`);
                    first=second=0;//时间清零
                    //vscode.window.showInformationMessage(`操作已完成，时间已清零`);

                    //**操作完成，清空缓存区，时间清零**//

                }else{  

                    //**操作超时，清空缓存区，时间清零**//

                    //vscode.window.showInformationMessage(`时间差:${second-first}`);
                    lastChr ='';//清空
                    first=second=0;//时间清零
                    //vscode.window.showInformationMessage(`操作超时，时间已清零`);
                }
            }
        }else{

            //**字符不匹配，清空缓存区，时间清零**//

            //vscode.window.showInformationMessage(`时间差:${second-first}`);
            lastChr='';//清空
            first=second=0;//时间清零
            //vscode.window.showInformationMessage(`字符不匹配`);

        }

        
    });
			
		
}

//更改函数
function correctPunc(event) {

    //如果已经存在注释，则不进行更改
    /*if(enter===1)
    {
        return;
    }*/

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
            //删除操作
            start = new vscode.Position(startLine, startCharacter - 1);
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
}
    

// 5: 插件被销毁时调用的方法, 比如可以清除一些缓存, 释放一些内存
function deactivate() {}

// 6: 忙活一大堆当然要导出
module.exports = {
    activate,
    deactivate
}
