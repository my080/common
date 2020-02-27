/**
 * 操作 cookies 的工具类，封装操作 cookies
 * @author 周亮
 * @createDate 2019-12-02
 */
class CookiesStorage {

	static set(key, value, days) {
		let promise = new Promise(function(resolve, reject) {
			try {
				let d = new Date();
				d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
				window.document.cookie = key + '=' + value + ';path=/;expires=' + d.toGMTString();
				resolve()
			} catch (e) {
				reject(e)
			}
		})
		return promise
	}

	static get(key) {
		let promise = new Promise(function(resolve, reject) {
			try {
				//用处理字符串的方式查找到key对应value
				let name = escape(key)
				//读cookie属性，这将返回文档的所有cookie
				let allcookies = document.cookie
				//查找名为name的cookie的开始位置
				name += "="
				let pos = allcookies.indexOf(name)
				//如果找到了具有该名字的cookie，那么提取并使用它的值
				if (pos != -1) { //如果pos值为-1则说明搜索"version="失败
					let start = pos + name.length //cookie值开始的位置
					let end = allcookies.indexOf(";", start) //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置
					if (end == -1) end = allcookies.length //如果end值为-1说明cookie列表里只有一个cookie
					let value = allcookies.substring(start, end) //提取cookie的值
					resolve(value) //对它解码
				} else { //搜索失败，返回空字符串
					resolve("")
				}
			} catch (e) {
				reject(e)
			}
		})
		return promise
	}

	static remove(key, path) {
		let promise = new Promise(function(resolve, reject) {
			try {
				let name = escape(key);
				let expires = new Date(0);
				path = path == "" ? "" : ";path=" + path;
				document.cookie = name + "=" + ";expires=" + expires.toUTCString() + path;
				resolve()
			} catch (e) {
				reject(e)
			}
		})
		return promise
	}

	static clear() {
		let promise = new Promise(function(resolve, reject) {
			try {
				let keys = document.cookie.match(/[^ =;]+(?=\\=)/g);
				if (keys) {
					for (let i = keys.length; i--;) {
						document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
					}
				}
				resolve()
			} catch (e) {
				reject(e)
			}
		})
		return promise
	}

	static has(key) {
		let isContain = false;
		let keys = document.cookie.match(/[^ =;]+(?=\\=)/g);
		if (keys && keys.length > 0) {
			for (let i = 0; i < keys.length; i++) {
				if (keys[i] === key) {
					isContain = true;
				}
			}
		}
		return isContain
	}

}

export default CookiesStorage
