import { CAMERAS } from './data/all-cameras.js?v=10';
import {
  CAMERA_KNOWLEDGE_BY_NAME,
  FILM_ENCYCLOPEDIA,
  FILM_LIBRARY_KNOWLEDGE,
  FILM_CAMERA_ENCYCLOPEDIA,
  FILM_GUIDES,
  KNOWLEDGE_ARTICLES,
  KNOWLEDGE_SOURCES,
  KNOWLEDGE_STATS,
} from './data/knowledge-base.js?v=9';
import { CAMERA_IMAGES_BY_NAME } from './data/camera-images.js?v=15';
import { FILM_LIBRARY_ROWS } from './data/film-library.js?v=9';
import { FILM_PRICE_BASIS, FILM_PRICE_REFERENCES, FILM_PRICE_SOURCES, FILM_PRICE_UPDATED_AT } from './data/film-prices.js?v=1';

// Scene intent is the strongest signal for a recommendation. The other
// dimensions still matter, but a camera should not win only because it is
// cheap or beginner-friendly when it does not fit the selected use case.
const WEIGHTS = { budget: .16, operation: .12, scene: .45, portability: .10, beginner: .08, maintenance: .09 };
const SCENES = ['日常记录', '人文街拍', '旅行风光', '人像', '静物 / 微距', '夜景 / 活动'];
const COSTS = { film: 73, develop: 18, battery: 40, accessories: 35, contingency: 80 };
const GUIDE_OPTIONS = {
  scene: ['旅行', '日常记录', '人像', '风景', '街拍', '室内', '夜景'],
  season: ['春季', '夏季', '秋季', '冬季', '不限'],
  light: ['晴天', '阴天', '室内', '傍晚', '夜景', '光线不确定'],
  theme: ['朋友和人物', '风景', '生日', '毕业', '旅行纪念', '日常生活', '建筑和城市'],
  look: ['清晰', '颗粒感明显', '复古', '色彩鲜艳', '色彩柔和', '黑白', '暂时不确定'],
  budget: ['低预算', '中等预算', '可接受较高成本'],
  experience: ['第一次使用', '使用过几卷', '比较熟悉胶片'],
};
const defaultGuidePrefs = () => ({ scene: '旅行', season: '不限', light: '晴天', theme: '旅行纪念', look: '清晰', budget: '中等预算', experience: '第一次使用' });
const COMPARISON_PRIORITIES = [
  { id: 'budget', label: '预算', note: '入手价格是否贴近你的预算' },
  { id: 'portability', label: '便携性', note: '是否适合旅行和日常携带' },
  { id: 'beginner', label: '新手友好度', note: '第一次使用是否容易上手' },
  { id: 'operation', label: '操作简单', note: '是否需要较多手动操作' },
  { id: 'lens', label: '镜头升级空间', note: '后续是否方便继续升级' },
  { id: 'scene', label: '适合旅行', note: '与你的主要拍摄场景是否匹配' },
  { id: 'maintenance', label: '维护风险', note: '二手购买和使用时的风险' },
  { id: 'cost', label: '后续使用成本', note: '机身和首卷的基础支出' },
  { id: 'appearance', label: '外观和机身感觉', note: '现有资料没有可客观比较的外观数据' },
];
const COMPARISON_SCENES = ['日常记录', '旅行', '人像', '风景', '街拍', '生日和纪念日', '室内拍摄', '第一次尝试胶片'];
const DEFAULT_COMPARISON_PRIORITIES = ['budget', 'portability', 'beginner'];
const STORAGE_KEY = 'filmmatch:local-state:v2';
const root = document.getElementById('root');
const CAMERA_BY_NAME = new Map(CAMERAS.map((camera) => [camera.name, camera]));
const NAV_ITEMS = [
  { id: 'recommendation', label: '推荐' },
  { id: 'camera-library', label: '相机库' },
  { id: 'film-library', label: '菲林百科' },
  { id: 'guide', label: '指南' },
  { id: 'community', label: '社区' },
];

const defaultPrefs = () => ({
  budget: 2000,
  operation: 3,
  scenes: ['旅行风光', '人文街拍'],
  portability: 3,
  beginner: 4,
  maintenance: 2,
  film: {
    subject: null,
    look: null,
    light: null,
    occasion: [],
    hasCamera: null,
  },
});

const loadPersistence = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const defaults = defaultPrefs();
    const savedFilm = saved.prefs?.film || {};
    const savedOccasion = Array.isArray(savedFilm.occasion) ? savedFilm.occasion : savedFilm.occasion ? [savedFilm.occasion] : defaults.film.occasion;
    return {
      favorites: new Set(Array.isArray(saved.favorites) ? saved.favorites.filter((name) => CAMERA_BY_NAME.has(name)) : []),
      compare: Array.isArray(saved.compare) ? saved.compare.filter((name) => CAMERA_BY_NAME.has(name)).slice(0, 3) : [],
      history: Array.isArray(saved.history) ? saved.history.slice(0, 8) : [],
      prefs: { ...defaults, ...(saved.prefs || {}), scenes: Array.isArray(saved.prefs?.scenes) ? saved.prefs.scenes : defaults.scenes, film: { ...defaults.film, ...savedFilm, occasion: savedOccasion } },
      submitted: Boolean(saved.submitted),
      guidePrefs: { ...defaultGuidePrefs(), ...(saved.guidePrefs || {}) },
      guideSubmitted: Boolean(saved.guideSubmitted),
      guideCameraName: saved.guideCameraName || '',
      guideFilmId: saved.guideFilmId || '',
      costFilmId: saved.costFilmId || '',
      costInputs: saved.costInputs || null,
      shootingPlan: saved.shootingPlan || null,
      comparisonPriorities: Array.isArray(saved.comparisonPriorities) ? saved.comparisonPriorities.filter((id) => COMPARISON_PRIORITIES.some((item) => item.id === id)).slice(0, 3) : [],
      comparisonScene: saved.comparisonScene || '',
      comparisonChoice: saved.comparisonChoice || '',
      comparisonFeedback: saved.comparisonFeedback || null,
      comparisonEvents: Array.isArray(saved.comparisonEvents) ? saved.comparisonEvents.slice(0, 50) : [],
    };
  } catch {
    return { favorites: new Set(), compare: [], history: [], prefs: defaultPrefs(), submitted: false, guidePrefs: defaultGuidePrefs(), guideSubmitted: false, guideCameraName: '', guideFilmId: '', costFilmId: '', costInputs: null, shootingPlan: null, comparisonPriorities: [], comparisonScene: '', comparisonChoice: '', comparisonFeedback: null, comparisonEvents: [] };
  }
};

const saved = loadPersistence();
const state = {
  prefs: defaultPrefs(),
  submitted: false,
  detail: null,
  cost: null,
  costFilmId: '',
  costInputs: null,
  rolls: 1,
  film: COSTS.film,
  develop: COSTS.develop,
  compare: saved.compare.map((name) => CAMERA_BY_NAME.get(name)).filter(Boolean),
  favorites: saved.favorites,
  history: saved.history,
  showCompare: false,
  showHistory: false,
  showPlan: false,
  libraryQuery: '',
  libraryBrand: '全部',
  libraryType: '全部',
  onlyFavorites: false,
  mobileMenuOpen: false,
  profileOpen: false,
  filmRandomIndex: 0,
  guideRandomIndex: 0,
  filmKnowledgeType: 'all',
  filmKnowledgeId: null,
  guidePrefs: defaultGuidePrefs(),
  guideSubmitted: false,
  guideCameraName: '',
  guideFilmId: '',
  shootingPlan: null,
  comparisonPriorities: [],
  comparisonScene: '',
  comparisonChoice: '',
  comparisonFeedback: null,
  comparisonFeedbackDraft: null,
  comparisonEvents: [],
};

Object.assign(state, {
  prefs: saved.prefs || defaultPrefs(),
  submitted: saved.submitted,
  guidePrefs: saved.guidePrefs || defaultGuidePrefs(),
  guideSubmitted: saved.guideSubmitted,
  guideCameraName: saved.guideCameraName,
  guideFilmId: saved.guideFilmId,
  costFilmId: saved.costFilmId,
  costInputs: saved.costInputs,
  shootingPlan: saved.shootingPlan,
  comparisonPriorities: saved.comparisonPriorities || [],
  comparisonScene: saved.comparisonScene || '',
  comparisonChoice: saved.comparisonChoice || '',
  comparisonFeedback: saved.comparisonFeedback || null,
  comparisonEvents: saved.comparisonEvents || [],
});

const clamp = (n, min = 1, max = 5) => Math.max(min, Math.min(max, n));
const money = (n) => `¥${Math.round(n).toLocaleString('zh-CN')}`;
const esc = (value) => String(Array.isArray(value) ? value.join('、') : value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const normalize = (value) => String(value ?? '').trim().toLocaleLowerCase('zh-CN');
const FILM_BY_ID = new Map(FILM_LIBRARY_ROWS.map((film) => [film.id, film]));
const filmFormat = (film) => String(film?.format || '').trim();
const filmIso = (film) => Number(String(film?.iso || '').match(/\d+/)?.[0] || 0);
const filmPriceInfo = (film) => FILM_PRICE_REFERENCES[film?.id] || (Number.isFinite(Number(film?.price)) && Number(film.price) > 0 ? { cny: Number(film.price), low: Number(film.price), high: Number(film.price), source: '胶卷资料字段' } : null);
const filmPrice = (film) => filmPriceInfo(film)?.cny ?? null;
const filmPriceLabel = (film) => { const info = filmPriceInfo(film); return info ? `¥${info.low.toLocaleString('zh-CN')}–¥${info.high.toLocaleString('zh-CN')} / 135卷` : missingAmount(); };
const filmPriceSource = (film) => filmPriceInfo(film)?.source || '价格暂未录入';
const filmKnowledgeId = (film) => film ? `library-${String(film.id).toLowerCase()}` : '';
const missingAmount = () => '暂未录入';
const amountValue = (value) => Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : null;
const amountText = (value) => amountValue(value) == null ? missingAmount() : money(value);
const FILM_FIELDS = ['subject', 'look', 'light', 'occasion', 'hasCamera'];
const isFilmAssessmentComplete = (prefs) => FILM_FIELDS.every((field) => field === 'occasion' ? Array.isArray(prefs.film?.[field]) && prefs.film[field].length > 0 : Boolean(prefs.film?.[field]));
const isAssessmentComplete = (prefs) => isFilmAssessmentComplete(prefs);
const markAssessmentDirty = () => { state.submitted = false; invalidateResults(); };
const FILM_KNOWLEDGE = [...FILM_ENCYCLOPEDIA, ...FILM_LIBRARY_KNOWLEDGE, ...FILM_CAMERA_ENCYCLOPEDIA];
const filmKnowledgeKind = (article) => article.kind || (article.type === '胶片机' ? 'camera' : 'film');
const visibleFilmKnowledge = () => FILM_KNOWLEDGE.filter((article) => state.filmKnowledgeType === 'all' || filmKnowledgeKind(article) === state.filmKnowledgeType);
const sectionIds = new Set(NAV_ITEMS.map((item) => item.id));
// Make adjacent preference choices meaningfully change the ranking while keeping
// the existing 1–5 score scale and all downstream rendering unchanged.
const scoreDistance = (value, target) => {
  const distance = Math.abs(Number(value) - Number(target));
  return clamp(5 - (distance === 0 ? 0 : 1.35 * distance ** 1.35));
};
const cameraType = (camera) => {
  if (camera.autoFocus && camera.lens.includes('卡口')) return '自动化单反';
  if (!camera.autoFocus && camera.lens.includes('卡口')) return camera.autoExposure ? '半自动单反' : '机械手动单反';
  if (!camera.autoFocus && !camera.lens.includes('卡口')) return '旁轴 / 定焦';
  return '全自动便携机';
};

const nextRandomIndex = (length, current) => {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  if (next === current) next = (next + 1) % length;
  return next;
};

let resultCache = null;
let renderFrame = 0;
let pendingAnnouncement = '';
let persistTimer = 0;
let toastTimer = 0;
let scrollRequest = 0;

const invalidateResults = () => { resultCache = null; };

const persistState = () => {
  window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        favorites: [...state.favorites],
        compare: state.compare.map((camera) => camera.name),
        history: state.history.slice(0, 8),
        prefs: state.prefs,
        submitted: state.submitted,
        guidePrefs: state.guidePrefs,
        guideSubmitted: state.guideSubmitted,
        guideCameraName: state.guideCameraName,
        guideFilmId: state.guideFilmId,
        costFilmId: state.costFilmId,
        costInputs: state.costInputs,
        shootingPlan: state.shootingPlan,
        comparisonPriorities: state.comparisonPriorities,
        comparisonScene: state.comparisonScene,
        comparisonChoice: state.comparisonChoice,
        comparisonFeedback: state.comparisonFeedback,
        comparisonEvents: state.comparisonEvents.slice(0, 50),
      }));
    } catch {
      // Private browsing or a full storage quota should not block the core MVP flow.
    }
  }, 0);
};

function scenePreferences(prefs) {
  const preferences = [...(prefs.scenes || [])];
  const subjectMap = { 人像: '人像', 风景: '风光' };
  const occasionMap = { 旅行: '旅行', 生日: '家庭', 毕业: '活动', 日常: '日常' };
  const subjectScene = subjectMap[prefs.film?.subject];
  const occasions = Array.isArray(prefs.film?.occasion) ? prefs.film.occasion : prefs.film?.occasion ? [prefs.film.occasion] : [];
  const occasionScenes = occasions.map((occasion) => occasionMap[occasion]).filter(Boolean);
  return [...new Set([...(subjectScene ? [subjectScene] : []), ...occasionScenes, ...preferences])];
}

const CAMERA_SCENE_PROFILES = {
  '\u65e5\u5e38\u8bb0\u5f55': ['\u65e5\u5e38', '\u5bb6\u5ead\u8bb0\u5f55', '\u968f\u8eab\u8bb0\u5f55'],
  '\u4eba\u6587\u8857\u62cd': ['\u4eba\u6587', '\u8857\u62cd', '\u7eaa\u5b9e'],
  '\u65c5\u884c\u98ce\u5149': ['\u65c5\u884c', '\u98ce\u5149', '\u6237\u5916'],
  '\u4eba\u50cf': ['\u4eba\u50cf', '\u4eba\u7269', '\u8096\u50cf', '\u68da\u62cd'],
  '\u9759\u7269 / \u5fae\u8ddd': ['\u9759\u7269', '\u5fae\u8ddd', '\u4ea7\u54c1'],
  '\u591c\u666f / \u6d3b\u52a8': ['\u591c\u666f', '\u591c\u95f4', '\u6d3b\u52a8', '\u805a\u4f1a'],
};
const CAMERA_SCENE_IMPORTANCE = {
  '\u4eba\u50cf': 1.35,
  '\u9759\u7269 / \u5fae\u8ddd': 1.2,
  '\u591c\u666f / \u6d3b\u52a8': 1.15,
  '\u4eba\u6587\u8857\u62cd': 1.1,
};

const sceneMatchScore = (camera, preference) => {
  const tokens = CAMERA_SCENE_PROFILES[preference] || [preference];
  return (camera.scenes || []).reduce((best, tag) => {
    const normalizedTag = normalize(tag);
    return Math.max(best, tokens.reduce((tokenBest, token) => {
      const normalizedToken = normalize(token);
      if (!normalizedToken) return tokenBest;
      if (normalizedTag === normalizedToken) return Math.max(tokenBest, 5);
      return normalizedTag.includes(normalizedToken) ? Math.max(tokenBest, 3) : tokenBest;
    }, 0));
  }, 0);
};

