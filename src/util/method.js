import {
    local
} from './storage'
//休眠
const sleep = (s) => new Promise(resolve => {
    setTimeout(resolve, s * 1000)
})
//统计角色武器数量
/**
 * 
 * @param {Object} data 
 * @returns {Object}
 */
const statistical = (data) => {
    const GachDataObj = data || local.get("GachDataObj");
    if (!GachDataObj) return
    console.log(GachDataObj);
    if (GachDataObj === undefined) return;
    let level_5_role = []; //角色
    let level_5_weapons = []; //武器
    let level_4_role = [];
    let level_4_weapons = [];
    let level_3_Weapons = [];
    for (let i = 0; i < GachDataObj[301].length; i++) {
        let item = GachDataObj[301][i];
        switch (item[3]) {
            case 3:
                level_3_Weapons.push(item);
                break;
            case 4:
                item[2] === "角色" ?
                    level_4_role.push(item) :
                    level_4_weapons.push(item);
                break;
            case 5:
                item[2] === "角色" ?
                    level_5_role.push(item) :
                    level_5_weapons.push(item);
                break;
            default:
                console.log("判断出错");
                break;
        }
    }
    return {
        level_5_role,
        level_5_weapons,
        level_4_role,
        level_4_weapons,
        level_3_Weapons,
        total: GachDataObj[301].length,
        noGoldTimes: GachDataObj[301][GachDataObj[301].length - 1][5], //目前已抽次数
        probability: [
            //概率
            {
                title: `三星武器`,
                chance: percentage(level_3_Weapons.length / GachDataObj[301].length) //(level_3_Weapons.length / GachDataObj[301].length) * 100 + `%`,
            },
            {
                title: `四星武器`,
                chance: percentage(level_4_weapons.length / GachDataObj[301].length)
            },
            {
                title: `四星角色`,
                chance: percentage(level_4_role.length / GachDataObj[301].length)
            },
            {
                title: `五星角色`,
                chance: percentage(level_5_role.length / GachDataObj[301].length)
            },
        ],
    };
};
//计算百分比
const percentage = num => Math.round(num * 10000) / 100 + `%`;
//
const Obj = {
    "200": "常驻祈愿",
    "100": "新手祈愿",
    "301": "角色活动祈愿",
    "302": "武器活动祈愿",
}
const mate = num => Obj[num]
export {
    sleep,
    statistical,
    mate
}