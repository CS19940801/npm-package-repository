// T37();
// arrTrans("005008000000500000000000000104000306000060000500800000000406000000080002000200000");
function arrTrans(str) { // 一维数组转换为二维数组
    //数学界证明数独初始数小于17没有唯一解
    var regex = new RegExp('0', 'g');
    var result = str.match(regex);
    var count = !result ? 0 : result.length;
    if (count < 17) {
        return;
    }
    // const iconsArr = []; // 声明数组
    const iconsArr = []; // 声明数组
    const arr = str.split('');
    arr.forEach((item, index) => {
        const page = Math.floor(index / 9); // 计算该元素为第几个素组内
        if (!iconsArr[page]) { // 判断是否存在
            iconsArr[page] = [];
        }
        iconsArr[page].push(item);
    });
    // T37(iconsArr);
    // console.log(iconsArr);
    return iconsArr
}
function arrTransT37(str) { // 一维数组转换为二维数组
    //数学界证明数独初始数小于17没有唯一解
    var regex = new RegExp('0', 'g');
    var result = str.match(regex);
    var count = !result ? 0 : result.length;
    if (count < 17) {
        return;
    }
    // const iconsArr = []; // 声明数组
    const iconsArr = []; // 声明数组
    const arr = str.split('');
    arr.forEach((item, index) => {
        const page = Math.floor(index / 9); // 计算该元素为第几个素组内
        if (!iconsArr[page]) { // 判断是否存在
            iconsArr[page] = [];
        }
        iconsArr[page].push(item);
    });
    T37(iconsArr);
    // console.log(iconsArr);
    return iconsArr
}
function T37(chars) {
    var allChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    //是否包含0，是否有解，是否回溯
    var hasZero = true, hasAns = false, back = false, koBack = false;
    //记录回溯法其它格子填写的数字，用于回退还原
    var backInputChars = [];
    //记录回溯法起始格子填入的数字，用于自增填写与回退
    var backChars = [];
    while (hasZero) {
        hasZero = false; hasAns = false;
        topFor: for (var i = 0; i < 9; i++) {
            var row = chars[i];//行
            for (var j = 0; j < 9; j++) {
                //不是空格则跳过，否则记录有空格，用于后续判断是否解成功
                if (row[j] != '0') continue; else hasZero = true;
                //找出当前格子所在的行、列、块数字，如果总个数是8，则填入剩下的数
                var numSet = T37_getNumSet(chars, i, j);
                //数字是8个，则有唯一解
                if (Object.keys(numSet).length == 8) {
                    hasAns = true;
                    for (var key in allChars) {
                        var c = allChars[key];
                        if (!numSet[c]) {
                            row[j] = c;
                            //如果开启了回溯，则记录回溯时填写的数字
                            if (back) backInputChars.push('' + i + j + c);
                            break;
                        }
                    }
                } else {
                    //如果数字是9个，要么是无解，要么是回溯无解
                    if (Object.keys(numSet).length == 9) { koBack = true; break topFor; }
                    //尝试分析剩下数字是否可以放当前格子
                    for (var key in allChars) {
                        var c = allChars[key];
                        if (numSet[c]) continue;
                        //统计格子放c时，其他格子符号条件的数量
                        var okCount = T37_getOkCount(chars, i, j, c);
                        //有8个格子表示你可以放c，则可以放
                        if (okCount == 8) {
                            hasAns = true;
                            chars[i][j] = c;
                            //如果开启了回溯，则记录回溯时填写的数字
                            if (back) backInputChars.push("" + i + j + c);
                            break;
                        }
                    }
                }
            }
        }
        //包含0，但无解，意味着精确计算法得不到解，采用回溯法尝试填写
        if (hasZero && !hasAns || koBack == true) {
            //如果没有开启回溯，且无解，则直接结束程序
            if (!back && koBack) break;
            //如果之前没开始走回溯，则本次把回溯数据准备好
            if (!back) back = true;
            //如果有回溯填写的其它格子，则需要还原现场
            if (backInputChars.length > 0) {
                for (var key in backInputChars) {
                    var input = backInputChars[key];
                    chars[input.charCodeAt(0) - 48][input.charCodeAt(1) - 48] = '0';
                }
                backInputChars = [];
            }
            //如果回溯的第一个格子为空则取第一个空格开始回溯
            if (backChars.length == 0) {
                T37_setNextEmptyBackChar(chars, backChars);
            } else {
                //如果是回溯无解，则回溯值取下一个，否则取下一个空格回溯
                if (koBack) {
                    koBack = false;
                    //进位到第一位都没有回溯值可以取了，说明没有解，结束程序
                    if (!T37_setNextBackChar(chars, backChars)) return;
                } else {
                    //获取不到下一个空格，且进位到之前的空格也取不到下个回溯值，说明没有解，结束程序
                    if (!T37_setNextEmptyBackChar(chars, backChars)) return;
                }
            }
            //由于上面还原现场了，所以这里再次把回溯值全部填写上
            for (var key in backChars) {
                var input = backChars[key];
                chars[input.charCodeAt(0) - 48][input.charCodeAt(1) - 48] = input.charAt(2);
            }
        }
    }
    //打印数独
    var box = '';
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            box += chars[i][j];
            if ((j + 1) % 3 == 0) box += '';
        }
        // box += '\n';
        if ((i + 1) % 3 == 0) box += '';
    }
    // console.log(box);
}

