<template>
	<view class="Integral">
		<!-- <view class="bg-img">
			<image :src="type == 1 ? '/static/aboutusbg.png' : type == 2 ? '/static/aboutusbg.png' : '/static/aboutusbg.png'" style="width: 100%;height: 200px;" mode=""></image>
		</view> -->
		<view class="titBox flex justify-between">
			<view @click="changeFreeGoodsType(0)" :class="{ select: freeGoodsType === 0 }" class="tit">全部</view>
			<view @click="changeFreeGoodsType(1)" :class="{ select: freeGoodsType === 1 }" class="tit">0元抢</view>
			<view @click="changeFreeGoodsType(2)" :class="{ select: freeGoodsType === 2 }" class="tit">会员免费</view>
			<view @click="changeFreeGoodsType(3)" :class="{ select: freeGoodsType === 3 }" class="tit">分享免费</view>
		</view>
		<view class="lsitbox " style="border: none;">
			<view v-if="freeGoodsType === 0 ? true : item.product_type === freeGoodsType" v-for="(item, index) in goodsList" :key="index" class="itemFree  flex align-center">
				<image :src="item.picture" mode="aspectFill"></image>
				<view style="height: auto;" class="infobox flex flex-direction justify-between">
					<view class="info textov2">
						<text :class="'typeName' + item.product_type" class="typeName">
							{{ item.product_type === 1 ? '0元抢' : item.product_type === 2 ? '会员免费' : '分享免费' }}
						</text>
						{{ item.name }}
					</view>
					<view class="moneybox flex align-center justify-between">
						<view class="money">￥{{ item.price }}</view>
						<view class="xl">剩余{{ item.left_num }}份</view>
						<button v-if="item.product_type === 1" @click="ClickfreeBtn(item.id, item.product_type, item)" class="btn cu-btn  ">0元抢</button>
						<button v-else-if="item.product_type === 2" @click="ClickfreeBtn(item.id, item.product_type, item)" class="btn cu-btn  ">会员免费</button>
						<button open-type="share" v-else-if="item.product_type === 3" :data-pid="item.id" class="btn cu-btn  ">分享免费</button>
					</view>
				</view>
			</view>
		</view>

		<will-mc class="mc" v-if="showTrial">
			<view class="_mcMain bg-white ">
				<image @click="showTrial = false" src="/static/delect.png" mode=""></image>
				<view class="tit">请填写申请免费试吃理由</view>
				<view class="tip flex justify-center text-left">
					<textarea
						v-model="trialText"
						style="width: 80%;height: 120px;border: 1rpx solid #555555;border-radius: 10px;padding: 10px;"
						maxlength="-1"
						placeholder="请填写申请免费试吃理由,申请成功方能试用"
					/>
				</view>
				<button @click="ApplyTrial" class="btn cu-btn">点击申请</button>
			</view>
		</will-mc>
	</view>
</template>

