var apiHost = "http://api.jx9n.com";
// apiHost = "http://39.106.62.16:8181";
// !mui.os.plus && (apiHost = "http://192.168.2.129:3000");
var appVersion = "v3.2.0"; //app当前版本

var API_URL = {};
API_URL.ApiSmsSendCode = apiHost + "/api/sms/sendCode"; //发送短信接口
API_URL.ApiMemberRegister = apiHost + "/api/member/register"; //注册接口
API_URL.ApiMemberLogin = apiHost + "/api/member/login"; //登录接口
API_URL.ApiMemberQuickLogin = apiHost + "/api/member/quickLogin"; //快捷登录
API_URL.ApiMemberInfo = apiHost + "/api/member/info"; //获取用户信息
API_URL.ApiMemberNeedGuide = apiHost + "/api/member/needGuide"; // 用户是否需要新手引导
API_URL.APIfMemberForgetThePassword = apiHost + "/api/member/forgetThePassword"; //重置密码
API_URL.APIMemberModifyPassword = apiHost + "/api/member/modifyPassword"; //修改密码
API_URL.APIFeedbackSaveFeedback = apiHost + "/api/feedback/saveFeedback"; //反馈报修
API_URL.APISaveapplyChargingPile = apiHost + "/api/applyChargingPile/saveapplyChargingPile"; //用户申请建桩
API_URL.APIfMemberForgetThePassword = apiHost + "/api/member/forgetThePassword";
API_URL.ApiArticleContentBYID = apiHost + "/api/article/getArticleByCategoryTwoId";
API_URL.ApiArticleContentBYName = apiHost + "/api/article/getArticleByName";
API_URL.ApiChargingInfo = apiHost + "/api/charging/info"; //获取充电桩信息
API_URL.ApiChargingInfoByShellId = apiHost + "/api/charging/infoByShellId"; //获取充电桩信息
API_URL.ApiChargingSocketListByCode = apiHost + "/api/chargingSocket/listByCode"; //获取充电桩插座列表
API_URL.ApiCharginGetPriceListByChargingCode = apiHost + "/api/charging/getPriceListByChargingCode"; //获取充电桩片区价格
API_URL.ApiCharginGetPriceListByGroupID = apiHost + "/api/charging/getPriceListByGroupID"; //获取充电桩片区价格
API_URL.ApiChargingPriceDesc = apiHost + "/api/charging/getChargingPriceDesc"; // 充电桩价格描述
API_URL.ApiDeviceCommandSendChargeCommand = apiHost + "/api/DeviceCommand/sendChargeCommand"; //下发充电
API_URL.ApiUserChargingDetailGetDoingCount = apiHost + "/api/userChargingDetail/getDoingCount"; //用户正在执行订单数量
API_URL.ApiUserChargingDetailGetDoingList = apiHost + "/api/userChargingDetail/getDoingList"; //用户正在执行订单
API_URL.ApiUserChargingDetailGetUserList = apiHost + "/api/userChargingDetail/getUserList"; //用户充电订单
API_URL.ApiUserChargingDetailGetChargeOrder = apiHost + "/api/userChargingDetail/order"; // 用户订单详情
API_URL.ApiDictionaryManageGetDmList = apiHost + "/api/dictionaryManage/getDmList"; //数据字典
API_URL.ApiArticleCategoryList = apiHost + "/api/article/getArticleCategoryList"; //获取文章分类
API_URL.updateLoginInfo = apiHost + "/api/member/updateLoginInfo"; //更新用户登录信息
API_URL.ApiCarouselImageGetCarouselImage = apiHost + "/api/carouselImage/getCarouselImage"; //获取轮播图
API_URL.ApiMessageGetMessageAll  = apiHost + "/api/message/getMessage";     //获取消息列表
API_URL.ApiMessageDeleteMessage  = apiHost + "/api/message/deleteMessage";  //删除消息
API_URL.ApiMessageGetLastestMessage = apiHost + "/api/message/getLastestMessage";  //获取最后消息
API_URL.ApiMessageCountUnreadMessage = apiHost + "/api/message/countUnreadMessage"; //统计未读消息
API_URL.ApiMessageSetAllMessageRead = apiHost + "/api/message/setAllMessageRead";   //设置消息已读
API_URL.ApiMessageGetMessageList = apiHost + "/api/message/getMessageList"; //获取消息列表
API_URL.ApiMessageGetMessageText = apiHost + "/api/message/getMessageText"; //获取消息列表
API_URL.ApiMessageGetMessageByID = apiHost + "/api/message/getMessageById"; //获取消息
API_URL.ApiRecharGetRechargeConfigurationList = apiHost + "/api/recharge/getRechargeConfigurationList"; //获取充值数据

