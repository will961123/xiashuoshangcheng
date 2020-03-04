<template>
	<view class="prodectList">
		<view @click="gotoDetail" :data-item="JSON.stringify(item)" v-for="(item, index) in list" :key="index" class="item bg-white flex justify-between">
			<image :src="item.pic" mode="aspectFill"></image>
			<view class="contentbox  flex flex-direction justify-between">
				<view class="tit">{{ item.tit }}</view>
				<view class="datebox flex justify-between">
					<text>{{ item.createNmae }}</text>
					<text>{{ item.date }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: 1, // 1视频 2文章
			offset: 1,
			list: [
				{ pic: '/static/goods.jpg', date: '2020-03-08 18:18:10', createNmae: 'admin', tit: '视频1', id: 1, videosrc: 'videosrc' },
				{ pic: '/static/goods.jpg', date: '2020-03-08 18:18:10', createNmae: 'admin', tit: '文章1', id: 2 }
			]
		};
	},
	onLoad(options) {
		options.type ? (this.type = Number(options.type)) : 1;
		uni.setNavigationBarTitle({
			title: this.type === 1 ? '视频列表' : '文章列表'
		});
		// this.getList();
	},
	onReachBottom() {
		// this.getList();
	},
	methods: {
		gotoDetail(e) {
			let item = JSON.parse(e.currentTarget.dataset.item);
			let url = '';
			if (this.type === 1) {
				url = '/pages/index/prodectDetail?type=1&videoSrc=' + item.videosrc;
			} else {
				url = '/pages/index/prodectDetail?type=2&prodectId=' + item.id;
			}
			uni.navigateTo({
				url: url
			});
		},
		getList() {
			this.request({
				url: '',
				data: {
					offset: this.offset,
					limit: 10,
					type: this.type
				},
				success: res => {
					if (res.data.returnCode === 1) {
						this.offset += 1;
						this.list.push(...res.dara.list);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.prodectList {
	.item {
		padding: 10px 30rpx;
		border-bottom: 1px solid #e5e5e5;
		& > image {
			width: 240rpx;
			height: 240rpx;
		}
		.contentbox {
			flex: 1;
			margin-left: 15px;
		}
	}
}
</style>