<script>
export default {
	data() {
		return {
			goodsList: [],
			freeGoodsType: 0, // 0全部 1零元 2会员免费 3分享免费
			showTrial: false,
			trialId: null,
			trialText: ''
		};
	},
	onLoad(options) {
		this.getList();
		console.log('options', options);
		// this.addShareNum({
		// 	parentId:decodeURI(encodeURI('eyJpdiI6InRKMmtNMjBvRElBOGR2NjkrQkczNkE9PSIsInZhbHVlIjoiQ3prM0pseVJcL3JxbGI4RzVoTllOU0E9PSIsIm1hYyI6ImJiOTA4MjNjOTcxNDM1ZDQ3NmVlOWI1OTJhYTkwMWE0YzU1Y2M3MmJkZWUxM2VlNDM0ODdiYmUyMmEzMWI1MGEifQ=='))
		// 	,searchGoodsId:'73'
		// })
		// if (options.goodsId || options.parentId) {
		if (options.goodsId && options.parentId) {
			let searchGoodsInfo = {
				parentId: decodeURI(options.parentId),
				searchGoodsId: options.goodsId
			};
			console.log('searchGoodsInfo', searchGoodsInfo);
			this.checkLogin().then(
				reslove => {
					this.addShareNum(searchGoodsInfo);
				},
				reject => {
					uni.setStorageSync('searchGoodsInfo', searchGoodsInfo);
				}
			);
		}
	},
	onShareAppMessage(e) {
		if (e.from === 'button') {
			let parentId = encodeURI(this.getUserId());
			let path = '/pages/index/Integral?type=1&parentId=' + parentId + '&goodsId=' + e.target.dataset.pid;
			console.log(path);
			return {
				title: '苍都牧场',
				path: path
				// imageUrl:'/static/goods.jpg'
			};
		} else if (e.from === 'menu') {
			return {
				title: '苍都牧场',
				path: '/pages/index/Integral?parentId=' + (this.getUserId() || '')
				// imageUrl: '测试图片'
			};
		}
	},
	methods: {
		addShareNum(searchInfo) {
			this.request({
				url: '/tryAssemble/postShareTryProduct',
				method: 'POST',
				data: {
					user_mark_id: searchInfo.parentId,
					target_mark_user_id: this.getUserId(),
					product_id: searchInfo.searchGoodsId
				},
				success: res => {
					console.log('分享信息', res);
				}
			});
		},
		getList() {
			//1 免费试吃 2 团购
			this.showLoading();
			this.request({
				url: '/tryAssemble/postTryAssembleList',
				method: 'POST',
				data: {
					type_id: 2, // 2免费 3拼团
					product_type: this.freeGoodsType // 全部 0元 会员 分享
				},
				success: res => {
					uni.hideLoading();
					console.log('查询免费试吃', res);
					if (res.data.status === 1) {
						res.data.list = res.data.list.map(i => {
							i.picture = res.data.image_url + i.picture;
							return i;
						});
						this.goodsList = res.data.list;
					}
				}
			});
		},
		changeFreeGoodsType(type) {
			if (type === this.freeGoodsType) {
				return;
			}
			this.freeGoodsType = type;
			this.getList();
		},
		ClickfreeBtn(id, type, item) {
			if (type === 1) {
				this.showTrialView(id);
			} else if (type === 2) {
				// type 1零元 2会员 3分享
				// goodsType 2团购 3会员 4分享领取
				// uni.navigateTo({
				// 	url: '/pages/index/goodsDetail?goodsId=' + id + '&goodsType=3'
				// });

				this.checkLogin().then(reslove => {
					this.checkVip(id, item);
				});
			} else if (type === 3) {
				uni.navigateTo({
					url: '/pages/index/goodsDetail?goodsId=' + id + '&goodsType=4'
				});
			}
		},
		// checkVip
		checkVip(pid, item) {
			this.showLoading();
			this.request({
				url: '/tryAssemble/postMemberRushProduct',
				method: 'POST',
				data: {
					product_id: pid,
					user_mark_id: this.getUserId()
				},
				success: res => {
					uni.hideLoading();
					console.log('检查vip', res);
					if (res.data.status == 1) {
						console.log(item);
						let goodslist = [
							{
								checkState: true,
								productId: item.id, // 商品id
								productName: item.name,
								productPic: item.picture,
								price: 0,
								number: 1,
								total: 0
							}
						];
						let url = '/pages/index/confirmOrder?from=5&goodslist=' + JSON.stringify(goodslist) + '&buyType=7';
						uni.navigateTo({
							url: url
						});
					} else if (res.data.status == 0) {
						uni.showModal({
							title: '开通会员',
							content: '请先开通会员',
							success: res => {
								if (res.confirm) {
									uni.switchTab({
										url: '/pages/my/my'
									});
								}
							}
						});
					} else {
						this.showToast(res.data.info);
					}
				}
			});
		},
		// 显示申请0元试吃界面
		showTrialView(id) {
			this.showTrial = true;
			this.trialId = id;
		},
		// 点击申请0元试吃按钮
		ApplyTrial() {
			if (!this.trialId) {
				return;
			}
			if (!this.trialText) {
				this.showToast('请输入申请理由');
				return;
			}
			this.checkLogin().then(reslove => {
				this.showLoading();
				this.request({
					url: '/tryAssemble/postAddProductApply',
					method: 'POST',
					data: {
						product_id: this.trialId,
						content: this.trialText,
						user_mark_id: this.getUserId()
					},
					success: res => {
						uni.hideLoading();
						this.showTrial = false;
						this.trialId = null;
						console.log('申请试吃', res);
						if (res.data.status === 1) {
							this.showToast('申请成功!');
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/my/freeGoods'
								});
							}, 800);
						} else {
							this.showToast(res.data.info);
						}
					}
				});
			});
		},
		// 0元试吃请求
		zeroTrial() {
			this.request({
				url: '',
				data: {
					id: this.trialId,
					userId: uni.getStorageSync('userInfo').id
				},
				success: res => {
					uni.hideLoading();
					console.log('0元试吃', res);
					this.showToast(res.data.returnStr);
				}
			});
		},
		//  开通会员试吃
		buyVip(goodsid) {
			uni.showModal({
				content: '需要支付***开通会员来领取',
				title: '开通会员',
				success: modalRes => {
					if (modalRes.confirm) {
						this.showLoading();
						this.request({
							url: '',
							data: {
								goodsid: goodsid,
								userId: uni.getStorageSync('userInfo').id
							},
							success: res => {
								console.log('生成订单数据', res);
								if (res.data.returnCode === 1) {
									this.wxpay(res);
								}
							}
						});
					}
				}
			});
		},
		wxpay(options) {
			uni.requestPayment({
				timeStamp: options.timeStamp,
				nonceStr: options.nonceStr,
				package: options.package,
				signType: 'MD5',
				paySign: options.paySign,
				success: res => {
					uni.hideLoading();
					this.showToast('开通成功');
					console.log('success:' + JSON.stringify(res));
				},
				fail: err => {
					uni.hideLoading();
					this.showToast('开通失败');
					console.log('fail:' + JSON.stringify(err));
				}
			});
		},

		// 去详情
		gotoDetail(id) {
			return;
			if (this.type === 1) {
				return;
			}
			// type 免费试用 2 团购
			// goodsType 2团购 3会员 4分享领取
			uni.navigateTo({
				// url: '/pages/index/goodsDetail?goodsType=' + goodsType + '&goodsId=' + id,
				url: '/pages/index/goodsDetail?goodsId=' + id + '&goodsType=' + Number(this.type)
			});
		}
	}
};
</script>

