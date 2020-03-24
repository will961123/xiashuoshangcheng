<template>
	<view class="myContributionList">
		<view class="menubox flex justify-between align-center">
			<view @click="gotoAddCategory(1)" class="addbox flex align-center">
				<image src="/static/add.png" mode="aspectFill"></image>
				<text>发布文稿</text>
			</view>
			<view @click="del" class="delbox flex align-center">
				<image src="/static/delete.png" mode="aspectFill"></image>
				<text>删除</text>
			</view>
		</view>
		<view v-for="(item, index) in list" class="item">
			<view @click="gotoAddCategory(2, item)" class="topbox flex align-center justify-end">
				<image src="/static/xiugai.png" mode="aspectFill"></image>
				<text>修改</text>
			</view>
			<view class="infoBox flex align-center">
				<view class="left flex align-center">
					<image @click="changeRadio(index)" class="select" :src="selectIdx[index] ? '/static/select.png' : '/static/noo.png'" mode="aspectFill"></image>
					<image class="pic" :src="item.pic" mode="aspectFill"></image>
				</view>
				<view class="right flex flex-direction  ">
					<view class="titbox">
						<view class="tit1 textov1 ">{{ item.tit1 }}</view>
						<view class="tit2  textov1 ">{{ item.tit2 }}</view>
					</view>
					<view class="viewbox">
						<image src="../../static/eye.png" mode="aspectFill"></image>
						<text>{{ item.view }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{ pic: '/static/aboutusbg.png', tit1: '标题标题标题标题标题标', tit2: '标题标题标题标题标题标', id: 123, view: 3333 },
				{ pic: '/static/aboutusbg.png', tit1: '标题标题标题标题标题标', tit2: '标题标题标题标题标题标', id: 233, view: 444 }
			],
			selectIdx: [true, false]
		};
	},
	methods: {
		gotoAddCategory(type, item) { 
			if (type === 1) {
				uni.navigateTo({
					url: '/pages/my/upLoadContribution'
				});
			} else {
				uni.navigateTo({
					url: '/pages/my/upLoadContribution?type=2&item=' + JSON.stringify(item)
				});
			}
		},
		changeRadio(idx) {
			this.selectIdx.splice(idx, 1, !this.selectIdx[idx]);
		},
		del() {
			if (
				this.selectIdx.every(val => {
					return val === false;
				})
			) {
				this.showToast('请勾选文稿');
				return;
			} else {
				let idArr = [];
				for (let idx in this.selectIdx) {
					if (this.selectIdx[idx]) {
						idArr.push(this.list[idx].id);
					}
				}
				console.log(idArr);
				if (!idArr.length) {
					this.showToast('请勾选文稿');
					return;
				}
			}
		}
	}
};
</script>

<style lang="less">
.myContributionList {
	.menubox {
		font-size: 32rpx;
		color: #000;
		background: #ffe0a9;
		padding: 0 30rpx;
		height: 40px;
		.addbox > image,
		.delbox > image {
			margin-right: 17rpx;
			width: 32rpx;
			height: 32rpx;
		}
	}
	.item {
		margin-top: 8px;
		background: #fff;
		padding: 0 30rpx;
		.topbox {
			height: 60rpx;
			border-bottom: 1rpx solid #e8e8e8;
			font-size: 28rpx;
			& > image {
				margin-right: 10rpx;
				width: 28rpx;
				height: 28rpx;
			}
		}
		.infoBox {
			padding: 30rpx 0;
			.left {
				.select {
					width: 34rpx;
					height: 34rpx;
					margin-right: 24rpx;
				}
				.pic {
					width: 220rpx;
					height: 146rpx;
				}
			}
			.right {
				padding-left: 30rpx;
				width: calc(100% - 250rpx);
				.titbox {
					.tit1 {
						font-size: 32rpx;
						color: #000;
					}
					.tit2 {
						font-size: 26rpx;
						color: #777777;
						margin-top: 4px;
						margin-bottom: 8px;
					}
				}
				.viewbox {
					font-size: 22rpx;
					color: #9d9d9d;
					& > image {
						width: 22rpx;
						height: 16rpx;
					}
				}
			}
		}
	}
}
</style>
