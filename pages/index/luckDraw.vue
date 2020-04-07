<template>
	<view class="conbox">
		<view class="container">
			<!-- 背景 -->
			<image src="/static/images/bg.png" class="cont" mode=""></image>
			<image src="/static/images/caidai.png" class="caidai" mode=""></image>
			<view class="main" style="padding-top: 50upx;">
				<view class="canvas-container">
					<view :animation="animationData" class="canvas-content" id="zhuanpano" style="">
						<view class="canvas-line">
							<view class="canvas-litem" v-for="(item, index) in list" :key="index" :style="{ transform: 'rotate(' + (index * width + width / 2) + 'deg)' }"></view>
						</view>

						<view class="canvas-list">
							<view class="canvas-item" :style="{ transform: 'rotate(' + index * width + 'deg)', zIndex: index }" v-for="(iteml, index) in list" :key="index">
								<view class="canvas-item-text" :style="'transform:rotate(' + index + ')'">
									<text class="b" style="font-size: 32upx;">{{ iteml.name }}</text>
									<image style="width: 30px ; height: 30px;margin-top: 30px;" :src="iteml.picture" mode="aspectFill"></image>
								</view>
							</view>
						</view>
					</view>

					<view @tap="playReward" class="canvas-btn" v-bind:class="btnDisabled">开始</view>
				</view>
			</view>
			<!-- 规则 -->
			<view class="guize" style="margin-top: 100upx;">
				<view class="titbox flex">
					<view @click="showGuize = true" :class="{ select: showGuize }" class="title ">规则说明</view>
					<view @click="showGuize = false" :class="{ select: !showGuize }" class="title">中奖名单</view>
				</view>

				<view v-if="showGuize" class="guizeList">
					<scroll-view scroll-y="true" style="height: 180px;padding: 10px 0;">
						<view>
							<!-- <view class="g_item">1.用户每天登录即送1次抽奖机会，分享好友则多赠1次机会</view> -->
							<view class="g_item">1.用户点击大转盘抽奖按钮，，每天1次抽奖机会</view>
							<view class="g_item">2.用户获得的奖品，可在我的道具里查看</view>
						</view>
					</scroll-view>
				</view>
				<view v-else class="goodsList">
					<swiper style="height: 50px;" :vertical="true" :autoplay="true" :interval="1400" :duration="300">
						<swiper-item v-for="(item, index) in peopleList" :key="index" style="height: 100%;width: 100%;" class="flex align-center">
							<view class="swiper-item flex justify-between align-center" style="width: 100%;">
								<view class="userinfo flex">
									<image :src="item.avatar" style="width: 40rpx;height: 40rpx;margin-right: 10rpx;border-radius: 50%;" mode="aspectFill"></image>
									<!-- <image src="/static/headerpic.png" style="width: 40rpx;height: 40rpx;margin-right: 10rpx;border-radius: 50%;" mode="aspectFill"></image> -->
									<text>{{ item.nickName }}</text>
								</view>
								<text>{{ item.prize_name }}</text>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			peopleList: [],
			width: 0,
			animationData: {},
			btnDisabled: '',
			showGuize: true,
			timer: null
		};
	},
	onLoad: function() {
		this.getGoodsList();
		this.getPeopleList();
	},
	onUnload() {
		if (this.timer) {
			console.log('卸载');
			clearTimeout(this.timer);
		}
	},
	onShareAppMessage(res) {
		return {
			title: '苍都牧场',
			path: '/pages/index/luckDraw?parentId=' + this.getUserId() || ''
			// imageUrl: '测试图片'
		};
	},
	methods: {
		getGoodsList() {
			this.showLoading();
			this.request({
				url: '/prize/getPrizeList',
				data: {},
				success: res => {
					uni.hideLoading();
					console.log('奖品列表', res);
					if (res.data.status === 1) {
						let index = 0;
						res.data.list.find((val, idx) => {
							if (val.type === 3) {
								index = idx;
							}
						});
						res.data.list.unshift(...res.data.list.splice(index, 1));
						res.data.list = res.data.list.map(i => {
							i.picture = res.data.image_url + i.picture;
							return i;
						});
						this.list = res.data.list;
						this.width = 360 / this.list.length;
					}
				}
			});
		},
		getPeopleList() {
			this.request({
				url: '/prize/getUserPrizeList',
				data: {},
				success: res => {
					console.log('中奖名单', res);
					if (res.data.status === 1) {
						res.data.list = res.data.list.map(i => {
							if (i.avatar) {
								i.avatar = i.avatar.indexOf('http') === -1 ? res.data.image_url + i.avatar : i.avatar;
							}

							return i;
						});
						this.peopleList = res.data.list;
					}
				}
			});
		},
		animation(index, duration) {
			//中奖index
			var list = this.list;
			var runNum = 4; //旋转8周

			// 旋转角度
			this.runDeg = this.runDeg || 0;
			this.runDeg = this.runDeg + (360 - (this.runDeg % 360)) + (360 * runNum - index * (360 / list.length)) + 1;
			//创建动画
			var animationRun = uni.createAnimation({
				duration: duration,
				timingFunction: 'ease'
			});
			animationRun.rotate(this.runDeg).step();
			this.animationData = animationRun.export();
			this.btnDisabled = 'disabled';
		},
		//发起抽奖
		playReward() {
			this.checkLogin().then(reslove => {
				this.showLoading();
				this.request({
					url: '/prize/postUserPrize',
					method: 'POST',
					data: {
						user_mark_id: this.getUserId()
					},
					success: res => {
						console.log('中奖id', res);
						uni.hideLoading();
						if (res.data.status === 1) {
							let id = res.data.prize_id;
							let index = 0;
							this.list.find((val, idx, arr) => {
								if (val.id === id) {
									index = idx;
								}
							});
							console.log(index);
							let duration = 4000;
							this.animation(index, duration);
							this.timer = setTimeout(() => {
								uni.showModal({
									content: this.list[index].name,
									showCancel: false,
									title: '中奖结果',
									confirmText: res.data.type !== 3 ? '去领奖' : '谢谢惠顾',
									success: modelRes => {
										console.log(modelRes, modelRes.confirm && res.data.type !== 3);
										if (modelRes.confirm && res.data.type !== 3) {
											let url = '/pages/my/myCouponList';
											if (res.data.type === 1) {
												url = '/pages/my/myPrizeList';
											} else if (res.data.type === 2) {
												url = '/pages/my/myCouponList';
											}
											console.log(url);
											uni.navigateTo({
												url: url
											});
										}
									}
								});
								this.btnDisabled = '';
							}, duration + 1000);
						} else {
							this.showToast(res.data.info);
						}
					}
				});
			});
		}
	}
};
</script>
<style scoped>
.icon-awrad {
	font-size: 50upx !important;
}

