const RUN_ENV = process.env.BUILD_ENV ? process.env.BUILD_ENV : process.env.ENV ? process.env.ENV : process.env.NODE_ENV;
// 静态环境配置
const ENV_CONFIG = {
    production: {
        //线上
        upm_url: "//upm.81cs_enjoy.com",
        to_login: "//upm.81cs_enjoy.com/to_login.htm?referrerUrl=",
        to_logout: "//upm.81cs_enjoy.com/loginout.htm?referrerUrl=",
        old_md_url: "//config.81cs_enjoy.com",
        salary_url: "//salary.shebao.net",
        static_url: "//gs0.101hr.com",
        vr_ui: "//vue-reservoir.shebao.net",
    },
    demos: {
        //demos
        upm_url: "//demos.upm.81cs_enjoy.com",
        to_login: "//demos.upm.81cs_enjoy.com/to_login.htm?referrerUrl=",
        to_logout: "//demos.upm.81cs_enjoy.com/loginout.htm?referrerUrl=",
        old_md_url: "//demos.config.81cs_enjoy.com",
        salary_url: "//demos.salary.shebao.net",
        static_url: "//demos.global.static.101hr.com",
        vr_ui: "//demos-vue-reservoir.shebao.net",
    },
    test: {
        //test
        upm_url: "//test.upm.shebao.net",
        to_login: "//test.upm.shebao.net/to_login.htm?referrerUrl=",
        to_logout: "//test.upm.shebao.net/loginout.htm?referrerUrl=",
        old_md_url: "//test.config.81cs_enjoy.com",
        salary_url: "//test.salary.shebao.net",
        static_url: "//test-global-static.101hr.com",//test-global-static.101hr.com/
        vr_ui: "//test-vue-reservoir.shebao.net",
    },
    development: {
        //本地
        upm_url: "//test.upm.shebao.net",
        to_login: "//test.upm.shebao.net/to_login.htm?referrerUrl=",
        to_logout: "//test.upm.shebao.net/loginout.htm?referrerUrl=",
        transpond_url: "//test.api.licence.shebao.net",
        old_md_url: "//test.config.81cs_enjoy.com",
        salary_url: "//test.salary.shebao.net",
        static_url: "//localhost:8199",
        vr_ui:"//localhost:9977",
    }
};
// 根据环境变量获取配置 
const CONF_LIST = ENV_CONFIG[RUN_ENV];
// 项目基础方法
const BASE_API = {
    login() {
        window.location.href = `${CONF_LIST.upm_url}/to_login.htm?referrerUrl=${window.location}`;
    },
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("permission");
        window.location.href = `${CONF_LIST.upm_url}/loginout.htm?referrerUrl=${window.location.origin}`;
    },
    getUrlParam(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);

        if (r != null) return decodeURI(r[2]);
        return null;
    }
};
// 表单校验规则
const FORM_RULE = {
}
// TS引入赋值调用
const bindPublic = () => {

    window.$env = CONF_LIST;

    window.$base_api = BASE_API;

    window.$form_rule = FORM_RULE;

}
// CommonJS输出
module.exports = {
    RunEnv: RUN_ENV,
    bindPublic: bindPublic,
    ConfList: CONF_LIST,
};