const scoreScenePreferences = (camera, preferences) => {
  const matches = preferences.map((preference) => sceneMatchScore(camera, preference));
  if (!matches.length) return { score: 1, matches, coverage: 0, exactCoverage: 0, focusMatch: 0, focusPreference: '' };
  const coverage = matches.filter((match) => match > 0).length;
  const exactCoverage = matches.filter((match) => match >= 4).length;
  const totalImportance = preferences.reduce((sum, preference) => sum + (CAMERA_SCENE_IMPORTANCE[preference] || 1), 0);
  const weightedMatch = matches.reduce((sum, match, index) => sum + match * (CAMERA_SCENE_IMPORTANCE[preferences[index]] || 1), 0);
  const averageMatch = weightedMatch / totalImportance;
  const focusIndex = preferences.reduce((bestIndex, preference, index) => {
    const bestImportance = CAMERA_SCENE_IMPORTANCE[preferences[bestIndex]] || 1;
    const importance = CAMERA_SCENE_IMPORTANCE[preference] || 1;
    return importance > bestImportance ? index : bestIndex;
  }, 0);
  const focusPreference = preferences[focusIndex];
  const focusMatch = matches[focusIndex];
  // A specific intent such as portrait or night work should not be erased by
  // a broad daily-use match. Matching the focused intent gets a modest bonus;
  // missing it gets a modest penalty. Full coverage still wins overall.
  const focusAdjustment = focusMatch >= 4 ? 1 : focusMatch > 0 ? 0.1 : -1;
  const score = clamp(1 + averageMatch * 0.8 + exactCoverage * 0.35 + focusAdjustment);
  return { score, matches, coverage, exactCoverage, focusMatch, focusPreference };
};

function filmScore(film, prefs, camera = null, guideMode = false) {
  const scenes = guideMode ? [prefs.scene, prefs.theme] : scenePreferences(prefs);
  const light = guideMode ? prefs.light : prefs.film?.light;
  const look = guideMode ? prefs.look : prefs.film?.look;
  const budget = guideMode ? prefs.budget : null;
  const haystack = normalize([film.name, film.type, film.scenes, film.seasons, film.themes, film.summary, film.style, film.advice, film.caution].join(' '));
  let score = 0;
  const reasons = [];
  if (scenes.some((scene) => scene && haystack.includes(normalize(scene)))) {
    score += 5;
    reasons.push(`适合${scenes.filter(Boolean).slice(0, 2).join('、')}`);
  }
  const iso = filmIso(film);
  if (light === '晴天' || light === '春季' || light === '夏季') {
    if (iso > 0 && iso <= 200) { score += 3; reasons.push('明亮光线下更容易发挥'); }
  } else if (light === '阴天' || light === '傍晚') {
    if (iso >= 400) { score += 4; reasons.push('ISO 400 让阴天和傍晚多一点快门余量'); }
  } else if (light === '室内' || light === '夜景') {
    if (iso >= 400) { score += 4; reasons.push('较高感光度更适合光线变化'); }
    else if (iso > 0) { score -= 1; }
  }
  if (look === '颗粒感' || look === '颗粒感明显') {
    if (/颗粒|复古|纪实|实验/.test(`${film.style}${film.themes}${film.summary}`)) { score += 3; reasons.push('画面更接近你偏好的颗粒或复古取向'); }
  }
  if (look === '清晰感' || look === '清晰') {
    if (/细腻|清晰|锐|细节|自然/.test(`${film.style}${film.themes}${film.summary}`)) { score += 3; reasons.push('细节和清晰度取向更贴合'); }
  }
  if (look === '色彩鲜艳' && /鲜明|饱和|明快|色彩/.test(`${film.style}${film.summary}`)) score += 2;
  if (look === '色彩柔和' && /柔和|自然|奶油|肤色/.test(`${film.style}${film.summary}`)) score += 2;
  if (look === '黑白' && /黑白/.test(`${film.type}${film.summary}`)) score += 5;
  if (budget === '低预算' && filmPrice(film) != null && filmPrice(film) <= 100) { score += 2; reasons.push('单卷价格更适合低预算尝试'); }
  if (budget === '可接受较高成本' && /专业|细腻|电影|实验/.test(`${film.type}${film.style}${film.summary}`)) score += 1;
  if (!filmPrice(film)) reasons.push('胶卷价格暂未录入，可在成本计算器手动补充');
  let compatibility = '建议购买前确认画幅和相机规格。';
  if (camera?.filmFormat) {
    compatibility = filmFormat(film).includes(camera.filmFormat) ? '画幅字段匹配。' : '画幅字段不匹配，不建议组合。';
    if (!filmFormat(film).includes(camera.filmFormat)) score -= 100;
  }
  return { score, reasons, compatibility };
}

function recommendFilm(camera, prefs = state.prefs, guideMode = false) {
  const ranked = FILM_LIBRARY_ROWS.map((film) => ({ film, ...filmScore(film, prefs, camera, guideMode) }))
    .filter((item) => item.score > -50)
    .sort((a, b) => b.score - a.score || filmIso(a.film) - filmIso(b.film));
  const selected = ranked[0] || { film: FILM_LIBRARY_ROWS[0], score: 0, reasons: [], compatibility: '信息不足，建议进一步确认。' };
  const film = selected.film;
  const light = guideMode ? prefs.light : prefs.film?.light;
  const scene = guideMode ? prefs.scene : (prefs.scenes?.[0] || '日常记录');
  const riskReasons = [film.caution, camera?.risk, selected.compatibility].filter(Boolean);
  const riskScore = (camera?.repairLevel || 1) + (light === '室内' || light === '夜景' ? (filmIso(film) < 400 ? 2 : 0) : 0) + (!filmPrice(film) ? 1 : 0);
  const riskLevel = riskScore >= 6 ? '较高风险' : riskScore >= 4 ? '中等风险' : '低风险';
  return {
    ...selected,
    film,
    scene,
    reason: selected.reasons.length ? `${selected.reasons.slice(0, 2).join('；')}。` : '当前资料更适合作为第一卷的基础选择。',
    suitable: film.scenes || '适合场景暂未录入',
    unsuitable: film.caution || '不适合场景暂未录入',
    riskLevel,
    riskText: riskReasons.slice(0, 2).join('；') || '信息不足，建议进一步确认。',
  };
}

function scoreCamera(camera, prefs) {
  const midpoint = (camera.priceLow + camera.priceHigh) / 2;
  const gates = [];
  if (camera.priceLow > prefs.budget * 1.2) gates.push('价格下限超过预算容差');
  if (camera.repairLevel > prefs.maintenance + 1) gates.push('维护风险超过接受范围');
  const budgetDistance = Math.abs(midpoint - prefs.budget) / Math.max(prefs.budget, 1);
  const budget = clamp(5 - budgetDistance * 2.2);
  const primaryScenePrefs = prefs.scenes?.length ? [...prefs.scenes] : scenePreferences(prefs);
  const allScenePrefs = scenePreferences(prefs);
  const secondaryScenePrefs = allScenePrefs.filter((preference) => !primaryScenePrefs.includes(preference));
  const primarySceneResult = scoreScenePreferences(camera, primaryScenePrefs);
  const secondarySceneResult = scoreScenePreferences(camera, secondaryScenePrefs);
  // Explicit camera-scene choices drive the ranking; film subject/occasion
  // remain useful as a smaller secondary signal without diluting the main intent.
  const scene = clamp(primarySceneResult.score * 0.85 + secondarySceneResult.score * 0.15);
  const operation = scoreDistance(camera.autoLevel, prefs.operation);
  const weightLevel = camera.weight <= 220 ? 5 : camera.weight <= 380 ? 4 : camera.weight <= 540 ? 3 : camera.weight <= 700 ? 2 : 1;
  const portability = scoreDistance(weightLevel, prefs.portability);
  const beginner = scoreDistance(camera.newbieLevel, prefs.beginner);
  const maintenance = scoreDistance(5 - camera.repairLevel, 5 - prefs.maintenance);
  const breakdown = { budget, operation, scene, portability, beginner, maintenance };
  const score = Object.entries(WEIGHTS).reduce((sum, [key, weight]) => sum + breakdown[key] * weight, 0);
  if (score < 3) gates.push('综合匹配分低于最低推荐分');
  return {
    ...camera,
    midpoint,
    breakdown,
    sceneMatches: primarySceneResult.matches,
    sceneCoverage: primarySceneResult.coverage,
    sceneExactCoverage: primarySceneResult.exactCoverage,
    sceneFocusMatch: primarySceneResult.focusMatch,
    score,
    gates,
    status: gates.length ? 'excluded' : 'recommended',
    reason: gates.length
      ? gates[0]
      : budget >= 4.5
        ? '价格区间更贴合你的预算'
        : scene === 5
          ? `适合${prefs.scenes[0]}等主要场景`
          : '在操作、便携和维护之间取得平衡',
  };
}

function getResults() {
  const signature = JSON.stringify(state.prefs);
  if (resultCache?.signature === signature) return resultCache.value;
  const scored = CAMERAS.map((camera) => scoreCamera(camera, state.prefs));
  const eligible = scored
    .filter((camera) => camera.status === 'recommended')
    .sort((a, b) => b.score - a.score
      || b.sceneExactCoverage - a.sceneExactCoverage
      || b.sceneCoverage - a.sceneCoverage
      || a.midpoint - b.midpoint);
  const value = {
    top: eligible.slice(0, 3),
    eligible,
    excluded: scored.filter((camera) => camera.status === 'excluded').sort((a, b) => b.score - a.score),
    all: scored,
  };
  resultCache = { signature, value };
  return value;
}

function visual(camera, large = false) {
  const image = CAMERA_IMAGES_BY_NAME[camera.name] || CAMERA_IMAGES_BY_NAME[camera.originalName];
  const photo = image
    ? `<img class="camera-photo" src="${esc(image.url)}" alt="${esc(image.alt)}" loading="${large ? 'eager' : 'lazy'}" decoding="async" referrerpolicy="no-referrer" onerror="this.hidden=true;this.nextElementSibling.hidden=false;">`
    : '';
  return `<div class="camera-visual ${large ? 'large' : ''}">${photo}<div class="camera-fallback" ${image ? 'hidden' : ''}><div class="film-grain"></div><div class="camera-body"><span class="brand-mark">${esc(camera.brand)}</span><span class="model-mark">${esc(camera.name.split(' ')[0])}</span><div class="lens"><i></i><b></b></div><div class="shutter"></div></div><div class="camera-strap"></div></div></div>`;
}

