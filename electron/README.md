# 在线全景制作桌面工具

## 项目目录结构

```
.
├── babel.config.js 使用iview组件，通过vue-cli3插件生成
├── config.js 对照配置文件
├── package.json
├── postcss.config.js
├── public // 静态公共资源
│   ├── config.json 对照配置文件
│   ├── index.html
│   ├── main.js // electron的主入口 ****
│   ├── plugins
│   │   ├── bingmaps.js
│   │   ├── combobox.xml
│   │   ├── doubleclick_style.xml
│   │   ├── fps.xml
│   │   ├── googlemaps.js
│   │   ├── gyro2.js
│   │   ├── pp_blur.js
│   │   ├── pp_light.js
│   │   ├── pp_sharpen.js
│   │   ├── scrollarea.js
│   │   ├── showtext.xml
│   │   ├── soundinterface.js
│   │   ├── videoplayer.js
│   │   ├── webvr.js
│   │   ├── webvr.xml
│   │   ├── webvr_handcursor.png
│   │   ├── webvr_laser.png
│   │   ├── webvr_light.png
│   │   └── webvr_vrcursor.png
│   └── tour.js
├── src
│   ├── App.vue 入口文件
│   ├── api
│   │   └── index.js // 请求方法
│   ├── assets // 资源文件
│   │   ├── image
│   │   │   └── logo.png
│   │   ├── img
│   │   │   ├── hotspot
│   │   │   ├── rado.png
│   │   │   ├── rado@2x.png
│   │   │   └── spot
│   │   ├── less
│   │   │   ├── base.less // 基础重置样式
│   │   │   ├── common.less // 通用样式
│   │   │   └── var.less // 样式变量
│   │   └── xml
│   │       └── core.xml // 后续可能用到的一些通用action xml
│   ├── components
│   │   ├── header // 页面头部
│   │   │   ├── addModuleModal.vue // 添加模块弹窗
│   │   │   ├── appModal.vue // 应用管理弹窗
│   │   │   ├── index.vue
│   │   │   └── musicModal.vue // 背景音乐弹窗
│   │   ├── hotspot-canvas // 待实验
│   │   │   ├── index.js
│   │   │   └── index.vue
│   │   ├── img-loader.vue // 通用图片上传组件
│   │   ├── ps
│   │   │   ├── brochure // 电子楼书
│   │   │   │   └── index.vue
│   │   │   ├── houseType // 户型鉴赏
│   │   │   │   ├── floorDotModal.vue  户型列表-楼层（位置打点）
│   │   │   │   ├── houseFloorModal.vue 户型列表-楼层列表
│   │   │   │   ├── houseListDetail.vue 户型分类-户型列表
│   │   │   │   ├── houseTypeDetail.vue // 户型鉴赏-户型分类
│   │   │   │   └── index.vue
│   │   │   └── location // 区位交通
│   │   │       ├── index.vue
│   │   │       ├── locationAreaModal.vue //
│   │   │       ├── locationDetail.vue 区位交通详情-区分分类列表
│   │   │       ├── locationDot.vue // 区位交通各个分类下实时打点
│   │   │       └── locationDotModal // 区位交通打点位置管理
│   │   ├── scene // 页面左边场景
│   │   │   ├── addSceneModal.vue // 模块关联场景弹窗
│   │   │   ├── editSceneModal.vue // 场景编辑
│   │   │   ├── index.vue
│   │   │   └── rankSceneModal.vue // 当前模块下场景排序
│   │   ├── tool // 右侧工具面板
│   │   │   ├── floor.vue // 全景漫游-当前场景地图打点
│   │   │   ├── floorModal.vue 户型管理 - 楼层管理
│   │   │   ├── group.vue 热点分组
│   │   │   ├── hot.vue // 热点
│   │   │   ├── hotModal.vue // 热点管理（添加，编辑）
│   │   │   ├── houseModal.vue 全景漫游 - 户型管理（地图，楼层）
│   │   │   ├── index.vue // 入口
│   │   │   └── view.vue // 视图管理
│   │   └── vue-drag-resize // 地图打点拖拽处理位置组件
│   │       ├── vue-drag-resize.css
│   │       ├── vue-drag-resize.html
│   │       ├── vue-drag-resize.js
│   │       └── vue-drag-resize.vue
│   ├── config
│   │   ├── api.js API 接口配置
│   │   ├── config.js // 各个模块新增，模块子级等新增的时候的初始化数据
│   │   └── index.js 关于vr的一些常量
│   ├── directive
│   │   ├── drag.js  区位交通各个分类下实时打点-使用的拖拽指令
│   │   ├── loading // 自定义loading组件指令
│   │   │   ├── loading.js
│   │   │   └── loading.less
│   │   └── transferDom.js // dom添加到body后面的指令
│   ├── main.js vue入口文件
│   ├── minxins
│   │   ├── page.js // home.vue ps.vue 平面和vr都会执行的minxins
│   │   └── pspage.js // 平面模块下所以路由页的minxin
│   ├── plugins
│   │   └── iview.js
│   ├── router
│   │   └── index.js
│   ├── store
│   │   ├── index.js // 借用vuex-persistedstate部分数据持久化
│   │   └── root
│   │       ├── actions.js
│   │       ├── getters.js
│   │       ├── index.js
│   │       ├── mutations.js
│   │       ├── state.js
│   │       └── types.js
│   ├── utils
│   │   ├── auth.js // 没有cookies,模拟的授权token处理
│   │   ├── compressing.js // 全量发布前的压缩zip处理
│   │   ├── event.js // 时间总栈
│   │   ├── file.js // 之前图片还没有上传服务器的copy本地文件处理，已废弃
│   │   ├── form-data.js // 数据form-data 话
│   │   ├── index.js // 关于configJson的一系列操作
│   │   ├── krpano.js // xml,krpano原生接口操作
│   │   ├── localStorageUtils.js // 封装的localStorage
│   │   ├── location.js // 重定向到首页的封装
│   │   ├── particles.js
│   │   ├── platform.js 平台相关的判断
│   │   ├── raf.js // requestAnimationFrame动画兼容
│   │   ├── request.js // 请求库
│   │   ├── scroll.js // 区域交通打点tab的实时滚动处理
│   │   ├── sign.js 一些签名
│   │   ├── sql.js // 获取模块当前页面数据，按模块发布，id体系化
│   │   ├── upload.js // 文件的上传
│   │   ├── xhttp.js // 废弃
│   │   └── xml.js // vr操作更新本地xml文件
│   └── views
│       ├── choosefile.vue // 选择全景文件夹
│       ├── home.vue // vr首页
│       ├── login.vue // 登录页
│       ├── ps.vue // 平面模块入口
│       ├── psPreview.vue // 平面模块预览
│       └── tour.vue // vr模块预览
├── vue.config.js
└── yarn.lock
```

