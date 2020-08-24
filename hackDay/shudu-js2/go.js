const axios = require('axios');
const solveSudoku = require('./shudu-wei')
function arrTrans(str) { // 一维数组转换为二维数组
    //数学界证明数独初始数小于17没有唯一解
    var regex = new RegExp('0', 'g');
    var result = str.match(regex);
    var count = !result ? 0 : result.length;
    if (count < 17) {
        return;
    }
    const iconsArr = []; // 声明数组
    const arr = str.split('');
    arr.forEach((item, index) => {
        const page = Math.floor(index / 9); // 计算该元素为第几个素组内
        if (!iconsArr[page]) { // 判断是否存在
            iconsArr[page] = [];
        }
        iconsArr[page].push(item);
    });

    return iconsArr
}
// 做题
function getQ() {
    // axios.get('http://hack-shebao-net.hackproject/api/getQuestions?group=JS2&quantity=100').then(Response => {
    let time = new Date().getTime()
    axios.get('http://hack-shebao-net.hackproject/api/getQuestions?group=JS2&quantity=100').then(Response => {
        let res = Response.data
        let submit = Object.assign({
            recordId: res.recordId,
            "questionDOS": []
        },res)
        submit.questionDOList.forEach(val => {
            submit.questionDOS.push({ questionId: val.questionId, answer: solveSudoku(arrTrans(val.question)) })
        });
        let endtime = new Date().getTime() - time
        if (endtime < 262){
            axios.post(`http://hack-shebao-net.hackproject/api/answerRecord/submit`, submit)
        }else{
            getQ()
        }
    })
}
getQ()