function activeNavId() {
  const hash = location.hash.replace(/^#/, '');
  return NAV_ITEMS.some((item) => item.id === hash) ? hash : 'recommendation';
}

function navLinks(className = '') {
  const active = activeNavId();
  return NAV_ITEMS.map((item) => `<a class="${className} ${active === item.id ? 'active' : ''}" aria-current="${active === item.id ? 'page' : 'false'}" data-action="nav" data-nav="${item.id}" href="#${item.id}">${item.label}</a>`).join('');
}

function segmented(field, value, options) {
  return `<div class="segmented">${options.map((item) => `<button type="button" class="${value === item.value ? 'active' : ''}" aria-pressed="${value === item.value}" data-action="set" data-field="${field}" data-value="${item.value}">${item.label}</button>`).join('')}</div>`;
}

function questionnaire() {
  const p = state.prefs;
  const film = p.film || {};
  const choice = (field, value, label) => { const selected = Array.isArray(film[field]) ? film[field].includes(value) : film[field] === value; return `<button type="button" class="${selected ? 'selected' : ''}" aria-pressed="${selected}" data-action="film-set" data-film-field="${field}" data-value="${esc(value)}">${label}${selected ? '<b>✓</b>' : ''}</button>`; };
  const complete = isAssessmentComplete(p);
  return `<aside class="questionnaire"><div class="questionnaire-head"><span>偏好测评 · ${complete ? '11 / 11 项已完成' : '还差 5 项胶卷偏好'}</span><strong>先回答，再解锁推荐</strong><p>相机匹配沿用原有 6 项偏好；新增问题用于胶卷取向和更完整的使用建议。</p></div><div class="questionnaire-fields"><section class="question-group"><div class="question-group-heading"><strong>01 · 预算</strong><span>硬性筛选</span></div><div class="field-block"><div class="field-label"><span>预算上限</span><span class="help-icon" title="预算用于筛选价格下限与区间中位">?</span></div><div class="range-wrap"><input aria-label="预算上限" type="range" min="300" max="5000" step="100" value="${p.budget}" data-action="range" data-field="budget"><div class="range-value">${money(p.budget)}</div></div><div class="range-marks"><span>¥300</span><span>¥1,000</span><span>¥2,000</span><span>¥3,000</span><span>¥5,000+</span></div></div></section><section class="question-group"><div class="question-group-heading"><strong>02 · 操作</strong><span>软性排序</span></div><div class="field-block"><div class="field-label"><span>操作偏好</span><span class="help-icon" title="自动化越高，越少手动控制">?</span></div>${segmented('operation', p.operation, [{ value: 1, label: '更自动' }, { value: 3, label: '半自动' }, { value: 5, label: '更手动' }])}<div class="field-help">1 = AF / AE 更省心，5 = 保留更多手动控制</div></div><div class="field-block"><div class="field-label"><span>便携性要求</span><span class="help-icon" title="按机身重量换算便携等级">?</span></div>${segmented('portability', p.portability, [{ value: 1, label: '低' }, { value: 3, label: '中等' }, { value: 5, label: '高' }])}</div><div class="field-block"><div class="field-label"><span>新手友好度</span><span class="help-icon" title="自动化和学习成本会影响此项">?</span></div>${segmented('beginner', p.beginner, [{ value: 1, label: '可学习' }, { value: 3, label: '中等' }, { value: 5, label: '越简单越好' }])}</div></section><section class="question-group"><div class="question-group-heading"><strong>03 · 场景</strong><span>影响匹配和胶卷取向</span></div><div class="field-block"><div class="field-label"><span>主要拍摄场景</span><small>可多选</small><span class="help-icon" title="场景会影响匹配理由和排序">?</span></div><div class="option-grid">${SCENES.map((scene) => `<button type="button" class="${p.scenes.includes(scene) ? 'selected' : ''}" aria-pressed="${p.scenes.includes(scene)}" data-action="scene" data-scene="${esc(scene)}">${scene}${p.scenes.includes(scene) ? '<b>✓</b>' : ''}</button>`).join('')}</div></div><div class="field-block film-question"><div class="field-label"><span>主要拍人还是风景</span><small>胶卷取向</small></div><div class="option-grid option-grid-compact">${choice('subject', '人像', '主要拍人')}${choice('subject', '风景', '主要拍风景')}</div></div><div class="field-block film-question"><div class="field-label"><span>喜欢颗粒感还是清晰感</span></div><div class="option-grid option-grid-compact">${choice('look', '颗粒感', '喜欢颗粒感')}${choice('look', '清晰感', '喜欢清晰感')}</div></div><div class="field-block film-question"><div class="field-label"><span>主要光线</span></div><div class="option-grid">${choice('light', '晴天', '晴天')}${choice('light', '阴天', '阴天')}${choice('light', '室内', '室内')}</div></div><div class="field-block film-question"><div class="field-label"><span>使用场合</span></div><div class="option-grid">${choice('occasion', '旅行', '旅行')}${choice('occasion', '生日', '生日')}${choice('occasion', '毕业', '毕业')}${choice('occasion', '日常', '日常')}</div></div></section><section class="question-group"><div class="question-group-heading"><strong>04 · 风险</strong><span>维护与准备</span></div><div class="field-block"><div class="field-label"><span>维护风险接受度</span><span class="help-icon" title="老电子机型可能需要更多验机和维修">?</span></div>${segmented('maintenance', p.maintenance, [{ value: 1, label: '希望省心' }, { value: 3, label: '中等' }, { value: 5, label: '可接受折腾' }])}<div class="field-help">我们会排除超出你接受范围的高风险型号</div></div><div class="field-block film-question"><div class="field-label"><span>是否已经有相机</span><small>影响成本提示</small></div><div class="option-grid option-grid-compact">${choice('hasCamera', '有', '已经有相机')}${choice('hasCamera', '没有', '还没有相机')}</div></div></section></div><div class="questionnaire-completion"><span>${complete ? '已完成全部测评，可以查看最终推荐。' : '完成 5 项胶卷偏好后，最终推荐和匹配解释会解锁。'}</span></div><button type="button" class="primary-button" data-action="submit" ${complete ? '' : 'disabled aria-disabled="true"'}>完成测评并查看推荐 <span class="arrow">→</span></button><button type="button" class="reset-button" data-action="reset">↻ 重置问卷</button></aside>`;
}

function scoreRows(camera) {
  return Object.entries({ budget: '预算', operation: '操作', scene: '场景', portability: '便携', beginner: '新手', maintenance: '维护' }).map(([key, label]) => `<div class="score-row"><span>${label}</span><em>${Math.round(camera.breakdown[key] * 20)}%</em><div class="score-track"><i style="width:${camera.breakdown[key] / 5 * 100}%"></i></div><strong>${camera.breakdown[key].toFixed(1)}</strong></div>`).join('');
}

function favoriteButton(camera, extraClass = '', origin = '') {
  const active = state.favorites.has(camera.name);
  return `<button type="button" class="icon-button ${extraClass} ${active ? 'is-active' : ''}" aria-label="${active ? '取消收藏' : '收藏'} ${esc(camera.name)}" aria-pressed="${active}" data-action="favorite" data-origin="${esc(origin)}" data-name="${esc(camera.name)}">${active ? '♥' : '♡'}</button>`;
}

function compareButton(camera, extraClass = '') {
  const active = state.compare.some((item) => item.name === camera.name);
  return `<button type="button" class="compare-button ${extraClass} ${active ? 'active' : ''}" aria-label="${active ? '移出对比' : '加入对比'} ${esc(camera.name)}" aria-pressed="${active}" data-action="compare" data-name="${esc(camera.name)}">${active ? '✓ 已加入' : '+ 加入对比'}</button>`;
}

function positioningLabel(camera, rank, best) {
  if (rank === 1) return '综合最匹配';
  if (camera.priceLow < best.priceLow && camera.priceHigh <= best.priceHigh) return '更省预算';
  if (camera.newbieLevel > best.newbieLevel) return '更适合新手';
  if (camera.weight < best.weight) return '更轻便随身';
  if (camera.repairLevel < best.repairLevel) return '更省心维护';
  const scene = camera.scenes.find((item) => !item.includes('想要') && !item.includes('希望') && !item.includes('需要')) || camera.scenes[0];
  return scene ? `更适合${scene}` : '另一种使用取向';
}

function fitTier(rank) {
  return rank === 1 ? '最适合' : rank === 2 ? '可以考虑' : '不太建议';
}

function weakestDimension(camera) {
  const labels = { budget: '预算', operation: '操作', scene: '场景', portability: '便携', beginner: '新手友好度', maintenance: '维护风险' };
  const [key] = Object.entries(camera.breakdown).sort(([, a], [, b]) => a - b)[0] || [];
  return key ? `${labels[key]}匹配相对弱一些（${camera.breakdown[key].toFixed(1)} / 5）` : '需要结合实机状态复核';
}

function alternativeFor(camera, results) {
  const alternative = results.top.find((item) => item.name !== camera.name);
  return alternative ? alternative.name : '相机库中的其他型号';
}

function card(camera, rank) {
  const best = getResults().top[0] || camera;
  const results = getResults();
  return `<article class="camera-card ${rank === 1 ? 'featured' : ''}"><div class="card-rank"><span>TOP</span><strong>${String(rank).padStart(2, '0')}</strong></div>${visual(camera)}<div class="card-content"><div class="card-title-row"><div><span class="camera-type">${cameraType(camera)}</span><h3>${esc(camera.name)}</h3></div>${favoriteButton(camera)}</div><div class="card-positioning">${esc(fitTier(rank))} · ${esc(positioningLabel(camera, rank, best))}</div><div class="match-row"><strong>${fitTier(rank)}</strong><span>基于你的 6 项偏好</span></div><div class="price-line">¥${camera.priceLow.toLocaleString()} – ¥${camera.priceHigh.toLocaleString()}</div><div class="mini-tags"><span>${cameraType(camera)}</span><span>${camera.weight}g</span><span>${camera.repairLevel <= 2 ? '可踏实用' : '需重点验机'}</span></div><p class="card-reason">${esc(camera.reason)}。${esc(camera.recommendation)}。</p><div class="card-decision-notes"><span><b>主要短板</b>${esc(weakestDimension(camera))}</span><span><b>替代方案</b>${esc(alternativeFor(camera, results))}</span></div><div class="card-actions"><button type="button" class="secondary-button" data-action="detail" data-name="${esc(camera.name)}">查看知识详情</button>${compareButton(camera)}</div></div></article>`;
}

function filmThumb(film) {
  if (!film) return '<div class="film-thumb film-thumb-missing"><span>暂无胶卷图片</span></div>';
  return `<div class="film-thumb"><span>FILM</span><strong>${esc(film.name)}</strong><small>${esc(film.iso)} · ${esc(film.format)}</small><small>${esc(filmPriceLabel(film))}</small></div>`;
}

function comboCostLabel(camera, film) {
  const filmValue = filmPrice(film);
  const known = (camera.priceLow + camera.priceHigh) / 2 + COSTS.battery + COSTS.develop + (filmValue || 0);
  return `${money(known)}左右 · 胶卷参考 ${filmPriceLabel(film)}`;
}

function purchaseChecklist(camera, film) {
  const cameraItems = ['快门是否正常', '测光是否正常', '镜头是否有明显霉斑、划痕或雾化', '电池仓是否有腐蚀', '胶片仓和后盖密封状态', '是否包含镜头', '是否需要更换密封', '是否有维修记录'];
  const filmItems = [`画幅是否匹配：${filmFormat(film) || '暂未录入'}`, `ISO 是否适合当前场景：${filmIso(film) ? film.iso : '暂未录入'}`, '有效期或保存状态', `是否为${film?.type || '彩色或黑白暂未录入'}`, '冲洗和扫描是否方便'];
  return `<details class="purchase-checklist"><summary>购买前检查清单 <span>相机 + 胶卷</span></summary><div class="checklist-columns"><div><strong>相机检查</strong><ul>${cameraItems.map((item) => `<li>□ ${item}</li>`).join('')}</ul></div><div><strong>胶卷检查</strong><ul>${filmItems.map((item) => `<li>□ ${item}</li>`).join('')}</ul></div></div><p>以上是通用购买建议；当前资料无法判断某台具体相机的实际故障，请以实机测试和卖家记录为准。</p></details>`;
}

function comboRecommendation(camera) {
  const match = recommendFilm(camera);
  const film = match.film;
  const scenes = state.prefs.scenes?.slice(0, 2).join('、') || match.scene;
  const filmActionId = filmKnowledgeId(film);
  return `<section class="combo-recommendation" aria-labelledby="combo-title"><div class="combo-heading"><div><span class="eyebrow">首卷方案 · 基于当前测评</span><h2 id="combo-title">你的第一次拍摄方案</h2><p>把当前最匹配的相机和一卷更适合练习的胶片放在一起判断。</p></div><span class="combo-risk ${match.riskLevel.includes('较高') ? 'is-high' : match.riskLevel.includes('中等') ? 'is-medium' : 'is-low'}">${match.riskLevel}</span></div><div class="combo-pair"><div class="combo-camera-summary">${visual(camera)}<div><span>推荐相机</span><strong>${esc(camera.name)}</strong><small>${esc(cameraType(camera))} · ${camera.weight}g · ${money(camera.priceLow)}–${money(camera.priceHigh)}</small></div></div><div class="combo-plus">＋</div><div class="combo-film-summary">${filmThumb(film)}<div><span>推荐首卷胶片</span><strong>${esc(film.name)}</strong><small>${esc(film.iso)} · ${esc(film.format)} · ${esc(film.type)}</small></div></div></div><div class="combo-grid"><div><span>组合理由</span><p>${esc(match.reason)}作为第一卷，先用固定冲扫流程建立曝光和颜色参照。</p></div><div><span>适合拍摄场景</span><p>${esc(scenes)}；${esc(match.suitable)}。</p></div><div><span>不适合的场景</span><p>${esc(match.unsuitable)}。</p></div><div><span>预计总成本</span><p class="combo-cost">${comboCostLabel(camera, film)}</p><small>胶卷价格采用 135 / 36 张公开零售参考区间，购买前按画幅和店铺复核。</small></div></div><div class="combo-risk-note"><strong>失败风险 · ${match.riskLevel}</strong><p>${esc(match.riskText)}</p></div><div class="combo-actions"><button type="button" class="primary-button" data-action="open-guide" data-name="${esc(camera.name)}" data-film-id="${esc(film.id)}">生成场景拍摄方案 →</button><button type="button" class="secondary-button" data-action="cost" data-name="${esc(camera.name)}" data-film-id="${esc(film.id)}">计算完整成本</button><button type="button" class="secondary-button" data-action="add-plan" data-name="${esc(camera.name)}" data-film-id="${esc(film.id)}">${state.shootingPlan?.filmId === film.id ? '✓ 已加入拍摄计划' : '加入拍摄计划'}</button></div><div class="combo-links"><button type="button" data-action="detail" data-name="${esc(camera.name)}">查看相机详情</button><button type="button" data-action="film-detail" data-id="${esc(filmActionId)}">查看胶卷详情</button></div>${purchaseChecklist(camera, film)}</section>`;
}

function recommendation(results) {
  if (!state.submitted) {
    return `<section class="recommendation-panel recommendation-preview"><div class="recommendation-heading"><div><p class="eyebrow">实时预览 · 尚未完成测评</p><h1>完成偏好后，解锁你的推荐结果</h1><p>当前只展示结果结构预览；最终型号、推荐层级和匹配解释会在完成 11 项偏好后计算。</p></div></div><div class="recommendation-trust" aria-label="推荐结果信任信息"><span><b>${KNOWLEDGE_STATS.cameraCount}</b> 台真实资料</span><span>二手市场参考价格</span><span>数据更新时间：2026-07-26</span><span>购买前复核实机状态</span></div><div class="preview-skeleton" aria-label="推荐结果预览"><div class="preview-skeleton-media"><span>TOP 01</span></div><div class="preview-skeleton-copy"><span class="skeleton-line short"></span><span class="skeleton-score"></span><span class="skeleton-line"></span><span class="skeleton-line medium"></span><span class="skeleton-button"></span></div></div><div class="preview-lock"><strong>最终推荐暂未解锁</strong><span>请先完成左侧 4 组测评：预算、操作、场景、风险。</span><span>新增的胶卷偏好会用于后续的胶卷选择和使用建议，不会伪装成相机绝对质量评分。</span></div></section>`;
  }
  const best = results.top[0] || CAMERAS[0];
  const bestScore = results.top[0]?.score || 0;
  const bestScoreValue = Math.round(bestScore / 5 * 100);
  const scenes = best.scenes.filter((item) => !item.includes('想要') && !item.includes('希望') && !item.includes('需要')).slice(0, 2);
  return `<section class="recommendation-panel"><div class="recommendation-heading"><div><p class="eyebrow">实时预览 · 基于 ${KNOWLEDGE_STATS.cameraCount} 台真实资料</p><h1>为你找到 ${results.top.length} 款高匹配度相机</h1><p>按预算、操作、场景、便携、上手和维护风险综合排序。</p></div></div><div class="recommendation-trust" aria-label="推荐结果信任信息"><span><b>${KNOWLEDGE_STATS.cameraCount}</b> 台真实资料</span><span>二手市场参考价格</span><span>数据更新时间：2026-07-26</span><span>购买前复核实机状态</span></div><div class="best-match"><div class="best-media">${visual(best, true)}<span class="best-media-label">TOP 01 · ${esc(cameraType(best))}</span></div><div class="best-copy"><div class="best-copy-kicker"><span>首要推荐 · 基于 6 项偏好</span><span class="best-match-badge">MATCH</span></div><div class="best-title-row"><div><h2>${esc(best.name)}</h2><p>${esc(best.recommendation)}</p></div><div class="best-score-display" aria-label="综合匹配度 ${bestScoreValue} 分，基于 6 项偏好"><span>综合匹配度</span><strong>${bestScoreValue}</strong><em>/ 100</em></div></div><div class="big-score-track" aria-label="综合匹配度 ${bestScoreValue} 分"><i style="width:${bestScoreValue}%"></i></div><div class="score-axis"><span>0</span><span>50</span><span>100</span></div><div class="best-conclusion"><p><b>为什么推荐：</b>${esc(best.reason)}。${esc(best.recommendation)}。</p><p><b>最适合：</b>${esc(scenes.join('、') || '你当前选择的主要场景')}。</p><p class="best-risk"><b>需要注意：</b>${esc(best.risk)}</p></div><div class="best-decision-notes"><span><b>主要短板</b>${esc(weakestDimension(best))}</span><span><b>替代方案</b>${esc(alternativeFor(best, results))}</span></div><div class="best-actions"><button type="button" class="primary-button" data-action="detail" data-name="${esc(best.name)}">查看验机与使用建议 <span aria-hidden="true">→</span></button><button type="button" class="secondary-button" data-action="cost" data-name="${esc(best.name)}">计算首次完整体验成本</button></div><div class="best-quiet-actions">${favoriteButton(best)}${compareButton(best)}<span>评分只反映你这 6 项偏好，不代表购买成功率或绝对质量</span></div></div></div>${comboRecommendation(best)}<div class="film-preference-summary"><b>已记录的胶卷偏好</b><span>${esc(state.prefs.film.subject)} · ${esc(state.prefs.film.look)} · ${esc(state.prefs.film.light)} · ${esc(state.prefs.film.occasion)} · ${state.prefs.film.hasCamera === '有' ? '已有相机' : '暂无相机'}</span></div><div class="cards-grid">${results.top.map((camera, index) => card(camera, index + 1)).join('')}</div><div class="price-note">ⓘ 价格为二手市场参考区间，随成色与配件不同会有波动。数据更新时间：2026-07-26。价格会随成色与配件变化，购买前请复核实机状态。</div><div class="score-explainer"><div class="explainer-main"><h2>匹配度如何计算</h2><p>基于你的 6 项偏好，对相机进行多维度评分加权。</p>${results.top[0] ? `<div class="score-list">${scoreRows(results.top[0])}</div>` : ''}</div><div class="best-highlights"><h3>Top 1 推荐亮点</h3>${results.top[0] ? `<ul><li>价格下限在预算容差内</li><li>${esc(results.top[0].reason)}</li><li>${results.top[0].weight}g 机身，${results.top[0].repairLevel <= 2 ? '维护压力相对低' : '建议重点验机'}</li><li>评分不是成交保证，购买前请复核实机状态</li></ul>` : '<p>当前条件下没有足够候选。建议先提高预算，或将维护风险接受度调高一级。</p>'}<button type="button" class="cost-link" data-action="cost" data-name="${esc(best.name)}">计算首次完整体验成本 →</button></div></div></section>`;
}

function lowerSections(results) {
  return `<section class="below-fold"><div><span class="eyebrow">${state.submitted ? '已完成一次推荐运行 · rule_v0.2' : '先看懂，再决定'}</span><h2>把一台相机变成一次完整的体验预算</h2><p>FilmMatch 不只告诉你型号，还会解释价格区间、维护风险和第一次拍摄的实际花费。</p></div><div class="below-actions"><button type="button" data-action="cost" data-name="${esc(results.top[0]?.name || '')}">▣ 计算总成本</button><button type="button" data-action="detail" data-name="${esc(results.top[0]?.name || '')}">⌕ 看懂推荐理由</button></div></section><section class="excluded-section"><div class="excluded-head"><div><span class="eyebrow">没有被推荐的型号</span><h2>排除也是结果的一部分</h2></div><p>硬门槛：价格下限不超过预算 × 1.2，维护风险不超过接受度 + 1，综合分不低于 3 / 5。</p></div><div class="excluded-list">${results.excluded.slice(0, 5).map((camera) => `<button type="button" data-action="detail" data-name="${esc(camera.name)}"><span>${esc(camera.name)}</span><em>${esc(camera.gates[0])}</em><b>→</b></button>`).join('')}</div></section>${cameraLibrary()}${knowledgeSections()}`;
}

const LIBRARY_TYPES = ['全部', '机械 / 手动', '自动 / 半自动', '便携 / 傻瓜'];
const brands = ['全部', ...new Set(CAMERAS.map((camera) => camera.brand))];

const matchesLibraryType = (camera, type) => {
  if (type === '机械 / 手动') return cameraType(camera).includes('机械') || cameraType(camera).includes('半自动');
  if (type === '自动 / 半自动') return cameraType(camera).includes('自动') && !cameraType(camera).includes('便携');
  if (type === '便携 / 傻瓜') return cameraType(camera).includes('便携');
  return true;
};

function libraryItems() {
  const query = normalize(state.libraryQuery);
  return CAMERAS.filter((camera) => {
    const knowledge = CAMERA_KNOWLEDGE_BY_NAME.get(camera.name);
    const haystack = normalize([camera.name, camera.brand, camera.lens, camera.risk, camera.recommendation, ...(knowledge?.searchKeywords || [])].join(' '));
    return (state.libraryBrand === '全部' || camera.brand === state.libraryBrand)
      && matchesLibraryType(camera, state.libraryType)
      && (!state.onlyFavorites || state.favorites.has(camera.name))
      && (!query || haystack.includes(query));
  });
}

function libraryCard(camera) {
  const knowledge = CAMERA_KNOWLEDGE_BY_NAME.get(camera.name);
  const tags = knowledge?.tags?.length ? knowledge.tags : camera.scenes.slice(0, 2);
  return `<article class="library-card"><div class="library-card-photo">${visual(camera)}</div><div class="library-card-top"><div><span class="camera-type">${esc(knowledge?.family || cameraType(camera))}</span><h3>${esc(camera.name)}</h3></div>${favoriteButton(camera, 'library-heart')}</div><div class="library-facts"><span>${money(camera.priceLow)} – ${money(camera.priceHigh)}</span><span>${camera.weight}g</span><span>${camera.autoFocus ? 'AF' : '手动对焦'}</span></div><div class="library-tags">${tags.map((tag) => `<span>${esc(tag)}</span>`).join('')}</div><p>${esc(knowledge?.summary || camera.recommendation)}</p><div class="library-actions"><button type="button" class="secondary-button" data-action="detail" data-name="${esc(camera.name)}">知识详情</button>${compareButton(camera, 'library-compare')}</div></article>`;
}

function libraryGrid() {
  const items = libraryItems();
  if (!items.length) return '<div class="library-empty"><strong>没有找到匹配型号</strong><span>试试清空关键词，或把品牌/类型筛选调回“全部”。</span></div>';
  return items.map(libraryCard).join('');
}

function cameraLibrary() {
  if (activeNavId() !== 'camera-library') return '';
  const items = libraryItems();
  return `<section id="camera-library" class="library-section deferred-section"><div class="section-heading"><div><span class="eyebrow">知识库 · ${KNOWLEDGE_STATS.cameraCount} 个型号</span><h2>相机库：先看规格，再看风险</h2><p>每台相机都保留真实价格区间、使用场景、验机重点和可回查的资料链接。</p></div><div class="library-count" data-library-count>显示 ${items.length} / ${KNOWLEDGE_STATS.cameraCount} 台</div></div><div class="library-toolbar"><label class="search-field"><span>⌕</span><input type="search" aria-label="搜索相机知识库" placeholder="搜索型号、卡口、场景或风险" value="${esc(state.libraryQuery)}" data-action="library-search"></label><label class="select-field"><span>品牌</span><select aria-label="按品牌筛选" data-action="library-brand">${brands.map((brand) => `<option value="${esc(brand)}" ${state.libraryBrand === brand ? 'selected' : ''}>${esc(brand)}</option>`).join('')}</select></label><div class="filter-chips" role="group" aria-label="按相机类型筛选">${LIBRARY_TYPES.map((type) => `<button type="button" class="${state.libraryType === type ? 'active' : ''}" aria-pressed="${state.libraryType === type}" data-action="library-type" data-value="${esc(type)}">${type}</button>`).join('')}</div><button type="button" class="library-reset" data-action="library-reset">清除筛选</button></div><div id="camera-grid" class="library-grid">${libraryGrid()}</div></section>`;
}

function mountCameraLibraryPage() {
  const main = root.querySelector('.workspace');
  const existingLibrary = root.querySelector('#camera-library');
  if (!main) return;
  if (activeNavId() !== 'camera-library') {
    existingLibrary?.remove();
    main.classList.remove('camera-library-workspace');
    return;
  }
  main.classList.add('camera-library-workspace');
  const page = document.createElement('div');
  page.className = 'camera-library-page-shell';
  page.innerHTML = cameraLibrary();
  main.replaceChildren(page);
}

function articleCard(article) {
  return `<article class="knowledge-card"><span class="eyebrow">${esc(article.eyebrow)}</span><h3>${esc(article.title)}</h3><p>${esc(article.summary)}</p><ul>${article.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><div class="knowledge-sources">${article.sources.map((entry) => `<a href="${esc(entry.url)}" target="_blank" rel="noreferrer">${esc(entry.label)} ↗</a>`).join('')}</div></article>`;
}

function filmEncyclopediaCard(article) {
  if (filmKnowledgeKind(article) === 'camera') {
    return `<article class="film-knowledge-card camera-knowledge-card"><div class="film-card-meta"><span class="eyebrow">${esc(article.eyebrow)}</span><span class="film-iso">${esc(article.badge || article.type)}</span></div><h3>${esc(article.title)}</h3><p>${esc(article.summary)}</p><div class="film-facts">${article.facts.map((fact, index) => `<div><span>0${index + 1}</span><p>${esc(fact)}</p></div>`).join('')}</div><div class="knowledge-sources">${article.sources.map((entry) => `<a href="${esc(entry.url)}" target="_blank" rel="noreferrer">${esc(entry.label)} ↗</a>`).join('')}</div></article>`;
  }
  return `<article class="film-knowledge-card"><div class="film-card-meta"><span class="eyebrow">${esc(article.eyebrow)}</span><span class="film-iso">${esc(article.iso)}</span></div><h3>${esc(article.title)}</h3><p>${esc(article.summary)}</p><div class="film-facts">${article.facts.map((fact, index) => `<div><span>0${index + 1}</span><p>${esc(fact)}</p></div>`).join('')}</div><div class="knowledge-sources">${article.sources.map((entry) => `<a href="${esc(entry.url)}" target="_blank" rel="noreferrer">${esc(entry.label)} ↗</a>`).join('')}</div></article>`;
}

function filmKnowledgeCatalog() {
  const entries = visibleFilmKnowledge().slice(0, 8);
  const selectedId = state.filmKnowledgeId || entries[0]?.id;
  return `<div class="film-knowledge-catalog"><div class="film-catalog-heading"><div><span class="eyebrow">菲林百科 · 快速索引</span><h3>把一卷胶片的选择线索收进一张小地图</h3><p>点击条目，定位到上方百科内容。</p></div><span>${visibleFilmKnowledge().length} 条可回查内容</span></div><div class="film-catalog-grid">${entries.map((entry) => `<button type="button" class="film-catalog-item ${selectedId === entry.id ? 'is-selected' : ''}" data-action="film-index" data-kind="${filmKnowledgeKind(entry)}" data-id="${esc(entry.id)}" aria-current="${selectedId === entry.id ? 'true' : 'false'}" aria-label="定位到 ${esc(entry.title)}"><span>${esc(filmKnowledgeKind(entry) === 'camera' ? '胶片机' : entry.type)}</span><strong>${esc(entry.title)}</strong><p>${esc(entry.summary)}</p><span class="film-catalog-link">查看条目 <span aria-hidden="true">↗</span></span></button>`).join('')}</div></div>`;
}

function guideChoice(field, value) {
  const active = state.guidePrefs[field] === value;
  return `<button type="button" class="guide-choice ${active ? 'active' : ''}" aria-pressed="${active}" data-action="guide-set" data-field="${field}" data-value="${esc(value)}">${esc(value)}</button>`;
}

function sceneDecisionTool() {
  const camera = findCamera(state.guideCameraName) || (state.submitted ? getResults().top[0] : null);
  const generated = state.guideSubmitted ? recommendFilm(camera, state.guidePrefs, true) : null;
  const selectedFilm = state.guideFilmId ? FILM_BY_ID.get(state.guideFilmId) : null;
  const result = generated && selectedFilm ? { ...generated, film: selectedFilm, reason: `你选择的场景是${state.guidePrefs.scene}，这卷胶片作为替代方案仍需结合现场光线确认。` } : generated;
  const film = result?.film;
  const alternatives = FILM_LIBRARY_ROWS.filter((item) => item.id !== film?.id).slice(0, 2);
  return `<div class="scene-decision-tool"><div class="scene-tool-heading"><div><span class="eyebrow">场景决策工具 · 胶卷选择</span><h3>根据我的拍摄需求，生成下一卷选择方案</h3><p>把场景、光线、主题、画面偏好、预算和经验放在一起判断；信息不足时会明确提示。</p></div>${camera ? `<span class="guide-camera-context">当前搭配相机：${esc(camera.name)}</span>` : '<span class="guide-camera-context is-muted">尚未带入推荐相机</span>'}</div><div class="guide-form-grid">${Object.entries(GUIDE_OPTIONS).map(([field, options]) => `<fieldset><legend>${({ scene: '拍摄场景', season: '季节', light: '光线', theme: '拍摄主题', look: '画面偏好', budget: '预算', experience: '胶片经验' })[field]}</legend><div class="guide-options">${options.map((value) => guideChoice(field, value)).join('')}</div></fieldset>`).join('')}</div><div class="guide-tool-actions"><button type="button" class="primary-button" data-action="guide-submit">生成下一卷选择方案 →</button><button type="button" class="secondary-button" data-action="guide-reset">重新选择</button></div>${result ? `<article class="guide-decision-result"><div class="guide-result-head"><div><span class="eyebrow">下一卷选择方案</span><h4>${esc(film.name)}</h4><p>${esc(film.iso)} · ${esc(film.format)} · ${esc(film.type)}</p></div>${filmThumb(film)}</div><div class="guide-result-grid"><div><span>推荐理由</span><p>${esc(result.reason)}</p></div><div><span>适合拍摄场景</span><p>${esc(result.suitable)}</p></div><div><span>不适合的场景</span><p>${esc(result.unsuitable)}</p></div><div><span>冲洗和扫描建议</span><p>${esc(film.advice || '冲洗和扫描建议暂未录入。')}</p></div><div><span>第一次拍摄提醒</span><p>${esc(film.caution || '信息不足，建议进一步确认。')}</p></div><div><span>预计单卷成本</span><p>${filmPriceInfo(film) ? `${filmPriceLabel(film)} · 中位数 ${money(filmPrice(film))}` : '暂未录入；可在成本计算器手动补充'} · 风险：${esc(result.riskLevel)}</p></div></div><div class="guide-alternatives"><span>替代方案</span>${alternatives.map((item) => `<button type="button" data-action="guide-film-pick" data-id="${esc(item.id)}">${esc(item.name)} · ${esc(item.iso)} · ${esc(filmPriceLabel(item))}</button>`).join('')}</div><div class="guide-result-actions">${camera ? `<button type="button" class="primary-button" data-action="add-plan" data-name="${esc(camera.name)}" data-film-id="${esc(film.id)}">${state.shootingPlan?.filmId === film.id ? '✓ 已加入拍摄计划' : '加入拍摄计划'}</button><button type="button" class="secondary-button" data-action="cost" data-name="${esc(camera.name)}" data-film-id="${esc(film.id)}">回填到完整成本</button>` : ''}<button type="button" class="secondary-button" data-action="guide-reset">重新选择</button></div></article>` : '<div class="guide-empty">完成上方选择后，生成一套可解释的下一卷方案。</div>'}</div>`;
}

function filmGuideCard(guide) {
  return `<article class="film-guide-card"><div class="guide-card-head"><div><span class="eyebrow">${esc(guide.eyebrow)}</span><h3>${esc(guide.title)}</h3></div><span class="guide-scene">${esc(guide.scene)}</span></div><div class="guide-tags">${guide.tags.map((tag) => `<span>${esc(tag)}</span>`).join('')}</div><ol class="guide-steps">${guide.steps.map((step) => `<li>${esc(step)}</li>`).join('')}</ol><div class="guide-answer"><span>下一卷怎么选</span><strong>${esc(guide.recommendation)}</strong><p>${esc(guide.caveat)}</p></div><div class="knowledge-sources">${guide.sources.map((entry) => `<a href="${esc(entry.url)}" target="_blank" rel="noreferrer">${esc(entry.label)} ↗</a>`).join('')}</div></article>`;
}

function knowledgeSections() {
  const filmEntries = visibleFilmKnowledge();
  const selectedFilm = state.filmKnowledgeId ? filmEntries.find((entry) => entry.id === state.filmKnowledgeId) : null;
  const film = selectedFilm || filmEntries[state.filmRandomIndex % Math.max(filmEntries.length, 1)] || FILM_ENCYCLOPEDIA[0];
  const guide = FILM_GUIDES[state.guideRandomIndex] || FILM_GUIDES[0];
  return `<section id="film-library" class="knowledge-section deferred-section"><div class="section-heading"><div><span class="eyebrow">胶卷百科 · 知识分享</span><h2>先认识一卷胶片，再谈喜欢哪一卷</h2><p>百科解释感光度、色彩、颗粒、光线和冲扫变量；它提供可回查的知识，不替你做个性化购买决定。</p></div><div class="knowledge-section-actions"><div class="library-count">${KNOWLEDGE_STATS.filmEncyclopediaCount} 条百科内容</div><button type="button" class="secondary-button random-button" data-action="random-film">↻ 随机生成一条百科</button></div></div><div class="film-encyclopedia-stage">${filmEncyclopediaCard(film)}</div></section><section id="guide" class="guide-section deferred-section"><div class="section-heading"><div><span class="eyebrow">指南 · 场景化胶卷决策</span><h2>根据拍摄需求，生成下一卷选择方案</h2><p>场景决策工具是主要入口；原有随机指南仍然保留，作为次要的灵感入口。</p></div><div class="knowledge-section-actions"><div class="library-count">${KNOWLEDGE_STATS.guideCount} 条选卷指南</div><button type="button" class="secondary-button random-button" data-action="random-guide">↻ 随机看看</button></div></div>${sceneDecisionTool()}<details class="random-guide-secondary"><summary>随机生成指南 · 给我一个随机灵感</summary><div class="film-guide-stage">${filmGuideCard(guide)}</div></details><div id="knowledge-method" class="method-card"><span class="method-number">${KNOWLEDGE_STATS.cameraCount}</span><div><strong>相机库与胶卷库分开核对</strong><p>相机型号、价格与验机重点来自 ${KNOWLEDGE_STATS.cameraCount} 台真实资料；胶卷知识引用胶片厂商资料，行情与库存仍需按购买日复核。</p><div class="source-pills">${KNOWLEDGE_SOURCES.slice(0, 4).map((entry) => `<a href="${esc(entry.url)}" target="_blank" rel="noreferrer">${esc(entry.label)} ↗</a>`).join('')}</div></div></div></section><section id="camera-decision-archive" class="knowledge-archive-section deferred-section"><div class="section-heading"><div><span class="eyebrow">相机决策资料 · 原有知识库</span><h2>保留原有相机选购与验机内容</h2><p>这里继续保留 FilmMatch 原有的曝光、相机家族、二手验机、卡口和便携机风险资料；它服务于相机决策，不与胶卷百科混为一谈。</p></div><div class="library-count">${KNOWLEDGE_ARTICLES.length} 篇资料</div></div><div class="knowledge-grid">${KNOWLEDGE_ARTICLES.map(articleCard).join('')}</div></section><section id="community" class="community-section deferred-section"><div><span class="eyebrow">社区 · 本地 MVP</span><div class="community-title-row"><h2>把你看中的型号留下来</h2><span class="library-count community-status">即将上线</span></div><p>当前收藏和对比会保存在本浏览器中，不需要登录。后续接入账号后可同步跨设备收藏、购买记录和真实交易链接。</p></div><div class="community-actions"><button type="button" class="primary-button compact" data-action="show-favorites">查看收藏（<span data-favorites-count>${state.favorites.size}</span>）</button></div></section>`;
}

function detailModal(camera) {
  if (!camera) return '';
  const knowledge = CAMERA_KNOWLEDGE_BY_NAME.get(camera.name);
  const sources = knowledge?.sources || [];
  const image = CAMERA_IMAGES_BY_NAME[camera.name] || CAMERA_IMAGES_BY_NAME[camera.originalName];
  const imageSource = image ? `<a href="${esc(image.source)}" target="_blank" rel="noreferrer">照片来源 · ${esc(image.credit || '型号资料页')} ↗</a>` : '';
  return `<div class="modal-backdrop" data-action="close-detail"><div class="detail-modal" data-stop="true"><button type="button" class="modal-close" aria-label="关闭详情" data-action="close-detail">×</button><div class="detail-media">${visual(camera, true)}</div><div class="detail-body"><div class="detail-title-row"><div><span class="eyebrow">${esc(camera.brand)} · ${esc(knowledge?.family || cameraType(camera))}</span><h2>${esc(camera.name)}</h2></div>${favoriteButton(camera)}</div><p class="detail-lead">${esc(knowledge?.summary || camera.recommendation)}。</p><div class="detail-grid"><div><span>价格参考</span><strong>¥${camera.priceLow.toLocaleString()}–¥${camera.priceHigh.toLocaleString()}</strong></div><div><span>机身重量</span><strong>${camera.weight}g</strong></div><div><span>操作类型</span><strong>${cameraType(camera)}</strong></div><div><span>镜头 / 卡口</span><strong>${esc(camera.lens)}</strong></div></div><div class="detail-section"><h3>知识摘要</h3><p>${esc(knowledge?.knowledgeNote || '')}</p><div class="detail-tags">${(knowledge?.tags || camera.scenes.slice(0, 3)).map((tag) => `<span>${esc(tag)}</span>`).join('')}</div></div><div class="detail-section"><h3>购买前重点复核</h3><p>${esc(camera.risk)}</p><div class="checklist">${(knowledge?.checks || []).map((item) => `<span>✓ ${esc(item)}</span>`).join('')}</div></div><div class="detail-actions">${compareButton(camera)}<button type="button" class="primary-button" data-action="cost" data-name="${esc(camera.name)}">计算这台的完整体验成本 →</button></div><div class="detail-source"><span>ⓘ</span><span>风险等级：${esc(knowledge?.riskLevel || '需要验机')} · ${esc(knowledge?.dataLineage || '规格与价格来自 FilmMatch 真实价格版资料表；价格需按成色复核。')}</span></div><div class="source-list"><strong>资料来源</strong>${imageSource}${sources.map((entry) => `<a href="${esc(entry.url)}" target="_blank" rel="noreferrer">${esc(entry.label)} · ${esc(entry.tier)} ↗</a>`).join('')}</div></div></div></div>`;
}

function selectedCostFilm() {
  return FILM_BY_ID.get(state.costFilmId) || null;
}

function ensureCostInputs() {
  if (!state.costInputs) {
    const film = selectedCostFilm();
    state.costInputs = {
      lens: null,
      battery: COSTS.battery,
      film: filmPrice(film) ?? state.film ?? COSTS.film,
      develop: state.develop ?? COSTS.develop,
      scan: null,
      seal: null,
      repair: COSTS.contingency,
      shipping: null,
      other: null,
      frameCount: null,
      includeSeal: false,
      includeRepair: false,
    };
  }
  return state.costInputs;
}

function calculateCost(camera) {
  const input = ensureCostInputs();
  const film = amountValue(input.film);
  const develop = amountValue(input.develop);
  const scan = amountValue(input.scan);
  const shipping = amountValue(input.shipping);
  const other = amountValue(input.other);
  const battery = amountValue(input.battery) || 0;
  const lens = amountValue(input.lens);
  const seal = input.includeSeal ? amountValue(input.seal) : 0;
  const repair = input.includeRepair ? amountValue(input.repair) : 0;
  const oneTimeLow = camera.priceLow + battery + (lens || 0) + (seal || 0);
  const oneTimeMid = ((camera.priceLow + camera.priceHigh) / 2) + battery + (lens || 0) + (seal || 0);
  const oneTimeHigh = camera.priceHigh + battery + (lens || 0) + (seal || 0);
  const rollKnown = (film || 0) + (develop || 0) + (scan || 0) + (shipping || 0) + (other || 0);
  const unknownRoll = [film == null && '胶卷', develop == null && '冲洗', scan == null && '扫描', shipping == null && '邮费'].filter(Boolean);
  const unknownOneTime = [lens == null && '镜头'].filter(Boolean);
  const firstLow = oneTimeLow + rollKnown + repair;
  const firstMid = oneTimeMid + rollKnown + repair;
  const firstHigh = oneTimeHigh + rollKnown + repair;
  const frameCount = amountValue(input.frameCount);
  const perPhoto = !unknownRoll.length && frameCount ? rollKnown / frameCount : null;
  const label = (value, unknowns = []) => `${money(value)}${unknowns.length ? '＋未录入项' : ''}`;
  return {
    oneTime: { low: oneTimeLow, mid: oneTimeMid, high: oneTimeHigh, unknowns: unknownOneTime },
    perRoll: { value: rollKnown, unknowns: unknownRoll },
    firstRoll: { low: firstLow, mid: firstMid, high: firstHigh, unknowns: [...unknownOneTime, ...unknownRoll] },
    singlePhoto: perPhoto,
    total: input.scenario === 'low' ? firstLow : input.scenario === 'high' ? firstHigh : firstMid,
    totalLabel: label(input.scenario === 'low' ? firstLow : input.scenario === 'high' ? firstHigh : firstMid, [...unknownOneTime, ...unknownRoll]),
    labels: { oneTime: label(oneTimeMid, unknownOneTime), perRoll: label(rollKnown, unknownRoll), first: label(firstMid, [...unknownOneTime, ...unknownRoll]) },
    input,
  };
}

function costInputMarkup(field, label, value, placeholder = '暂未录入') {
  const text = amountValue(value) == null ? '' : value;
  return `<label>${label}<input type="number" min="0" step="1" value="${text}" placeholder="${placeholder}" data-action="cost-input" data-field="${field}"></label>`;
}

function costResultMarkup(camera) {
  const totals = calculateCost(camera);
  const scenario = totals.input.scenario || 'mid';
  return `<div class="cost-result cost-result-expanded" data-cost-summary><div><span>一次性购入</span><strong>${totals.labels.oneTime}</strong><small>相机参考价 + 电池${totals.input.includeSeal ? ' + 密封更换' : ''}</small></div><div class="cost-mid"><span>第一卷完整体验</span><strong data-cost-value="mid">${totals.totalLabel}</strong><small>当前为${scenario === 'low' ? '最低' : scenario === 'high' ? '高风险' : '常规'}预算</small></div><div><span>后续每卷</span><strong>${totals.labels.perRoll}</strong><small>胶卷 + 冲洗 + 扫描 + 邮费</small></div><div><span>单张照片</span><strong>${totals.singlePhoto == null ? missingAmount() : money(totals.singlePhoto)}</strong><small>后续每卷 ÷ 有效张数</small></div></div>`;
}

function costDetailsMarkup(camera) {
  const totals = calculateCost(camera);
  const input = totals.input;
  const film = selectedCostFilm();
  const rows = [
    ['相机机身 / 套装参考', `${money(camera.priceLow)} – ${money(camera.priceHigh)}`, '沿用现有相机价格区间，未将机身与镜头拆成独立真实报价'],
    ['镜头', amountText(input.lens), '当前相机数据未独立记录镜头价格，可手动补充'],
    ['电池', amountText(input.battery), '沿用原有成本估算'],
    ['胶卷', filmPriceInfo(film) ? `${amountText(input.film)}（参考 ${filmPriceLabel(film)}）` : amountText(input.film), filmPriceInfo(film) ? `${filmPriceSource(film)}；成本计算使用区间中位数，可手动改成你的实际购买价` : '当前胶卷资料未录入价格，可手动补充'],
    ['冲洗 / 显影', amountText(input.develop), '沿用原有冲扫输入，建议按店家报价拆分确认'],
    ['扫描', amountText(input.scan), '当前数据未录入，可手动补充'],
    ['密封更换', input.includeSeal ? amountText(input.seal) : '未开启', '可选一次性费用'],
    ['维修预留', input.includeRepair ? amountText(input.repair) : '未开启', '可选风险缓冲，不与密封更换重复'],
    ['邮费 / 其他', amountText(input.shipping ?? input.other), '当前数据未录入，可手动补充'],
  ];
  return `<div class="cost-detail-panel" data-cost-details><div class="cost-detail-heading"><strong>成本明细</strong><span>胶卷使用 ${esc(FILM_PRICE_UPDATED_AT)} 的公开零售参考</span></div><div class="cost-detail-list">${rows.map(([name, value, note]) => `<div class="cost-detail-row"><span>${name}</span><strong>${value}</strong><small>${note}</small></div>`).join('')}</div><div class="cost-price-source">${esc(FILM_PRICE_BASIS)}。<a href="${esc(FILM_PRICE_SOURCES[0].url)}" target="_blank" rel="noreferrer">查看价格来源 ↗</a></div></div>`;
}

function costModal(camera) {
  if (!camera) return '';
  const input = ensureCostInputs();
  const film = selectedCostFilm();
  return `<div class="modal-backdrop" data-action="close-cost"><div class="cost-modal cost-modal-expanded" data-stop="true"><button type="button" class="modal-close" aria-label="关闭成本计算" data-action="close-cost">×</button><div class="cost-head"><span>▣</span><div><span>完整拍摄成本</span><h2>${esc(camera.name)}${film ? ` + ${esc(film.name)}` : ''}</h2><small>${film ? `首卷：${esc(film.iso)} · ${esc(film.format)} · 参考价 ${esc(filmPriceLabel(film))}` : '当前未指定首卷胶片'}</small></div></div><div class="cost-scenarios" role="group" aria-label="预算档位">${[['low', '最低预算'], ['mid', '常规预算'], ['high', '高风险预算']].map(([value, label]) => `<button type="button" class="${(input.scenario || 'mid') === value ? 'active' : ''}" aria-pressed="${(input.scenario || 'mid') === value}" data-action="cost-scenario" data-value="${value}">${label}</button>`).join('')}</div><div class="cost-inputs cost-inputs-expanded">${costInputMarkup('lens', '镜头价格', input.lens)}${costInputMarkup('battery', '电池', input.battery)}${costInputMarkup('film', '胶卷单价', input.film)}${costInputMarkup('develop', '冲洗 / 显影', input.develop)}${costInputMarkup('scan', '扫描', input.scan)}${costInputMarkup('shipping', '邮费', input.shipping)}${costInputMarkup('seal', '密封更换', input.seal)}${costInputMarkup('repair', '维修预留', input.repair)}${costInputMarkup('frameCount', '有效张数', input.frameCount)}</div><div class="cost-toggles"><button type="button" class="${input.includeSeal ? 'active' : ''}" aria-pressed="${input.includeSeal}" data-action="cost-toggle" data-field="includeSeal">${input.includeSeal ? '✓' : '＋'} 计入密封更换</button><button type="button" class="${input.includeRepair ? 'active' : ''}" aria-pressed="${input.includeRepair}" data-action="cost-toggle" data-field="includeRepair">${input.includeRepair ? '✓' : '＋'} 计入维修预留</button></div>${costResultMarkup(camera)}${costDetailsMarkup(camera)}<p class="cost-note">二手相机价格、成色、维修状态、胶卷价格和冲扫服务可能导致实际成本变化。本次胶卷成本使用 135 / 36 张公开零售参考区间中位数，具体购买仍请按画幅、店铺和有效期复核。</p><button type="button" class="primary-button" data-action="close-cost">完成计算</button></div></div>`;
}

function comparisonPriorityLabel(id) {
  return COMPARISON_PRIORITIES.find((item) => item.id === id)?.label || id;
}

function comparisonSceneMatches(camera, scene) {
  if (!scene) return false;
  const aliases = {
    日常记录: ['日常', '家庭', '记录'],
    旅行: ['旅行'],
    人像: ['人像', '人物'],
    风景: ['风景', '风光'],
    街拍: ['街拍', '城市'],
    生日和纪念日: ['生日', '家庭', '活动', '聚会'],
    室内拍摄: ['室内', '棚拍'],
    第一次尝试胶片: ['入门', '新手'],
  };
  const words = aliases[scene] || [scene];
  return camera.scenes.some((item) => words.some((word) => item.includes(word) || word.includes(item)));
}

function comparisonDimensionInfo(key, sceneOverride = '') {
  const scene = sceneOverride || state.comparisonScene || (state.submitted ? state.prefs.scenes?.[0] : '');
  const info = {
    budget: {
      label: '预算匹配',
      meaning: '是否符合当前预算',
      score: (camera) => {
        if (!state.submitted || !Number(state.prefs.budget)) return null;
        const budget = Number(state.prefs.budget);
        if (camera.priceLow <= budget) return 5;
        if (camera.priceLow <= budget * 1.2) return 4;
        if (camera.priceLow <= budget * 1.6) return 3;
        return 2;
      },
      detail: (camera) => state.submitted && Number(state.prefs.budget)
        ? `${money(camera.priceLow)}起 · ${camera.priceLow <= state.prefs.budget ? '预算内起步' : '高于当前预算'}`
        : `${money(camera.priceLow)}起 · 暂未读取预算`,
    },
    portability: {
      label: '便携性',
      meaning: '是否适合旅行和日常携带',
      score: (camera) => camera.weight <= 350 ? 5 : camera.weight <= 500 ? 4 : camera.weight <= 650 ? 3 : camera.weight <= 800 ? 2 : 1,
      detail: (camera) => `${camera.weight}g · ${camera.weight <= 500 ? '更适合随身携带' : '携带负担相对更高'}`,
    },
    beginner: {
      label: '新手友好度',
      meaning: '第一次使用是否容易上手',
      score: (camera) => Number(camera.newbieLevel) || null,
      detail: (camera) => `${camera.newbieLevel}/5 · ${camera.newbieLevel >= 4 ? '上手门槛相对低' : '需要一定练习'}`,
    },
    operation: {
      label: '操作难度',
      meaning: '是否需要较多手动操作',
      score: (camera) => Number.isFinite(Number(camera.autoLevel)) ? 6 - camera.autoLevel : null,
      detail: (camera) => `自动化${camera.autoLevel <= 2 ? '较高' : camera.autoLevel === 3 ? '中等' : '较低'} · ${camera.autoFocus ? '支持自动对焦' : '手动对焦'}`,
    },
    lens: {
      label: '镜头升级空间',
      meaning: '后续是否方便继续探索',
      score: (camera) => /卡口|可换镜头|镜头资源/.test(camera.lens) ? 5 : 2,
      detail: (camera) => /卡口|可换镜头|镜头资源/.test(camera.lens) ? '可更换镜头，已有卡口信息' : '固定镜头，选择更简单但扩展有限',
    },
    scene: {
      label: '场景匹配',
      meaning: scene ? `是否适合${scene}` : '是否适合当前主要场景',
      score: (camera) => scene ? (scene === '第一次尝试胶片' ? Number(camera.newbieLevel) || null : comparisonSceneMatches(camera, scene) ? 5 : 2) : null,
      detail: (camera) => scene ? `${scene} · ${comparisonSceneMatches(camera, scene) || (scene === '第一次尝试胶片' && camera.newbieLevel >= 4) ? '资料中有对应场景' : '资料中未标记为优先场景'}` : '暂未选择拍摄场景',
    },
    maintenance: {
      label: '维护风险',
      meaning: '二手购买和使用时需要注意什么',
      score: (camera) => Number.isFinite(Number(camera.repairLevel)) ? 6 - camera.repairLevel : null,
      detail: (camera) => `${camera.repairLevel <= 2 ? '较低' : camera.repairLevel === 3 ? '中等' : '较高'} · 购买前需复核实机状态`,
    },
    cost: {
      label: '后续使用成本',
      meaning: '机身和首卷的基础支出',
      score: () => 4,
      detail: (camera) => `相机中位价＋首卷基础成本约${money((camera.priceLow + camera.priceHigh) / 2 + COSTS.film + COSTS.develop)} · 仅供参考`,
    },
    appearance: {
      label: '外观和机身感觉',
      meaning: '是否符合你的审美和手感偏好',
      score: () => null,
      detail: () => '现有资料不足以判断，请结合图片、握持和实机成色决定',
    },
  };
  return info[key] || info.budget;
}

function comparisonAssessment(cameras, key, sceneOverride = '') {
  const info = comparisonDimensionInfo(key, sceneOverride);
  const scores = cameras.map((camera) => info.score(camera));
  const valid = scores.filter((score) => Number.isFinite(score));
  if (valid.length < 2) return { info, scores, labels: scores.map(() => '暂无法判断'), winnerNames: [] };
  const max = Math.max(...valid);
  const min = Math.min(...valid);
  const close = max - min <= (key === 'scene' ? 1 : .75);
  const winnerNames = cameras.filter((camera, index) => scores[index] === max).map((camera) => camera.name);
  const labels = scores.map((score) => {
    if (!Number.isFinite(score)) return '暂无法判断';
    if (close) return '相近';
    return score === max ? '更适合' : '较适合';
  });
  return { info, scores, labels, winnerNames };
}

function activeComparisonPriorities() {
  if (state.comparisonPriorities.length) return state.comparisonPriorities;
  return state.submitted ? DEFAULT_COMPARISON_PRIORITIES : ['portability'];
}

function recordComparisonEvent(eventName, extra = {}) {
  const cameras = state.compare;
  const entry = {
    event_name: eventName,
    comparison_camera_ids: cameras.map((camera) => camera.name),
    comparison_camera_names: cameras.map((camera) => camera.name),
    timestamp: new Date().toISOString(),
    priorities: [...state.comparisonPriorities],
    scene: state.comparisonScene || state.prefs.scenes?.[0] || null,
    ...extra,
  };
  state.comparisonEvents = [entry, ...state.comparisonEvents].slice(0, 50);
  persistState();
}

function comparisonNeeds() {
  const p = state.prefs;
  const film = p.film || {};
  const tags = state.submitted
    ? [
      `预算 ${money(p.budget)}`,
      `场景 ${(p.scenes || []).slice(0, 2).join('、') || '暂未选择'}`,
      `操作 ${p.operation >= 4 ? '偏手动' : p.operation <= 2 ? '偏自动' : '半自动'}`,
      `便携 ${p.portability >= 4 ? '重视' : '一般'}`,
      `维护 ${p.maintenance <= 2 ? '希望省心' : p.maintenance >= 4 ? '可接受折腾' : '中等'}`,
      film.look ? `画面 ${film.look}` : '',
    ].filter(Boolean)
    : [];
  return `<section class="comparison-needs"><div class="comparison-module-heading"><div><span class="eyebrow">基于本设备最近一次测评</span><h3>你的对比需求</h3></div><span class="comparison-module-index">01</span></div>${tags.length ? `<div class="comparison-tags">${tags.map((tag) => `<span>${esc(tag)}</span>`).join('')}</div>` : '<p class="comparison-empty-copy">还没有可读取的测评结果。你可以先根据预算、便携性、操作难度和镜头扩展需求进行判断。</p>'}<p class="comparison-helper">以下建议基于当前对比数据和你的使用偏好，仅供选购参考。</p></section>`;
}

function comparisonPriorityPicker() {
  const selected = state.comparisonPriorities;
  return `<section class="comparison-priority-picker"><div class="comparison-module-heading"><div><span class="eyebrow">轻量偏好</span><h3>你最在意什么？</h3><p>最多选择 3 项，只影响新增的解释和结论，不改变原有对比结果。</p></div><span class="comparison-priority-count">${selected.length} / 3</span></div><div class="comparison-priority-options">${COMPARISON_PRIORITIES.map((item) => `<button type="button" class="comparison-priority ${selected.includes(item.id) ? 'is-selected' : ''}" aria-pressed="${selected.includes(item.id)}" data-action="comparison-priority" data-value="${item.id}"><strong>${selected.includes(item.id) ? '✓ ' : ''}${item.label}</strong><small>${item.note}</small></button>`).join('')}</div></section>`;
}

function comparisonDecisionSummary(cameras) {
  const priorities = activeComparisonPriorities();
  const usable = priorities.map((key) => ({ key, assessment: comparisonAssessment(cameras, key) })).filter(({ assessment }) => assessment.winnerNames.length);
  if (!usable.length) return { winner: null, text: '当前资料不足以支持明确结论。可以先选择关注维度，或通过详情和实机状态继续判断。', reasons: [] };
  const totals = new Map(cameras.map((camera) => [camera.name, 0]));
  usable.forEach(({ assessment }) => assessment.scores.forEach((score, index) => { if (Number.isFinite(score)) totals.set(cameras[index].name, totals.get(cameras[index].name) + score); }));
  const sorted = [...cameras].sort((a, b) => totals.get(b.name) - totals.get(a.name));
  const winner = sorted[0];
  const second = sorted[1];
  if (!winner || !second || totals.get(winner.name) === totals.get(second.name)) return { winner: null, text: '两台相机在当前对比维度上较为接近，可以根据预算、外观和实际成色决定。', reasons: [] };
  const reasons = usable.filter(({ assessment }) => assessment.winnerNames.includes(winner.name)).map(({ key }) => comparisonDimensionInfo(key).label).slice(0, 3);
  const preferenceText = state.comparisonPriorities.length ? `因为你更在意${priorities.map(comparisonPriorityLabel).join('、')}，` : '结合当前测评，';
  return { winner, text: `${preferenceText}资料更支持${winner.name}。${reasons.length ? `它在${reasons.join('、')}上更占优势。` : '但仍建议结合实机状态和预算确认。'}`, reasons };
}

function comparisonDecisionModule(cameras) {
  const summary = comparisonDecisionSummary(cameras);
  const priorityText = state.comparisonPriorities.length ? state.comparisonPriorities.map(comparisonPriorityLabel).join('、') : (state.submitted ? '当前测评中的预算、便携和入门难度' : '已知的重量、操作和价格资料');
  return `<section class="comparison-decision-module"><div class="comparison-module-heading"><div><span class="eyebrow">个性化结论</span><h3>对你来说，哪台更合适？</h3><p>当前结论重点参考：${esc(priorityText)}。不生成没有数据支持的精确百分比。</p></div><span class="comparison-module-index">02</span></div><div class="comparison-conclusion ${summary.winner ? 'has-winner' : 'is-balanced'}"><strong>${summary.winner ? '我们的建议' : '当前结论'}</strong><p>${esc(summary.text)}</p>${summary.winner ? `<span class="comparison-conclusion-reason">主要依据：${esc(summary.reasons.join(' · ') || '现有参数和风险资料')}</span>` : ''}</div><div class="comparison-persona-grid">${cameras.map((camera) => comparisonPersonaCard(camera, summary.winner?.name === camera.name)).join('')}</div></section>`;
}

function comparisonPersonaCard(camera, isWinner = false) {
  const scene = state.comparisonScene || (state.submitted ? state.prefs.scenes?.[0] : '');
  const userTypes = [];
  if (camera.priceLow <= (state.submitted ? state.prefs.budget : camera.priceHigh)) userTypes.push(state.submitted ? '适合预算有限的胶片新手' : '价格区间相对友好');
  if (camera.weight <= 500) userTypes.push('适合重视便携和日常记录的用户');
  if (camera.newbieLevel >= 4) userTypes.push('适合第一次接触胶片摄影的用户');
  if (/卡口|可换镜头|镜头资源/.test(camera.lens)) userTypes.push('适合愿意继续探索镜头的用户');
  if (scene && comparisonSceneMatches(camera, scene)) userTypes.push(`适合${scene}`);
  const knowledge = CAMERA_KNOWLEDGE_BY_NAME.get(camera.name);
  const checks = (knowledge?.checks || []).slice(0, 2);
  const notes = [camera.risk, `价格参考 ${money(camera.priceLow)}–${money(camera.priceHigh)}，会随成色和配件变化。`, ...checks].filter(Boolean).slice(0, 3);
  const selected = state.comparisonChoice === camera.name;
  return `<article class="comparison-persona-card ${isWinner ? 'is-winner' : ''} ${selected ? 'is-chosen' : ''}">${isWinner ? '<span class="comparison-fit-badge">更适合你</span>' : ''}<div class="comparison-persona-head">${visual(camera)}<div><span>${esc(cameraType(camera))}</span><h4>${esc(camera.name)}</h4><small>${money(camera.priceLow)}–${money(camera.priceHigh)} · ${camera.weight}g</small></div>${favoriteButton(camera, 'comparison-favorite', 'comparison')}</div><div class="comparison-persona-block"><strong>更适合这类用户</strong><ul>${(userTypes.length ? userTypes : ['需要结合你的实际握持和拍摄习惯']).slice(0, 3).map((item) => `<li>${esc(item)}</li>`).join('')}</ul></div><div class="comparison-persona-block comparison-caution"><strong>购买前需要注意</strong><ul>${notes.map((item) => `<li>${esc(item)}</li>`).join('')}</ul></div><div class="comparison-persona-actions"><button type="button" class="primary-button compact" data-action="comparison-select" data-name="${esc(camera.name)}">${selected ? '✓ 已选择这台' : '选择这台相机'}</button><button type="button" class="secondary-button compact" data-action="detail" data-name="${esc(camera.name)}">查看详情</button><button type="button" class="secondary-button compact" data-action="cost" data-name="${esc(camera.name)}">计算成本</button><button type="button" class="compare-button compact" data-action="remove-compare" data-name="${esc(camera.name)}">移除对比</button></div></article>`;
}

function comparisonDimensionTable(cameras) {
  const rows = ['budget', 'portability', 'beginner', 'operation', 'lens', 'scene', 'maintenance', 'cost', 'appearance'];
  return `<section class="comparison-dimensions"><div class="comparison-module-heading"><div><span class="eyebrow">决策化信息</span><h3>把参数翻译成选择依据</h3><p>保留原有参数表，同时补充用户能直接理解的使用意义。</p></div><span class="comparison-module-index">03</span></div><div class="comparison-dimension-table" role="table"><div class="comparison-dimension-row comparison-dimension-header" role="row"><span>维度</span>${cameras.map((camera) => `<span>${esc(camera.name)}</span>`).join('')}<span>对用户的意义</span></div>${rows.map((key) => { const assessment = comparisonAssessment(cameras, key); return `<div class="comparison-dimension-row" role="row"><strong>${assessment.info.label}</strong>${cameras.map((camera, index) => `<span><b class="comparison-status ${assessment.labels[index] === '更适合' ? 'is-best' : ''}">${assessment.labels[index]}</b><small>${esc(assessment.info.detail(camera))}</small></span>`).join('')}<em>${esc(assessment.info.meaning)}</em></div>`; }).join('')}</div><div class="detail-source">ⓘ 以上判断只使用当前相机资料、测评偏好和本地输入；资料缺失时显示“暂无法判断”。</div></section>`;
}

function comparisonSceneModule(cameras) {
  const scene = state.comparisonScene;
  const assessment = scene ? comparisonAssessment(cameras, 'scene', scene) : null;
  const winner = assessment?.winnerNames?.[0];
  const winnerCamera = cameras.find((camera) => camera.name === winner);
  return `<section class="comparison-scene-module"><div class="comparison-module-heading"><div><span class="eyebrow">场景化比较</span><h3>如果你主要想拍……</h3><p>先选一个场景，结论只会基于相机资料中已经录入的场景和操作特征。</p></div><span class="comparison-module-index">04</span></div><div class="comparison-scene-options">${COMPARISON_SCENES.map((item) => `<button type="button" class="comparison-scene ${scene === item ? 'is-selected' : ''}" aria-pressed="${scene === item}" data-action="comparison-scene" data-value="${item}">${item}</button>`).join('')}</div>${winnerCamera ? `<div class="comparison-scene-result"><strong>更推荐 ${esc(winnerCamera.name)}</strong><p>因为现有资料中它与“${esc(scene)}”的场景标记更匹配；仍建议结合预算和实际成色确认。</p><span>需要注意：${esc(winnerCamera.risk)}</span></div>` : `<p class="comparison-empty-copy">选择一个拍摄场景后，这里会显示哪台更适合、为什么，以及购买前需要注意什么。</p>`}</section>`;
}

function comparisonComboEntry(cameras) {
  const summary = comparisonDecisionSummary(cameras);
  const camera = summary.winner || cameras[0];
  return `<section class="comparison-combo-entry"><div><span class="eyebrow">下一步</span><h3>想知道哪台相机更适合搭配你的第一卷胶片？</h3><p>沿用现有场景决策工具，不重复创建胶片数据库。当前将${summary.winner ? `以 ${esc(camera.name)} 作为已选相机` : '把当前对比中的第一台相机'}带入。</p></div><button type="button" class="primary-button" data-action="open-guide" data-origin="comparison" data-name="${esc(camera.name)}">查看相机 + 胶片组合方案 →</button></section>`;
}

const COMPARISON_FEEDBACK_REASONS = ['参数太复杂', '不知道哪台更适合我', '缺少实际样片', '缺少价格信息', '缺少维护信息', '想比较更多相机', '想看相机和胶片组合', '其他'];

function comparisonFeedback() {
  const feedback = state.comparisonFeedback;
  const draft = state.comparisonFeedbackDraft;
  if (feedback) return `<section class="comparison-feedback is-submitted"><div><span class="eyebrow">本地反馈</span><h3>这次对比是否帮助你做出决定？</h3><p>已记录：${feedback.type === 'helpful' ? '有帮助' : feedback.type === 'uncertain' ? '还不确定' : '没有帮助'}${feedback.reasons?.length ? ` · ${feedback.reasons.join('、')}` : ''}</p></div><span class="comparison-feedback-success">✓ 已保存到本设备</span></section>`;
  return `<section class="comparison-feedback"><div class="comparison-module-heading"><div><span class="eyebrow">帮助我们改进</span><h3>这次对比是否帮助你做出决定？</h3><p>只保存在本设备，不会伪装成线上用户数据。</p></div><span class="comparison-module-index">05</span></div><div class="comparison-feedback-options"><button type="button" class="${draft?.type === 'helpful' ? 'is-selected' : ''}" data-action="comparison-feedback" data-value="helpful">有帮助</button><button type="button" class="${draft?.type === 'uncertain' ? 'is-selected' : ''}" data-action="comparison-feedback" data-value="uncertain">还不确定</button><button type="button" class="${draft?.type === 'no' ? 'is-selected' : ''}" data-action="comparison-feedback" data-value="no">没有帮助</button></div>${draft?.type === 'no' ? `<div class="comparison-feedback-reasons"><span>可以告诉我们原因（可多选）</span>${COMPARISON_FEEDBACK_REASONS.map((reason) => `<button type="button" class="${draft.reasons?.includes(reason) ? 'is-selected' : ''}" data-action="comparison-feedback-reason" data-value="${esc(reason)}">${draft.reasons?.includes(reason) ? '✓ ' : ''}${reason}</button>`).join('')}</div>` : ''}${draft?.type ? `<button type="button" class="primary-button compact" data-action="comparison-feedback-submit">提交反馈</button>` : ''}</section>`;
}

function originalCompareTable(cameras) {
  const rows = [['型号', 'name'], ['价格参考', 'price'], ['自动化', 'type'], ['重量', 'weight'], ['维护风险', 'risk'], ['适合场景', 'scene']];
  return `<section class="comparison-original"><div class="comparison-module-heading"><div><span class="eyebrow">原有内容 · 保留</span><h3>原有参数横向对比</h3><p>以下表格沿用原来的参数和布局信息，没有删除或替换任何原有字段。</p></div></div><div class="compare-table"><div class="compare-labels">${rows.map((row) => `<span>${row[0]}</span>`).join('')}</div>${cameras.map((camera) => `<div class="compare-column">${visual(camera)}<strong>${esc(camera.name)}</strong><span>¥${camera.priceLow.toLocaleString()}–¥${camera.priceHigh.toLocaleString()}</span><span>${cameraType(camera)}</span><span>${camera.weight}g</span><span>${camera.repairLevel <= 2 ? '较低' : camera.repairLevel === 3 ? '中等' : '较高'}</span><span>${esc(camera.scenes.slice(0, 2).join('、'))}</span></div>`).join('')}</div><div class="detail-source">ⓘ 对比沿用同一份真实价格区间，不代表固定成交价。</div></section>`;
}

function compareModal() {
  if (!state.showCompare) return '';
  const cameras = state.compare;
  if (!cameras.length) return '';
  return `<div class="modal-backdrop" data-action="close-compare"><div class="compare-modal comparison-modal-product" data-stop="true"><button type="button" class="modal-close" aria-label="关闭对比" data-action="close-compare">×</button><span class="eyebrow">决策工具 · 横向对比</span><h2>把差异放在一张桌上看</h2>${comparisonNeeds()}${comparisonPriorityPicker()}${comparisonDecisionModule(cameras)}${comparisonDimensionTable(cameras)}${comparisonSceneModule(cameras)}${originalCompareTable(cameras)}${comparisonComboEntry(cameras)}${comparisonFeedback()}</div></div>`;
}

function drawer() {
  if (!state.compare.length) return '';
  return `<div class="compare-drawer" aria-live="polite"><div><span>已加入对比</span><strong>${state.compare.length} / 3 台</strong></div><div class="compare-items">${state.compare.map((camera) => `<button type="button" aria-label="移出 ${esc(camera.name)}" data-action="remove-compare" data-name="${esc(camera.name)}">${esc(camera.name)} ×</button>`).join('')}</div><button type="button" class="primary-button compact" data-action="open-compare">查看对比</button></div>`;
}

function profileMenu() {
  if (!state.profileOpen) return '';
  return `<div class="profile-popover" role="dialog" aria-label="本地用户面板" data-stop="true"><div class="profile-head"><div class="profile-avatar">FM</div><div><strong>FilmMatch 游客</strong><span>偏好保存在本设备</span></div></div><div class="profile-stats"><span><b>${state.favorites.size}</b> 收藏</span><span><b>${state.compare.length}</b> 对比</span></div><button type="button" data-action="show-favorites">查看我的收藏</button><button type="button" data-action="profile-info">账号同步说明</button></div>`;
}

function recordHistory() {
  const results = getResults();
  const entry = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    film: { ...state.prefs.film },
    top: results.top.slice(0, 3).map((camera) => ({ name: camera.name, score: Math.round(camera.score / 5 * 100) })),
  };
  state.history = [entry, ...state.history.filter((item) => item.top?.[0]?.name !== entry.top?.[0]?.name)].slice(0, 8);
  persistState();
}