/**设置下一个空格回溯，并返回是否成功*/
function T37_setNextEmptyBackChar(chars, backChars) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (chars[i][j] == '0') {
                backChars.push('' + i + j + '0');
                //设置下一个回溯值，如果当前回溯值已经最大，则也会回溯进位
                return T37_setNextBackChar(chars, backChars);
            }
        }
    }
    return false;
}

/**设置下一个回溯值，并返回是否成功*/
function T37_setNextBackChar(chars, backChars) {
    var allChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    //如果没有找到下一个回溯值，则需要回溯上一个格子取下一个回溯值，即回溯进位
    var hasNext = false;
    top: while (backChars.length > 0) {
        hasNext = false;
        var lastInput = backChars[backChars.length - 1];
        var lastKey = '' + lastInput.charAt(0) + lastInput.charAt(1);
        var lastChar = lastInput.charAt(2);
        //找出当前格子所在的行、列、块数字集合，因为回溯的尝试填写的值会和行、列、块的值重复，这需要去重
        var numSet = T37_getNumSet(chars, lastInput.charCodeAt(0) - 48, lastInput.charCodeAt(1) - 48);
        for (var key in allChars) {
            var c = allChars[key];
            //要求取下一个数字，不能和当前行、列、块重复，不能和原始状态数组的行、列、块数字重复
            if (c > lastChar && !numSet[c]) {
                hasNext = true;
                //更新最后一个回溯格子的输入值
                backChars[backChars.length - 1] = lastKey + c;
                break top;
            }
        }
        //找不到下一个回溯值
        if (!hasNext) {
            //获取上一个回溯值
            lastInput = backChars[backChars.length - 1];
            //还原现场
            chars[lastInput.charCodeAt(0) - 48][lastInput.charCodeAt(1) - 48] = '0';
            //删除当前回溯值
            backChars.pop();
            //如果回溯记录没有了，就表示无解
            if (backChars.length == 0) return false;
        }
    }
    return hasNext;
}

/**提取当前格子所在块的其余格子不能放数字c的个数，如果有8个说明当前格子就能放下c*/
function T37_getOkCount(chars, rowIndex, colIndex, c) {
    //方块序号对应的左上角坐标
    var boxStart = [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6], [6, 0], [6, 3], [6, 6]];
    var xy = boxStart[(rowIndex - rowIndex % 3) / 3 * 3 + (colIndex - colIndex % 3) / 3];
    var x = xy[0], y = xy[1], okCount = 0;
    for (var d = 0; d < 3; d++) {
        for (var e = 0; e < 3; e++) {
            //跳过不是空格的格子
            if (chars[x + d][y + e] != '0') { okCount++; continue; }
            //同一行，除去当前格子，只需列包含c
            if ((rowIndex == x + d) && (colIndex != y + e)) { for (var f = 0; f < 9; f++) { if (chars[f][y + e] == c) { okCount++; break; } } }
            //同一列，除去当前格子，只需行包含c
            else if (colIndex == y + e) { for (var f = 0; f < 9; f++) { if (chars[x + d][f] == c) { okCount++; break; } } }
            //非同一行同一列的四个格子
            else { for (var f = 0; f < 9; f++) { if (chars[x + d][f] == c || chars[f][y + e] == c) { okCount++; break; } } }
        }
    }
    return okCount;
}

/**找出当前格子所在的行、列、块数字集合*/
function T37_getNumSet(chars, rowIndex, colIndex) {
    //找出当前格子所在的行、列、块数字，如果总个数是8，则填入剩下的数
    var numSet = {};
    var k = 0;
    //把行数字全部提取
    while (k < 9) { numSet[chars[rowIndex][k]] = 1; k++; }
    delete numSet['0'];
    //如果行数字不是9个，把列数字提取
    if (Object.keys(numSet).length < 9) while (k > 0) { k--; numSet[chars[k][colIndex]] = 1; }//列
    delete numSet['0'];
    //如果行列数字不是9个，则把块数据提取
    if (Object.keys(numSet).length < 9) {
        //方块序号对应的左上角坐标
        var boxStart = [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6], [6, 0], [6, 3], [6, 6]];
        //方块左上角坐标
        var xy = boxStart[(rowIndex - rowIndex % 3) / 3 * 3 + (colIndex - colIndex % 3) / 3];
        var x = xy[0], y = xy[1];
        while (k < 3) { numSet[chars[x + 0][y + k]] = 1; k++; };//块第1行
        while (k > 0) { k--; numSet[chars[x + 1][y + k]] = 1; };//块第2行
        while (k < 3) { numSet[chars[x + 2][y + k]] = 1; k++; };//块第3行
    }
    delete numSet['0'];
    // console.log("numSet", numSet);
    return numSet;
}

module.exports = {
    arrTrans,
    arrTransT37
};