
const detecter = {};
const u = window.navigator.userAgent;
const match = {
    /* 内核(EdgeHTML,Trident,Presto,WebKit/Blink,Gecko)*/
    /* eslint quote-props: 0*/
    'Trident': u.indexOf('Trident') > -1 || u.indexOf('NET CLR') > -1,
    'Presto': u.indexOf('Presto') > -1,
    'WebKit': u.indexOf('AppleWebKit') > -1,
    'Gecko': u.indexOf('Gecko/') > -1,
    /* 浏览器:
     (Safari,chrome,ie,edge,firefox,opera,kindle,360,uc,qq,baidu,maxthone,sogo,lbbrowser,xiaomi)
     wv:
     (微博,微信,支付宝,淘宝)*/
    'Safari': u.match(/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i) || u.match(/version\/([\w\.]+).+?(mobile\s?safari|safari)/i),
    'Chrome': u.indexOf('Chrome') > -1 || u.match(/((?:android.+)crmo|crios)\/([\w\.]+)/i),
    'IE': u.match(/(?:ms|\()(ie)\s([\w\.]+)/i) || u.match(/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i),
    'Edge': u.match(/(edge)\/((\d+)?[\w\.]+)/i),
    'Firefox': u.indexOf('Firefox') > -1 || u.match(/fxios\/([\w\.-]+)/i),
    'Firefox Focus': u.indexOf('Focus') > -1,
    'Chromium': u.indexOf('Chromium') > -1,
    'Opera': u.indexOf('Opera') > -1 || u.match(/\s(opr)\/([\w\.]+)/i),
    'Vivaldi': u.indexOf('Vivaldi') > -1,
    'Yandex': u.match(/(yabrowser)\/([\w\.]+)/i),
    'Kindle': u.match(/(kindle)\/([\w\.]+)/i),
    '360': u.indexOf('360EE') > -1 || u.indexOf('360SE') > -1,
    'UC': u.match(/(uc\s?browser)[\/\s]?([\w\.]+)/i) || u.match(/ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i) || u.match(/(ucbrowser)\/([\w\.]+)/i) || u.match(/juc.+(ucweb)[\/\s]?([\w\.]+)/i),
    'QQBrowser': u.match(/m?(qqbrowser)[\/\s]?([\w\.]+)/i),
    'Baidu': u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1,
    /* 遨游*/
    'Maxthon': u.indexOf('Maxthon') > -1,
    'Sogou': u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1,
    /* 猎豹*/
    'LBBROWSER': u.indexOf('LBBROWSER') > -1,
    'XiaoMi': u.match(/xiaomi\/miuibrowser\/([\w\.]+)/i),
    /* webview*/
    'Wechat': u.match(/(micromessenger)\/([\w\.]+)/i),
    'Taobao': u.indexOf('AliApp(TB') > -1,
    'Alipay': u.indexOf('AliApp(AP') > -1,
    'Weibo': u.match(/Weibo\s*\((.*?)\)/i),
    'QQ': u.indexOf('QQ/') > -1,
    /* 系统或平台*/
    'Windows': u.match(/microsoft\s(windows)\s(vista|xp)/i) || u.match(/(windows)\snt\s6\.2;\s(arm)/i),
    'Mac OS': u.match(/(mac\sos\sx)\s?([\w\s\.]+\w)*/i) || u.match(/(macintosh|mac(?=_powerpc)\s)/i),
    'Android': u.indexOf('Android') > -1,
    'Windows Phone': u.indexOf('IEMobile') > -1,
    /* 'Windows Phone': u.match(/(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s]+\w)*!/i) || ua.match(/(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i) || u.match(/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i),*/
    'iOS': u.match(/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i),
    /* 设备 电脑(PC),平板或PDA(Tablet),手机(Mobile)*/
    'Mobile': u.indexOf('Mobile') > -1 || u.indexOf('iPhone') > -1 || u.indexOf('480') > -1,
    'Tablet': u.indexOf('Tablet') > -1 || u.indexOf('Pad') > -1 || u.indexOf('Nexus 7') > -1
};
/* 基本信息*/
const hash = {
    'engine': ['WebKit', 'Trident', 'Gecko', 'Presto'],
    'browser': ['Chrome', 'Safari', 'Edge', 'IE', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Kindle', '360', 'UC', 'QQBrowser', 'QQ', 'Baidu', 'Maxthon', 'Sogou', 'LBBROWSER', 'XiaoMi', 'Wechat', 'Taobao', 'Alipay', 'Weibo'],
    'os': ['Windows', 'Mac OS', 'Android', 'iOS', 'Windows Phone'],
    'device': ['Mobile', 'Tablet']
};

/* 系统版本信息*/
const osVersion = {
    'Windows': function () {
        const v = u.replace(/^.*Windows NT ([\d.]+);.*$/, '$1');
        const hashV = {
            '6.4': '10',
            '6.3': '8.1',
            '6.2': '8',
            '6.1': '7',
            '6.0': 'Vista',
            '5.2': 'XP',
            '5.1': 'XP',
            '5.0': '2000'
        };
        return hashV[v] || v;
    },
    'Mac OS': function () {
        return u.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.');
    },
    'Android': function () {
        return u.replace(/^.*Android ([\d.]+);.*$/, '$1');
    },
    'iOS': function () {
        return u.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.');
    },
    'Windows Phone': function () {
        return u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2');
    }
};

/* 浏览器版本信息 */
const version = {
    'Safari': function () {
        return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
    },
    'Chrome': function () {
        return u.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1');
    },
    'IE': function () {
        return u.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1');
    },
    'Edge': function () {
        return u.replace(/^.*Edge\/([\d.]+).*$/, '$1');
    },
    'Firefox': function () {
        return u.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1');
    },
    'Firefox Focus': function () {
        return u.replace(/^.*Focus\/([\d.]+).*$/, '$1');
    },
    'Chromium': function () {
        return u.replace(/^.*Chromium\/([\d.]+).*$/, '$1');
    },
    'Opera': function () {
        return u.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1');
    },
    'Vivaldi': function () {
        return u.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1');
    },
    'Yandex': function () {
        return u.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1');
    },
    'Kindle': function () {
        return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
    },
    'Maxthon': function () {
        return u.replace(/^.*Maxthon\/([\d.]+).*$/, '$1');
    },
    'QQBrowser': function () {
        return u.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1');
    },
    /* eslint no-useless-escape: 0*/
    'Baidu': function () {
        return u.replace(/^.*BIDUBrowser[\s\/]([\d.]+).*$/, '$1');
    },
    'UC': function () {
        return u.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1').replace(/juc.+(ucweb)[\/\s]?([\w\.]+)/i, '$1');
    },
    'Sogou': function () {
        return u.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1');
    },
    'XiaoMi': function () {
        return u.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1');
    },
    'Wechat': function () {
        return u.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1');
    },
    'Taobao': function () {
        return u.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1');
    },
    'Alipay': function () {
        return u.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1');
    },
    /* "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89 Weibo (iPhone9,2__weibo__7.6.0__iphone__os10.3.2)" */
    'Weibo': function () {
        const arr = u.match(/__weibo__(\d+?.\d+?.\d+)(_*\w*)*__(.+)?__/);
        if (!arr || !arr.length || arr.length < 2) {
            return '';
        }
        return arr[1];
    },
    'QQ': function () {
        return u.replace(/^.*QQ\/([\d.]+).*$/, '$1');
    }
};

const config = {
    'detecter': detecter,
    'osVersion': osVersion,
    'version': version,
    'u': window.navigator.userAgent,
    'match': match,
    'hash': hash
};

export default config;