function historyModal() {
  if (!state.showHistory) return '';
  const items = state.history.map((entry) => `<article class="history-item"><div><time>${new Date(entry.createdAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</time><strong>${esc(entry.top?.[0]?.name || '暂无推荐')}</strong></div><div class="history-item-meta"><span>${entry.top?.[0]?.score || 0}% 匹配</span><small>${(entry.top || []).map((camera) => esc(camera.name)).join(' · ')}</small></div></article>`).join('');
  return `<div id="history-modal" class="modal-backdrop history-backdrop" data-action="close-history"><div class="history-modal" data-stop="true"><div class="history-modal-head"><div><span class="eyebrow">决策记录 · 本地保存</span><h2>历史推荐</h2><p>每次完成测评后，FilmMatch 会保留最近的推荐结果。</p></div><button type="button" class="modal-close" aria-label="关闭历史记录" data-action="close-history">×</button></div><div class="history-list">${items || '<div class="history-empty"><strong>还没有历史推荐</strong><span>完成一次测评并点击“完成测评并查看推荐”，这里会出现你的记录。</span></div>'}</div></div></div>`;
}

function shootingPlanModal() {
  if (!state.showPlan) return '';
  const plan = state.shootingPlan;
  const camera = plan ? findCamera(plan.cameraName) : null;
  const film = plan ? FILM_BY_ID.get(plan.filmId) : null;
  const createdAt = plan?.createdAt
    ? new Date(plan.createdAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '刚刚加入';
  return `<div id="shooting-plan-modal" class="modal-backdrop plan-backdrop" data-action="close-plan"><div class="shooting-plan-modal" data-stop="true"><div class="plan-modal-head"><div><span class="eyebrow">本地保存 · 随时回看</span><h2>我的拍摄计划</h2><p>${plan ? '把相机、首卷胶片和拍摄场景放在一起，拍摄前打开这里就能快速复核。' : '加入一套方案后，它会显示在这里，并保存在当前浏览器。'}</p></div><button type="button" class="modal-close" aria-label="关闭拍摄计划" data-action="close-plan">×</button></div>${plan ? `<div class="plan-status"><span class="plan-status-dot"></span><strong>已加入拍摄计划</strong><small>保存在本设备 · ${createdAt}</small></div><div class="plan-meta-grid"><div><span>相机</span><strong>${esc(camera?.name || plan.cameraName || '暂未指定')}</strong></div><div><span>首卷胶片</span><strong>${esc(film?.name || '暂未指定')}</strong></div><div><span>拍摄场景</span><strong>${esc(plan.scene || '暂未指定')}</strong></div><div><span>使用提醒</span><strong>先完成一卷，再比较曝光和冲扫结果</strong></div></div><p class="plan-note">这是一份轻量拍摄清单，不会替代购买记录；你可以从推荐区继续查看验机建议和完整成本。</p><div class="plan-modal-actions">${camera ? `<button type="button" class="primary-button" data-action="cost" data-name="${esc(camera.name)}" data-film-id="${esc(film?.id || '')}">查看完整成本 →</button>` : ''}<button type="button" class="secondary-button" data-action="close-plan">返回推荐页</button></div>` : `<div class="plan-empty"><strong>还没有拍摄计划</strong><span>在“首卷方案”中点击“加入拍摄计划”，加入后可从顶部的“拍摄计划”入口再次打开。</span><button type="button" class="secondary-button" data-action="close-plan">返回推荐页</button></div>`}</div></div>`;
}

function render() {
  const results = getResults();
  root.innerHTML = `<div class="app-shell ${state.compare.length ? 'has-compare' : ''}"><header class="topbar"><div class="brand"><span class="brand-icon" aria-hidden="true"><svg class="brand-icon-svg" viewBox="0 0 36 36" focusable="false"><rect x="2.5" y="2.5" width="31" height="31" rx="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 8.5h4M7 14h4M7 22h4M7 27.5h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="21" cy="18" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="21" cy="18" r="3.2" fill="currentColor" opacity=".72"/><path d="M21 10v4M28 18h-4M21 26v-4M14 18h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".78"/></svg></span><span>FilmMatch</span></div><nav aria-label="主导航">${navLinks()}</nav><div class="top-actions"><button type="button" data-action="show-favorites">♡ 收藏 <span data-favorites-count>${state.favorites.size}</span></button><button type="button" class="history-button" data-action="open-history" aria-haspopup="dialog" aria-controls="history-modal">◷ 历史</button><div class="profile-shell"><button type="button" class="user-menu-trigger" aria-label="打开用户面板" aria-expanded="${state.profileOpen}" aria-controls="profile-popover"><span class="avatar">FM</span><span aria-hidden="true">⌄</span></button>${state.profileOpen ? profileMenu().replace('class="profile-popover"', 'id="profile-popover" class="profile-popover"') : ''}</div></div><button type="button" class="mobile-menu" aria-label="${state.mobileMenuOpen ? '关闭导航' : '打开导航'}" aria-controls="mobile-navigation" aria-expanded="${state.mobileMenuOpen}" data-action="toggle-menu">☰</button></header><div id="mobile-navigation" class="mobile-nav ${state.mobileMenuOpen ? 'is-open' : ''}" aria-label="移动端目录">${navLinks('mobile-nav-link')}</div><main class="workspace"><div>${questionnaire()}</div><div id="recommendation" class="recommendation-wrap">${recommendation(results)}${state.submitted ? lowerSections(results) : ''}</div></main>${drawer()}${detailModal(state.detail)}${costModal(state.cost)}${compareModal()}${historyModal()}<div id="toast-host" class="toast-host" aria-live="polite"></div></div>`;
}

function announce(message) {
  const host = document.getElementById('toast-host');
  if (!host) return;
  host.textContent = message;
  host.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => host.classList.remove('show'), 1800);
}

