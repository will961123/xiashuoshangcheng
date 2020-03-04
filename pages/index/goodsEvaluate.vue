<template>
	<view class="myEvaluate">
		<view v-for="(item, index) in evaluateList" :key="index" class="item bg-white">
			<view class="topbox flex justify-between align-center">
				<view class="uinfobox flex align-center">
					<image :src="item.userPic" style="border-radius: 50%;" mode="aspectFill"></image>
					<text>{{ item.userName }}</text>
				</view>
				<view class="time text-center">{{ item.date }}</view>
			</view>
			<view class="contentBox">
				<view class="content">{{ item.content }}</view>
				<view class="imgBox flex flex-wrap justify-start">
					<view class="box text-center" v-for="(imgItem, imgIndex) in item.picList" :key="imgIndex"><image :src="imgItem.commentPic" mode="aspectFill"></image></view>
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
			evaluateList: [
				{
					userPic: '/static/headerpic.png',
					userName: '用户名',
					data: '2020-03-06 21:20:20',
					content: '评价内容',
					picList: [{ commentPic: '/static/goods.jpg' }],
					toPic: '/static/goods.jpg',
					toName: '商品2'
				}
			],
			offset: 1
		};
	},
	onLoad(options) {
		this.goodsId = options.goodsId;
		// this.findCommentByProductId();
	},
	onReachBottom() {
		// this.findCommentByProductId();
	},
	methods: {
		findCommentByProductId() {
			this.request({
				url: '',
				data: {
					toId: this.goodsId,
					offset: this.offset,
					limit: 10
				},
				success: res => {
					console.log('评论信息', res);
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
				.box {
					width: calc(100% / 3);
					margin-top: 20rpx;
					& > image {
						width: 220rpx;
						height: 220rpx;
					}
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
