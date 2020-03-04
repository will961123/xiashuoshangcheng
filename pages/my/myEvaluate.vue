<template>
	<view class="myEvaluate">
		<view class="addEvaluate bg-white flex justify-between align-center">
			<view class="uinfobox flex align-center">
				<image :src="userInfo ? userInfo.wxPic || '/static/headerpic.png' : ''" mode="aspectFit"></image>
				<text>{{ userInfo ? userInfo.account || userInfo.wxName : '' }}</text>
			</view>
			<view @click="gotoOrder" class="btn text-center">写评价</view>
		</view>

		<view v-for="(item, index) in evaluateList" :key="index" class="item bg-white">
			<view class="topbox flex justify-between align-center">
				<view class="uinfobox flex align-center">
					<image :src="item.userPic" mode="aspectFill"></image>
					<text>{{ item.userName }}</text>
				</view>
				<view class="time text-center">{{ item.date }}</view>
			</view>
			<view class="contentBox">
				<view class="content">{{ item.content }}</view>
				<view v-if="item.picList.length" class="imgBox flex flex-wrap justify-between">
					<image v-for="(imgItem, imgIndex) in item.picList" :key="imgIndex" :src="imgItem" mode="aspectFill"></image>
				</view>
			</view>
			<view class="goodsInfo flex align-center">
				<image :src="item.toPic" mode="aspectFill"></image>
				<view class="textov1">{{ item.toName }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {
				wxName: '用户'
			},
			evaluateList: [
				{
					userPic: '/static/goods.jpg',
					userName: '用户名',
					toPic: '/static/goods.jpg',
					toName: '商品1',
					date: '2020-03-07 18:12:11',
					content: '评价1231',
					picList: ['/static/goods.jpg']
				}
			],
			offset: 1
		};
	},
	onLoad() {
		// this.getEvaluateList();
		// this.userInfo = uni.getStorageSync('userInfo') || {};
	},
	methods: {
		gotoOrder() {
			uni.navigateTo({
				url: '/pages/my/myOrder?type=4'
			});
		},
		getEvaluateList() {
			this.showLoading();
			this.request({
				url: '',
				data: {
					openid: uni.getStorageSync('openid'),
					offset: this.offset,
					limit: 10
				},
				success: res => {
					console.log('评价列表', res);
					uni.hideLoading();
					if (res.data.returnCode === 1) {
						this.offset += 1;
						this.evaluateList.push(...res.data.list);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.myEvaluate {
	.addEvaluate {
		padding: 0 30rpx;
		height: 120rpx;
		.uinfobox {
			& > text {
				font-size: 26rpx;
				letter-spacing: 1rpx;
				color: #333333;
			}
			& > image {
				width: 80rpx;
				height: 80rpx;
				margin-right: 20rpx;
				border-radius: 50%;
			}
		}
		.btn {
			width: 160rpx;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 30rpx;
			border: solid 1rpx #f23030;
			color: #f23030;
		}
	}

	.item {
		margin-top: 10px;
		padding: 20rpx 30rpx;
		.topbox {
			.uinfobox {
				& > text {
					font-size: 26rpx;
					color: #333333;
				}
				& > image {
					width: 64rpx;
					height: 64rpx;
					margin-right: 30rpx;
					border-radius: 50%;
				}
			}
			.time {
				font-size: 22rpx;
				color: #999999;
			}
		}
		.contentBox {
			.content {
				font-size: 24rpx;
				line-height: 36rpx;
				letter-spacing: 0px;
				color: #666666;
				margin-top: 20rpx;
			}
			.imgBox {
				& > image {
					width: 220rpx;
					height: 220rpx;
					margin-top: 20rpx;
				}
			}
		}
		.goodsInfo {
			background: #f5f5f5;
			margin-top: 20rpx;
			& > image {
				width: 96rpx;
				height: 96rpx;
				margin-right: 30rpx;
			}
			& > view {
				flex: 1;
			}
		}
	}
}
</style>