function enhanceKnowledgeSection() {
  document.querySelector('.user-menu-trigger')?.setAttribute('data-action', 'toggle-profile');
  document.querySelectorAll('.history-button').forEach((button) => {
    button.dataset.action = 'open-history';
    button.title = '打开历史记录';
  });
  document.querySelectorAll('.top-actions button').forEach((button) => {
    if (button.textContent.includes('历史')) {
      button.classList.add('history-button');
      button.dataset.action = 'open-history';
      button.title = '打开历史记录';
    }
  });
  const topActions = document.querySelector('.top-actions');
  if (topActions && !topActions.querySelector('[data-action="open-plan"]')) {
    const planButton = document.createElement('button');
    planButton.type = 'button';
    planButton.className = 'plan-button';
    planButton.dataset.action = 'open-plan';
    planButton.setAttribute('aria-haspopup', 'dialog');
    planButton.setAttribute('aria-controls', 'shooting-plan-modal');
    const historyButton = topActions.querySelector('.history-button');
    if (historyButton) historyButton.insertAdjacentElement('beforebegin', planButton);
    else topActions.prepend(planButton);
  }
  const planButton = document.querySelector('.plan-button');
  if (planButton) {
    planButton.innerHTML = state.shootingPlan ? '◈ 拍摄计划 <span class="plan-count">1</span>' : '◈ 拍摄计划';
    planButton.classList.toggle('has-plan', Boolean(state.shootingPlan));
  }
  const shell = document.querySelector('.app-shell');
  if (state.showHistory && shell && !shell.querySelector('.history-backdrop')) shell.insertAdjacentHTML('beforeend', historyModal());
  if (state.showPlan && shell && !shell.querySelector('.plan-backdrop')) shell.insertAdjacentHTML('beforeend', shootingPlanModal());
  const comboLinks = document.querySelector('.combo-links');
  if (comboLinks && state.shootingPlan && !comboLinks.querySelector('[data-action="open-plan"]')) {
    comboLinks.insertAdjacentHTML('beforeend', '<button type="button" data-action="open-plan">查看拍摄计划</button>');
  }
  const section = document.getElementById('film-library');
  if (!section) return;
  const heading = section.querySelector('.section-heading > div');
  if (heading) {
    const eyebrow = heading.querySelector('.eyebrow');
    const title = heading.querySelector('h2');
    const summary = heading.querySelector('p');
    if (eyebrow) eyebrow.textContent = '菲林百科 · 胶卷与胶片机';
    if (title) title.textContent = '菲林百科：从一卷胶片到一台胶片机，先看懂再上手';
    if (summary) summary.textContent = '胶卷选择、曝光、胶片机类型、测光、卡口、选购与二手验机放在同一条知识路径里，买之前先看懂，拍摄时少走弯路。';
  }
  const actions = section.querySelector('.knowledge-section-actions');
  if (actions && !actions.querySelector('.knowledge-kind-filter')) {
    const labels = [['all', '全部'], ['film', '胶卷'], ['camera', '胶片机']];
    actions.insertAdjacentHTML('afterbegin', `<div class="knowledge-kind-filter" role="group" aria-label="百科内容类型">${labels.map(([value, label]) => `<button type="button" class="${state.filmKnowledgeType === value ? 'active' : ''}" aria-pressed="${state.filmKnowledgeType === value}" data-action="film-kind" data-kind="${value}">${label}</button>`).join('')}</div>`);
  }
  const stage = section.querySelector('.film-encyclopedia-stage');
  if (stage && !section.querySelector('.film-knowledge-catalog')) stage.insertAdjacentHTML('afterend', filmKnowledgeCatalog());
  const method = document.querySelector('#knowledge-method');
  if (method) {
    const methodTitle = method.querySelector('strong');
    if (methodTitle) methodTitle.textContent = '胶卷库 Excel 已接入百科与指南';
  }
  const archive = document.getElementById('camera-decision-archive');
  if (archive && !section.contains(archive)) section.append(archive);
  if (archive) {
    archive.querySelector('.eyebrow').textContent = '菲林百科 · 胶片机决策资料';
    archive.querySelector('h2').textContent = '胶片机选购与验机：把知识用到购买前';
    archive.querySelector('.section-heading p').textContent = '原有相机曝光、相机家族、二手验机、卡口和便携机风险资料，现与胶卷百科合并，帮助你从“选胶卷”一路看到“选机身”。';
  }
}

