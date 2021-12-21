//公用api
const api = {
    // 存储
    set(key, val) {
        if (val === undefined) {
            throw new Error('undefined数据不能保存')
            // console.log('undefined数据不能保存');
            // return false
        }
        this.storage.setItem(key, JSON.stringify(val));
        return true;
    },
    // 获取
    get(key) {
        if (this.storage.getItem(key)) {
            return JSON.parse(this.storage.getItem(key));
        }
    },
    //获取全部
    getAll() {
        let storage = this.storage.valueOf();
        let ret = {}
        for (const key in storage) {
            if (Object.hasOwnProperty.call(storage, key)) {
                ret[key] = storage[key]
            }
        }
        return ret
    },
    //是否含有
    has(key) {
        return this.get(key) !== undefined
    },
    //删除一个
    remove(key) {
        this.storage.removeItem(key);
    },
    //删除全部
    clear() {
        this.storage.clear();
    }
}

const store = {
    local: {
        storage: window.localStorage,
        ...api
    },
    session: {
        storage: window.sessionStorage,
        ...api
    }
}
// Object.assign(store.session, api);
// Object.assign(store.local, api);
export const {
    local,
    session
} = store
// export default {
//     //安装插件 vue3
//     install(app) { //opts
//         // app.config.globalProperties.$local = local;
//         // app.config.globalProperties.$session = session;
//         Object.defineProperty(app.config.globalProperties, '$local', {
//             get() {
//                 return local
//             }
//         });
//         Object.defineProperty(app.config.globalProperties, '$session', {
//             get() {
//                 return session
//             }
//         });
//     }
// };

export default (app) => {
    Object.defineProperty(app.config.globalProperties, '$local', {
        get() {
            return local
        }
    });
    Object.defineProperty(app.config.globalProperties, '$session', {
        get() {
            return session
        }
    });
}