.conbox {
	width: 750upx;
	height: 100vh;
	overflow-x: hidden;
	overflow-y: scroll;
}

.container,
image.cont {
	width: 750upx;
	min-height: 100vh;
	height: auto;
	position: relative;
}

image.cont {
	height: 100%;
	position: absolute;
	z-index: 0;
}

image.caidai {
	position: absolute;
	top: 0;
	left: 0;
	width: 750upx;
	height: 1024upx;
}

.header-title > view {
	padding: 8upx 16upx;
	border: 1px solid #d89720;
	color: #d89720;
	font-size: 28upx;
	border-radius: 26upx;
}

/* 转盘 */
.canvas-container {
	margin: 0 auto;
	position: relative;
	width: 600upx;
	height: 600upx;
	background: url(../../static/images/circle.png) no-repeat;
	background-size: cover;
	border-radius: 50%;
}

.canvas-content {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 1;
	display: block;
	width: 600upx;
	height: 600upx;
	border-radius: inherit;
	/* background-clip: padding-box; */
	/* background-color: #ffcb3f; */
}

.canvas-list {
	position: absolute;
	left: 0;
	top: 0;
	width: inherit;
	height: inherit;
	z-index: 9999;
}

.canvas-item {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	color: #e4370e;
	/* text-shadow: 0 1upx 1upx rgba(255, 255, 255, 0.6); */
}

.canvas-item-text {
	position: relative;
	display: block;
	padding-top: 46upx;
	margin: 0 auto;
	text-align: center;
	-webkit-transform-origin: 50% 300upx;
	transform-origin: 50% 300upx;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #fb778b;
}

.canvas-item-text text {
	font-size: 30upx;
}

/* 分隔线 */
.canvas-line {
	position: absolute;
	left: 0;
	top: 0;
	width: inherit;
	height: inherit;
	z-index: 99;
}

.canvas-litem {
	position: absolute;
	left: 300upx;
	top: 0;
	width: 3upx;
	height: 300upx;
	background-color: rgba(228, 55, 14, 0.4);
	overflow: hidden;
	-webkit-transform-origin: 50% 300upx;
	transform-origin: 50% 300upx;
}

/**
* 抽奖按钮
*/
.canvas-btn {
	position: absolute;
	left: 260upx;
	top: 260upx;
	z-index: 400;
	width: 80upx;
	height: 80upx;
	border-radius: 50%;
	color: #f4e9cc;
	background-color: #e44025;
	line-height: 80upx;
	text-align: center;
	font-size: 26upx;
	text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.6);
	box-shadow: 0 3px 5px rgba(0, 0, 0, 0.6);
	text-decoration: none;
}

.canvas-btn::after {
	position: absolute;
	display: block;
	content: ' ';
	left: 12upx;
	top: -44upx;
	width: 0;
	height: 0;
	overflow: hidden;
	border-width: 30upx;
	border-style: solid;
	border-color: transparent;
	border-bottom-color: #e44025;
}
.canvas-btn.disabled {
	pointer-events: none;
	background: #b07a7b;
	color: #ccc;
}

.canvas-btn.disabled::after {
	border-bottom-color: #b07a7b;
}

.typecheckbox view {
	border: 1px solid #ff3637;
	background: transparent;
	color: #ff3637;
	display: flex;
	height: 60upx;
	width: 140upx;
	border-radius: 50upx;
	align-items: center;
	justify-content: center;
	display: flex;
	margin-left: 20upx;
}

.guize {
	width: 502upx;
	min-height: 300upx;
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 3;
	background-image: linear-gradient(-180deg, #f48549 0%, #f2642e 100%);
	border: 18upx solid #e4431a;
	border-radius: 16px;
	margin: 0 auto;
	margin-top: -104upx;
	padding: 48upx;
	/* box-sizing: border-box; */
	color: #fff;
}

.guize .title {
	text-align: center;
	margin-bottom: 28upx;
	width: 50%;
	border: 1rpx solid #c5c2c6;
	padding: 10px 0px;
}
.guize .title.select {
	color: red;
}

.guize .g_item {
	font-family: PingFang-SC-Medium;
	font-size: 24upx;
	color: #ffffff;
	letter-spacing: 0.5px;
	text-align: justify;
	line-height: 20px;
	padding: 5px 0;
	border-bottom: 1rpx dashed #eeeeee;
}

.myrewards .title {
	font-family: PingFang-SC-Bold;
	font-size: 16px;
	color: #e4431a;
	letter-spacing: 0.57px;
	display: flex;
	padding-top: 36upx;
	justify-content: center;
}
</style>
