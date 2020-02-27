
import MyImageLoader from './my-image-loader.js'
import TimeLine from './time-line.js'

/**
 * 独立封装的动画帧引擎库
 * @author 周亮
 * @createDate 2019-12-02
 */
class MyAnimation {
	//初始化状态
	static STATE_INITIAL = 0
	//开始状态
	static STATE_START = 1
	//停止状态
	static STATE_STOP = 2

	//同步任务
	static TASK_SYNC = 0
	//异步任务
	static TASK_ASYNC = 1


	constructor() {
		this.taskQueue = []
		this.index = 0
		this.state = MyAnimation.STATE_INITIAL
		this.timeLine = new TimeLine()
	}
	/**
	 * 简单的函数封装，执行callback
	 * @param callback 执行的函数
	 */
	next(callback) {
		callback && callback()
	}
	
	/**
	 * 添加一个同步任务，去加载图片
	 * @param {Object} imgList 图片数组
	 */
	loadImage(imgList) {
		let taskFn = function(next) {
			new MyImageLoader(imgList.slice(), next)
		}
		let type = MyAnimation.TASK_SYNC

		return this._add(taskFn, type)
	}
	/**
	 * 添加一个异步定时任务，通过定时改变图片背景位置，实现动画帧
	 * @param {Object} ele dom 对象
	 * @param {Object} positions 背景位置数组
	 * @param {Object} imageURL 图片地址
	 */
	changePosition(ele, positions, imageURL) {
		let len = positions.length
		let taskFn
		let type
		if (len) {
			let that = this
			taskFn = function(next, time) {
				//如果指定图片，则设置dom对象的背景图片地址
				if (imageURL) {
					ele.style.backgroundImage = 'url(' + imageURL + ')'
				}
				//获得当前背景图片位置索引
				let index = Math.min(time / that.interval | 0, len)
				let position = positions[index - 1].split(' ')
				//改变dom对象的背景图片位置
				ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px'
				//当前任务执行完毕
				if (index === len) {
					next()
				}
			}
			type = MyAnimation.TASK_ASYNC
		} else {
			taskFn = this.next
			type = MyAnimation.TASK_SYNC
		}

		return this._add(taskFn, type)
	}
	/**
	 * 添加一个异步定时任务，通过定时改变 image 标签的属性
	 * @param {Object} ele
	 * @param {Object} imgList
	 */
	changeSrc(ele, imgList) {
		let len = imgList.length
		let taskFn
		let type
		if (len) {
			let that = this;
			taskFn = function(next, time) {
				//获得当前的图片索引
				var index = Math.min(time / that.interval | 0, len)
				//改变image对象的图片地址
				ele.src = imgList[index - 1]
				//当前任务执行完毕
				if (index === len) {
					next()
				}
			};
			type = MyAnimation.TASK_ASYNC
		} else {
			taskFn = this.next
			type = MyAnimation.TASK_SYNC
		}

		return this._add(taskFn, type)
	}
	/**
	 * 高级用法，添加一个异步定时执行任务，该任务自定义动画每帧执行的任务函数
	 * @param {Object} taskFn 自定义每帧执行的任务函数
	 */
	enterFrame(taskFn) {
		return this._add(taskFn, MyAnimation.TASK_ASYNC)
	}
	/**
	 * 添加一个同步任务，可以在上一个任务完成以后执行回调函数
	 * @param {Object} callback 回调函数
	 */
	then(callback) {
		let taskFn = function(next) {
			callback(this)
			next()
		};
		let type = MyAnimation.TASK_SYNC

		return this._add(taskFn, type)
	}
	/**
	 * 开始执行任务 异步定义任务的间隔
	 * @param {Object} interval
	 */
	start(interval) {
		//如果任务已经开始，则返回
		if (this.state === MyAnimation.STATE_START)
			return this
		//如果任务链中没有任务，则返回
		if (!this.taskQueue.length)
			return this
		this.state = MyAnimation.STATE_START
		this.interval = interval
		this._runTask()
		return this
	}