function syncTopDataDate() {
  const dateNode = root.querySelector('.recommendation-trust span:nth-child(3)');
  if (dateNode) dateNode.textContent = '数据更新时间：2026-07-31';
}

function scheduleRender(message = '') {
  pendingAnnouncement = message || pendingAnnouncement;
  if (renderFrame) return;
  renderFrame = window.requestAnimationFrame(() => {
    renderFrame = 0;
    render();
    mountCameraLibraryPage();
    enhanceKnowledgeSection();
    syncTopDataDate();
    if (pendingAnnouncement) {
      const messageToShow = pendingAnnouncement;
      pendingAnnouncement = '';
      announce(messageToShow);
    }
  });
}

function syncFavoriteButtons() {
  root.querySelectorAll('[data-action="favorite"]').forEach((button) => {
    const active = state.favorites.has(button.dataset.name);
    button.textContent = active ? '♥' : '♡';
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', `${active ? '取消收藏' : '收藏'} ${button.dataset.name}`);
  });
  root.querySelectorAll('[data-favorites-count]').forEach((node) => { node.textContent = String(state.favorites.size); });
}

function updateLibraryGrid() {
  const grid = document.getElementById('camera-grid');
  if (!grid) return;
  grid.innerHTML = libraryGrid();
  const count = root.querySelector('[data-library-count]');
  if (count) count.textContent = `显示 ${libraryItems().length} / ${KNOWLEDGE_STATS.cameraCount} 台`;
  const brand = root.querySelector('[data-action="library-brand"]');
  if (brand) brand.value = state.libraryBrand;
  root.querySelectorAll('[data-action="library-type"]').forEach((button) => {
    const active = button.dataset.value === state.libraryType;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  syncFavoriteButtons();
}

function updateCostNumbers() {
  if (!state.cost) return;
  root.querySelector('[data-cost-summary]')?.replaceWith(document.createRange().createContextualFragment(costResultMarkup(state.cost)));
  root.querySelector('[data-cost-details]')?.replaceWith(document.createRange().createContextualFragment(costDetailsMarkup(state.cost)));
}

function findCamera(name) {
  return CAMERA_BY_NAME.get(name);
}

function scrollToSection(id, behavior = 'smooth') {
  if (!sectionIds.has(id)) return;
  const request = ++scrollRequest;
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
    if (request !== scrollRequest) return;
    const target = document.getElementById(id);
    if (!target) return;
    const offset = window.innerWidth <= 800 ? 76 : 96;
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
    window.scrollTo({ top, behavior });
  }));
}

