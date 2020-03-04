<template>
	<view class="prodectDetail">
		<view v-if="type === 1" class="videobox"><video :src="videoSrc" controls></video></view>
		<rich-text class="richText" v-else :nodes="richText"></rich-text>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: 1, // 1视频 2文章
			id: '',
			videoSrc: '',
			richText: ''
		};
	},
	onLoad(options) {
		options.type ? (this.type = Number(options.type)) : 1;
		options.id ? (this.type = options.id) : '';
		options.videoSrc ? (this.videoSrc = options.videoSrc) : '';
		uni.setNavigationBarTitle({
			title: this.type === 1 ? '视频详情' : '文章详情'
		});
		// this.type === 2 && this.getProdDetail();
	},
	methods: {
		getProdDetail() {
			this.request({
				url: '',
				data: {
					id: this.id
				},
				success: res => {}
			});
		}
	}
};
</script>

<style lang="scss" >
	.prodectDetail{
		.videobox{
			width: 100%;
			&>video{
				width: 100%;
			}
		}
	}
</style>
