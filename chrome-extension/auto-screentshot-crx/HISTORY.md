# updatelist auto-screentshot-crx
## 截止 2020.8.17完成内容 如下：
- 前提条件 插件支持url范围 https://exmail.qq.com/cgi-bin/*
- 1、按键触发 自动截图-下载 ✅ e键盘截图并下载 （并配置浏览器，下载不询问保存地址。注意设置下载保存默认路径） 
- 2、邮件自动翻页 按键触发 ✅ n键触发 （页面焦点不在邮件内容） 
- 3、邮件打印页跳转 按键触发  ✅ p键触发进入邮件打印页面 （页面焦点不在邮件内容） 
- 4、目前自动化以上流程 使用按键精灵录屏 ✅ p -> e -> n

## 2020.8.18
### 新增目标
- 1、下载文件名 月/公司 ✅
- 2、尝试在邮件页面截图 ✅
- 3、尝试插件自动执行 不使用按键精灵 block 自动递归无法触发二次截图下载
### 发现异常
- 1、企业邮件下一封无法支持列表跨页（即需回退再翻页再执行下载-下一封流程）
- 2、部分页面无法使用ep下载，但pp总是可行的 ✅

## 2020.8.19 
### 新增目标
- 1、pp下载支持自定义名字 ✅
- 已使用插件跑完 海南薪资32页数据 ✅
### 发现异常
- 1、blocked级别 企业邮箱，下一封会出现不可点击情况  自动下载
- 2、blocked级别 附件有jpg或png格式文件会无法支持ep自动下载

## 2020.8.20
### 新增目标
let next_btn = document.getElementById('mainFrame').contentWindow.document.getElementById('nextmail')
let _iframe_ = document.getElementById('mainFrame').contentWindow
- 解决8.19发现异常
- 1、blocked级别 企业邮箱，下一封会出现不可点击情况  自动下载
- 2、blocked级别 附件有jpg或png格式文件会无法支持ep自动下载
- 需完成功能
- 异常1解决所需
- 1、识别下一封失效 ✅
- 2、返回列表页 ✅
- 3、区分列表页&详情页（列表不截图）✅
- 4、记录当前下载内容 ✅
- 5、找到失效是下一封位置
    获取失效位置
    根据失效位置计算
    根下载记录对比 if == 
        if == 列表长度（本页末尾）：翻页-进入第一个
        else 寻找下一个进入
    else 进入当前
- 6、点击下一页 ✅ 
    document.getElementById('mainFrame').contentWindow.document.getElementById('nextpage').click()
- 7、点击进入邮件详情
 $("#mainFrame").contents().find(".showarrow").parent().parent().find('.l').click()
- 8、继续下载-循环
    一页末尾/偶发bug
- 异常2解决所需
- 1、识别附件含有图片格式文件（包括头像）
- 2、识别后使用pp下载