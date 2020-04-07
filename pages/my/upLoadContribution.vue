<template>
	<view class="contribution">
		<view class="action">
			<view class="item flex align-center">
				<text>标题：</text>
				<input v-model="itemInfo.tit1" type="text" placeholder="请输入文稿标题" />
			</view>
			<view class="item  item2  ">
				<text>描述：</text>
				<view class=""><textarea style=" height: 80px;width: 100%;" maxlength="-1" v-model="itemInfo.tit2" type="text" placeholder="请输入文稿描述" /></view>
			</view>
		</view>

		<view class="action">
			<view class="item item2">
				<view class="flex align-center">
					<text>上传视频：</text>
					<text class="tip">（最多上传1个视频）</text>
				</view>
				<view @click="chooseVideo" class="imgBox">
					<video v-if="itemInfo.temporaryVideo" :src="itemInfo.temporaryVideo" src="" controls></video>
					<view v-else class="noImg flex flex-direction align-center justify-between">
						<image src="/static/uploadVideo.png" mode="aspectFill"></image>
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
					<image v-if="itemInfo.temporaryImg" :src="itemInfo.temporaryImg" mode="aspectFill"></image>
					<view v-else class="noImg flex flex-direction align-center justify-between">
						<image src="/static/uploadPic.png" mode="aspectFill"></image>
						<text>上传封面</text>
					</view>
				</view>
			</view>
		</view>
		<view class="flex justify-center" style="padding-bottom: 40px;">
			<button @click="saveCategory" class="btn cu-btn bg-green">确定发布</button>
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
				imgSrc: '',
				temporaryVideo: '',
				temporaryImg: ''
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
				this.showToast('请输入描述');
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
			this.checkLogin().then(reslove => {
				this.showLoading();
				this.request({
					url: '/works/postAdd',
					method: 'POST',
					data: {
						title: this.itemInfo.tit1,
						desc: this.itemInfo.tit2,
						picture: this.itemInfo.imgSrc,
						video: this.itemInfo.videoSrc,
						user_mark_id: this.getUserId()
					},
					success: res => {
						uni.hideLoading();
						console.log('保存结果', res);
						if (res.data.status == 1) {
							this.showToast('保存成功');
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								});
							}, 500);
						} else {
							this.showToast(res.data.info);
						}
					}
				});
			});
		},
		chooseVideo() {
			uni.chooseVideo({
				count: 1,
				sourceType: ['camera', 'album'],
				success: res => {
					console.log('临时路径', res);
					this.itemInfo.temporaryVideo = res.tempFilePath;
					if (res.size > 1024 * 1024 * 24) {
						this.showToast('视频需要在24MB以内!');
						return;
					}
					this.showLoading();
					uni.uploadFile({
						url: this.uploadUrl + '/admin/upload',
						filePath: res.tempFilePath,
						name: 'file',
						formData: {},
						success: res => {
							uni.hideLoading();
							console.log('上传视频', res);
							let resoult = JSON.parse(res.data);
							if (resoult.status === 1) {
								this.itemInfo.videoSrc = resoult.url;
								console.log(this.itemInfo);
							} else {
								this.showToast(resoult.info);
								this.itemInfo.temporaryVideo = '';
							}
						},
						fail: err => {
							this.showToast('上传失败!');
							this.itemInfo.temporaryVideo = '';
							console.log(err);
						}
					});
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
					this.itemInfo.temporaryImg = res.tempFilePaths[0];
					uni.uploadFile({
						url: this.uploadUrl + '/admin/upload',
						filePath: res.tempFilePaths[0],
						name: 'file',
						formData: {},
						success: res => {
							uni.hideLoading();
							let resoult = JSON.parse(res.data);
							console.log('上传图片', resoult);
							if (resoult.status === 1) {
								this.itemInfo.imgSrc = resoult.url;
								console.log(this.itemInfo);
							} else {
								this.showToast(resoult.info);
								this.itemInfo.temporaryImg = '';
							}
						},
						fail: err => {
							console.log(err);
						}
					});
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
