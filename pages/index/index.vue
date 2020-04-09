<template>
	<view class="index">
		<view class="search bg-white flex align-center">
			<!-- <navigator hover-class="none" url="/pages/index/signIn"><image src="/static/qiandao.png" mode="aspectFit"></image></navigator> -->
			<view class="searchiptbox flex align-center">
				<image src="/static/search.png" mode="aspectFill"></image>
				<navigator hover-class="none" style="flex:1" url="/pages/index/search">
					<input style="width: 100%;" disabled="true" type="text" placeholder="请输入关键字" value="" />
				</navigator>
			</view>
		</view>

		<swiper class="screen-swiper square-dot" :indicator-dots="true" :autoplay="true">
			<swiper-item v-for="(item, index) in swiperList" :key="index"><image :src="item" mode="aspectFill"></image></swiper-item>
		</swiper>

		<!-- <view style="padding:  0 30rpx; " class="bg-white">
			<view class="noteData flex align-center ">
				<image src="/static/gg.png" mode="aspectFit"></image>
				<swiper vertical="true" :autoplay="true">
					<swiper-item style="width: 100%;" class="textov1" v-for="(item, index) in noticeList" :key="index">{{ item.content }}</swiper-item>
				</swiper>
				<text class="more">更多</text>
			</view>
		</view> -->

		<view class="cu-list grid no-border col-4 justify-between" style="padding:  30rpx;">
			<view
				@click="gotoIntegral(index)"
				class="cu-item text-center text-bold "
				style="font-size: 24rpx;color:#383D43;width: 150rpx;line-height: 40px;border:1px solid rgba(112,112,112,1);border-radius: 5px;"
				v-for="(item, index) in cuIconList"
				:key="index"
			>
				{{ item.name }}
			</view>
		</view>

		<!-- <view class="cu-list grid no-border col-4">
			<view @click="gotoCategory(item.id)" class="cu-item" v-for="(item, index) in cuIconList" :key="index">
				<view class="imgbox"><image :src="`/static/icon_idx_${Number(index) + 1}.png`" mode=""></image></view>
				<text>{{ item }}</text> 
			</view>
		</view> -->

		<!-- <view class="vipbox bg-white flex">
			<image @click="gotoIntegral(1)" class="left" src="/static/vipzx.png"></image>
			<view class="right" style="overflow: hidden;">
				<image @click="gotoIntegral(2)" style="border-bottom: 1rpx solid #ededed;" src="/static/jfsc.png"></image>
				<image @click="gotoIntegral(3)" src="/static/newpeople.png"></image>
			</view>
		</view> -->

		<view class="hotgoods bg-white">
			<view class="hot_tit">
				<image class="bgimg" src="/static/hotgoods.png" mode=""></image>
				精品展示
			</view>
			<view class="listbox  flex justify-between">
				<view @click="gotoDetail(item.id)" class="item" v-for="(item, index) in hootGoods" :key="index">
					<image :src="item.picture" style="border-radius: 14rpx;" mode="aspectFill"></image>
					<view class="title textov2">{{ item.name }}</view>
					<view class="moneybox flex justify-between align-center">
						<view class="money flex align-center">
							<text>￥</text>
							{{ item.price }}
							<!-- <text class="oldMoney">￥{{ item.mark_price }}</text> -->
						</view>
						<!-- <view class="num">销量:{{ item.sale_num }}</view> -->
					</view>
				</view>
			</view>
			<!-- <view class="listbox2 ">
				<view @click="gotoDetail(item.id)" class="item flex" v-for="(item, index) in hootGoods" :key="index">
					<image :src="item.smallPic" mode="widthFix"></image>
					<view class="flex flex-direction justify-between" style="flex: 1;">
						<view class="title textov2">{{ item.name }}</view>
						<view class="typeBox flex">
							<view class="typeName">折扣</view>
							<view class="typeName">保真</view>
						</view>
						<view class="moneybox flex justify-between align-center"  >
							<view class="money ">
								<text>￥</text>
								{{ item.price }}
								<text class="oldMoney">￥123</text>
							</view>
							<view class="num">销量:{{ item.saleNum }}</view>
						</view>
					</view>
				</view>
			</view> -->
		</view>

		<!-- #ifdef MP-WEIXIN -->
		<will-mc class="mc" v-if="showGetAuthor">
			<view class="_mcMain bg-white ">
				<image @click="showGetAuthor = false" src="/static/delect.png" mode=""></image>
				<view class="tit">欢迎授权登录苍都牧场</view>
				<view class="tip">授权登录后即可使用哦~</view>
				<button @getuserinfo="getOpenId_btn" class="btn cu-btn" open-type="getUserInfo">点击授权</button>
			</view>
		</will-mc>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			search: '',
			swiperList: [],
			noticeList: [{ content: '公告1' }, { content: '公告2' }],
			cuIconList: [
				{ name: '免费试吃>', pic: '/static/indexicon1.png' },
				{ name: '超级团购', pic: '/static/indexicon2.png' },
				{ name: '幸运转盘', pic: '/static/indexicon3.png' },
				{ name: '会员投稿', pic: '/static/indexicon4.png' }
				// { name: '视频', pic: '/static/indexicon5.png' },
				// { name: '文章', pic: '/static/indexicon6.png' }
			],
			// cuIconList: ['免费试吃', '超级团购', '幸运转盘', '会员投稿', '视频', '文章'],
			offset: 1,
			hootGoods: [
				// { smallPic: '/static/goods.jpg', name: '热门1', price: 100, saleNum: 999, id: 1 }
			],
			showGetAuthor: false,
			userInfo: {}
		};
	},
	onLoad() {
		this.getSwiperList();
		this.getHotGoods();
		// this.getActivity();
		// this.getCategoryList();
		// this.findNoticeBySysCode()
	},
	onReachBottom() {
		// this.getHotGoods();
	},
	onShow() {
		// if (!this.isLoad()) {
		// 	// #ifdef MP-WEIXIN
		// 	this.showGetAuthor = true;
		// 	// #endif
		// } else {
		// 	// #ifdef MP-WEIXIN
		// 	this.showGetAuthor = false;
		// 	// #endif
		// }
	},
	onShareAppMessage(res) {
		return {
			title: '苍都牧场',
			path: '/pages/index/index?parentId=' + this.getUserId() || ''
			// imageUrl: '测试图片'
		};
	},
	methods: {
		shaerApp(options = {}) {
			let { title, path, imageUrl } = { ...options };
			var obj = {
				title,
				path,
				imageUrl
			};
			console.log(obj);
		},
		// #ifdef MP-WEIXIN
		getOpenId_btn(e) {
			this.getOpenId(e, this);
		},
		// #endif
		gotoDetail(id) {
			uni.navigateTo({
				url: '/pages/index/goodsDetail?goodsId=' + id
			});
		},
		gotoIntegral(type) {
			let url = '';
			switch (type) {
				case 0:
					url = '/pages/index/Integral?type=' + 1;
					// url = '/pages/index/Integral?type=' + 1 + '&parentId=' + (this.getUserId() || '') + '&goodsId=73';
					break;
				case 1:
					url = '/pages/index/groupPurchase';
					break;
				case 2:
					url = '/pages/index/luckDraw';
					break;
				case 3:
					url = '/pages/index/categoryList';
					break;
				case 4:
					url = '/pages/index/prodectList?type=' + 1;
					break;
				case 5:
					url = '/pages/index/prodectList?type=' + 2;
					break;
			}
			console.log(url);
			uni.navigateTo({
				url: url
			});
		},
		findNoticeBySysCode() {
			this.request({
				url: '',
				data: {},
				success: res => {
					console.log('系统公告', res);
					if (res.data.returnCode === 1) {
						this.noticeList = res.data.list;
					}
				}
			});
		},
		getCategoryList() {
			this.request({
				url: '',
				data: {},
				success: res => {
					console.log('分类', res);
					if (res.data.returnCode === 1) {
						this.cuIconList = res.data.list;
					}
				}
			});
		},
		gotoCategory(id) {
			uni.setStorageSync('tabCurId', id);
			uni.switchTab({
				url: '/pages/category/category'
			});
		},
		getSwiperList() {
			this.request({
				url: '/index/index',
				data: {},
				success: res => {
					console.log('轮播图', res);
					if (res.data.status === 1) {
						this.swiperList = res.data.head_images_list.map(i => {
							return res.data.image_url + i;
						});
					}
				}
			});
		},
		getActivity() {
			this.request({
				url: '',
				data: {},
				success: res => {
					console.log('活动', res);
					if (res.data.returnCode === 1) {
					}
				}
			});
		},

		getHotGoods() {
			this.showLoading();
			this.request({
				url: '/index/productRecommendList',
				data: {},
				success: res => {
					console.log('查询热门商品', res);
					uni.hideLoading();
					if (res.data.status === 1) {
						res.data.product_recommend_list = res.data.product_recommend_list.map(i => {
							i.picture = res.data.image_url + i.picture;
							return i;
						});
						this.hootGoods.push(...res.data.product_recommend_list);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f5f5f5;
	padding-bottom: 10px;
}
.index {
	.search {
		padding: 20rpx 30rpx;
		& > navigator {
			& > image {
				width: 20px;
				height: 20px;
				margin-right: 15px;
			}
		}
		.searchiptbox {
			background: #f5f5f5;
			height: 30px;
			border-radius: 15px;
			padding: 0 30rpx;
			font-size: 26rpx;
			flex: 1;

			& > image {
				width: 16px;
				height: 16px;
				margin-right: 20rpx;
			}
			input {
				height: 30px;
				flex: 1;
			}
		}
	}

	.noteData {
		padding: 30rpx 0;
		& > image {
			width: 148rpx;
			height: 34rpx;
		}
		& > swiper {
			flex: 1;
			height: 1.5em;
			line-height: 1.5em;
			margin: 0 30rpx;
		}
		.more {
			font-size: 26rpx;
			letter-spacing: 1px;
			color: #f23030;
		}
	}

	.cu-list {
		margin-bottom: 10px;
		.cu-item {
			padding-bottom: 10rpx !important;
			& > text {
				font-size: 24rpx;
				color: #333;
			}
			.imgbox {
				image {
					width: 112rpx;
					height: 112rpx;
					border-radius: 50%;
				}
			}
		}
	}

	.vipbox {
		height: 480rpx;
		.left {
			width: 330rpx;
			height: 100%;
			border-right: 1rpx solid #ededed;
		}
		.right {
			flex: 1;
			image {
				box-sizing: border-box;
				width: 100%;
				height: 50%;
			}
		}
	}

	.hotgoods {
		padding: 0 30rpx;
		padding-top: 15px;
		margin-top: 10px;
		.hot_tit {
			margin: 0 auto;
			text-align: center;
			width: 220px;
			height: 30px;
			line-height: 30px;
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
			position: relative;
			.bgimg {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
			}
		}
		.listbox {
			flex-wrap: wrap;
			.item {
				// width: calc(50% - 10rpx);
				padding-bottom: 30rpx;
				width: 340rpx;
				margin-top: 15rpx;
				& > image {
					width: 340rpx;
					height: 340rpx;
				}
				.title {
					font-size: 26rpx;
					line-height: 36rpx;
					color: #000000;
					margin: 15px 0;
				}
				.moneybox {
					.money {
						color: #f23030;
						font-size: 28rpx;
						& > text {
							font-size: 20rpx;
						}
						.oldMoney {
							color: #bababa;
							font-size: 24rpx;
							text-decoration: line-through;
							margin-left: 5px;
						}
					}
					.num {
						font-size: 22rpx;
						color: #999999;
					}
				}
			}
		}
		.listbox2 {
			.item {
				margin-top: 15px;
				& > image {
					width: 212rpx;
					height: 212rpx;
					margin-right: 30rpx;
				}
				.title {
					font-size: 26rpx;
					line-height: 36rpx;
					color: #000000;
				}
				.typeBox {
					.typeName {
						line-height: 36rpx;
						padding: 0 6px;
						border: 1px solid #a7a7a7;
						color: #a7a7a7;
						font-size: 22rpx;
						text-align: center;
						margin-right: 8px;
					}
				}
				.moneybox {
					.money {
						color: #ff6060;
						font-size: 32rpx;
						& > text {
							font-size: 20rpx;
						}
						.oldMoney {
							color: #bababa;
							font-size: 24rpx;
							text-decoration: line-through;
							margin-left: 5px;
						}
					}
					.num {
						font-size: 24rpx;
						color: #999999;
					}
				}
			}
		}
	}
}
</style>
