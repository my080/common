
/**
 * 动画帧引擎库加载图片的封装类
 * @author 周亮
 * @createDate 2019-12-02
 */
class MyImageLoader {

	static ID = 0

	constructor(images, callback, timeout) {
		this.count = 0
		this.success = true
		this.timeoutId = 0
		this.isTimeout = false
		this.images = images
		this.callback = callback

		for (let key in images) {
			if (!images.hasOwnProperty(key))
				continue
			let item = images[key]

			if (typeof item === 'string') {
				item = images[key] = {
					src: item
				}
			}

			//如果格式不满足期望，则丢弃此条数据进行下一次遍历
			if (!item || !item.src)
				continue
			this.count++
			item.id = "__img_" + key + this.getId()
			item.img = window[item.id] = new Image()
			this.doLoad(item)
		}
		
		//遍历完成如果计数为0，则直接调用
		if (!this.count) {
			callback(this.success)
		} else if (this.timeout) {
			this.timeoutId = setTimeout(this.onTimeout.bind(this), timeout)
		}
	}

	getId() {
		return ++MyImageLoader.ID
	}

	onTimeout() {
		this.isTimeout = true
		this.callback(false)
	}

	doLoad(item) {
		let that = this
		item.status = 'loading'
		let img = item.img
		img.onload = function() {
			that.success = that.success && true
			item.status = 'loaded'
			done()
		}
		img.onerror = function() {
			this.success = false
			item.status = 'error'
			done()
		}
		
		img.src = item.src;

		function done() {
			//事件清理
			img.onload = img.onerror = null

			try {
				//删除window上注册的属性
				delete window[item.id]
			} catch (e) {
				console.log(e)
			}

			//每张图片加载完成，计数器减一，当所有图片加载完毕且没有超时的情况下，
			//清除超时计时器，且执行回调函数
			if (!--that.count && !that.isTimeout) {
				clearTimeout(that.timeoutId)
				that.callback(that.success)
			}
		}
	}

}

export default MyImageLoader
