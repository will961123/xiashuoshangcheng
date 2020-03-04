<template>
	<view class="Integral">
		<view class="bg-img">
			<image :src="type == 1 ? '/static/aboutusbg.png' : type == 2 ? '/static/aboutusbg.png' : '/static/aboutusbg.png'" style="width: 100%;height: 200px;" mode=""></image>
		</view>
		<view class="lsitbox bg-white ">
			<view @click="gotoDetail(item.id)" v-for="(item, index) in goodsList" :key="index" class="item flex align-center">
				<image :src="item.smallPic" mode="aspectFill"></image>
				<view class="infobox flex flex-direction justify-between">
					<view class="info textov2">{{ item.name }}</view>
					<view class="moneybox flex align-center justify-between">
						<view class="xl">销量： {{ item.saleNum }}</view>
						<button v-if="type === 1" @click="showTrialView(item.id)" class="btn cu-btn bg-cyan">免费试用</button>
						<view v-else class="money">￥ {{ item.price }}</view>
					</view>
				</view>
			</view>
		</view>

		<will-mc class="mc" v-if="showTrial">
			<view class="_mcMain bg-white ">
				<image @click="showTrial = false" src="/static/delect.png" mode=""></image>
				<view class="tit">请填写申请免费试用理由</view>
				<view class="tip flex justify-center text-left">
					<textarea
						style="width: 80%;height: 120px;border: 1rpx solid #555555;border-radius: 10px;padding: 10px;"
						maxlength="-1"
						placeholder="请填写申请免费试用理由,申请成功方能试用"
					/>
				</view>
				<button @click="ApplyTrial" class="btn cu-btn">点击申请</button>
			</view>
		</will-mc>
	</view>
</template>

<script>
export default {
	data() {
		return {
			goodsList: [
				{
					smallPic: '/static/goods.jpg',
					name: '商品1',
					price: 100,
					saleNum: 999,
					id: 1
				},
				{
					smallPic: '/static/goods.jpg',
					name: '商品2',
					price: 100,
					saleNum: 999,
					id: 2
				}
			],
			offset: 1,
			type: 1, //1 免费试用 2 团购
			showTrial: false,
			trialId: null
		};
	},
	onLoad(options) {
		this.type = Number(options.type) || 1;
		switch (this.type) {
			case 1:
				console.log('免费试用');
				uni.setNavigationBarTitle({
					title: '免费试用'
				});
				break;
			case 2:
				console.log('团购');
				uni.setNavigationBarTitle({
					title: '团购'
				});
				break;
			default:
				this.type = 1;
				console.log('免费试用', this.type);
				uni.setNavigationBarTitle({
					title: '免费试用'
				});
				break;
		}
		// this.getList();
	},
	onReachBottom() {
		// this.getList();
	},
	methods: {
		getList() {
			//1 免费试用 2 团购
			this.showLoading();
			this.request({
				url: '/appProduct/findByLink',
				data: {
					offset: this.offset,
					limit: 10,
					type: this.type
				},
				success: res => {
					uni.hideLoading();
					console.log(this.type == 1 ? '查询免费试用' : '查询团购', res);
					if (res.data.returnCode === 1) {
						this.offset += 1;
						this.goodsList.push(...res.data.list);
					}
				}
			});
		},
		showTrialView(id) {
			this.showTrial = true;
			this.trialId = id;
		},
		ApplyTrial() {
			if (!this.trialId) {
				return;
			}
			if (!this.trialText) {
				this.showToast('请输入申请理由');
				return;
			}
		},
		// 去详情
		gotoDetail(id) {
			if (this.type === 1) {
				return;
			}
			//1 免费试用 2 团购
			uni.navigateTo({
				// url: '/pages/index/goodsDetail?goodsType=' + goodsType + '&goodsId=' + id,
				url: '/pages/index/goodsDetail?goodsId=' + id + '&goodsType=' + (Number(this.type) + 1)
			});
		}
	}
};
</script>

<style lang="scss">
.Integral {
	.lsitbox {
		position: relative;
		overflow: hidden;
		border-radius: 20px 20px 0px 0px;
		top: -15px;
		.item {
			padding: 30rpx;
			border-bottom: 1rpx solid #ededed;
			& > image {
				width: 260rpx;
				height: 260rpx;
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
	}
}
</style>
