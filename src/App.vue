<script setup>
import { ref, reactive,  } from "vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";
import {Search,Download } from '@element-plus/icons-vue'
import { local } from "./util/storage";
import { GachaUrl } from "./api/baseUrl";
import { getGachaLog, gachaTypes as gachaType } from "./api/data";
import { sleep, statistical } from "./util/method";
import {save} from './util/save'
const DataShow = ref(false);
const url = ref(""); //new URL(GachaUrl);
const tips = ref("");
let AuthKey = "";
let AuthKeyVer = "1";
let Lang = "zh-cn";
const upactivity_D = reactive({
  level_3_Weapons: [],
  level_4_role: [],
  level_4_weapons: [],
  level_5_role: [],
  total: 0,
  noGoldTimes: 0,
  probability: [],
}); //up角色数据
//获取每一页数据
const getGachaLogs = async (name, key) => {
  let page = 1,
    data = [],
    res = [];
  let end_id = "0";
  let list = [];
  do {
    // console.log(`正在获取${name}第${page}页`);
    tips.value = `正在获取${name}第${page}页`;
    res = await getGachaLog(key, page, end_id, AuthKey, AuthKeyVer, Lang);
    await sleep(0.2);
    end_id =
      res.data.list.length > 0 ? res.data.list[res.data.list.length - 1].id : 0;
    list = res.data.list;
    data.push(...list);
    page += 1;
  } while (list.length > 0);
  return data;
};
//生成抽奖数据
const main = async (uri) => {
  // console.log(uri);
  uri = uri ? new URL(uri) : new URL(GachaUrl);
  AuthKey = uri.searchParams.get("authkey"); //获取密钥
  if (!AuthKey) {
    console.error("AuthKey 获取失败!");
    ElMessage.warning(`地址不正确，AuthKey 获取失败!`);
    return;
  }
  if (AuthKey.includes("/")) {
    AuthKey = encodeURIComponent(AuthKey);
  }
  AuthKeyVer = uri.searchParams.get("authkey_ver") || "1";
  Lang = uri.searchParams.get("lang") || "zh-cn";

  const gachaTypes = await gachaType(AuthKey, AuthKeyVer, Lang);
  // console.log("获取抽卡活动类型成功");
  // console.log("开始获取抽卡记录");
  tips.value = "开始获取抽卡记录";
  // let GachData = [];
  let GachDataObj = {};
  for (const type of gachaTypes) {
    // console.log("type:", gachaTypes);
    let gacha_type = type.key;
    // get gacha logs
    const logs = (await getGachaLogs(type.name, type.key)).map((item) => {
      return [item.time, item.name, item.item_type, parseInt(item.rank_type)];
    });
    logs.reverse();
    let idx = 0,
      pdx = 0;
    for (let log of logs) {
      idx += 1;
      pdx += 1;
      log.push(idx, pdx);
      if (log[3] === 5) {
        pdx = 0;
      }
    }
    //第一个数据
    // console.log(logs);
    // GachData.push(logs);
    GachDataObj[gacha_type] = logs;
  }
  console.log("获取抽卡记录结束");
  tips.value = "获取抽卡记录完成";
  // console.log(GachData);
  Upactivity(GachDataObj);
  // console.log(GachDataObj);
  //保存本地
  local.set("GachDataObj", GachDataObj);
};
/**
 * "200" "常驻祈愿"
 * "100" "新手祈愿"
 * "301""角色活动祈愿"
 * "302""武器活动祈愿"
 */
//查询
const queryFn = () => {
  main(url.value);
};