## 本地开发流程

1： 全景文件夹的生成可以参看本地文件： 全景工具.docx （包括一系列使用操作流程）

2：桌面工具本地开发

```
yarn install // 安装依赖
yarn serve // 开发环境
yarn electron // 运行electron（第一次会尝试加载vuejs_devtools,需要翻墙）

```

> electron 安装错误可以查看 github 对应 issue

3: 桌面工具打包

```
yarn build:test // 测试环境
yarn build // 生产环境

```

## 业务流程

全景工具.docx

## 技术架构

### **vr**

选择全景文件夹后

#### 1:请求接口获取配置，

#### 2: 分析接口配置

```javascript
/**
 * 解析config.json
 * 对所有的kp场景列表进行标记属于哪个模块
 * 没有标记的始终不管
 * 然后分模块对场景编辑，可以在当前模块下添加场景（kp所有场景）
 * 上面的指的是vr模块的处理，
 * 对于平面模块ps基于下述
 * "电子楼书" 只有一个层级，图片平铺
 * "区位交通" 二层 locations items
 * "户型鉴赏" 二层 types items
 * configSceneInfo {moduleid: scenes} 用来获取当前模块场景列表的，从krpano所有场景进行过滤 getCurrentModuleSceneList
 */
const analyConfig = () => {
    const state = store.state
    const { configJson } = state
    const moduleResult = [] // 最终的模块列表切换数据，这里全部平铺下来，如果按树结构化太复杂，容易出错
    const ps = [] // 平面设计模块
    try {
        configJson.modules.forEach((configModule, index) => {
            // ps模块不平铺
            if (~psTypes.indexOf(configModule.id)) {
                ps.push({
                    id: configModule.id,
                    name: configModule.name,
                    key: `modules[${index}]`
                })
            } else if (configModule.id === 'sandTable') {
                // 三维沙盘，和全景漫游是属于vr模块的,vr模块直接平铺下来
                const { sandTables = [] } = configModule
                moduleResult.push({
                    value: 'sandTable',
                    label: configModule.name || '三维沙盘',
                    key: `modules[${index}].sandTables`,
                    count: sandTables.length
                })

                state.configSceneInfo.sandTable = sandTables
            } else if (configModule.id === 'roaming') {
                // 全景漫游直接平铺，平铺到楼层
                const { houseTypes = [] } = configModule
                houseTypes.forEach((item, idx) => {
                    const moduleId = `roaming${idx}`
                    const { scenes = [] } = item
                    moduleResult.push({
                        value: moduleId,
                        label: `${configModule.name ||
                            '全景漫游'}-${item.name || ''}`,
                        count: scenes.length,
                        key: `modules[${index}].houseTypes[${idx}].scenes`
                    })
                    state.configSceneInfo[moduleId] = scenes
                })
            }
        })
        // 平面初始化，默认开始进入平面初始化
        state.ps = ps
        // vr初始化
        state.moduleList = moduleResult
        state.currentModule = defaultCurrentModule
        setCurrentScene(state)
    } catch (error) {
        //
    }
}
```

