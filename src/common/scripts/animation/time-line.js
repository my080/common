/**
 * raf
 */
let requestAnimationFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		//所有都不支持，用setTimeout兼容
		function(callback) {
			return window.setTimeout(callback, (callback.interval || TimeLine.DEFAULT_INTERVAL))
		}
})()

/**
 * cancel raf
 */
let cancelAnimationFrame = (function () {
	return window.cancelAnimationFrame ||
		window.webkitCancelAnimationFrame ||
		window.mozCancelAnimationFrame ||
		window.oCancelAnimationFrame ||
		function (id) {
			window.clearTimeout(id)
		}
})()

/**
 * 动画帧引擎的时间片封装类
 * @author 周亮
 * @createDate 2019-12-02
 */
class TimeLine {

	static DEFAULT_INTERVAL = 1000 / 60

	//初始化状态
	static STATE_INITIAL = 0
	//开始状态
	static STATE_START = 1
	//停止状态
	static STATE_STOP = 2

	constructor() {
		this.state = TimeLine.STATE_INITIAL
		this.interval = 0
		this.animationHander = 0
	}
	/**
	 * 时间轴上每次回调执行的函数
	 * @param {Object} time 从动画开始到当前执行的时间
	 */
	onenterframe() {
	}
	/**
	 * 动画开始
	 * @param {Object} interval 每一次回调的间隔时间
	 */
	start(interval) {
		if (this.state === TimeLine.STATE_START) {
			return
		}
		this.state = TimeLine.STATE_START
		this.interval = interval || TimeLine.DEFAULT_INTERVAL
		this.startTimeLine(this, +new Date())
	}

	/**
	 * 停止动画
	 */
	stop() {
		if (this.state !== TimeLine.STATE_START) {
			return
		}
		this.state = TimeLine.STATE_STOP

		//如果动画开始过，则记录动画从开始到现在所经历的时间
		if (this.startTime) {
			this.dur = +new Date() - this.startTime
		}
		cancelAnimationFrame(this.animationHander)
	}
	/**
	 * 重新开始动画
	 */
	restart() {
		if (this.state === TimeLine.STATE_START) {
			return
		}
		if (!this.dur || !this.interval) {
			return
		}
		this.state = TimeLine.STATE_START
		this.startTimeLine(this, +new Date() - this.dur)
	}
	/**
	 * 动画时间轴启动函数
	 * @param {Object} timeLine 时间轴的实例
	 * @param {Object} startTime 动画开始时间戳
	 */
	startTimeLine(timeLine, startTime) {
		timeLine.startTime = startTime
		nextTick.interval = timeLine.interval

		//记录上一次回调的时间戳
		let lastTick = +new Date()
		nextTick()

		function nextTick() {
			let now = +new Date()
			timeLine.animationHander = requestAnimationFrame(nextTick)
			//如果当前时间与上一次回调的时间戳大约设置的时间间隔
			//表示这一次可以执行回调函数
			if (now - lastTick >= timeLine.interval) {
				timeLine.onenterframe(now - startTime)
				lastTick = now
			}
		}
	}

}

export default TimeLine
