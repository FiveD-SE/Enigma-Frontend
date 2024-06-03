export const ORDERS = [
	{
		user: {
			name: "Trương Lê Vỉnh Phúc",
			avatar: require("../utils"),
		},
		order: {
			orderStatus: "Hoàn thành",
			orderList: [
				{
					name: "Áo thun trơn",
					price: 100000,
					quantity: 1,
				},
			],
		},
	},
	{
		user: {
			name: "Nguyển Quốc Thắng",
			avatar: require("../utils"),
		},
		order: {
			orderStatus: "Đang giao",
			orderList: [
				{
					name: "Áo thun trơn",
					price: 200000,
					quantity: 2,
				},
				{
					name: "Áo thun trơn",
					price: 200000,
					quantity: 3,
				},
			],
		},
	},
	{
		user: {
			name: "Huỳnh Gia Bão",
			avatar: require("../utils"),
		},
		order: {
			orderStatus: "Chờ xác nhận",
			orderList: [
				{
					name: "Áo thun trơn",
					price: 200000,
					quantity: 2,
				},
				{
					name: "Áo thun trơn",
					price: 200000,
					quantity: 3,
				},
			],
		},
	},
];