> 其中 vr 模式下，分析 config 生成了 moduleList 模块列表用来切换

> currentModule 指向当前激活模块；ps 模式下分析整理了 ps 用来平面模块的 menu 菜单

> configSceneInfo 需要特别注意，里面存的是 vr 模块列表下以各个模块 id 为 key，以 config 配置该 id 的场景列表数组为值，新增模块，删除模块都记得需要更新这个 configSceneInfo 信息。

> configSceneInfo 的用途是：获取当前模块下的场景，因为有可能当前激活 vr 模块下的场景列表根据场景名称 本地 xml 根本找不到匹配项，因此这个模块下的这个找不到匹配项的场景不允许编辑过滤掉（没有对应场景源文件）

#### 3: 对本地 xml 文件新增一些初始化 action，比如拖拽等,解析本地 xml 文件，转化为 xmlobj 并保存到 state

#### 4: vr 对当前模块当前激活场景进行一系列的操作：热点，视角，地图等，其中有些编辑配置涉及到 xml 文件的更改，xml 文件始终实时更改， 但是 config 配置本地缓存是实时更改，提交保存是一次性提交更改的，右上角保存按钮。因此很容易存在多人操作冲突等问题 （后续拆分 xml 按模块发布）

```javascript
const xml2js = require('xml2js')

const parser = new xml2js.Parser()
const builder = new xml2js.Builder()

const xmlToobj = filepath => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(filepath, 'tour.xml'), 'utf8', (err, data) => {
            if (err) reject(err)
            //xml转对象
            parser.parseString(data, (parseErr, obj) => {
                if (parseErr) reject(parseErr)
                resolve(obj)
            })
        })
    })
}

const objToXml = (obj, filepath) => {
    return new Promise((resolve, reject) => {
        const xmlStr = builder.buildObject(obj)
        // 写入文件
        fs.writeFile(path.join(filepath, 'tour.xml'), xmlStr, 'utf8', err => {
            if (err) reject(err)
            resolve()
        })
    })
}
```

#### 5: 发布，提交本地缓存 configJson，上传本地全景文件夹到 oss (增量上传处理)

### **ps**

#### 1: 应用管理切换到平面模块页面，入口 view/ps.vue

#### 2: 最初的平面模块都是全量发布配置