	/**
	 * 添加一个同步任务，该任务就是回退到上一个任务中，实现重复上个一任务的效果，可以定义重复次数
	 * @param {Object} times 重复次数
	 */
	repeat(times) {
		let that = this
		let taskFn = function() {
			if (typeof times === 'undefined') {
				//无限回退到上一个任务
				that.index--
				that._runTask()
				return
			}
			if (times) {
				times--
				//回退到上一个任务
				that.index--
				that._runTask()
			} else {
				//达到重复执行次数，则跳转到下一个任务
				let task = that.taskQueue[that.index]
				that._next(task)
			}
		};
		let type = MyAnimation.TASK_SYNC

		return this._add(taskFn, type)
	}

	/**
	 * 添加一个同步任务，相当于 repeat（）更友好的接口，无限循环上一次任务
	 */
	repeatForever() {
		this.repeat()
	}

	/**
	 * 设置当前任务执行结束后到下一个任务开始前的等待时间
	 * @param {Object} time 等待时长
	 */
	wait(time) {
		if (this.taskQueue && this.taskQueue.length > 0) {
			this.taskQueue[this.taskQueue.length - 1].wait = time
		}
		return this
	}
	/**
	 * 暂停当前异步定时任务
	 */
	pause() {
		if (this.state === MyAnimation.STATE_START) {
			this.state = MyAnimation.STATE_STOP
			this.timeLine.stop()
			return this
		}
		return this
	}

	/**
	 * 重新执行上一次暂停的异步任务
	 */
	restart() {
		if (this.state === MyAnimation.STATE_STOP) {
			this.state = MyAnimation.STATE_START
			this.timeLine.restart()
			return this
		}
		return this
	}

	/**
	 * 释放资源
	 */
	dispose() {
		if (this.state !== MyAnimation.STATE_INITIAL) {
			this.state = MyAnimation.STATE_INITIAL
			this.taskQueue = null
			this.timeLine.stop()
			this.timeLine = null
			return this
		}
		return this
	}
	/**
	 * 添加一个任务到任务队列中
	 * @param {Object} taskFn 任务方法
	 * @param {Object} type 任务类型
	 * @private
	 */
	_add(taskFn, type) {
		this.taskQueue.push({
			taskFn: taskFn,
			type: type
		})
		return this
	}

	_runTask() {
		if (!this.taskQueue || this.state !== MyAnimation.STATE_START) {
			return
		}
		//任务执行完毕
		if (this.index === this.taskQueue.length) {
			this.dispose()
			return
		}
		//获得任务链上的当前任务
		let task = this.taskQueue[this.index]
		if (task.type == MyAnimation.TASK_SYNC) {
			this._syncTask(task)
		} else {
			this._asyncTask(task)
		}
	}

	/**
	 * 同步任务
	 * @param {Object} task 执行的同步任务对象
	 * @private
	 */
	_syncTask(task) {
		let that = this
		let next = function() {
			//切换下一个任务
			that._next()
		}
		let taskFn = task.taskFn
		taskFn(next)
	}

	/**
	 * 异步任务
	 * @param {Object} task 执行的任务对象
	 * @private
	 */
	_asyncTask(task) {
		let that = this;
		//定义每一帧执行的回调函数
		let enterframe = function(time) {
			let taskFn = task.taskFn;
			let next = function() {
				//停止执行当前任务
				that.timeLine.stop()
				//执行下一个任务
				that._next(task)
			};
			taskFn(next, time)
		}

		that.timeLine.onenterframe = enterframe
		that.timeLine.start(that.interval)
	}

	_next(task) {
		let that = this;
		this.index++;
		(task && task.wait) ? setTimeout(function() {
			that._runTask();
		}, task.wait): this._runTask()
	}

}

export default MyAnimation
