
import config from './config.js';

/**
 * 用户端浏览器内核及版本信息适配工具类
 * @author 曹科 （ES6 语法调整：周亮）
 * @createTime 周亮
 */
class UserAgent {

    /**
     * 浏览器内核、版本适配方法
     */
    match () {
        config.device = 'PC';
        for (const s in config.hash) {
            for (let i = 0; i < config.hash[s].length; i += 1) {
                const value = config.hash[s][i];
                if (value && config.match[value]) {
                    config.detecter[s] = value;
                }
            }
        }
        config.detecter.osVersion = '';
        if (config.osVersion[config.detecter.os]) {
            config.detecter.osVersion = config.osVersion[config.detecter.os]();
            if (config.detecter.osVersion === config.u) {
                config.detecter.osVersion = '';
            }
        }
        config.detecter.version = '';
        if (config.version[config.detecter.browser]) {
            config.detecter.version = config.version[config.detecter.browser]();
            if (config.detecter.version === config.u) {
                config.detecter.version = '';
            }
        }
        config.detecter.versionCompare = this.versionCompare;
        return config.detecter;
    }

    /**
     * 版本比较方法
     * @param a
     * @param b
     * @returns {number}
     */
    versionCompare (a, b) {
        const pa = a.indexOf('_') > -1 ? a.split('_') : a.split('.');
        const pb = b.indexOf('_') > -1 ? b.split('_') : b.split('.');
        const len = Math.max(pa.length, pb.length);
        for (let i = 0; i < len; i += 1) {
            const na = Number(pa[i]) || 0;
            const nb = Number(pb[i]) || 0;
            if (na > nb) {
                return 1;
            }
            if (nb > na) {
                return -1;
            }
        }
        return 0;
    }

}

export default UserAgent;
