<template>
	<view class="goodsDetail">
		<swiper class="banner_sw" :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item, index) in goodsInfo.images" :key="index"><image :src="item" mode="aspectFill"></image></swiper-item>
		</swiper>
		<view class="infobox bg-white ">
			<view style="padding: 30rpx;">
				<view class="info">{{ goodsInfo.name }}</view>
				<view class="moneybox flex justify-between">
					<view class="">
						￥
						<text class="money">{{ goodsInfo.price }}</text>
						<text class="showmoney">￥{{ goodsInfo.mark_price }}</text>
					</view>
					<view class="kd" style="color: #999;">销量：{{ goodsInfo.sale_num }}</view>
				</view>
				<!-- <view v-if="goodsInfo.hot != 4" class="moneybox">
					￥
					<text class="money">{{ goodsInfo.price }}</text>
					<text class="showmoney">￥{{ goodsInfo.showPrice }}</text>
				</view> -->
				<!-- <view v-else class="moneybox">
					积分
					<text class="money">{{ goodsInfo.needIntegral }}</text>
					<text class="showmoney">￥{{ goodsInfo.showPrice }}</text>
				</view> -->
				<!-- <view class="kdbox flex justify-between">
					<view class="kd">剩余数量：{{ goodsInfo.stock || 0 }}</view>
					<view class="kd">销量：{{ goodsInfo.saleNum }}</view>
					<view class="kd">{{ goodsInfo.address || '暂无地址' }}</view>
				</view> -->
			</view>
			<!-- <view @click="showSpec = true" class="gg flex align-center">
				<text>规格</text>
				<view v-if="spaceIndex === -1" class="selectgg">请选择规格</view>
				<view v-else class="selectgg">{{ goodsInfo.specList[spaceIndex].name }}</view>
				<image src="/static/aroow.png" mode="aspectFit"></image>
			</view> -->
			<view v-if="goodsType === 2" class="assemble  ">
				<view class="tit text-center">他们正在拼团 赶快加入把</view>
				<view v-for="(item, index) in assembleList" :key="index" class="item flex align-center justify-between ">
					<view class="left flex align-center">
						<image :src="item.user.captain.pic" mode="aspectFill"></image>
						<text>{{ item.user.captain.name }}</text>
					</view>
					<view class="right flex align-center">
						<text>{{ item.totNum }}人拼 还差{{ item.nowNum }}人成团</text>
						<button @click="buyNow(2, item)" class="btn cu-btn bg-red ">去参团</button>
					</view>
				</view>
			</view>
			<view class="pzbzlist flex align-center">
				<view class="item flex align-center">
					<image src="/static/detaildui.png" mode="aspectFit"></image>
					<text>品质保障</text>
				</view>
				<view class="item">
					<image src="/static/detaildui.png" mode="aspectFit"></image>
					<text>精选品牌</text>
				</view>
				<view class="item">
					<image src="/static/detaildui.png" mode="aspectFit"></image>
					<text>成本价</text>
				</view>
			</view>
			<!-- <view class="pjnumbox gg flex align-center justify-between">
				<text>评价</text>
				<view class="flex align-center" @click="gotoGoodsEvaluate">
					查看更多评价
					<image src="/static/aroow.png" mode="aspectFit"></image>
				</view>
			</view> -->
			<!-- <view v-if="evaluate.length" class="pingjiaone">
				<view class="userbox flex align-center">
					<image :src="evaluate[0].userPic" mode="aspectFill"></image>
					<text class="name">{{ evaluate[0].userName }}</text>
					<text>{{ evaluate[0].data }}</text>
				</view>
				<view class="commenttxt">{{ evaluate[0].content }}</view>
				<view class="commentImgBox flex flex-wrap justify-start ">
					<view class="imgbox text-center" v-for="(img, idx) in evaluate[0].picList" :key="idx"><image :src="img.commentPic" mode="aspectFill"></image></view>
				</view>
			</view>
			<view v-if="evaluate.length" @click="gotoGoodsEvaluate" class="findmore flex justify-center align-center ">
				查看更多评价
				<image src="/static/aroow.png" mode="aspectFit"></image>
			</view> -->
			<view style="background: #f5f5f5;height: 10px;"></view>
		</view>

		<view class="changeTit bg-white flex" style=" font-size: 30rpx;color: #333;line-height: 40px;text-align: center;">
			<view @click="titType = 1" :class="titType === 1 ? 'tit titselect' : 'tit'" style="flex: 1;">图文详情</view>
			<view @click="titType = 2" :class="titType === 2 ? 'tit titselect' : 'tit'" style="flex: 1;">商品评价</view>
		</view>
		<!-- <rich-text v-if="titType === 1" :nodes="goodsInfo.details | replaceImgStr"></rich-text> -->
		<view class="detailImgbox" v-if="titType === 1"><image v-for="(item, index) in goodsInfo.detail_image" :key="index" :src="item" mode="widthFix"></image></view>
		<view v-else class="pingjiaList">
			<view class="item">
				<view class="userbox flex align-center">
					<image :src="evaluate[0].userPic" mode="aspectFill"></image>
					<text class="name">{{ evaluate[0].userName }}</text>
					<text>{{ evaluate[0].data }}</text>
				</view>
				<view class="commenttxt">{{ evaluate[0].content }}</view>
				<!-- <view class="commentImgBox flex flex-wrap justify-start ">
					<view class="imgbox text-center" v-for="(img, idx) in evaluate[0].picList" :key="idx"><image :src="img.commentPic" mode="aspectFill"></image></view>
				</view> -->
			</view>
		</view>

		<!-- <view class="fuwenbenbox">
			<view class="bg-white" style="text-align: center;font-size: 30rpx;color: #333;line-height: 40px;">宝贝详情</view>
			<rich-text :nodes="goodsInfo.details | replaceImgStr"></rich-text>
		</view> -->

		<view class="bottombox flex bg-white">
			<view class="left flex align-center justify-around">
				<view class="item flex flex-direction align-center" style="position: relative;">
					<image src="/static/detailkf.png" mode=""></image>
					<text>客服</text>
					<button open-type="contact" style="width: 100%;height: 100%;position: absolute;left: 0;top: 0;opacity: 0;"></button>
				</view>
				<!-- <view class="item flex flex-direction align-center">
					<image
						@click="Collection(goodsInfo.collectType == 1 ? 2 : 1)"
						:src="goodsInfo.collectType == 1 ? '/static/detailscyes.png' : '/static/detailscno.png'"
						mode=""
					></image>
					<text>收藏</text>
				</view> -->
			</view>
			<button @click="showSpec = true" class=" cu-btn add">加入购物车</button>
			<button v-if="goodsType === 2" @click="showSpec = true" class=" cu-btn buy">发起拼团</button>
			<button v-if="goodsType === 3" @click="showSpec = true" class=" cu-btn buy">{{ userInfo.isVip ? '免费领取' : '升级会员' }}</button>
			<button v-if="goodsType === 4 && goodsInfo.canGetShareGoods" @click="showSpec = true" class=" cu-btn buy">免费领取</button>
			<button v-if="goodsType === 4 && !goodsInfo.canGetShareGoods" open-type="share" class=" cu-btn buy">立即分享</button>
			<button v-if="goodsType === 1" @click="showSpec = true" class=" cu-btn buy">立即购买</button>
			<!-- <button v-if="goodsType === 2" @click="showSpec = true" class=" cu-btn buy">发起拼团</button>
			<button v-else @click="showSpec = true" class=" cu-btn buy">立即购买</button> -->
		</view>

		<!-- 规格 -->
		<view v-show="showSpec" @click="showSpec = false" class="cu-modal bottom-modal" style="z-index: 500;" :class="showSpec ? 'show' : ''">
			<view class="cu-dialog bg-white" @click.stop="" v-show="goodsInfo">
				<view style="padding: 0 30rpx;">
					<view class="specinfo flex ">
						<image :src="spaceIndex > -1 ? goodsInfo.specList[spaceIndex].picture : goodsInfo.picture" mode="aspectFill"></image>
						<view class="monrybox flex flex-direction justify-between">
							<view class="money">
								￥
								<text>{{ spaceIndex > -1 ? goodsInfo.specList[spaceIndex].price : goodsInfo.price }}</text>
							</view>
							<view class="kc">销量{{ goodsInfo.sale_num }}件</view>
						</view>
					</view>
					<!-- <view class="specList">
						<view class="tit">规格</view>
						<text
							@click="spaceChange(spaceIdx)"
							v-for="(spaceItm, spaceIdx) in goodsInfo.specList"
							:key="spaceIdx"
							:class="{ select: spaceIndex === spaceIdx }"
							class="item"
						>
							{{ spaceItm.name }}
						</text>
					</view> -->
					<view style="height: 40px;width: 100%;"></view>
					<view class="numbox flex justify-between align-center">
						<text class="tit">数量</text>
						<sunui-stepper :val="1" :min="1" :max="999" @change="stepperChange"></sunui-stepper>
					</view>
					<view style="height: 20px;width: 100%;"></view>
				</view>
				<view class="btnbox">
					<button @click="addCrats" class=" cu-btn add">加入购物车</button>
					<!-- // buyType 1普通 2参与拼图 3发起拼图 4会员 5分享 -->
					<!-- // goodsType 1 普通商品 2团购 3会员 4分享领取 -->
					<button v-if="goodsType === 2" @click="buyNow(3)" class=" cu-btn buy">发起拼团</button>
					<button v-if="goodsType === 3" @click="buyNow(4)" class=" cu-btn buy">{{ userInfo.isVip ? '免费领取' : '升级会员' }}</button>
					<button v-if="goodsType === 4 && goodsInfo.canGetShareGoods" @click="buyNow(5)" class=" cu-btn buy">免费领取</button>
					<button v-if="goodsType === 4 && !goodsInfo.canGetShareGoods" open-type="share" class=" cu-btn buy">立即分享</button>
					<button v-if="goodsType === 1" @click="buyNow(1)" class=" cu-btn buy">立即购买</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			goodsInfo: {},
			// goodsInfo: {
			// 	bannerList: [
			// 		{
			// 			src: '/static/aboutusbg.png'
			// 		}
			// 	],
			// 	productId: 1,
			// 	smallPic: '/static/goods.jpg',
			// 	name: '商品1',
			// 	price: 100,
			// 	showPrice: 999,
			// 	stock: 123,
			// 	saleNum: 233,
			// 	hot: 1,
			// 	specList: [
			// 		{
			// 			picture: '/static/banner.png',
			// 			name: '规格1',
			// 			price: 30,
			// 			id: 2333
			// 		}
			// 	],
			// 	details: '<p>富文本</p>',
			// 	canGetShareGoods: false
			// },
			evaluate: [
				{
					userPic: '/static/headerpic.png',
					userName: '用户名',
					data: '2020-03-06 21:20:20',
					content: '评价内容',
					picList: [{ commentPic: '/static/goods.jpg' }]
				}
			],
			assembleList: [
				{
					user: {
						captain: {
							name: '队长1',
							pic: '/static/goods.jpg'
						},
						team: []
					},
					totNum: 2,
					nowNum: 1,
					id: 1
				},
				{
					user: {
						captain: {
							name: '队长1',
							pic: '/static/goods.jpg'
						},
						team: [{ name: '队员1', pic: '/static/goods.jpg' }]
					},
					totNum: 2,
					nowNum: 1,
					id: 1
				}
			],
			// 存放选择的规格
			spaceIndex: -1,
			spaceNum: 1,

			showSpec: false,
			goodsId: '',

			goodsType: 1, // 1 普通商品 2团购 3会员 4分享领取
			userInfo: {
				isVip: false
			},
			searchUserId: '',

			titType: 1 //1 图文 2 评价
		};
	},
	onLoad(options) {
		options.goodsId ? (this.goodsId = options.goodsId) : '';
		options.goodsType ? (this.goodsType = Number(options.goodsType)) : (this.goodsType = 1);
		options.searchUserId ? (this.searchUserId = options.searchUserId) : (this.searchUserId = '');
		this.searchUserId && AddsearchNum();
		console.log('1 普通商品 2团购 3会员 4分享领取---', this.goodsType);

		this.getGoodsDetail();
		// this.findCommentByProductId();
		// this.saveFootMark();
	},
	onShareAppMessage(e) {
		if (e.from === 'button') {
			console.log(e.target);
			return {
				title: '免费试吃',
				path: '/pages/index/goodsDetail?goodsId=' + id + '&goodsType=4' + '&searchUserId=' + uni.getStorageSync('userInfo').id
				// imageUrl:'/static/goods.jpg'
			};
		}
	},
	filters: {
		replaceImgStr(val) {
			return val ? val.replace(/\<img/gi, '<img style="width:100%;height:auto" ') : val;
		}
	},
	methods: {
		addCrats() {
			return;
			if (this.goodsInfo.hot != '1' && this.goodsInfo.hot != '2') {
				this.showToast('特殊商品不能添加');
				return;
			}
			if (this.spaceIndex < 0) {
				this.showToast('请选择规格');
				return;
			}
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				this.showToast('请登录');
				return;
			}
			this.showLoading();
			this.request({
				url: '/appShoppingCart/save',
				data: {
					userId: userInfo.userId,
					productId: this.goodsId,
					specId: this.goodsInfo.specList[this.spaceIndex].id,
					num: this.spaceNum
				},
				success: res => {
					uni.hideLoading();
					if (res.data.returnCode === 1) {
						this.showToast('添加成功');
					} else {
						this.showToast(res.data.returnStr);
					}
				}
			});
		},
		AddsearchNum() {
			if (!this.searchUserId) {
				return;
			}
			this.request({
				url: '',
				data: {
					searchUserId: this.searchUserId,
					userId: uni.getStorageSync('userInfo').id
				},
				success: res => {
					console.log('给分享者增加分享数量', res);
				}
			});
		},
		buyNow(buyType, assemble) {
			// buyType 1普通 2参与拼图 3发起拼图 4会员 5分享
			// if (this.spaceIndex < 0) {
			// 	this.showToast('请选择规格');
			// 	return;
			// }
			// let goodslist = [
			// 	{
			// 		checkState: true,
			// 		productId: this.goodsId,
			// 		productName: this.goodsInfo.name,
			// 		productPic: this.goodsInfo.specList[this.spaceIndex].picture ? this.goodsInfo.specList[this.spaceIndex].picture : this.goodsInfo.smallPic,
			// 		productSpecId: this.goodsInfo.specList[this.spaceIndex].id,
			// 		productSpecName: this.goodsInfo.specList[this.spaceIndex].name,
			// 		price: Number(this.goodsInfo.specList[this.spaceIndex].price),
			// 		number: this.spaceNum,
			// 		total: Number(this.goodsInfo.specList[this.spaceIndex].price) * Number(this.spaceNum),
			// 		hot: this.goodsInfo.hot
			// 	}
			// ];

			let goodslist = [
				{
					checkState: true,
					productId: this.goodsId,
					productName: this.goodsInfo.name,
					productPic: this.goodsInfo.picture,
					price: Number(this.goodsInfo.price),
					number: this.spaceNum,
					total: Number(this.goodsInfo.price) * Number(this.spaceNum)
				}
			];
			if (this.goodsInfo.hot == 4) {
				goodslist[0].needIntegral = Number(this.goodsInfo.specList[this.spaceIndex].price);
			}
			this.showSpec = false;
			let url = '/pages/index/confirmOrder?from=1&goodslist=' + JSON.stringify(goodslist);
			// buyType 1普通 2参与拼图 3发起拼图 4会员 5分享
			if (buyType === 1) {
				uni.navigateTo({
					url: url
				});
			} else if (buyType === 2) {
				url = '/pages/index/confirmOrder?from=1&goodslist=' + JSON.stringify(goodslist) + '&buyType=2' + '&assemble=' + JSON.stringify(assemble);
				uni.navigateTo({
					url: url
				});
			} else if (buyType === 3) {
				url = '/pages/index/confirmOrder?from=1&goodslist=' + JSON.stringify(goodslist) + '&buyType=3';
				uni.navigateTo({
					url: url
				});
			} else if (buyType === 4) {
				url = '/pages/index/confirmOrder?from=1&goodslist=' + JSON.stringify(goodslist) + '&buyType=4';
				if (this.userInfo.isVip) {
					uni.navigateTo({
						url: url
					});
				} else {
					this.buyVip(this.goodsId);
				}
			} else if (buyType === 5) {
				url = '/pages/index/confirmOrder?from=1&goodslist=' + JSON.stringify(goodslist) + '&buyType=5';
				if (this.goodsInfo.canGetShareGoods) {
					uni.navigateTo({
						url: url
					});
				} else {
					uni.showModal({
						title: '请分享商品',
						content: '分享小程序给朋友领取奖励',
						showCancel: false,
						showCancel: true,
						success: res => {
							if (res.confirm) {
								console.log('分享');
							}
						}
					});
				}
			}
		},
		//  开通会员试吃
		buyVip(goodsid) {
			uni.showModal({
				content: '需要支付***开通会员来领取',
				title: '开通会员',
				success: modalRes => {
					if (modalRes.confirm) {
						// this.$set(this.userInfo,'isVip',true)
						//  return
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
		Collection(type = 1) {
			// 1 收藏 2 取消
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				this.showToast('请先登录');
				return;
			}
			let url = '/appCollect/saveCollect';
			let formeData = {
				// #ifdef MP-WEIXIN
				userId: userInfo.userId,
				// #endif
				// #ifdef APP-PLUS
				userId: userInfo.userId,
				// #endif
				// #ifdef H5
				userId: userInfo.userId,
				// #endif
				toCollectId: this.goodsId,
				toCollectType: 'product'
			};
			if (type === 2) {
				url = '/appCollect/cancelCollect';
				formeData = {
					// #ifdef MP-WEIXIN
					userId: userInfo.userId,
					// #endif
					// #ifdef H5
					userId: userInfo.userId,
					// #endif
					// #ifdef APP-PLUS
					userId: userInfo.userId,
					// #endif
					toCollectId: this.goodsId
				};
			}
			this.showLoading();
			this.request({
				url: url,
				data: formeData,
				success: res => {
					console.log(type === 1 ? '收藏' : '取消收藏', res);
					uni.hideLoading();
					if (res.data.returnCode === 1) {
						this.showToast(type === 1 ? '收藏成功' : '取消收藏成功');
						this.goodsInfo.collectType = type === 1 ? 1 : -1;
					} else {
						this.showToast(res.data.returnStr);
					}
				}
			});
		},
		getGoodsDetail() {
			this.showLoading();
			this.request({
				url: '/product/productShow/' + this.goodsId,
				data: {},
				success: res => {
					console.log('商品详情', res);
					uni.hideLoading();
					if (res.data.status === 1) {
						res.data.product_info.images = res.data.product_info.images.map(i => {
							return res.data.image_url + i;
						});
						res.data.product_info.detail_image = res.data.product_info.detail_image.map(i => {
							return res.data.image_url + i;
						});
						res.data.product_info.picture = res.data.image_url + res.data.product_info.picture;
						this.goodsInfo = res.data.product_info;
						// this.goodsInfo = Object.assign({}, this.goodsInfo, res.data.obj);
					}
				}
			});
		},
		findCommentByProductId() {
			this.request({
				url: '	/appComment/findCommentByProductId',
				data: {
					toId: this.goodsId,
					offset: 1,
					limit: 1
				},
				success: res => {
					console.log('评论信息', res);
					if (res.data.returnCode === 1) {
						this.evaluate = res.data.list;
					}
				}
			});
		},
		saveFootMark() {
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				return;
			}
			let formdata = {
				// #ifdef MP-WEIXIN
				userId: userInfo.userId,
				userOpenid: uni.getStorageSync('openId'),
				// #endif
				// #ifdef H5
				userId: userInfo.userId,
				userOpenid: '',
				// #endif
				// #ifdef APP-PLUS
				userId: userInfo.userId,
				userOpenid: '',
				// #endif
				userPic: userInfo.wxPic,
				userName: userInfo.name || userInfo.wxName,
				toId: this.goodsId,
				toType: 'product'
			};

			this.request({
				url: '/appFootMark/saveFootMark',
				data: formdata,
				success: res => {
					console.log('保存足迹', res);
				}
			});
		},
		gotoGoodsEvaluate() {
			uni.navigateTo({
				url: '/pages/index/goodsEvaluate?goodsId=' + this.goodsId
			});
		},
		spaceChange(idx) {
			this.spaceIndex = idx;
		},
		stepperChange(e) {
			this.spaceNum = e.val;
		}
	}
};
</script>

<style lang="scss">
.goodsDetail {
	padding-bottom: 48px;
	.banner_sw {
		height: 375px;
		width: 100%;
		swiper-item {
			width: 100%;
			height: 100%;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	.infobox {
		.info {
			font-size: 32rpx;
			font-weight: bold;
			font-stretch: normal;
			line-height: 48rpx;
			letter-spacing: 2rpx;
			color: #333333;
		}
		.moneybox {
			font-size: 28rpx;
			color: #f23030;
			.money {
				font-size: 40rpx;
			}
			.showmoney {
				color: #999999;
				margin-left: 10rpx;
				text-decoration: line-through;
			}
		}
		.kdbox {
			font-size: 26rpx;
			color: #999999;
			margin: 20px 0;
		}
		.gg {
			height: 56px;
			border-top: 1rpx solid #ededed;
			padding: 0 30rpx;
			& > text {
				font-size: 26rpx;
				color: #999999;
			}
			.selectgg {
				font-size: 28rpx;
				color: #333333;
				flex: 1;
				margin-left: 30rpx;
			}
			& > image {
				width: 14rpx;
				height: 24rpx;
			}
		}
		.assemble {
			padding: 20px 0;
			.tit {
				font-size: 16px;
			}
			.item {
				padding: 10px 30rpx;
				border-bottom: 1rpx solid #ededed;
				.left {
					& > image {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
						margin-right: 20rpx;
					}
					& > text {
						width: 80rpx;
					}
				}
				.right {
					font-size: 12px;
					& > text {
						margin-right: 20rpx;
					}
				}
			}
		}
		.pzbzlist {
			background: #f5f5f5;
			padding-left: 34rpx;
			height: 40px;
			.item {
				margin-right: 34rpx;
				& > image {
					width: 24rpx;
					height: 24rpx;
					margin-right: 20rpx;
				}
				& > text {
					font-size: 22rpx;
					color: #666666;
				}
			}
		}
		.pjnumbox {
			font-size: 26rpx;
			color: #999999;
			& > text {
				font-size: 30rpx;
				color: #333333;
			}
			image {
				width: 14rpx;
				height: 24rpx;
				margin-left: 20rpx;
			}
		}

		.pingjiaone {
			padding: 0 30rpx;
			font-size: 26rpx;
			border: 1rpx solid #ededed;
			color: #333;
			.userbox {
				font-size: 22rpx;
				color: #999999;
				margin: 20rpx 0;
				.name {
					font-size: 26rpx;
					color: #333;
					flex: 1;
				}
				& > image {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}
			}
			.commenttxt {
				font-size: 26rpx;
				line-height: 36rpx;
				letter-spacing: 1rpx;
				color: #333333;
			}
			.commentImgBox {
				.imgbox {
					margin-top: 10px;
					width: calc(100% / 3);
					& > image {
						width: 220rpx;
						height: 220rpx;
					}
				}
			}
			.ggg {
				line-height: 30px;
				font-size: 22rpx;
				color: #999999;
			}
		}
		.findmore {
			font-size: 26rpx;
			line-height: 40px;
			color: #666666;
			& > image {
				width: 14rpx;
				height: 24rpx;
				margin-left: 20rpx;
			}
		}
	}
	.changeTit {
		.titselect {
			color: #ff7f69;
			border-bottom: 1rpx solid #ff7f69;
		}
	}
	.detailImgbox {
		width: 100%;

		font-size: 0;
		& > image {
			width: 100%;
			display: inline-block;
		}
	}
	.pingjiaList {
		padding-bottom: 20px;
		.item {
			padding: 10px 30rpx;
			font-size: 26rpx;
			border: 1rpx solid #ededed;
			color: #333;
			background: #fff;
			.userbox {
				font-size: 22rpx;
				color: #999999;
				margin: 20rpx 0;
				.name {
					font-size: 26rpx;
					color: #333;
					flex: 1;
				}
				& > image {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}
			}
			.commenttxt {
				font-size: 26rpx;
				line-height: 36rpx;
				letter-spacing: 1rpx;
				color: #333333;
			}
			.commentImgBox {
				.imgbox {
					margin-top: 10px;
					width: calc(100% / 3);
					& > image {
						width: 220rpx;
						height: 220rpx;
					}
				}
			}
			.ggg {
				line-height: 30px;
				font-size: 22rpx;
				color: #999999;
			}
		}
	}
	.bottombox {
		width: 100%;
		height: 48px;
		position: fixed;
		left: 0;
		bottom: 0;
		.left {
			flex: 1;
			.item {
				font-size: 22rpx;
				& > image {
					width: 40rpx;
					height: 40rpx;
				}
			}
		}

		.cu-btn {
			line-height: 48px;
			height: 100%;
			width: 260rpx;
			color: #fff;
			border-radius: 0;
		}
		.add {
			background: #000;
		}
		.buy {
			background-image: linear-gradient(-90deg, #ff826a 0%, #ff585f 100%);
		}
	}

	.cu-dialog {
		text-align: left;
		border-radius: 20rpx 20rpx 0px 0px;
		.specinfo {
			padding: 30rpx 0;
			border-bottom: 1rpx solid #e5e5e5;
			& > image {
				width: 185rpx;
				height: 185rpx;
			}
			.monrybox {
				margin-left: 30rpx;
				padding-bottom: 10rpx;
				.money {
					color: #f23030;
					font-size: 24rpx;
					& > text {
						font-size: 36rpx;
					}
				}
				.kc {
					font-size: 26rpx;
					line-height: 48rpx;
					letter-spacing: 1rpx;
					color: #333333;
				}
			}
		}
		.specList {
			min-height: 420rpx;
			padding: 30rpx 0;
			border-bottom: 1rpx solid #e5e5e5;
			.tit {
				font-size: 32rpx;
				line-height: 48rpx;
				letter-spacing: 2rpx;
				color: #333333;
			}
			.item {
				border-radius: 8rpx;
				display: inline-block;
				line-height: 60rpx;
				height: 60rpx;
				padding: 0 35rpx;
				font-size: 26rpx;
				letter-spacing: 1rpx;
				color: #4d4d4d;
				background: #f5f5f5;
				margin-top: 30rpx;
				margin-right: 30rpx;
				&.select {
					color: #ff585f;
					background-color: #fff2f3;
					border: 1rpx solid #ff826a;
				}
			}
		}
		.numbox {
			padding: 30rpx 0;
			.tit {
				font-size: 32rpx;
				line-height: 48rpx;
				letter-spacing: 2rpx;
				color: #333333;
			}
		}

		.btnbox {
			.cu-btn {
				line-height: 48px;
				height: 100%;
				width: 50%;
				color: #fff;
				border-radius: 0;
			}
			.add {
				background: #000;
			}
			.buy {
				background-image: linear-gradient(-90deg, #ff826a 0%, #ff585f 100%);
			}
		}
	}
}
</style>
