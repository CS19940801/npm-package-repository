// window.postMessage({ "test": '你好！' }, '*');
// mod ep//邮件页面 pp//打印页面
window.onload = function () {
    // window.postMessage({"zz":"你好"},'*')
    console.log('你好～我是自动截屏小助手-帅仔')

    let lianxu = false // 判断是否是组合键

    document.addEventListener('keydown', function (e) {
        let downKC = 00

        console.log(`document-down-keyCode`, e.keyCode);
        // 左trl键 = 17  e键 = 69
        if (e.keyCode === 17) {
            downKC = 1 << 0
        } else if (e.keyCode === 69) { // 点击e键触发截图-下载 - pp下载
            downKC = 1 << 1
            screenshot() 
        } else if (e.keyCode === 80) { // 点击p键触发打印

            getEl('mail_print').click();
        } else if (e.keyCode === 78) { // 点击n键触发下一页

            getEl('nextmail').click();
        } else if (e.keyCode === 85) { // 点击b 重置ep自动截图
            
            document.getElementById('mainFrame').onload = undefined
        } else if (e.keyCode === 66) { // 点击b 全自动ep截图
            
            autoScreenshot()
        } else if (e.keyCode === 68) { // 点击d 下载流程开始 - ep截图-下载 + 按键精灵录制版

            let _iframe = document.getElementById('mainFrame').contentWindow;

            screenshot(_iframe.document.querySelector('html'),function(){
                getEl('nextmail').click();
            })
        }
        // let screenshotFlag = localStorage.getItem('screenshotFlag') || 00
        // // 组合按键截图 左ctrl+e 待实验
        // if (screenshotFlag & downKC === 3) {
        //     screenshot()
        // }
        
        // localStorage.setItem('screenshotFlag', downKC)
    })
}
// screenshot循环
function ssLoop(ssNum) {
    let ssSum = 25 // 工作室12068 海南3610
  
    // console.log(`ssNum:${ssNum}，ssSum:${ssSum}`);
    // if (ssNum <= ssSum) {
    //     ssNum++
    //     // 记录循环次数
    //     localStorage.setItem('email-screenshot-num', ssNum)
        // 获取下一封按钮状态
        let nextDis = getEl('nextmail').getAttribute('disabled');
        // 判断下一封是否可点
        if (nextDis === null) { // 可点
            // 翻页
            getEl('nextmail').click();
        } else if (nextDis === '') { // 不可点
            // 返回列表页
            // getEl('goback').click();
        }
    // } else {
    //     localStorage.removeItem('email-screenshot-num') // 完成后清空记录
    //     alert('mission complete')
    // }
}

function autoScreenshot(){

    let ssNum = parseInt(localStorage.getItem('email-screenshot-num')) || 0
    let _iframe = document.getElementById('mainFrame').contentWindow;
    // let $iframe = $("#mainFrame").contents();
    // 初始化
    document.getElementById('mainFrame').onload = undefined
    // 绑定
    document.getElementById('mainFrame').onload = function () {
        // 判断是否是列表页 （判断是否有管理设置按钮）三个页面 列表-邮件ep-打印pp
        if (getEl('manage_personal_folder') === null){ // 非列表页截图并循环
            screenshot(_iframe.document.querySelector('html'), function () {
                if (window.location.href.includes('readmail')) {
                    window.close(function(){
                        getEl('nextmail').click();
                        ssLoop(ssNum);
                    })
                }else{
                    ssLoop(ssNum);
                }
            })
        }else { // 寻找开始位置
            // @todo
            // let preFile = localStorage.getItem('email-screenshot-filename')
            // let showFile = $iframe.find(".showarrow").parent().parent().find('.txt_hidden')[0].firstChild.textContent

            // if (preFile && !preFile.includes('undefined') && preFile.includes(showFile)) {
            //     localstorage.setItem('down',1)
            //     getEl('nextpage').click()
            // }else {
            //     $iframe.find(".showarrow").parent().parent()[0].lastChild.click()
            // }
            // $iframe.find(".showarrow").parent().parent().find('.l').click()
        }       
    }
    ssLoop(ssNum);
}
// 获取元素
function getEl(key){

    let _iframe = document.getElementById('mainFrame').contentWindow;
    let resDom;

    if (key === 'goback') { // 返回按钮
        let ReplacementBack = _iframe.document.getElementsByClassName('button_gray')[0]
        if (ReplacementBack.getAttribute('ck') === key) {
            resDom = ReplacementBack
        }else{

        }
    }else{
        resDom = _iframe.document.getElementById(key)
    }

    return resDom
}
// 打印触发
function printHandle(kc) {
    
    let jQ = $ || jQuery

    if (kc === 80) {
        jQ('#mail_print').trigger('click')
    }
}

// 设置下载文件名 @todo支持非邮件页截图
function setFileName(mode) {
    
    let type = 'jpg'
    let filename

    if (mode === 'ep') {
        try {
            let _iframe = document.getElementById('mainFrame').contentWindow;
            let emailname = _iframe.document.getElementById('subject').textContent
            let date = _iframe.document.getElementById('tbOtherOptions').getElementsByClassName('tcolor')[0].textContent
            filename = `${date}/${emailname}.${type}`
        } catch (error) {
            console.log('ep取名失败',error);
            filename = 'ep-udefine.jpg'
        }   
    } else if (mode === 'pp') {
        try {
            let emailname = document.getElementsByTagName('table')[0].textContent.split('发')[0]
            let date = document.getElementsByTagName('table')[0].textContent.split('发')[1].split('间：')[1].split('收')[0]
            filename = `${date}/${emailname}.${type}`
        } catch (error) {
            console.log('pp取名失败',error);
            filename = 'pp-udefine.jpg'
        }
    }

    return filename
}
// 截图&下载
function screenshot(dom,cb) {
    console.log(`---begin-print---`);
    let mode = dom ? 'ep' : 'pp'
    let htmlDom = dom || document.querySelector('html'); // ep || pp 截图
    console.log('dom',dom);
    console.log('cb',cb);
    try {
        html2canvas(htmlDom, {
            allowTaint: true,   // 允许污染
            taintTest: true,    // 在渲染前测试图片(没整明白有啥用)
            useCORS: true,      // 使用跨域(当allowTaint为true时这段代码没什么用,下面解释)
            background: "#fff",
            // logging:true,
            // proxy:'https://rescdn.qqmail.com'
        }).then(function (canvas) {
            let img = document.createElement("a");
            let filename = setFileName(mode)
            let log = `${new Date()}\n${filename}`

            img.href = canvas
                .toDataURL("image/jpeg")
                .replace("image/jpeg", "image/octet-stream");
            img.download = filename;

            console.log(log);
            localStorage.setItem('email-screenshot-log', log)

            img.click();
            console.log(`---html2canvas-complete---`);
            if (cb && 'function' === typeof cb) { // 邮件页面下载
                cb();
            } else { // 打印页面下载
                // setTimeout(function () {
                //     window.close()
                // }, 1000)
            }
            localStorage.setItem('email-screenshot-filename', filename)
        });
    } catch (error) {
        console.log('---catch-log---', error)
    }
    
}