//up扇形图
const Upactivity = (dataObj) => {
  let data = statistical(dataObj);
  upactivity_D.level_3_Weapons.push(...data.level_3_Weapons);
  upactivity_D.level_4_role.push(...data.level_4_role);
  upactivity_D.level_4_weapons.push(...data.level_4_weapons);
  upactivity_D.level_5_role.push(...data.level_5_role);
  upactivity_D.total = data.total;
  upactivity_D.noGoldTimes = data.noGoldTimes;
  upactivity_D.probability.push(...data.probability);
  console.log(data);
  DataShow.value = true; //显示数据
  const Dom = each.value; // document.getElementById("each");
  if (!Dom) return;
  let EChart = echarts.init(Dom);
  let config = {
    title: { text: "角色活动祈愿" },
    tooltip: {},
    // color: ["skyblue", "#9b75b2", "#9b75b2", "#d68d4d"],
    series: [
      {
        name: "角色数量",
        type: "pie",
        data: [
          {
            value: data.level_3_Weapons.length,
            name: "三星武器",
            itemStyle: { color: "skyblue" },
          },
          {
            value: data.level_4_role.length,
            name: "四星角色",
            itemStyle: { color: "#9b75b2" },
          },
          {
            value: data.level_4_weapons.length,
            name: "四星武器",
            itemStyle: { color: "#9b75b2" },
          },
          {
            value: data.level_5_role.length,
            name: "五星角色",
            itemStyle: { color: "#d68d4d" },
          },
          // { value: data.level_5_weapons.length, name: "五星武器" },
        ],
      },
    ],
    radius: "50%",
  };
  EChart.setOption(config);
};
//导出表格数据
const Export = ()=>{
console.log(`导出表格数据`,);
let data = local.get('GachDataObj')
save(data)
}
setTimeout(() => {
  // Upactivity();
  // statistical();
}, 0);
const each = ref(null);
</script>

<template>
  <div>
    <header>
      <div class="search">
        <el-input
          v-model="url"
          size="small"
          class="url"
          placeholder="抽奖地址:如:https://webstatic.mihoyo.com/XXX"
        />
        <el-button
          class="button"
          color="#626aef"
          size="small"
          style="color: white"
          @click="queryFn"
          id=""
          :icon="Search"
          >查询</el-button
        >
        <el-button
        v-show="DataShow"
          class="button"
          color="#626aef"
          size="small"
          style="color: white"
          @click="Export"
          :icon="Download"
          >导出Excel表格</el-button
        >
      </div>
    </header>
    <div class="text">{{ tips }}</div>
    <div class="schart" v-show="DataShow">
      <div class="schart-box">
        <div class="text-box">
          <p>
            抽取次数:{{ upactivity_D.total }},目前已抽
            <el-tag>
              {{ upactivity_D.noGoldTimes }}
            </el-tag>

            发没出金
          </p>

          <p>
            五星角色次数:{{ upactivity_D.level_5_role.length }}
            <span v-for="item in upactivity_D.level_5_role" :key="item[0]">
              <el-tag type="success" class="tag">
                {{ `${item[1]}(${item[5]})` }}
              </el-tag>
            </span>
          </p>
          <p>四星角色次数:{{ upactivity_D.level_4_role.length }}</p>
          <p>四星武器次数:{{ upactivity_D.level_4_weapons.length }}</p>
          <p>三星武器次数:{{ upactivity_D.level_3_Weapons.length }}</p>
          <ul class="">
            <li v-for="(each, i) in upactivity_D.probability" :key="i">
              {{ each.title }}: <el-tag>{{ each.chance }}</el-tag>
            </li>
          </ul>
        </div>
        <div id="each" ref="each" style="width: 30rem; height: 15rem"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
html {
  font-size: 6.25vw;
}
* {
  margin: 0;
  padding: 0;
}
.search,
.schart-box,
.center,.export {
  display: flex;
  justify-content: center;
}

.url {
  /* margin-left: 20%; */

  text-align: center;
  width: 400px;
}
.text {
  margin-left: 10rem;
  color: #ffa256e1;
  /* 3: "ff8e8e8e",
					4: "ffa256e1",
					5: "ffbd6932", */
}
.button {
  margin-left: 0.25rem;
}
.schart {
  margin-top: 3rem;
}
.text-box {
  font-size: 0.9rem;
}
.tag {
  margin: 0 0.1rem;
}
p {
  margin: 10px 0;
}
li {
  list-style: none;
}
</style>
