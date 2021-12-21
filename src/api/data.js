import {
    GachaLogBaseUrl,
    GachaTypesUrl
} from './baseUrl'
//获取抽奖数据接口
const getGachaLog = (key, page, end_id, AuthKey, AuthKeyVer, Lang) => fetch(GachaLogBaseUrl +
        `?authkey=${AuthKey}` +
        `&authkey_ver=${AuthKeyVer}` +
        `&lang=${Lang}` +
        `&gacha_type=${key}` +
        `&page=${page}` +
        `&size=${20}` +
        `&end_id=${end_id}`, {
            credentials: 'include'
        })
    .then(res => res.json())
    .then(data => data)
//获取抽奖类型
const gachaTypes = (AuthKey, AuthKeyVer, Lang) => fetch(
        `${GachaTypesUrl}?authkey=${AuthKey}&authkey_ver=${AuthKeyVer}&lang=${Lang}`, {
            credentials: 'include'
        }
    )
    .then((res) => res.json())
    .then((data) => data.data.gacha_type_list);
export {
    getGachaLog,
    gachaTypes
}