API_URL.ApiUploadPicture = apiHost + "/api/member/uploadPicture"; //用户上传头像数据
API_URL.ApiUpdateMemberInfo = apiHost + "/api/member/updateMemberInfo"; //用户上传信息
API_URL.ApiChargingGroupGetNearList = apiHost + "/api/chargingGroup/getNearList"; //根据定位，获取附近的充电桩
API_URL.ApiChargingGroupGetNearChargingAndPrices = apiHost + "/api/chargingGroup/getNearChargingAndPrices"; // 获取附近的充电桩和价格
API_URL.ApiGetChargingByGroupID = apiHost + "/api/charging/getChargingByGroupID"; //根据片区，获取充电桩
API_URL.ApiSearchChargingGroup = apiHost + "/api/chargingGroup/searchChargingGroup"; // 搜索充电片区

API_URL.ApiDetailRecordGetDetailRecordList = apiHost + "/api/detailRecord/getDetailRecordList"; //获取明细记录列表

API_URL.ApiInvitationLogGetInvitationStatistics = apiHost + "/api/invitationLog/getInvitationStatistics"; //获取邀请统计数据
API_URL.ApiInvitationLogGetInvitationList = apiHost + "/api/invitationLog/getInvitationList"; //获取邀请列表

API_URL.ApiUserSignClickSign   = apiHost + "/api/userSign/clickSign"; //用户签到
API_URL.ApiUserSignIsSignToday = apiHost + "/api/userSign/isSignToday";//用户今日是否签到

API_URL.AppVersionGetNewest = apiHost + "/api/AppVersion/getNewest";

API_URL.getRechargeChannels = apiHost + '/api/recharge/getRechargeChannels';
API_URL.ApiPayAlipay = apiHost + '/api/pay/alipay'; //支付宝支付
API_URL.ApiPayWx = apiHost + '/api/pay/wxpay'; //微信支付

/** 商城接口 */
API_URL.ApiProductGetProductList = apiHost + "/api/product/getProductList"; //获取商城列表
API_URL.ApiProductGetProductById = apiHost + "/api/product/getProductById";
API_URL.ApiProductGetProductOrdersList = apiHost + "/api/productOrders/getProductOrdersList"; //获取用户订单

API_URL.ApiProductOrdersAddProductOrders = apiHost + "/api/productOrders/addProductOrders";

API_URL.ApiMemberCardGetCardList = apiHost + "/api/iccard/list"; // 获取用户IC卡
API_URL.ApiMemberCardBindingCard = apiHost + "/api/iccard/binding"; // 绑定IC卡
API_URL.ApiMemberCardUnBindingCard = apiHost + "/api/iccard/unbinding"; // 解除绑定IC卡

/** 一代产品的接口 */
API_URL.PSMSMFMiddlewareGetlist = apiHost + "/api/oldProducts/getlist"; //获取插座和价钱
API_URL.PSMSMFMiddlewareCharging = apiHost + "/api/oldProducts/charging"; //充电

var PAGE_URL = {};
PAGE_URL.INVITATION = apiHost + '/page/view/invitation' //邀请页面

API_URL.GetChargingGroup = apiHost + "/api/chargingGroupSearch/getChargingGroup";
API_URL.GetNearChargingGroup = apiHost + "/api/chargingGroupSearch/getNearChargingGroup";
API_URL.SearchChargingGroup = apiHost + "/api/chargingGroupSearch/searchChargingGroup";

API_URL.TrunOffCharge = apiHost + "/api/DeviceCommand/trunOffCharge";  //结束充电
API_URL.ApiUserChargingDetail = apiHost + "/api/userChargingDetail/settlement"; //订单结算
API_URL.ApiUploadfile = apiHost + "/api/common/uploadfile";




