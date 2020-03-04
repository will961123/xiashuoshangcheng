<template>
	<view class="myCollection bg-white flex flex-wrap justify-between">
		<view @click="gotoDetail(item.toId)" class="item" v-for="(item, index) in collectionList" :key="index">
			<!-- <view @click="gotoDetail(type == 1 ? item.toCollectId : item.toId)" class="item" v-for="(item, index) in collectionList" :key="index"> -->
			<image :src="item.toPic" mode="aspectFit"></image>
			<view class="info textov1 ">{{ item.toName }}</view>
			<!-- <view class="info textov1 ">{{ type == 1 ? item.toCollectName : item.toName }}</view> -->
			<!-- <view class="moneybox flex justify-between">
				<view class="money">￥{{ item.price }}</view>
				<view class="xl">销量：{{ item.saleNum }}</view>
			</view> -->
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: 1, //1收藏 2足迹
			collectionList: [
				{ toPic: '/static/goods.jpg', toName: '商品1', toId: 123 },
				{ toPic: '/static/goods.jpg', toName: '商品1', toId: 123 },
				{ toPic: '/static/goods.jpg', toName: '商品1', toId: 123 }
			],
			offset: 1
		};
	},
	onLoad(options) {
		this.type = options.type || 1;
		uni.setNavigationBarTitle({
			title: this.type == 1 ? '收藏' : '足迹'
		});
		// this.type == 1 && this.getCollectionList();
		// this.type == 2 && this.getFootMarkList();
	},
	onReachBottom() {
		this.type == 2 && this.getFootMarkList();
	},
	methods: {
		gotoDetail(id) {
			console.log(id);
			uni.navigateTo({
				url: '/pages/index/goodsDetail?goodsType=1&goodsId=' + id
			});
		},
		getCollectionList() {
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				this.showToast('请先登录');
				return;
			}
			this.showLoading();
			this.request({
				url: '',
				data: {
					userId: userInfo.userId
				},
				success: res => {
					console.log('收藏', res);
					uni.hideLoading();
					if (res.data.returnCode === 1) {
						this.collectionList.push(...res.data.list);
					}
				}
			});
		},
		getFootMarkList() {
			let userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				this.showToast('请先登录');
				return;
			}
			this.showLoading();
			this.request({
				url: '',
				data: {
					userId: userInfo.userId,
					offset: this.offset,
					limit: 10
				},
				success: res => {
					uni.hideLoading();
					console.log('足迹', res);
					if (res.data.returnCode === 1) {
						this.offset += 1;
						this.collectionList.push(...res.data.list);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.myCollection {
	padding: 0 10rpx;
	.item {
		padding-bottom: 15px;
		width: 360rpx;
		& > image {
			width: 360rpx;
			height: 360rpx;
		}
		.info {
			font-size: 24rpx;
			letter-spacing: 1px;
			color: #333333;
			padding: 0 20rpx;
			margin: 10rpx 0 15rpx 0;
		}
		.moneybox {
			padding: 0 20rpx;
			.money {
				font-size: 24rpx;
				letter-spacing: 1rpx;
				color: #f23030;
			}
			.xl {
				font-size: 20rpx;
				letter-spacing: 1rpx;
				color: #999999;
			}
		}
	}
}
</style>
