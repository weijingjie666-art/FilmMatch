// 每条图片都按相机“型号名 → 照片地址 → 可回查来源”绑定。
// Commons 图片优先使用 Wikimedia 的缩略图；厂商/商店图片保留来源页，便于复核型号。
const commons = (url, file, alt) => ({ url, source: `https://commons.wikimedia.org/wiki/File:${file}`, alt, credit: 'Wikimedia Commons' });
const sourceImage = (url, source, alt, credit) => ({ url, source, alt, credit });

export const CAMERA_IMAGES_BY_NAME = {
  'Canon AE-1': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Canon_AE-1.JPG/960px-Canon_AE-1.JPG',
    'Canon_AE-1.JPG',
    'Canon AE-1 胶片单反相机',
  ),
  'Canon AE-1 Program': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Canon_AE-1_Program_2.jpg/960px-Canon_AE-1_Program_2.jpg',
    'Canon_AE-1_Program_2.jpg',
    'Canon AE-1 Program 胶片单反相机',
  ),
  'Canon A-1': sourceImage(
    'https://global.canon/ja/c-museum/wp-content/uploads/2015/05/film100_b.jpg',
    'https://global.canon/en/c-museum/product/film100.html',
    'Canon A-1 胶片单反相机',
    'Canon Camera Museum',
  ),
  'Canon EOS 650': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/0577_Canon_EOS_650_body_and_EZ430EZ_strobe_%289122100471%29.jpg/960px-0577_Canon_EOS_650_body_and_EZ430EZ_strobe_%289122100471%29.jpg',
    '0577_Canon_EOS_650_body_and_EZ430EZ_strobe_(9122100471).jpg',
    'Canon EOS 650 胶片单反相机',
  ),
  'Canon EOS 30V': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Eos_30v-1-weba.jpg/960px-Eos_30v-1-weba.jpg',
    'Eos_30v-1-weba.jpg',
    'Canon EOS 30V 胶片单反相机',
  ),
  'Nikon FM2/FM2n': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/NIKON_FM2.jpg/960px-NIKON_FM2.jpg',
    'NIKON_FM2.jpg',
    'Nikon FM2 胶片单反相机',
  ),
  'Nikon FE2': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/NikonFE2blkfrt50f14.jpg/960px-NikonFE2blkfrt50f14.jpg',
    'NikonFE2blkfrt50f14.jpg',
    'Nikon FE2 胶片单反相机',
  ),
  'Nikon F3': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Nikon_F3.jpg/960px-Nikon_F3.jpg',
    'Nikon_F3.jpg',
    'Nikon F3 胶片单反相机',
  ),
  'Nikon F100': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Nikon_F100.jpg/960px-Nikon_F100.jpg',
    'Nikon_F100.jpg',
    'Nikon F100 胶片单反相机',
  ),
  'Nikon F80/N80': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Nikon_F80N80_with_MB-16_battery_grip_and_AF50mm-f1.8D.jpg/960px-Nikon_F80N80_with_MB-16_battery_grip_and_AF50mm-f1.8D.jpg',
    'Nikon_F80N80_with_MB-16_battery_grip_and_AF50mm-f1.8D.jpg',
    'Nikon F80/N80 胶片单反相机',
  ),
  'Pentax K1000': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Pentax_K1000.jpg/960px-Pentax_K1000.jpg',
    'Pentax_K1000.jpg',
    'Pentax K1000 胶片单反相机',
  ),
  'Pentax MX': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Pentax_MX_front_side.jpg/960px-Pentax_MX_front_side.jpg',
    'Pentax_MX_front_side.jpg',
    'Pentax MX 胶片单反相机',
  ),
  'Pentax ME Super': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Pentax_ME_Super_-_front-angle.jpg/960px-Pentax_ME_Super_-_front-angle.jpg',
    'Pentax_ME_Super_-_front-angle.jpg',
    'Pentax ME Super 胶片单反相机',
  ),
  'Pentax MZ-5/ZX-5': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Pentax_MZ-5.jpg/960px-Pentax_MZ-5.jpg',
    'Pentax_MZ-5.jpg',
    'Pentax MZ-5 / ZX-5 胶片单反相机',
  ),
  'Olympus OM-1': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Olympus_OM-1_chrome.JPG/960px-Olympus_OM-1_chrome.JPG',
    'Olympus_OM-1_chrome.JPG',
    'Olympus OM-1 胶片单反相机',
  ),
  'Olympus OM-2/OM-2n': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Olympus_OM_2_md_%2851887698687%29.jpg/960px-Olympus_OM_2_md_%2851887698687%29.jpg',
    'Olympus_OM_2_md_(51887698687).jpg',
    'Olympus OM-2 / OM-2n 胶片单反相机',
  ),
  'Olympus OM-10': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Olympus_OM-10%2C_front.JPG/960px-Olympus_OM-10%2C_front.JPG',
    'Olympus_OM-10,_front.JPG',
    'Olympus OM-10 胶片单反相机',
  ),
  'Olympus μ[mju:]-II（U2 / Stylus Epic）': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Olympus_%CE%BC_mju_II_4.jpg/960px-Olympus_%CE%BC_mju_II_4.jpg',
    'Olympus_μ_mju_II_4.jpg',
    'Olympus μ[mju:]-II / Stylus Epic 胶片便携相机',
  ),
  'Minolta X-700': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Minolta_X-700_2.jpg/960px-Minolta_X-700_2.jpg',
    'Minolta_X-700_2.jpg',
    'Minolta X-700 胶片单反相机',
  ),
  'Yashica Electro 35 GSN/GTN': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Yashica_Electro_35_GSN_%2813647971965%29.jpg/960px-Yashica_Electro_35_GSN_%2813647971965%29.jpg',
    'Yashica_Electro_35_GSN_(13647971965).jpg',
    'Yashica Electro 35 GSN/GTN 旁轴相机',
  ),
  'Canon Autoboy大魔王（New Autoboy / Caption Zoom）': sourceImage(
    'https://global.canon/ja/c-museum/wp-content/uploads/2015/05/film135_b.jpg',
    'https://global.canon/en/c-museum/product/film135.html',
    'Canon Autoboy 大魔王 / New Autoboy / Caption Zoom 胶片便携相机',
    'Canon Camera Museum',
  ),
  'Canon Autoboy ZOOM Super': sourceImage(
    'https://global.canon/ja/c-museum/wp-content/uploads/2015/05/film134_b.jpg',
    'https://global.canon/zh/c-museum/product/film134.html',
    'Canon Autoboy ZOOM Super 胶片便携相机',
    'Canon Camera Museum',
  ),
  'Canon Autoboy AF35M II（Autoboy系列代表）': sourceImage(
    'https://global.canon/ja/c-museum/wp-content/uploads/2015/05/film110_b.jpg',
    'https://global.canon/zh/c-museum/product/film110.html',
    'Canon Autoboy AF35M II 胶片便携相机',
    'Canon Camera Museum',
  ),
  'Pentax Espio 135M': sourceImage(
    'https://www.newwavepool.shop/cdn/shop/products/pentax_espio_135M_serial_4528755_20211119_286.jpg?v=1637378849',
    'https://www.newwavepool.shop/products/pentax-espio-135m-compact-35mm-film-camera-serial-4528755',
    'Pentax Espio 135M 胶片便携相机',
    'New Wave Pool product archive',
  ),
  'Minolta Capios 160A': sourceImage(
    'https://image.production.fruitsfamily.com/public/product/resized%40width620/thCYihEaFf-B8FBAB08-6AB4-4A35-A238-2FDDD7ABB908.jpg',
    'https://fruitsfamily.com/product/3ar2n/%EB%AF%B8%EB%86%80%ED%83%80-capios-160a',
    'Minolta Capios 160A 胶片便携相机',
    'Filmphotography.eu',
  ),
  'Fujifilm Cardia Mini Tiara（28mm固定版）': sourceImage(
    'https://natural-camera.com/cdn/shop/products/s-DSC00591_cabf7124-e431-4452-b75b-e80decac5c71_1200x1200.jpg?v=1673492709',
    'https://natural-camera.com/en/products/8295',
    'Fujifilm Cardia Mini Tiara 28mm 胶片便携相机',
    'Natural Camera product archive',
  ),
  'Minolta Riva Zoom 75W（Capios 75W）': sourceImage(
    'https://kamerastore.com/cdn/shop/files/47_20-_20KZ1532-1.jpg?v=1781087166',
    'https://kamerastore.com/en-us/products/minolta-riva-zoom-75w',
    'Minolta Riva Zoom 75W / Capios 75W 胶片便携相机',
    'Kamerastore product archive',
  ),
  'Canon Sure Shot WP-1（Canon WP-1）': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Canon_Sure_Shot_WP-1.jpg/960px-Canon_Sure_Shot_WP-1.jpg',
    'Canon_Sure_Shot_WP-1.jpg',
    'Canon Sure Shot WP-1 防水胶片相机',
  ),
  'Pentax Zoom 105-R': commons(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Pentax_Zoom_105-R.png/960px-Pentax_Zoom_105-R.png',
    'Pentax_Zoom_105-R.png',
    'Pentax Zoom 105-R 胶片便携相机',
  ),
  'Nikon One Touch Zoom 90S': sourceImage(
    'https://cameraexc.com/cdn/shop/products/nikon-one-touch-zoom-90s-af-quartz-date-35mm-camera-35mm-film-cameras-35mm-point-and-shoot-cameras-nikon-7005357-39183685910779.jpg?v=1672693369&width=720',
    'https://cameraexc.com/products/nikon-one-touch-zoom-90s-af-quartz-date-35mm-camera',
    'Nikon One Touch Zoom 90S 胶片便携相机',
    'Camera Exc product archive',
  ),
  'Minolta Panorama Zoom 5': sourceImage(
    'https://www.reddragonfilmlab.com/cdn/shop/files/cdcba1751bc3f200b77b7169ad9e910a.jpg?v=1760223655',
    'https://www.reddragonfilmlab.com/products/minolta-panorama-zoom-5',
    'Minolta Panorama Zoom 5 胶片便携相机',
    'Naniwa camera archive',
  ),
  'Fujifilm DL-290 / Discovery 290 Zoom': sourceImage(
    'https://cobblestore.com/cdn/shop/files/Vintage_1997_Fujifilm_Discovery_290_Zoom_35mm_Film_Camera_1200x1200.jpg?v=1760717716',
    'https://cobblestore.com/products/vintage-1997-fujifilm-discovery-290-zoom-35mm-film-camera',
    'Fujifilm DL-290 / Discovery 290 Zoom 胶片便携相机',
    'SoCal Cameras product archive',
  ),
  'Olympus Trip AF31': sourceImage(
    'https://www.analogcamerad.com/wp-content/uploads/2023/05/olympus-trip-af-31-camera-1.jpg',
    'https://www.analogcamerad.com/shop/olympus-trip-af-31/',
    'Olympus Trip AF31 胶片便携相机',
    'Analog Camera D product archive',
  ),
  'Canon Prima Super 115（Autoboy S / Sure Shot Z115）': sourceImage(
    'https://global.canon/ja/c-museum/wp-content/uploads/2015/08/film163_b.jpg',
    'https://global.canon/zh/c-museum/product/film163.html',
    'Canon Prima Super 115 / Autoboy S / Sure Shot Z115 胶片便携相机',
    'Canon Camera Museum',
  ),
  'Ricoh Myport Zoom RZ-800D（用户写作2Z800）': sourceImage(
    'https://kamerastore.com/cdn/shop/files/18-03-24-27597.jpg?v=1711529728',
    'https://kamerastore.com/en-us/products/ricoh-rz-800',
    'Ricoh Myport Zoom RZ-800 胶片便携相机',
    'Kamerastore product archive',
  ),
  'Canon New F-1（1981 标准型号）': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Canon%20new%20F-1-Camera.jpg?width=960',
    'Canon new F-1-Camera.jpg',
    'Canon New F-1（1981 标准型号）胶片单反相机',
  ),
  'Canon T70': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Canon%20t70.jpg?width=960',
    'Canon t70.jpg',
    'Canon T70 胶片单反相机',
  ),
  'Canon T90': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Canon%20T90.jpg?width=960',
    'Canon T90.jpg',
    'Canon T90 胶片单反相机',
  ),
  'Canon EOS-1（1989）': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Canon%20EOS-1.jpg?width=960',
    'Canon EOS-1.jpg',
    'Canon EOS-1（1989）胶片单反相机',
  ),
  'Canon EOS-3': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Canon%20EOS-3.jpg?width=960',
    'Canon EOS-3.jpg',
    'Canon EOS-3 胶片单反相机',
  ),
  'Canon T50': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Canon%20T50.jpg?width=960',
    'Canon_T50.jpg',
    'Canon T50 胶片单反相机',
  ),
  'Nikon FG': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Nikon%20FG%20and%20series%20E%2050mm%20lens.JPG?width=960',
    'Nikon_FG_and_series_E_50mm_lens.JPG',
    'Nikon FG 胶片单反相机',
  ),
  'Nikon F4': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Nikon%20f4.jpg?width=960',
    'Nikon_f4.jpg',
    'Nikon F4 胶片单反相机',
  ),
  'Nikon F5': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Nikon%20F5.jpg?width=960',
    'Nikon_F5.jpg',
    'Nikon F5 胶片单反相机',
  ),
  'Nikon F': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Nikon%20F.jpg?width=960',
    'Nikon F.jpg',
    'Nikon F 胶片单反相机',
  ),
  'Nikon F2': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Nikon%20F2.jpg?width=960',
    'Nikon F2.jpg',
    'Nikon F2 胶片单反相机',
  ),
  'Nikon FM': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Nikon%20FM.jpg?width=960',
    'Nikon FM.jpg',
    'Nikon FM 胶片单反相机',
  ),
  'Nikon FA': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Nikon%20FA%20%2822252503244%29.jpg?width=960',
    'Nikon FA (22252503244).jpg',
    'Nikon FA 胶片单反相机',
  ),
  'Pentax Spotmatic F': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Pentax%20SP-F%20%282357797222%29.jpg?width=960',
    'Pentax_SP-F_(2357797222).jpg',
    'Pentax Spotmatic F 胶片单反相机',
  ),
  'Pentax KX': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Asahi%20Pentax%20KX.jpg?width=960',
    'Asahi_Pentax_KX.jpg',
    'Pentax KX 胶片单反相机',
  ),
  'Pentax LX': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Pentax%20LX%20camera.jpg?width=960',
    'Pentax_LX_camera.jpg',
    'Pentax LX 胶片单反相机',
  ),
  'Pentax 67': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Pentax%2067.jpg?width=960',
    'Pentax_67.jpg',
    'Pentax 67 中画幅胶片单反相机',
  ),
  'Olympus OM-3': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Olympus%20OM3%2001b%20web.jpg?width=960',
    'Olympus_OM3_01b_web.jpg',
    'Olympus OM-3 胶片单反相机',
  ),
  'Olympus OM-4Ti': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Olympus%20OM-4Ti%20worn%20black%20body%20with%20Zuiko%201.8-50mm%20lens%20and%20neckstrap.jpg?width=960',
    'Olympus_OM-4Ti_worn_black_body_with_Zuiko_1.8-50mm_lens_and_neckstrap.jpg',
    'Olympus OM-4Ti 胶片单反相机',
  ),
  'Olympus XA': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Olympus%20XA.jpg?width=960',
    'Olympus_XA.jpg',
    'Olympus XA 胶片旁轴便携相机',
  ),
  'Olympus XA2': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Olympus%20XA2.jpg?width=960',
    'Olympus_XA2.jpg',
    'Olympus XA2 胶片便携相机',
  ),
  'Nikon FM2n': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Nikon%20FM2n%20Gehaeuse%20Frontansicht%2001%2009.jpg?width=960',
    'Nikon FM2n Gehaeuse Frontansicht 01 09.jpg',
    'Nikon FM2n 胶片单反相机',
  ),
  'Nikon F6': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Nikon-F6%20MG%202034.jpg?width=960',
    'Nikon-F6 MG 2034.jpg',
    'Nikon F6 胶片单反相机',
  ),
  'Nikon FE': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Nikon%20FE%20%288078751584%29.jpg?width=960',
    'Nikon FE (8078751584).jpg',
    'Nikon FE 胶片单反相机',
  ),
  'Nikon Nikkormat FTN': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Nikkormat%20FTN%20w%2010.5cm%20Nikkor-P%20%285992320638%29.jpg?width=960',
    'Nikkormat FTN w 10.5cm Nikkor-P (5992320638).jpg',
    'Nikon Nikkormat FTN 胶片单反相机',
  ),
  'Canon EOS-1V': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Canon%20EOS-1V.jpg?width=960',
    'Canon EOS-1V.jpg',
    'Canon EOS-1V 胶片单反相机',
  ),
  'Canon F-1': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Canon%20F-1%20%2813746363604%29.jpg?width=960',
    'Canon F-1 (13746363604).jpg',
    'Canon F-1 胶片单反相机',
  ),
  'Canon FTb QL': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Canon%20FTb%20QL.JPG?width=960',
    'Canon FTb QL.JPG',
    'Canon FTb QL 胶片单反相机',
  ),
  'Olympus mju-II（Stylus Epic）': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Olympus%20mju%20ii.jpg?width=960',
    'Olympus mju ii.jpg',
    'Olympus mju-II（Stylus Epic）胶片便携相机',
  ),
  'Olympus Pen F': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Olympus%20Pen%20F%20%282753006643%29.jpg?width=960',
    'Olympus Pen F (2753006643).jpg',
    'Olympus Pen F 半格胶片单反相机',
  ),
  'Olympus 35 RC': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Olympus%2035%20RC%20img%201850.jpg?width=960',
    'Olympus 35 RC img 1850.jpg',
    'Olympus 35 RC 胶片旁轴相机',
  ),
  'Olympus Trip 35': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Olympus%20Trip%2035%20camera.jpg?width=960',
    'Olympus Trip 35 camera.jpg',
    'Olympus Trip 35 胶片便携相机',
  ),
  'Minolta SRT 101': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Minolta%20SR-T%20101.jpg?width=960',
    'Minolta SR-T 101.jpg',
    'Minolta SRT 101 胶片单反相机',
  ),
  'Minolta TC-1': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Minolta%20TC-1%20and%20135Film.jpg?width=960',
    'Minolta TC-1 and 135Film.jpg',
    'Minolta TC-1 胶片便携相机',
  ),
  'Yashica Mat-124G': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Yashica%20Mat-124G%20TLR%20camera.jpg?width=960',
    'Yashica Mat-124G TLR camera.jpg',
    'Yashica Mat-124G 双镜头反光胶片相机',
  ),
  'Contax T2': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Contax%20T2%20-1%20%283576938591%29.jpg?width=960',
    'Contax T2 -1 (3576938591).jpg',
    'Contax T2 胶片便携相机',
  ),
  'Leica M6': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Leica%20M6.jpg?width=960',
    'Leica M6.jpg',
    'Leica M6 胶片旁轴相机',
  ),
  'Nikon FG-20': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Nikon%20FG-20%2020070114.jpg?width=960',
    'Nikon FG-20 20070114.jpg',
    'Nikon FG-20 鑳剁墖鍗曞弽鐩告満',
  ),
  'Nikon EM': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Nikon%20EM.jpg?width=960',
    'Nikon EM.jpg',
    'Nikon EM 鑳剁墖鍗曞弽鐩告満',
  ),
  'Nikon FM10': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Nikon%20FM10.jpg?width=960',
    'Nikon FM10.jpg',
    'Nikon FM10 鑳剁墖鍗曞弽鐩告満',
  ),
  'Olympus OM-4': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/OlympusOM4%201.JPG?width=960',
    'OlympusOM4 1.JPG',
    'Olympus OM-4 鑳剁墖鍗曞弽鐩告満',
  ),
  'Olympus Pen FT': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Olympus%20Pen%20FT%202015.jpg?width=960',
    'Olympus Pen FT 2015.jpg',
    'Olympus Pen FT 鍗婃牸鑳剁墖鍗曞弽鐩告満',
  ),
  'Olympus 35 SP': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Olympus%2035%20SP%20Front.jpg?width=960',
    'Olympus 35 SP Front.jpg',
    'Olympus 35 SP 鑳剁墖鏃佽酱鐩告満',
  ),
  'Canon EF': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Canon%20EF.jpg?width=960',
    'Canon EF.jpg',
    'Canon EF 鑳剁墖鍗曞弽鐩告満',
  ),
  'Canon TLb': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Canon%20TLb.jpg?width=960',
    'Canon TLb.jpg',
    'Canon TLb 鑳剁墖鍗曞弽鐩告満',
  ),
  'Canon Canonet QL17 G-III（1969）': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Canonet-QL17-G-III.jpg?width=960',
    'Canonet-QL17-G-III.jpg',
    'Canon Canonet QL17 G-III 鑳剁墖鏃佽酱鐩告満',
  ),
  'Yashica T4（Kyocera T Proof）': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/YASHICA%20T4.jpg?width=960',
    'YASHICA T4.jpg',
    'Yashica T4 鑳剁墖渚挎惡鐩告満',
  ),
  'Contax T3': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/CONTAX%20T3.jpg?width=960',
    'CONTAX T3.jpg',
    'Contax T3 鑳剁墖渚挎惡鐩告満',
  ),
  'Contax G1': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Contax%20G1%20Rangefinder%20Camera.jpg?width=960',
    'Contax G1 Rangefinder Camera.jpg',
    'Contax G1 鑳剁墖鏃佽酱鐩告満',
  ),
  'Contax G2': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Contax%20G2%20Rangefinder%20Camera.jpg?width=960',
    'Contax G2 Rangefinder Camera.jpg',
    'Contax G2 鑳剁墖鏃佽酱鐩告満',
  ),
  'Leica M2': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Leica%20M2.jpg?width=960',
    'Leica M2.jpg',
    'Leica M2 鑳剁墖鏃佽酱鐩告満',
  ),
  'Leica M3': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Leica%20M3%2020090309.jpg?width=960',
    'Leica M3 20090309.jpg',
    'Leica M3 鑳剁墖鏃佽酱鐩告満',
  ),
  'Leica M4': commons(
    'https://commons.wikimedia.org/wiki/Special:FilePath/Leica%20M4.jpg?width=960',
    'Leica M4.jpg',
    'Leica M4 鑳剁墖鏃佽酱鐩告満',
  ),
};

export const CAMERA_IMAGE_COUNT = Object.keys(CAMERA_IMAGES_BY_NAME).length;