本地页面操作实时映射到本地的 state.configJson，（通过 lodash 里对应的类似‘modules[0].locations[1].items’，找到对应的这个 key 的 value 进行更改，src/utils/index.js 有详细说明）

#### 3: 上述发布流程多人操作的时候非常容易冲突，因为过于依赖于本地的缓存 configJson,针对这种情况作出以下改变： 按模块进行发布

##### 3.1 建立 id 体系映射，之前的页面级别 id 都过度依赖数组下标

```javascript
/* 多人操作冲突的方法
 * 建立id 体系，config扁平化，1: 接口弄（最优，这样始终和config服务器是同步的） 2:前端借用 sqlite （何时刷新本地建立db等问题比较大）3: 简单的自己写映射 (耦合度高了点)
 * 暂时用第三种方式， 目前只是简单的对平面模块进行分析建立id 体系
 * 建立id体系，不能单纯的在用数组下标，
 * 平面路由页面都应该实时请求接口去渲染页面数据，不能再用缓存，（然后切路由是否提示保存或者是直接丢失是可选的）
 * 建立体系所有的新增都要记得加s_id
 */
const initIdSystem = configJson => {
    configJson.modules = configJson.modules.map(configModule => {
        if (!configModule.s_id) {
            configModule.s_id = configModule.id || createId()
        }
        // 电子楼书不管很简单的只有一层直接用下标影响不大
        if (configModule.id === 'location') {
            const { locations = [] } = configModule
            configModule.locations = locations.map(location => {
                const { items = [], areas = [] } = location
                if (!location.s_id) {
                    location.s_id = createId()
                }
                location.items = items.map(item => {
                    if (!item.s_id) {
                        item.s_id = createId()
                    }
                    return item
                })
                location.areas = areas.map(area => {
                    if (!area.s_id) {
                        area.s_id = createId()
                    }
                    return area
                })
                return location
            })
        } else if (configModule.id === 'houseType') {
            const { types = [] } = configModule
            configModule.types = types.map(type => {
                const { items = [] } = type
                if (!type.s_id) {
                    type.s_id = createId()
                }
                type.items = items.map(item => {
                    if (!item.s_id) {
                        item.s_id = createId()
                    }
                    const { floors = [] } = item
                    item.floors = floors.map(floor => {
                        if (!floor.s_id) {
                            floor.s_id = createId()
                        }
                        return floor
                    })
                    return item
                })
                return type
            })
        }
        return configModule
    })
}
```

> 初始化配置下的各自的 id,后续之前的 index 地方全部替换成这个 id

##### 3.2 实时在平面模块入口文件请求配置接口，用于显示当前实时的 menu 菜单

```javascript
async getConfig() {
    const res = await fetchConfig()
    this.configJson = res
    const ps = []
    res.modules.forEach((configModule, index) => {
        // ps模块不平铺
        if (~psTypes.indexOf(configModule.id)) {
            ps.push({
                id: configModule.id,
                name: configModule.name,
                key: `modules[${index}]`
            })
        }
    })
    this.updatePslist(ps)
}
```

##### 3.3 统一对所有的平面模块子路由增加一个 mixins 混入

