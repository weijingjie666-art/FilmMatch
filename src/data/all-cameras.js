import { CAMERAS as BASE_CAMERAS } from './cameras.js';
import { CAMERA_EXPANSION } from './camera-expansion.js';
import { CAMERA_EXPANSION_2 } from './camera-expansion-2.js';
import { CAMERA_EXPANSION_3 } from './camera-expansion-3.js';
import { CAMERA_EXPANSION_4 } from './camera-expansion-4.js';

const RAW_CAMERAS = [...BASE_CAMERAS, ...CAMERA_EXPANSION, ...CAMERA_EXPANSION_2, ...CAMERA_EXPANSION_3, ...CAMERA_EXPANSION_4];

// 型号校正：只修正型号字段的俗称、地区别名、版本混用与明显笔误；其余资料字段保持原表不变。
const MODEL_NAME_CORRECTIONS = {
  'Canon EOS-1': 'Canon EOS-1（1989）',
  'Canon EOS-1N': 'Canon EOS-1N（1994）',
  'Canon EOS 5（A2）': 'Canon EOS 5（A2，北美型号）',
  'Canon EOS 5': 'Canon EOS 5 QD（欧洲/亚洲型号）',
  'Canon F-1（New F-1）': 'Canon New F-1（1981 标准型号）',
  'Canon New F-1': 'Canon New F-1（AE Finder 版本）',
  'Canon F-1n': 'Canon New F-1（F-1N 俗称）',
  'Canon Autoboy大魔王（New Autoboy / Caption Zoom）': 'Canon Sure Shot Caption Zoom（日本型号 New Autoboy）',
  'Canon Autoboy AF35M II（Autoboy系列代表）': 'Canon AF35M II（日本型号 Autoboy II）',
  'Canon Canonet QL17 G-III': 'Canon Canonet QL17 G-III（1969）',
  'Canon Canonet QL19 G-III': 'Canon Canonet QL19 G-III（1969）',
  'Canonet QL17': 'Canon Canonet QL17（第一代，1965）',
  'Canonet QL19': 'Canon Canonet QL19（第一代，1965）',
  'Canon RP': 'Canon RP（1949）',
  'Nikon FM2/FM2n': 'Nikon FM2n',
  'Nikon F80/N80': 'Nikon F80（北美型号 N80）',
  'Nikon F90/N90': 'Nikon F90（北美型号 N90）',
  'Nikon F90X/N90s': 'Nikon F90X（北美型号 N90s）',
  'Nikon F801/N8008': 'Nikon F-801（北美型号 N8008）',
  'Nikon F801s/N8008s': 'Nikon F-801s（北美型号 N8008s）',
  'Nikon F601/N6006': 'Nikon F-601（北美型号 N6006）',
  'Nikon F501/N2020': 'Nikon F-501（北美型号 N2020）',
  'Nikon F401/N4004': 'Nikon F-401（北美型号 N4004）',
  'Nikon F65/N65': 'Nikon F65（北美型号 N65）',
  'Nikon F75/N75': 'Nikon F75（北美型号 N75）',
  'Nikon F-301': 'Nikon F-301（北美型号 N2000）',
  'Pentax MZ-5/ZX-5': 'Pentax MZ-5（北美型号 ZX-5）',
  'Pentax Z-1/PZ-1': 'Pentax Z-1（北美型号 PZ-1）',
  'Pentax PZ-10': 'Pentax PZ-10（北美型号 ZX-10）',
  'Pentax 110': 'Pentax Auto 110（早期版本）',
  'Olympus OM-2/OM-2n': 'Olympus OM-2n',
  'Olympus μ[mju:]-II（U2 / Stylus Epic）': 'Olympus mju-II（Stylus Epic）',
  'Olympus μ[mju:]-I（Stylus）': 'Olympus mju-I（Stylus）',
  'Olympus OM-77 AF': 'Olympus OM-77 AF（OM-707）',
  'Minolta Dynax 7/Maxxum 7': 'Minolta Alpha-7（日本型号 Dynax 7 / Maxxum 7）',
  'Minolta Dynax 7': 'Minolta Dynax 7（欧洲型号）',
  'Minolta Maxxum 7': 'Minolta Maxxum 7（北美型号）',
  'Minolta XD-7/XD-11': 'Minolta XD-7（北美型号 XD-11）',
  'Minolta XD-11/XD-7': 'Minolta XD-11（日本/欧洲型号 XD-7）',
  'Minolta 3000': 'Minolta 3000i（Maxxum 3000i）',
  'Fujifilm Cardia Mini Tiara（28mm固定版）': 'Fujifilm Cardia Mini Tiara（28mm f/3.5）',
  'Fujifilm GA645': 'Fujifilm GA645 Professional',
  'Ricoh Myport Zoom RZ-800D（用户写作2Z800）': 'Ricoh Myport Zoom RZ-800D',
  'Leica CL（胶片版）': 'Leica CL（Leitz-Minolta，1973）',
  'Leica CL': 'Leica CL（Leitz-Minolta，日本市场版本）',
};

export const CAMERAS = RAW_CAMERAS.map((camera) => ({
  ...camera,
  originalName: camera.name,
  name: MODEL_NAME_CORRECTIONS[camera.name] || camera.name,
}));

const normalizeModelKey = (camera) => `${camera.brand} ${camera.name}`
  .toLocaleLowerCase('en-US')
  .normalize('NFKC')
  .replace(/\s+/gu, '')
  .replace(/[-_/().+＋（）【】\[\]·:：]/gu, '');

const uniqueModelKeys = new Set(CAMERAS.map(normalizeModelKey));
if (CAMERAS.length !== 500 || uniqueModelKeys.size !== 500) {
  throw new Error(`相机库必须包含 500 个不重复型号：总数 ${CAMERAS.length}，唯一数 ${uniqueModelKeys.size}`);
}
