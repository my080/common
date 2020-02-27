
import Storage from '../storage.js'

class WeiStorage extends Storage {

	static set (key, value) {
		let promise = new Promise(function (resolve, reject) {
			try {
				wx.setStorage({
					key: key,
					value: value,
					success: resolve,
					fail: reject
				})
			} catch (e) {
				reject(e)
			}
		})
		return promise
	}

	static get (key) {
		let promise = new Promise(function (resolve, reject) {
			try {
				wx.getStorage({
					key: key,
					success: resolve,
					fail: reject
				})
			} catch (e) {
				reject(e)
			}
		})
		return promise
	}

	static remove (key) {
		let promise = new Promise(function (resolve, reject) {
			try {
				wx.removeStorage({
					key: key,
					success: resolve,
					fail: reject
				})
			} catch (e) {
				reject(e)
			}
		})
		return promise
	}

	static clear () {
		let promise = new Promise(function (resolve, reject) {
			try {
				wx.clearStorage({
					success: resolve,
					fail: reject
				})
			} catch (e) {
				reject(e)
			}
		})
		return promise
	}

	static has () {}

}

export default WeiStorage