<style lang="scss">
.Integral {
	padding: 0 30rpx;
	.titBox {
		padding: 30rpx 20rpx;
		.tit {
			line-height: 42rpx;
			color: #000;
			font-size: 28rpx;
			border: 2rpx solid rgba(0, 0, 0, 1);
			padding: 0 24rpx;
			border-radius: 21rpx;
			&.select {
				background: #ff5858;
				color: #ffffff;
				border-color: #ff5858;
			}
		}
	}
	.lsitbox {
		position: relative;
		overflow: hidden;
		border-radius: 20px 20px 0px 0px;
		// top: -15px;
		.titview {
			line-height: 40px;
			margin-top: 20px;
			font-size: 16px;
		}
		.item {
			padding: 30rpx;
			border-bottom: 1rpx solid #ededed;
			& > image {
				width: 220rpx;
				height: 220rpx;
			}
			.infobox {
				margin-left: 34rpx;
				flex: 1;
				height: 260rpx;
				padding: 30rpx 0;
				.info {
					font-size: 28rpx;
					line-height: 40rpx;
					color: #333333;
				}
				.moneybox {
					.money {
						font-size: 28rpx;
						color: #f23030;
						& > text {
							font-size: 22rpx;
						}
					}
					.xl {
						font-size: 26rpx;
						color: #999999;
					}
				}
			}
		}
		.itemFree {
			padding: 0 30rpx;
			margin-bottom: 30rpx;
			background: #ffffff;
			border-radius: 20rpx;
			& > image {
				width: 140rpx;
				height: 140rpx;
			}
			.infobox {
				margin-left: 34rpx;
				flex: 1;
				height: 260rpx;
				padding: 30rpx 0;
				.info {
					font-size: 32rpx;
					line-height: 48rpx;
					color: #000000;
					.typeName {
						margin-right: 4px;
						display: inline-block;
						line-height: 36rpx;
						padding: 2px 6px;
						font-size: 22rpx;
						&.typeName1 {
							color: #ff4b4b;
							border: 1px solid #ff4b4b;
						}
						&.typeName2 {
							color: #ef9b29;
							border: 1px solid #ef9b29;
						}
						&.typeName3 {
							color: #57c77a;
							border: 1px solid #57c77a;
						}
					}
				}
				.moneybox {
					margin-top: 10px;
					.money {
						font-size: 28rpx;
						color: #f23030;
						& > text {
							font-size: 22rpx;
						}
					}
					.xl {
						font-size: 26rpx;
						color: #999999;
					}
					& > button {
						height: 46rpx;
						line-height: 46rpx;
						font-size: 28rpx;
						border-radius: 23rpx;
						padding: 0 24rpx;
						background: #ff5858;
						color: #fff;
					}
				}
			}
		}
	}
}
</style>
