import Storage from '../storage.js'

/**
 * localStorage 工具类，封装 localStorage 的常用操作方法
 * @author 周亮
 * @createDate 2018-6-5
 */
class LocalStorage extends Storage {

	static set(key, data) {
		let promise = new Promise(function(resolve, reject) {
			const item = typeof data === 'object' ? JSON.stringify(data) : data
			try {
				if (window.localStorage) {
					window.localStorage[key] = item
					resolve()
				} else {
					reject('不支持 localStorage！')
				}
			} catch (e) {
				reject(e)
			}
		})
		return promise
	}

	static get(key) {
		let that = this
		let promise = new Promise(function(resolve, reject) {
			if (that.has(key)) {
				try {
					if (window.localStorage) {
						let data = JSON.parse(window.localStorage[key])
						resolve(data)
					} else {
						reject('不支持 localStorage！')
					}
				} catch (e) {
					reject(e)
				}
			} else {
				resolve(null)
			}
		})
		return promise
	}

	static remove(key) {
		let promise = new Promise(function(resolve, reject) {
			try {
				if (window.localStorage && window.localStorage[key]) {
					window.localStorage.removeItem(name)
					resolve()
				} else {
					reject('不支持 localStorage！')
				}
			} catch (e) {
				reject(e)
			}
		})
		return promise
	}

	static clear() {
		let promise = new Promise(function(resolve, reject) {
			try {
				try {
					if (window.localStorage) {
						window.localStorage.clear()
						resolve()
					} else {
						reject('不支持 localStorage！')
					}
				} catch (e) {
					reject(e)
				}
			} catch (e) {
				reject(e)
			}
		})
		return promise

	}

	static has(key) {
		let isContain = false
		try {
			if (window.localStorage && window.localStorage[key]) {
				isContain = true
			} else {
				return false
			}
		} catch (e) {
			return false
		}
		return isContain
	}

}

export default LocalStorage