```javascript
import { isEqual, cloneDeep, isEmpty } from 'lodash'
import {
    fetchConfigByModule,
    saveConfigByModule,
    validhouse,
    validlocation
} from 'src/utils/sql'
import { mapMutations, mapState } from 'vuex'
import { MODULE_PUBLISH } from 'src/store/root/types'

export default {
    data() {
        return {
            form: {},
            formcopy: {}
        }
    },
    computed: {
        ...mapState(['ps']),
        configJsonInner() {
            return this.$parent.configJson
        }
    },
    watch: {
        configJsonInner() {
            const { needFetchData = true } = this
            needFetchData && this.initData()
        }
    },
    methods: {
        ...mapMutations({
            publishbyModule: MODULE_PUBLISH
        }),
        /*
         * header组件发布是全量发布，检验不通过不让发布提示错误，
         * 这里如果按模块页面发布的情况下，可能也会存在检验不通过的情况，但是如果不通过就不让提交有点坑会死循环，
         * 因为有些检验比如户型鉴赏校验实际上分散到了几个页面模块，此时根本就无法单一的去谈完整性，
         * 因此这里不通过检验也让用户提交保存，但是应该明确提示用户检查自己的配置，或者进行预览查看。因此统一这里再检验下
         * 如果前端不需要这些检验的话那么就是h5需要做一些容错显示处理，不然有些页面直接报错
         */
        validVrModule(configJson) {
            const msg = validlocation(configJson) || validhouse(configJson)
            if (msg) {
                // 有一项没有通过检验提示错误
                this.$Message.warning(msg)
                return false
            }
            return true
        },
        async modulepublish(type) {
            const { needFetchData = true } = this
            let params = this.form

            if (this.valid) {
                // valid方法需要返回保存的参数
                params = this.valid()
            }
            const res = await saveConfigByModule({
                objkey: this.objkey,
                data: params,
                type: needFetchData ? 'update' : 'add'
            })
            // 接口更新成功，顺便更新一波对应的本地的configJson缓存
            if (res.result) {
                this.publishbyModule(res)
                this.$Message.success('保存成功')
                // 有些页面有valid方法并且params还额外拼接参数的情况下这个时候，如果还有publishSuccess里面路由跳转，然后beforeRouteLeave拦截一层发现form和formcopy不一致的问题，所有同步下，或者formcopy直接取this.form 值
                this.form = cloneDeep(params)
                this.formcopy = cloneDeep(params)
                this.validVrModule(res.configJson)
                if (this.publishSuccess && type !== 'leave') {
                    this.publishSuccess()
                }
            } else {
                this.$Message.error(res.message || '')
            }
        },
        modulereset() {
            this.form = cloneDeep(this.formcopy)
        },
        async initData() {
            // 根路由已经实时请求过一次了，直接用根路由的值，不要再请求了，根路由请求是为了渲染左侧的menu
            if (!isEmpty(this.configJsonInner)) {
                const res = await fetchConfigByModule(
                    this.objkey,
                    this.configJsonInner
                )
                if (res.result) {
                    let data = res.data
                    if (this.initDataInner) {
                        data = this.initDataInner(res.data)
                    }
                    this.form = cloneDeep(data)
                    this.formcopy = cloneDeep(data)
                } else {
                    this.$Message.error(res.message || '')
                }
            }
        }
    },
    created() {
        if (!this.ps.length) return
        // form, formcopy, objkey三个key必须，needFetchData页面既可以添加也可以删除的时候可用，defaultData默认新增的数据，新增的时候也是必须的
        // valid方法保存的检验，initDataInner初始化的一些额外设置,publishSuccess发布成功以后的回调方法
        const { needFetchData = true, form, formcopy, objkey } = this
        if (!form || !formcopy || !objkey) {
            console.log('页面确缺少初始化数据结构')
        } else if (needFetchData) {
            // this.initData()
        } else if (this.defaultData) {
            this.form = cloneDeep(this.defaultData)
            this.formcopy = cloneDeep(this.defaultData)
        } else {
            console.log('该新增页面没有默认的初始数据！')
        }
    },
    beforeRouteLeave(to, from, next) {
        if (this.form && this.formcopy && !isEqual(this.form, this.formcopy)) {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>有未保存的内容，离开前是否保存？</p>',
                'ok-text': '保存',
                'cancel-text': '不保存',
                onOk: async () => {
                    await this.modulepublish('leave')
                    next()
                },
                onCancel: () => {
                    next()
                }
            })
        } else {
            next()
        }
    }
}

// 电子楼书使用
import psPage from 'src/minxins/pspage'

export default {
    mixins: [psPage],
    data() {
        return {
            name: '',
            loading: false,
            objkey: 'modules[brochure]'
        }
    }
}

// 区位交通分类详情页使用
export default {
    mixins: [psPage],
    data() {
        return {
            defaultData: locationInit
        }
    },
    computed: {
        id() {
            return this.$route.params.id || ''
        },
        needFetchData() {
            return !!this.id
        },
        objkey() {
            return this.needFetchData
                ? `modules[location].locations[${this.id}]`
                : 'modules[location].locations'
        }
    }
}
```

