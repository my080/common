import Storage from '../storage.js'

/**
 * sessionStorage 工具类型，封装的操作方法
 * @author 周亮
 * @createDate 2018-6-4
 */
class SessionStorage extends Storage {

	static set(key, data) {
		const item = typeof data === 'object' ? JSON.stringify(data) : data;
		let promise = new Promise(function(resolve, reject) {
			try {
				if (window.sessionStorage) {
					window.sessionStorage[key] = item
					resolve()
				} else {
					reject('不支持 sessionStorage！')
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
					let data = JSON.parse(window.sessionStorage[key])
					resolve(data)
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
				if (window.sessionStorage && window.sessionStorage[key]) {
					window.sessionStorage.removeItem(key)
					resolve()
				} else {
					reject('不支持 sessionStorage！')
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
				if (window.sessionStorage) {
					window.sessionStorage.clear()
					resolve()
				} else {
					reject('不支持 sessionStorage！')
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
			if (window.sessionStorage && window.sessionStorage[key]) {
				isContain = true
			} else {
				return isContain
			}
		} catch (e) {
			return isContain
		}
		return isContain
	}

}

export default SessionStorage
