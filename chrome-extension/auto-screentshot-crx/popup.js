console.log('你好，我是csenjoy！');
if ($) {
    $('#mail_print').trigger('click')
}else if(jQuery){
    jQuery('#mail_print').trigger('click')
}
chrome.contextMenus.create({
    title: "测试右键菜单",
    onclick: function () { alert('您点击了右键菜单！'); }
});
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    // 只有打开百度才显示pageAction
                    new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: 'exmail.qq.com' } })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});