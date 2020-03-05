<template>
	<view class="uploadProdect">
		<view class="videobox">
			<video v-if="videoSrc" :src="videoSrc" controls></video> 
		</view>
		
		<button type="primary" @click="chooseVideo">选择视频</button>
		<button type="primary">上传视频</button>
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
				success: res=> {
					console.log(res.tempFilePath);
					this.videoSrc = res.tempFilePath
				},
				fail:err=>{
					console.log(err);
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
		&>video{
		width: 100%;
		}
	}
}
</style>