function handleClick(event) {
  const element = event.target instanceof Element ? event.target : null;
  const target = element?.closest('[data-action]');
  if (!target || !root.contains(target)) return;
  if (target.classList.contains('modal-backdrop') && element.closest('[data-stop]')) return;

  const action = target.dataset.action;
  const name = target.dataset.name;
  let shouldRender = false;

  if (state.profileOpen && !element?.closest('.profile-shell') && action !== 'toggle-profile') {
    state.profileOpen = false;
    shouldRender = true;
  }

  if (action === 'toggle-menu') {
    state.mobileMenuOpen = !state.mobileMenuOpen;
    shouldRender = true;
  }
  if (action === 'toggle-profile') {
    state.profileOpen = !state.profileOpen;
    shouldRender = true;
  }
  if (action === 'nav') {
    event.preventDefault();
    state.mobileMenuOpen = false;
    state.profileOpen = false;
    const navId = target.dataset.nav;
    if (sectionIds.has(navId)) {
      if (location.hash !== `#${navId}`) location.hash = navId;
      else scrollToSection(navId);
    }
    shouldRender = true;
  }

  if (action === 'set') {
    state.prefs[target.dataset.field] = Number(target.dataset.value);
    markAssessmentDirty();
    shouldRender = true;
  }
  if (action === 'scene') {
    state.prefs.scenes = state.prefs.scenes.includes(target.dataset.scene)
      ? state.prefs.scenes.filter((item) => item !== target.dataset.scene)
      : [...state.prefs.scenes, target.dataset.scene];
    markAssessmentDirty();
    shouldRender = true;
  }
  if (action === 'film-set') {
    const field = target.dataset.filmField;
    if (field === 'occasion') {
      const current = Array.isArray(state.prefs.film.occasion) ? state.prefs.film.occasion : state.prefs.film.occasion ? [state.prefs.film.occasion] : [];
      state.prefs.film.occasion = current.includes(target.dataset.value)
        ? current.filter((item) => item !== target.dataset.value)
        : [...current, target.dataset.value];
    } else {
      state.prefs.film[field] = target.dataset.value;
    }
    markAssessmentDirty();
    shouldRender = true;
  }
  if (action === 'reset') {
    state.prefs = defaultPrefs();
    state.submitted = false;
    persistState();
    invalidateResults();
    shouldRender = true;
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => scrollToSection('recommendation', 'auto')));
  }
  if (action === 'submit') {
    if (!isAssessmentComplete(state.prefs)) {
      announce('请先完成 5 项胶卷偏好，再查看最终推荐');
      return;
    }
    state.submitted = true;
    recordHistory();
    location.hash = 'recommendation';
    shouldRender = true;
    scrollToSection('recommendation');
  }
  if (action === 'detail' && name) {
    state.detail = findCamera(name);
    state.cost = null;
    state.showCompare = false;
    shouldRender = true;
  }
  if (action === 'close-detail') {
    state.detail = null;
    shouldRender = true;
  }
  if (action === 'cost' && name) {
    state.detail = null;
    state.cost = findCamera(name);
    state.costFilmId = target.dataset.filmId || state.costFilmId || '';
    const selectedFilm = selectedCostFilm();
    state.costInputs = { ...(state.costInputs || {}), film: filmPrice(selectedFilm) ?? state.costInputs?.film ?? state.film ?? COSTS.film };
    if (state.rolls == null) state.rolls = 1;
    if (state.film == null) state.film = COSTS.film;
    if (state.develop == null) state.develop = COSTS.develop;
    persistState();
    shouldRender = true;
  }
  if (action === 'close-cost') {
    state.cost = null;
    shouldRender = true;
  }
  if (action === 'favorite' && name) {
    if (state.favorites.has(name)) {
      state.favorites.delete(name);
      announce(`已取消收藏：${name}`);
    } else {
      state.favorites.add(name);
      announce(`已收藏：${name}`);
    }
    if (target.dataset.origin === 'comparison') recordComparisonEvent('save_camera_from_comparison', { camera_name: name });
    persistState();
    syncFavoriteButtons();
    return;
  }
  if (action === 'compare' && name) {
    const camera = findCamera(name);
    const exists = state.compare.some((item) => item.name === name);
    if (exists) {
      state.compare = state.compare.filter((item) => item.name !== name);
      persistState();
      scheduleRender(`已移出对比：${name}`);
      return;
    }
    if (state.compare.length >= 3) {
      announce('最多同时对比 3 台相机');
      return;
    }
    state.compare = [...state.compare, camera];
    persistState();
    scheduleRender(`已加入对比：${name}`);
    return;
  }
  if (action === 'remove-compare' && name) {
    state.compare = state.compare.filter((item) => item.name !== name);
    persistState();
    scheduleRender(`已移出对比：${name}`);
    return;
  }
  if (action === 'open-compare') {
    state.showCompare = true;
    recordComparisonEvent('view_camera_comparison');
    recordComparisonEvent('view_personalized_conclusion');
    shouldRender = true;
  }
  if (action === 'close-compare') {
    state.showCompare = false;
    shouldRender = true;
  }
  if (action === 'comparison-priority') {
    const value = target.dataset.value;
    const selected = state.comparisonPriorities.includes(value);
    if (selected) {
      state.comparisonPriorities = state.comparisonPriorities.filter((item) => item !== value);
    } else if (state.comparisonPriorities.length >= 3) {
      announce('最多选择 3 项关注维度');
      return;
    } else {
      state.comparisonPriorities = [...state.comparisonPriorities, value];
    }
    persistState();
    recordComparisonEvent('select_comparison_priority', { priority: value, selected: !selected });
    shouldRender = true;
  }
  if (action === 'comparison-select' && name) {
    state.comparisonChoice = name;
    state.guideCameraName = name;
    persistState();
    recordComparisonEvent('choose_camera_from_comparison', { camera_name: name });
    announce(`已选择相机：${name}`);
    shouldRender = true;
  }
  if (action === 'comparison-scene') {
    state.comparisonScene = target.dataset.value || '';
    persistState();
    recordComparisonEvent('select_comparison_scene', { scene: state.comparisonScene });
    shouldRender = true;
  }
  if (action === 'comparison-feedback') {
    state.comparisonFeedbackDraft = { type: target.dataset.value, reasons: [] };
    shouldRender = true;
  }
  if (action === 'comparison-feedback-reason') {
    const reason = target.dataset.value;
    const reasons = state.comparisonFeedbackDraft?.reasons || [];
    state.comparisonFeedbackDraft = { ...(state.comparisonFeedbackDraft || { type: 'no' }), reasons: reasons.includes(reason) ? reasons.filter((item) => item !== reason) : [...reasons, reason] };
    shouldRender = true;
  }
  if (action === 'comparison-feedback-submit') {
    const draft = state.comparisonFeedbackDraft;
    if (!draft) return;
    if (draft.type === 'no' && !draft.reasons?.length) {
      announce('请选择一个原因后再提交');
      return;
    }
    state.comparisonFeedback = { type: draft.type, reasons: draft.reasons || [], timestamp: new Date().toISOString() };
    state.comparisonFeedbackDraft = null;
    recordComparisonEvent('submit_comparison_feedback', { feedback_type: state.comparisonFeedback.type, feedback_reasons: state.comparisonFeedback.reasons });
    announce('反馈已保存到本设备');
    shouldRender = true;
  }
  if (action === 'open-history') {
    state.showHistory = true;
    state.profileOpen = false;
    shouldRender = true;
  }
  if (action === 'close-history') {
    state.showHistory = false;
    shouldRender = true;
  }
  if (action === 'open-plan') {
    state.showPlan = true;
    state.profileOpen = false;
    state.showHistory = false;
    shouldRender = true;
  }
  if (action === 'close-plan') {
    state.showPlan = false;
    shouldRender = true;
  }
  if (action === 'open-guide') {
    state.guideCameraName = name || state.guideCameraName;
    if (target.dataset.origin === 'comparison') recordComparisonEvent('click_camera_film_combo', { camera_name: name || state.guideCameraName });
    state.guideFilmId = '';
    state.guideSubmitted = false;
    persistState();
    shouldRender = true;
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => scrollToSection('guide')));
  }
  if (action === 'guide-set') {
    state.guidePrefs[target.dataset.field] = target.dataset.value;
    state.guideSubmitted = false;
    state.guideFilmId = '';
    persistState();
    shouldRender = true;
  }
  if (action === 'guide-submit') {
    state.guideSubmitted = true;
    state.guideFilmId = '';
    persistState();
    shouldRender = true;
  }
  if (action === 'guide-reset') {
    state.guidePrefs = defaultGuidePrefs();
    state.guideSubmitted = false;
    state.guideFilmId = '';
    persistState();
    shouldRender = true;
  }
  if (action === 'guide-film-pick') {
    state.guideFilmId = target.dataset.id || '';
    state.guideSubmitted = true;
    persistState();
    shouldRender = true;
  }
  if (action === 'film-detail') {
    state.filmKnowledgeType = 'film';
    state.filmKnowledgeId = target.dataset.id || null;
    scheduleRender('已打开胶卷详情');
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => scrollToSection('film-library')));
    return;
  }
  if (action === 'add-plan' && name) {
    const camera = findCamera(name);
    const film = FILM_BY_ID.get(target.dataset.filmId || state.guideFilmId || state.costFilmId);
    state.shootingPlan = { cameraName: camera?.name || name, filmId: film?.id || '', scene: state.guidePrefs.scene, createdAt: new Date().toISOString() };
    persistState();
    announce(film ? `已加入拍摄计划：${camera?.name || name} + ${film.name}` : '已加入拍摄计划');
    state.showPlan = true;
    shouldRender = true;
  }
  if (action === 'cost-toggle') {
    const input = ensureCostInputs();
    input[target.dataset.field] = !input[target.dataset.field];
    persistState();
    shouldRender = true;
  }
  if (action === 'cost-scenario') {
    ensureCostInputs().scenario = target.dataset.value || 'mid';
    persistState();
    shouldRender = true;
  }
  if (action === 'random-film') {
    state.filmRandomIndex = nextRandomIndex(visibleFilmKnowledge().length, state.filmRandomIndex);
    state.filmKnowledgeId = visibleFilmKnowledge()[state.filmRandomIndex]?.id || null;
    scheduleRender('已生成一条胶卷百科');
    return;
  }
  if (action === 'film-kind') {
    state.filmKnowledgeType = target.dataset.kind || 'all';
    state.filmRandomIndex = 0;
    state.filmKnowledgeId = visibleFilmKnowledge()[0]?.id || null;
    scheduleRender();
    return;
  }
  if (action === 'film-index') {
    const nextKind = target.dataset.kind || 'all';
    const nextId = target.dataset.id;
    state.filmKnowledgeType = nextKind;
    const nextEntries = visibleFilmKnowledge();
    const nextIndex = nextEntries.findIndex((entry) => entry.id === nextId);
    state.filmRandomIndex = Math.max(0, nextIndex);
    state.filmKnowledgeId = nextEntries[nextIndex]?.id || nextEntries[0]?.id || null;
    scheduleRender('已定位到百科条目');
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      document.querySelector('#film-library .film-encyclopedia-stage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }));
    return;
  }
  if (action === 'random-guide') {
    state.guideRandomIndex = nextRandomIndex(FILM_GUIDES.length, state.guideRandomIndex);
    scheduleRender('已生成一条选卷指南');
    return;
  }
  if (action === 'show-favorites') {
    if (location.hash !== '#camera-library') location.hash = 'camera-library';
    state.onlyFavorites = !state.onlyFavorites;
    state.libraryQuery = '';
    state.libraryBrand = '全部';
    state.libraryType = '全部';
    state.profileOpen = false;
    shouldRender = true;
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => document.getElementById('camera-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' })));
  }
  if (action === 'profile-info') {
    announce('当前为本地访客模式：收藏与对比保存在本设备。');
    return;
  }
  if (action === 'library-type') {
    state.libraryType = target.dataset.value;
    updateLibraryGrid();
    return;
  }
  if (action === 'library-reset') {
    state.libraryQuery = '';
    state.libraryBrand = '全部';
    state.libraryType = '全部';
    state.onlyFavorites = false;
    scheduleRender('已清除相机库筛选');
    return;
  }

  if (shouldRender) scheduleRender();
}

