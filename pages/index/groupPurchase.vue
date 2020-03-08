<template>
	<view class="Integral">
		<view class="titBox flex justify-between">
			<view @click="changeGroupGoodsType(0)" :class="{ select: groupGoodsType === 0 }" class="tit">全部</view>
			<view @click="changeGroupGoodsType(1)" :class="{ select: groupGoodsType === 1 }" class="tit">团购价</view>
			<view @click="changeGroupGoodsType(2)" :class="{ select: groupGoodsType === 2 }" class="tit">限时拼单</view>
			<view @click="changeGroupGoodsType(3)" :class="{ select: groupGoodsType === 3 }" class="tit">新品优惠</view>
		</view>
		<view class="lsitbox flex justify-between flex-wrap" style="border-radius: 0;">
			<view @click="gotoDetail(item.id)" v-if="groupGoodsType === 0 ? true : item.type === groupGoodsType" v-for="(item, index) in goodsList" :key="index" class="itemFree  ">
				<image :src="item.smallPic" mode="aspectFill"></image>
				<view style="height: auto;" class="infobox  ">
					<view class="info textov2"> 
						{{ item.name }}此标题最多显示2行此标题最多显示2行此标题最多
					</view>
					<view class="typeBox flex">
						<view class="typeName">折扣</view>
						<view class="typeName">保真</view>
					</view>
					<view class="moneybox flex align-center justify-between">
						<view class="money">￥123</view>
						<view class="xl">销量{{ item.saleNum }}份</view> 
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
			goodsList: [
				{
					smallPic: '/static/goods.jpg',
					name: '团购',
					price: 100,
					saleNum: 999,
					id: 1,
					type: 1
				},
				{
					smallPic: '/static/goods.jpg',
					name: '限时',
					price: 100,
					saleNum: 999,
					id: 2,
					type: 2
				},
				{
					smallPic: '/static/goods.jpg',
					name: '新品',
					price: 100,
					saleNum: 999,
					id: 2,
					type: 3
				}
			],
			offset: 1, 
			groupGoodsType: 0, // 0全部 1零元 2会员免费 3分享免费  
		};
	},
	onLoad(options) {
		// this.getList();
	},
	onShareAppMessage(e) {
		if (e.from === 'button') {
			console.log(e.target);
			return {
				title: '免费试吃',
				path: '/pages/index/Integral?type=1&searchUserId=' + uni.getStorageSync('userInfo').id + '&goodsId=' + e.dataset.goodsid
				// imageUrl:'/static/goods.jpg'
			};
		}
	},
	methods: {
		getList() {
			this.showLoading();
			this.request({
				url: '/appProduct/findByLink',
				data: {
					offset: this.offset,
					limit: 10
				},
				success: res => {
					uni.hideLoading();
					console.log('查询团购', res);
					if (res.data.returnCode === 1) {
						this.offset += 1;
						this.goodsList.push(...res.data.list);
					}
				}
			});
		},
		changeGroupGoodsType(type) {
			if (type === this.groupGoodsType) {
				return;
			}
			this.groupGoodsType = type;
		}, 

		// 去详情
		gotoDetail(id) {
			// goodsType 2团购 3会员 4分享领取
			uni.navigateTo({
				// url: '/pages/index/goodsDetail?goodsType=' + goodsType + '&goodsId=' + id,
				url: '/pages/index/goodsDetail?goodsId=' + id + '&goodsType=2'
			});
		}
	}
};
</script>

<style lang="scss">
.Integral {
	padding: 0 30rpx;
	.titBox {
		padding: 30rpx 20rpx;
		.tit {
			line-height: 42rpx;
			color: #000;
			font-size: 28rpx;
			border: 2rpx solid rgba(0, 0, 0, 1);
			padding: 0 24rpx;
			border-radius: 21rpx;
			&.select {
				background: #ff5858;
				color: #ffffff;
				border-color: #ff5858;
			}
		}
	}
	.lsitbox {
		position: relative;
		overflow: hidden;
		border-radius: 20px 20px 0px 0px;
		// top: -15px;
		.titview {
			line-height: 40px;
			margin-top: 20px;
			font-size: 16px;
		}
		.item {
			padding: 30rpx;
			border-bottom: 1rpx solid #ededed;
			& > image {
				width: 220rpx;
				height: 220rpx;
			}
			.infobox {
				margin-left: 34rpx;
				flex: 1;
				height: 260rpx;
				padding: 30rpx 0;
				.info {
					font-size: 28rpx;
					line-height: 40rpx;
					color: #333333;
				}
				.moneybox {
					.money {
						font-size: 28rpx;
						color: #f23030;
						& > text {
							font-size: 22rpx;
						}
					}
					.xl {
						font-size: 26rpx;
						color: #999999;
					}
				}
			}
		}
		.itemFree { 
			width: 330rpx;
			margin-bottom: 30rpx;
			background: #ffffff; 
			& > image {
				width: 330rpx;
				height: 330rpx;
			}
			.infobox { 
				flex: 1;
				height: 260rpx;
				padding: 16rpx;
				
				.info {
					font-size: 28rpx;
					line-height: 36rpx;
					color: #000000;
					.typeName {
						margin-right: 4px;
						display: inline-block;
						line-height: 36rpx;
						padding: 2px 6px;
						font-size: 22rpx;
						&.typeName1 {
							color: #ff4b4b;
							border: 1px solid #ff4b4b;
						}
						&.typeName2 {
							color: #ef9b29;
							border: 1px solid #ef9b29;
						}
						&.typeName3 {
							color: #57c77a;
							border: 1px solid #57c77a;
						}
					}
				}
				.typeBox{
					margin-top: 20rpx;
					.typeName{
						line-height: 36rpx;
						padding: 0 6px;
						border: 1px solid #A7A7A7;
						color: #A7A7A7;
						font-size: 22rpx;
						text-align: center;
						margin-right: 8px;
					}
				}
				.moneybox {
					margin-top: 20rpx;
					.money {
						font-size: 32rpx;
						color: #FF6060;
						& > text {
							font-size: 32rpx;
						}
					}
					.xl {
						font-size: 26rpx;
						color: #999999;
					}
					& > button {
						height: 46rpx;
						line-height: 46rpx;
						font-size: 28rpx;
						border-radius: 23rpx;
						padding: 0 24rpx;
						background: #ff5858;
						color: #fff;
					}
				}
			}
		}
	}
}
</style>
