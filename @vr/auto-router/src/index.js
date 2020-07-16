const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const glob = require('glob');
const shelljs = require('shelljs');

// 获取子目录路径
function getSubDirectory(dir) {
  if (dir.indexOf('./') !== -1) {
    dir = dir.substring(dir.indexOf('.') + 2);
  }
  if (dir.indexOf('src') !== -1) {
    return dir.substring(dir.indexOf('/') + 1);
  } else {
    return dir;
  }
}

class VrAutoRouter {
  constructor(options = {}) {
    // import 的路径前缀
    this.prefix = options.prefix || '../';
    if (this.prefix.lastIndexOf('/') === -1) {
      this.prefix += '/';
    }
    // 扫描目录 默认 src/views
    this.directory = options.directory || `src/views`;
    // 路由文件存放路径 默认 src/router/index.js
    this.routeFilePath = options.routeFilePath || `src/router/index.js`;
    // 生成的文件中是否使用双引号规范，默认使用
    this.doubleQoute = options.doubleQoute === undefined ? true : !!options.doubleQoute;
    this.qoute = this.doubleQoute ? '"' : "'";
    // 404 & 无权限路由文件
    this.unauthorizedPath = options.unauthorizedPath || '../components/common';
  }

  apply(compiler) {
    compiler.hooks.afterPlugins.tap('VrAutoRouter', () => {
      const allData = this.parseRouteData();
      this.writeRouteFile(allData);
      console.log('路由文件生成成功');

      const watcher = chokidar.watch(path.resolve(this.directory), {
        ignored: /(^|[\/\\])\../,
        persistent: true,
        ignoreInitial: true,
      });
      // 添加watcher
      watcher.on('add', (path) => {
        // 跳过src
        let directoryArr = this.directory.split('\/');

        if (directoryArr.length < 0) {
          console.log('请传入监听文件夹')
          return
        }

        let nameStartIndex = path.lastIndexOf(directoryArr[directoryArr.length - 1]) + directoryArr[directoryArr.length - 1].length;

        let nameEndIndex = path.indexOf('.vue');
        let fileData = fs.readFileSync(path, 'utf8');
        // 模板初始化, 判断文件是否有内容
        if (nameEndIndex !== -1) {
          if (fileData.length !== 0) {
            const allData = this.parseRouteData();
            this.writeRouteFile(allData);
            console.log('文件已有内容!!');
          } else {
            let name = path.slice(nameStartIndex, nameEndIndex).replace(/\\/g, '');
            let template = `<template>\n</template>\n`
            template += `<script>\n`
            template += `export default {\n`
            template += `name:'${name}'\n`
            template += `}\n`
            template += `</script>\n`
            template += `<style lang='scss'>\n`
            template += `</style>`
            fs.writeFileSync(path, template)
            // const allData = this.parseRouteData();
            // this.writeRouteFile(allData);
            console.log('路由文件生成成功');
          }

        } else {
          console.log('请创建VUE文件')
        }
      })
      // 改变watcher
      watcher.on('change', () => {
        const allData = this.parseRouteData();
        this.writeRouteFile(allData);
        console.log('路由文件生成成功');
      })
      // 文件删除时触发
      watcher.on('unlink', () => {
        const allData = this.parseRouteData();
        this.writeRouteFile(allData);
        console.log('路由文件生成成功');
      })

    })
  }
  // 判断存在
  judgeExist(content, name) {
    if (content.indexOf(name) === -1) {
      return false
    }
    return true
  }
  // 解析模板
  parseRouteData() {
    const files = glob.sync(path.join('.', this.directory) + '/**/*.vue');
    const routeData = [];
    const importData = new Set;
    files.forEach(filePath => {
      let fileContent = fs.readFileSync(path.resolve(filePath), 'utf8');
      let directoryArr = this.directory.replace(/[\.]/g, '').split('\/');
      // 替换相应的路径
      let name = filePath;

      directoryArr.forEach((fileName) => {

        name = name.replace(new RegExp(fileName, 'g'), '');
        name = name.replace(/\//g, '')
      })

      // const contentArr = content.split('');
      // name = filePath.replace(/src/, '');

      let index = name.indexOf('.');
      let contentArr = (`"/` + name.substring(0, index) + `".vue`).split('');
      // console.log('contentArr', contentArr);
      const parseRoute = require('./utils/parse-route');
      const parseData = parseRoute(contentArr);

      // 编译信息name, meta, router
      let routerExist = this.judgeExist(fileContent, '<router>');
      let routerName, routerAuto;
      if (routerExist) {
        // 提取相应的route内容
        const routerLen = '<router>'.length;
        const metaLen = '@meta:{'.length;
        const nameLen = '@name:'.length;
        const autoLen = '@auto:'.length;
        let content =
          fileContent.substring(fileContent.indexOf('<router>') + routerLen,
            // fileContent.lastIndexOf('</router>')).replace(/[\s\t\,]/g, ''); 
            // 不知为何过滤了，
            fileContent.lastIndexOf('</router>')).replace(/[\s\t]/g, '');

        // 提取name
        let nameExist = this.judgeExist(content, '@name');
        if (nameExist) {
          routerName = content.substring(content.indexOf('@name') + nameLen);

          let singal = routerName[0];
          if (singal === '\'' || singal === '\"') {
            // 跳过符号
            routerName = routerName.substring(1);
            routerName = routerName.substring(0, routerName.indexOf(singal));
            parseData[0].name = "\"" + routerName + "\"";
          }
        }
        // 提取meta内容，只嵌套一层
        let metaExist = this.judgeExist(content, '@meta');

        if (metaExist) {
          let metaLoad = content.substring(content.indexOf('@meta') + metaLen, content.indexOf('}'));
          console.log('metaLoad', metaLoad);
          let meta = {}
          if (metaLoad.includes(',')) {
            let metaArray = metaLoad.split(',')
            metaArray.forEach(val => {
              meta[val.substring(0, val.indexOf(':'))] = val.substring(val.indexOf(':') + 1)
            })
            console.log('metaArray', metaArray);
          } else {
            meta[metaLoad.substring(0, metaLoad.indexOf(':'))] = metaLoad.substring(metaLoad.indexOf(':') + 1)
          }
          console.log('meta', meta);
          parseData[0].meta = meta;
          console.log('router-index', parseData[0].meta);
          console.log('router-index', parseData[0]);
        }
        // 提取Auto
        let autoExist = this.judgeExist(content, '@auto');

        if (autoExist) {
          routerAuto = content.substring(content.indexOf('@auto') + autoLen)

          let singal = routerAuto[0];
          if (singal === '\'' || singal === '\"') {
            // 跳过符号
            routerAuto = routerAuto.substring(1);
            routerAuto = routerAuto.substring(0, routerAuto.indexOf(singal));
          }
        }
      }
      const subFilePath = getSubDirectory(filePath);
      // 编写路由信息 
      importData.add(`import Router from "vue-router"`)
      importData.add(`Vue.use(Router)`)
      let componentName = '';


      parseData.forEach(item => {
        if (componentName === '') {
          componentName = item.path.replace(/[\/:?*\\\-'"]/g, '');
        }
        // 是否加入内容
        if (routerAuto !== 'false') {
          importData.add(`import ${componentName} from ${this.qoute}${this.prefix}${subFilePath}${this.qoute};`.replace(/\\/g, '/'))
          item.component = componentName;
          routeData.push({ ...item });
        }
        // 404&无权限模块
        importData.add(`import unauthorized from ${this.qoute}${this.unauthorizedPath}/unauthorized.vue${this.qoute};`.replace(/\\/g, '/'))
        importData.add(`import noPath from ${this.qoute}${this.unauthorizedPath}/404.vue${this.qoute};`.replace(/\\/g, '/'))
      })

    })
    routeData.unshift({
      path: '"/"',
      name: '"首页"',
      redirect: routeData[0].path,
    })
    routeData.push({
      name:`"404页面"`,
      path: `"/404"`,
      component: 'noPath'
    })
    routeData.push({
      name: `"无权限页面"`,
      path: `"/unauthorized"`,
      component: 'unauthorized'
    })
    return { routeData, importData }
  }

  writeRouteFile(allData) {
    let routeString = '';
    allData.importData.forEach(item => {
      routeString += `${item}\n`;
    });

    routeString += '\nexport default new Router({\n';
    routeString += '\tmode:"history",\n'
    routeString += '\troutes:[\n';

    allData.routeData.forEach(item => {
      routeString += `  {\n`;
      Object.keys(item).forEach(key => {
        const val = item[key];
        if (typeof val === 'object') {
          routeString += `    ${key}:{\n`;
          Object.keys(val).forEach(k => {
            routeString += `      ${k}: ${val[k]},\n`;
          })
          routeString += '    },\n';
        } else {
          routeString += `    ${key}: ${val},\n`;
        }
      });
      routeString += '  },\n';
    })


    routeString += '\t],\n';
    routeString += '})';

    if (!fs.existsSync(path.resolve(this.routeFilePath, '..'))) {
      shelljs.mkdir('-p', path.resolve(this.routeFilePath, '..'));
    }
    fs.writeFileSync(path.resolve(this.routeFilePath), routeString);
  }
}

module.exports = VrAutoRouter;