> 1: 新增的话直接使用 defaultData 进行初始化赋值，needFetchData 辨识页面是否是属于新增，needFetchData 为 false 为新增

> 2: 其他情况下通过 ps 主入口实时请求下来的配置进行初始化，可以额外增加本地也的一些 initDataInner 补丁

> 3: 初始化中需依赖页面的 objkey（类似接口 path 的概念），找到当前页面对应 config 的具体值赋值到本地

> 4: 页面可以重置，按模块发布，发布（如果本地有检验 valid 那么必须通过本地页面的 valid，发布成功可以执行页面自定义的 publishSuccess）

> 5: 路由离开的时候拦截提示保存,其中保存有个很无奈的一个检验，后续再 faq 详情说明

##### 3.4 上面的使用可能对于初始数据和发布不清楚

```javascript
// objkey `modules[${moduleID}].locations[${id}].items[${itemid}]` 需要把id转成数组下标方便更新configJson
const fetchConfigByModule = async (objkey, json) => {
    let configJson = json
    if (!json) {
        const res = await getConfigJson()
        configJson =
            res.data.data === ''
                ? cloneDeep(configInit)
                : JSON.parse(res.data.data)
    }
    const data = idTransferToIndex(objkey, configJson)
    return {
        ...data,
        data: get(configJson, data.objkey),
        configJson: configJson
    }
}
```

> 类似接口的获取数据接口请求，objkey 对应接口路径（不一样的形式 `modules[${moduleID}].locations[${id}].items[${itemid}]`）

```javascript
/*
 * ps子路由页面按模块进行发布提交
 * 1: 先获取接口实时配置，
 * 2: 根据传入的objkey设置对应，和传入的data,合并到接口最新的config
 * 3: 提交保存合并后的config到接口
 */
const saveConfigByModule = async params => {
    const res = await getConfigJson()
    let configJson =
        res.data.data === '' ? cloneDeep(configInit) : JSON.parse(res.data.data)
    const { objkey = '', data = {}, type = 'update' } = params
    const idObj = idTransferToIndex(objkey, configJson)

    if (idObj.result) {
        if (type === 'update') {
            // 完整性检查成功，并且成功转换objkey
            set(configJson, idObj.objkey, data)
        } else if (type === 'add') {
            data.s_id = data.s_id || createId() // 新增的话记得加id
            let array = get(configJson, idObj.objkey)
            array.push(data)
        }
        await saveConfigJson(configJson)
        return {
            result: true,
            message: '保存成功',
            objkey: idObj.objkey,
            data,
            type,
            configJson,
            originkey: objkey
        }
    }
    return {
        result: false,
        message: idObj.message || '保存失败'
    }
}
```

> 类似接口的保存概念，保存前还额外的实时请求了下列表接口去检验完整性

> 保存成功以后记得更新本地 config 缓存，因为头部还有个全量发布，如果不更新缓存，就会有问题

**很重要的完整性检测函数!!!!!!**

```javascript
// 多人操作以后，为了避免冲突不能再用 index
// 建立 id 体系，传入的都是 id,但是实际更改 lodash.set 还是用的下标，需要转成下标模式
// 如：`modules[${moduleID}].locations[${id}].items[${itemid}]`
// 转换后 `modules[0].locations[1].items[3]`
// 其中如果有一个转换失败说明，有一个已经删除了该数组下这个下标，此时相当于直接新增
// 但还有一种特殊情况，比如 a/b/c a，b 用户刚开始都在同一配置下，a 用户在 b 页面，b 用户在 c 页面
// a 用户删除了 b 层级页面，此时 b 用户肯定是找不到的，此时情况下就不能算是新增，应该抛出错误，提示引导用户该页面父类已经删除了，请回退到主页面

const idTransferToIndex = (
    objkey = '',
    configJson = store.state.configJson
) => {
    // 示列就当是这个'modules[0].locations[1].items[3]'
    const keyarr = objkey.split('.') // ["modules[0]", "locations[1]", "items[3]"]
    let count = 0 // 从第一项开始匹配
    let currentObj = cloneDeep(configJson)

    let notMatchIndexArr = []

    const newobjkey = objkey.replace(
        /\[([^.]+)\]/g,
        (data, $1, index, origin) => {
            // data 匹配的值, $1 id, index下标位置，origin原始数据
            // [0] 0 7 modules[0].locations[1].items[3]
            const key = keyarr[count].replace(data, '') // modules, locations, items
            count++
            currentObj = currentObj[key] || []
            const matchIndex = currentObj.findIndex(item => item.s_id === $1)
            if (matchIndex === -1) {
                // 没有找到这个下标有可能已经删除
                notMatchIndexArr.push({
                    parent: currentObj
                })
            } else {
                currentObj = currentObj[matchIndex]
            }
            return `[${matchIndex}]`
        }
    )
    if (notMatchIndexArr.length) {
        return {
            result: false,
            message: '该元素父级已经删除，不能操作，请切换到根目录'
        }
    }
    return {
        result: true,
        message: '所有完整性检查成功',
        objkey: newobjkey
    }
}
```

