<template>
	<view class="contribution">
		<view class="action">
			<view class="item flex align-center">
				<text>标题：</text>
				<input v-model="itemInfo.tit1" type="text" placeholder="请输入文稿标题" />
			</view>
			<view class="item flex align-center">
				<text>描述：</text>
				<input v-model="itemInfo.tit2" type="text" placeholder="请输入文稿副标题" />
			</view>
		</view>

		<view class="action">
			<view class="item item2">
				<view class="flex align-center">
					<text>上传视频：</text>
					<text class="tip">（最多上传1个视频）</text>
				</view>
				<view @click="chooseVideo" class="imgBox">
					<video v-if="itemInfo.videoSrc" :src="itemInfo.videoSrc" src="" controls></video>
					<view v-else class="noImg flex flex-direction align-center justify-between">
						<image src="/static/aboutusbg.png" mode="aspectFill"></image>
						<text>上传视频</text>
					</view>
				</view>
			</view>
			<view class="item item2">
				<view class="flex align-center">
					<text>上传封面图：</text>
					<text class="tip">（最多上传1张）</text>
				</view>
				<view @click="chooseImg" class="imgBox">
					<image v-if="itemInfo.imgSrc" :src="itemInfo.imgSrc" mode="aspectFill"></image>
					<view v-else class="noImg flex flex-direction align-center justify-between">
						<image src="/static/aboutusbg.png" mode="aspectFill"></image>
						<text>上传封面</text>
					</view>
				</view>
			</view>
		</view>
		<view class="flex justify-center">
			<button @click="saveCategory" class="btn cu-btn bg-green">{{ type === 1 ? '确定修改' : '确定发布' }}</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: 1, // 1新增 2修改
			itemInfo: {
				tit1: '',
				tit2: '',
				videoSrc: '',
				imgSrc: ''
			}
		};
	},
	onLoad(options) {
		if (options.type) {
			this.type = Number(options.type);
		}
		if (options.item) {
			this.itemInfo = JSON.parse(options.item);
		}

		console.log('type', this.type, 'item', this.itemInfo);
	},
	methods: {
		saveCategory() {
			if (!this.itemInfo.tit1) {
				this.showToast('请输入标题');
				return;
			}
			if (!this.itemInfo.tit2) {
				this.showToast('请输入副标题');
				return;
			}
			if (!this.itemInfo.videoSrc) {
				this.showToast('请上传视频');
				return;
			}
			if (!this.itemInfo.imgSrc) {
				this.showToast('请上传封面');
				return;
			}
		},
		chooseVideo() {
			uni.chooseVideo({
				count: 1,
				sourceType: ['camera', 'album'],
				success: res => {
					console.log(res.tempFilePath);
					this.itemInfo.videoSrc = res.tempFilePath;
				},
				fail: err => {
					console.log(err);
				}
			});
		},
		chooseImg() {
			uni.chooseImage({
				count: 1,
				success: res => {
					console.log(res.tempFilePaths[0]);
					this.itemInfo.imgSrc = res.tempFilePaths[0];
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f5f2f5;
}
.contribution {
	.action {
		background: #fff;
		padding: 0 30rpx;
		margin-bottom: 15px;
		.item {
			&:last-child {
				border: none !important;
			}
			border-bottom: 1rpx solid #d0cdd0;
			line-height: 45px;
			color: #000;
			font-size: 32rpx;

			& > input {
				flex: 1;
				margin-left: 20rpx;
			}
			.tip {
				font-size: 24rpx;
				color: #a3a1a4;
			}
			.imgBox {
				width: 150rpx;
				height: 150rpx;
				background: #f0edf1;
				border-radius: 10rpx;
				& > image,
				& > video {
					width: 100%;
					height: 100%;
				}
				.noImg {
					& > image {
						width: 72rpx;
						height: 60rpx;
						margin-top: 20rpx;
					}
					& > text {
						color: #bfbfbf;
						font-size: 24rpx;
						line-height: 30rpxss;
					}
				}
			}
		}
		.item2 {
			padding-bottom: 30rpx;
		}
	}
	.btn {
		width: 650rpx;
		line-height: 70rpx;
		height: 70rpx;
		text-align: center;
		display: inline-block;
		padding: 0;
		margin-top: 100px;
	}
}
</style>
