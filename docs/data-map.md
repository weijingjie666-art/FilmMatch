# FilmMatch 数据结构说明

这份说明用于帮助招聘方或协作者快速定位 FilmMatch 的核心数据和推荐规则。所有数据都随源码提供，不依赖线上数据库。

## 数据文件

| 文件 | 内容 |
| --- | --- |
| `src/data/cameras.js` | 主相机数据，包含品牌、完整型号、价格区间、对焦/曝光能力、重量、卡口、场景、风险、推荐理由和新手友好度。 |
| `src/data/all-cameras.js` | 将主数据与扩展数据合并为当前 500 台相机的运行时汇总。 |
| `src/data/camera-expansion.js`、`camera-expansion-2.js`、`camera-expansion-3.js`、`camera-expansion-4.js` | 扩充相机库时保留的分批数据模块。 |
| `src/data/film-library.js` | 胶卷数据库，包含品牌、型号、ISO、色彩/黑白类型、风格、光线、场景、价格和来源。 |
| `src/data/film-prices.js` | 胶卷真实价格参考、价格口径、更新时间和价格来源链接。 |
| `src/data/camera-images.js` | 相机型号到图片 URL、来源页、图片署名和 `alt` 文本的对应关系。 |
| `src/data/knowledge-base.js` | 相机知识、胶卷百科、胶卷指南、场景化选卷内容、检查清单和资料来源。 |

## 测评题目与选项

测评题目、选项和默认值由 `src/main.js` 中的 `defaultPrefs`、`SCENES`、`GUIDE_OPTIONS`、`FILM_FIELDS` 以及对应的页面渲染函数维护，包含预算、操作方式、拍摄场景、便携性、新手友好度、维护风险、画面偏好、光线和已有相机等维度。用户选择会写入浏览器 `localStorage`，用于实时预览和完成测评后的最终推荐。

## 相机匹配与排序

推荐逻辑位于 `src/main.js`：

- `WEIGHTS`：综合评分权重；当前为预算 16%、操作 12%、场景 45%、便携 10%、新手友好 8%、维护风险 9%；
- `scoreScenePreferences`：区分宽泛场景、具体场景和多场景命中，避免只按单个标签粗略匹配；
- `scoreCamera`：汇总预算、操作、场景、便携、新手和维护风险分项；
- `rankCameras`：应用硬性筛选后按综合分排序，输出 Top 3；
- `CAMERA_SCENE_PROFILES`、`CAMERA_SCENE_IMPORTANCE`：场景词和具体用途的匹配规则。

预算下限明显超出用户范围、维护风险超过接受范围或关键规格冲突的型号会被硬性排除；剩余候选再按加权分排序。

## 胶卷推荐与成本

- 胶卷字段维度由 `FILM_FIELDS` 定义，涵盖拍摄对象、画面风格、光线、场合和相机适配；
- 胶卷推荐逻辑在 `recommendFilm` 及相关筛选函数中，结合场景、光线、季节、主题、ISO 和已有相机状态；
- `COSTS` 和 `calculateCost` 位于 `src/main.js`，计算胶卷、冲洗、电池、配件和维修预留等首次体验成本；
- 胶卷的公开价格口径和来源在 `src/data/film-prices.js`，具体二手或零售成交价仍需按商品复核。

## 菲林百科

`src/data/knowledge-base.js` 同时包含：

- 胶卷百科：ISO、色彩、黑白、曝光宽容度、冲扫和保存；
- 胶片机百科：机身类型、卡口、自动/手动操作、常见故障和二手验机；
- 41 条场景化选卷指南；
- 相机、胶卷和资料来源之间的可回查链接。

## 图片资源

相机图片不是由推荐逻辑临时生成。渲染时按照相机完整型号读取 `CAMERA_IMAGES_BY_NAME`，图片字段包含 `url`、来源页、`alt` 文本和来源署名；找不到图片时才使用页面已有的视觉 fallback，不会改变相机数据或推荐排序。