> 平面模块数据填充的时候实时检验了一层，保存发布的时候又检验了一层，本地缓存更新也检验了一层。多次保证完整性

#### 4: ps 路由页面都实时请求接口填充到本地 data 数据，所有页面操作都是更新本地 data 数，modal 弹窗数据填充也来自于本地 data,modal 更改的数据也是在页面本地 data,都需要最终发布保存，也可以选择重置为最初的数据

> 通过建立唯一的 id 体系和对应的映射、完整性检测、路由跳转前提示保存、实时请求接口填充数据，可以很大程度上避免多人操作的冲突性。vr 模块后续也需要拆分。实际上本地的 ID 体系还是有一定的业务耦合，最合理的还是接口直接把 config 偏平化，打成数据库表那样的结构

## 待改进

1: 平面模块有很多关于图片上传处理，是否需要增加素材管理功能，方便用户直接选择已有素材

2: 模块排序，以及里面各种分类 tab，户型列表等，是否都支持排序功能

3: vr 预览，和平面预览是否存在优化空间，（1: postmessage 必须得再 h5 请求完 config 后触发，不然会被接口覆盖 2: 如何直接跳转到对应模块对应分类进行对应类型预览），区位交通打点页很好的体验了实时性，关于户型鉴赏等除了漫游按钮图片位置打点可以看到一点实时性，关于背景图其他图上传实时效果差，上面的预览按钮无法跳到对应模块。（产品方面交互等是否可以优化）

4: 工具代码层面的优化，之前很多方法都是按业务拆分，后续抽象了通用的对于 config 的处理操作，是否业务代码统一，操作类型统一。以及很多 catch 没有抛出（接入天眼抛出），请求拦截优化，

5: 三维沙盘分组和角度处理，目前分组用的默认值，以及三维沙盘复杂的单体序列帧

6: 之前的关于热点交互优化及一些体验，视角等交互优化

7: 目前全景文件如果是从零配置开始生成再配置没问题，但是已有项目如何新增场景等还没处理

8: vr 模块无法分模块进行发布，因为 xml 是一个大的整体，后续可能需要拆分 xml,一个模块对应一个 xml 文件

## FAQ

#### 平面模块的按模块发布

背景：有些配置如果不完整在 h5 端可能会导致页面报错，无法显示

1: 头部的全量发布对整个配置进行量检测，有问题不让发布，并提示错误

2: 平面模块的是按模块路由页面进行发布的，而有些配置是分散到了各个页面路由，比如户型鉴赏（户型到楼层），必须得有楼层，是在第三个层级，有三个路由页面，如果此时检验不通过不让发布可能就会导致死循环（每次进路由页面都是取最新数据去渲染的）。针对这种特殊的情况，此时允许发布，但是发布的时候会检测整个平面模块的配置并给出错误提示

> 用户发布一个更改最好还是先预览一下

#### 图片上传路径问题

目前每个上传使用 image-loader 都是可以设置自定义路径的 prop (uploadPath),需要特别注意下使用的时候是否冲突，以及是否需要覆盖上传策略，
以及后续可能搞的素材管理，需要重新规划下整个的路径。
