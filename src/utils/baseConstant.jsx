let baseConstant = {
    /**
     * 前台token关键字
     */
    Authorization: 'Authorization',
    /**
     * 后台token关键字
     */
    ManagersAuthorization: 'Authorization-DXN',
    /**
     * 本地记住密码登录名key
     */
    localStorageLoginName: 'localStorageLoginName',
    /**
     * 本地记住密码密码key
     */
    localStoragePassword: 'localStoragePassword',
    /**
     * 本地记住密码公司key
     */
    localStorageCompanyCode: 'localStorageCompanyCode',
    /**
     * 本地记住密码选中key
     */
    localStorageIsChecked: 'localStorageIsChecked',
    /**
     * 需要重定向到登陆页面的消息体
     */
    toLoginMsg: ['用户尚未登陆', '用户信息异常', '用户信息不存在'],
    /**
     * 枚举对应
     */
    enumMapping: {
        START: '启用',
        MORNING: '早班',
        NOON: '中班',
        EVENING: '晚班',
        MAN: '男',
        WOM: '女',
        WAIT: '待审核',
        PASS: '已入职',
        NOT_PASS: '审核不通过',
        NORMAL: '正常离职',
        UN_AUTHORIZED: '擅自离职',
        ILLNESS: '因病离职',
        YES: '是',
        NO: '否',
        STOP: '禁用',
        RECTANGLE: "矩形",
        TRAPEZIUM: "梯形",
        HALF_ROUND: "半圆形",
        THREE_ARCH: "三星拱",
        BLASTING_DRIVING: "炮掘",
        FULLY: "综掘",
        ANCHOR_SPRAY: "锚喷",
        ANCHOR_NET: "锚网",
        MASONRY: "砌碹",
        CER_MINUS: "架棚",
        COMBINED_SUPPORT: "联合支护",
        U_SHAPED_SHED: "U型棚",
        ALL_COAL: "全煤",
        ALL_ROCK: "全岩",
        HALF_COAL: "半煤巷",
        U: "U型通风",
        Y: "Y型通风",
        Z: "Z型通风",
        BLASTING_MINING: "炮采",
        HIGH_GRADE: "高档普采",
        INTEGRATION_MACHINE: "综合机械化",
        THROUGH_LAYER_CATEGORY: "穿层钻孔",
        BEDDING_CATEGORY: "顺层钻孔",
        HIGH_POSITION_CATEGORY: "高位钻孔",
        GEOLOGY_CATEGORY: "地质钻孔",
        OTHER_CATEGORY: "其他钻孔",
        GAS_TYPE: "瓦斯",
        GEOLOGY_TYPE: "地质",
        WATER_DETECTION_TYPE: "探水",
        OTHER_TYPE: "其他",
        COAL_LAYER: "煤层",
        ROCK_LAYER: "岩层",
        RECTIFICATION_YES: "已整改",
        RECTIFICATION_NO: "未整改",
        GROUND: "地面",
        MACHINE: "机电",
        ONE_THROUGH_AND_THREE_PREVENTION: "一通三防",
        ROOF: "顶板",
        WATER_PREVENTION: "防治水",
        OTHER: "其他",
        TASK: "违章作业",
        COMMAND: "违章指挥",
        LABOR_DISCIPLINE: "违反劳动纪律",
        DEVICE_STATUS_USING: "在用",
        DEVICE_STATUS_MAINTAINING: "维保中",
        DEVICE_STATUS_TRANSFER: "外调",
        DEVICE_STATUS_BORROW: "外借",
        DEVICE_STATUS_SCRAP: "报废",
        DEVICE_STATUS_BACKUP:"备用",
        MAINTAIN_DAILY: "日常维保",
        MAINTAIN_REGULAR: "定期保养",
        ABNORMAL_FAILURE: "异常故障",
        ARTIFICIAL_DAMAGE: "人为损坏",
        MAINTAIN_OTHER: "其他",
        COMPLETE: "完成",
        NOT_COMPLETE: "未完成",
        RETURN_STATUS_NO: "未归还",
        RETURN_STATUS_YES: "已归还",
        LICENCE_MINING: "采矿许可证",
        LICENCE_SAFE_PRODUCE: "安全许可证",
        MARRAY_NO: "未婚",
        MARRAY_YES: "已婚",
        DOCTOR: "博士",
        MASTER: "硕士",
        BACHELOR: "本科",
        COLLEGE: "大专",
        SECONDARY: "中专",
        POLYTECHNIC: "中技",
        SENIOR_MIDDLE_SCHOOL: "高中",
        JUNIOR_MIDDLE_SCHOOL: "初中",
        PRIMARY_SCHOOL_AND_DOWN: "初中及以下"
    }
}

export default baseConstant