function handleInput(event) {
  const element = event.target instanceof Element ? event.target : null;
  const action = element?.dataset.action;
  if (action === 'range') {
    state.prefs[element.dataset.field] = Number(element.value);
    markAssessmentDirty();
    const display = element.parentElement?.querySelector('.range-value');
    if (display) display.textContent = money(state.prefs[element.dataset.field]);
    return;
  }
  if (action === 'cost-input') {
    const field = element.dataset.field;
    if (field === 'rolls') {
      state.rolls = Math.max(1, Number(element.value) || 1);
    } else {
      const input = ensureCostInputs();
      input[field] = element.value === '' ? null : Math.max(0, Number(element.value) || 0);
    }
    persistState();
    updateCostNumbers();
    return;
  }
  if (action === 'library-search') {
    state.libraryQuery = element.value;
    updateLibraryGrid();
  }
}

function handleChange(event) {
  const element = event.target instanceof Element ? event.target : null;
  if (element?.dataset.action === 'range') {
    state.prefs[element.dataset.field] = Number(element.value);
    markAssessmentDirty();
    scheduleRender();
  }
  if (element?.dataset.action === 'library-brand') {
    state.libraryBrand = element.value;
    updateLibraryGrid();
  }
}

function handleKeydown(event) {
  if (event.key !== 'Escape') return;
  if (state.profileOpen) {
    state.profileOpen = false;
    scheduleRender();
    return;
  }
  if (state.showHistory) {
    state.showHistory = false;
    scheduleRender();
    return;
  }
  if (state.showPlan) {
    state.showPlan = false;
    scheduleRender();
    return;
  }
  if (state.showCompare || state.detail || state.cost) {
    state.showCompare = false;
    state.detail = null;
    state.cost = null;
    scheduleRender();
  }
}

root.addEventListener('click', handleClick);
root.addEventListener('input', handleInput, { passive: true });
root.addEventListener('change', handleChange, { passive: true });
window.addEventListener('keydown', handleKeydown, { passive: true });
window.addEventListener('hashchange', () => {
  state.mobileMenuOpen = false;
  scheduleRender();
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => scrollToSection(activeNavId())));
}, { passive: true });

render();
mountCameraLibraryPage();
enhanceKnowledgeSection();
syncTopDataDate();
scrollToSection(activeNavId(), 'auto');
