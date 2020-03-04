<template>
	<view class="singin">
		<view class="bg-img" style="height: 220px;"><image src="/static/singin_bg.png" mode="" style="width: 100%;height: 100%;"></image></view>
		<view class="padingbox">
			<sw-calendar :curDate="curDate" :dateArray="dateArray"></sw-calendar>
			<button @click="singin" class="btn cu-btn  bg-white text-bold ">签到</button>
		</view>

		<will-mc v-if="showmc">
			<view class="tc_bgbox">
				<view class="bg-img" style="background-image: url('/static/singin_jinbi.png');width: 722rpx;height: 340rpx;"></view>
				<view class="mainbox bg-white">
					<image src="/static/singin_duihao.png" class="toppic" mode="aspectFit"></image>
					<view class="tit">恭喜您，签到成功！</view>
					<view class="tip">可获得积分1分</view>
					<button class="btn cu-btn" @click="showmc = false">好的</button>
				</view>
			</view>
		</will-mc>
	</view>
</template>

<script>
import swCalendar from '@/components/sw-calendar/sw-calendar.vue';
export default {
	components: {
		swCalendar
	},
	data() {
		return {
			day: '',
			curDate: '',
			changeDisable: -1,
			dateArray: [],
			showmc: false
		};
	},
	onLoad() {
		this.initDateArray();
	},
	methods: {
		initDateArray() {
			let d = new Date();
			let y = d.getFullYear();
			let m = d.getMonth();
			let week = new Date(y, m, 1).getDay(); //一号是周几
			m = m === 11 ? 12 : m + 1; //月份转换
			let max = new Date(y, m, 0).getDate(); //本月最大天
			let day = d.getDate();
			let curDate = `${y}年${m}月${day}日`;
			let dateArray = [];

			this.day = day;
			this.curDate = curDate;
			// 1号之前留白,对应正确的周几
			for (let i = 0; i < week; i++) {
				let obj = {
					year: '',
					month: '',
					date: '',
					disabled: false,
					isToday: false
				};
				dateArray.push(obj);
			}

			for (let i = 0; i < max; i++) {
				let roundom = parseInt(Math.random() * 10);
				let today = i + 1;
				let obj = {
					year: y,
					month: m,
					date: today,
					// disabled 为true 代表签到过
					disabled: roundom % 2 === 0,
					isToday: today == day
				};
				dateArray.push(obj);
			}
			this.dateArray = dateArray;
		},
		singin() {
			console.log(this.dateArray[Number(this.day) - 1]);
			if (this.dateArray[Number(this.day) - 1].disabled) {
				this.showToast('今天已经签到过了!');
				return;
			}
			this.$set(this.dateArray, Number(this.day) - 1, Object.assign({}, this.dateArray[Number(this.day) - 1], { disabled: true }));
			this.showmc = true;
			console.log('改变日历', this.dateArray[Number(this.day) - 1]);
		}
	}
};
</script>

<style lang="scss">
.singin {
	background: #ff585f;

	.padingbox {
		padding: 0 30rpx 30px 30rpx;
		.btn {
			width: 100%;
			line-height: 48px;
			height: 48px;
			border-radius: 24px;
			font-size: 40rpx;
			letter-spacing: 4px;
			color: #f23030;
			margin-top: 15px;
		}
	}

	.tc_bgbox {
		margin: 0 auto;
		margin-top: 160px;
		position: relative;
		.mainbox {
			text-align: center;
			width: 480rpx;
			margin: 0 auto;
			position: absolute;
			top: 30px;
			left: 50%;
			transform: translateX(-50%);
			border-radius: 30rpx;
			.toppic {
				width: 400rpx;
				height: 400rpx;
				position: absolute;
				top: -160rpx;
				left: 50%;
				transform: translateX(-50%);
			}
			.tit {
				padding-top: 230rpx;
				font-size: 34rpx;
				color: #ff585f;
			}
			.tip {
				font-size: 28rpx;
				color: #aaafb5;
				margin: 34rpx 0 30rpx 0;
			}
			.btn {
				width: 400rpx;
				height: 88rpx;
				line-height: 88rpx;
				background-image: linear-gradient(0deg, #ff585f 0%, #ff826a 100%);
				border-radius: 44rpx;
				margin-bottom: 46rpx;
				font-size: 32rpx;
				color: #ffffff;
			}
		}
	}
}
</style>
