<template>
	<view class="uploadProdect">
		<view class="videobox">
			<video v-if="videoSrc" :src="videoSrc" controls></video>
			<view v-else class="text-center " style="line-height: 80px;">请选择视频</view>
		</view>

		<view class="btnbox flex justify-between">
			<button class="btn cu-btn bg-red" @click="chooseVideo">选择视频</button>
			<button class="btn cu-btn bg-red" @click="uploadVideo">上传视频</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			videoSrc: ''
		};
	},
	methods: {
		chooseVideo() {
			uni.chooseVideo({
				count: 1,
				sourceType: ['camera', 'album'],
				success: res => {
					console.log(res.tempFilePath);
					this.videoSrc = res.tempFilePath;
				},
				fail: err => {
					console.log(err);
				}
			});
		},
		uploadVideo() {
			if (!this.videoSrc) {
				this.showToast('请先选择视频!');
				return;
			}
			uni.uploadFile({
				url: this.apiUrl + '', //仅为示例，非真实的接口地址
				filePath: this.videoSrc,
				name: 'file',
				formData: {
					userId: uni.getStorageSync('userInfo').id
				},
				success: res => {
					console.log('上传视频',res)
				}
			});
		}
	}
};
</script>

<style lang="scss">
.uploadProdect {
	.videobox {
		width: 100%;
		min-height: 100px;
		& > video {
			width: 100%;
		}
	}
	.btnbox {
		padding: 0 30rpx;
		& > button {
			width: 40%;
		}
	}
}
</style>
