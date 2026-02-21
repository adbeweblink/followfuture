/**
 * 真太陽時校正模組
 * 將標準時間轉換為當地真太陽時，用於精確的八字排盤
 */

/**
 * 城市經度資料
 */
export interface CityData {
  name: string;
  province: string;
  longitude: number;
  latitude: number;
}

/**
 * 真太陽時結果
 */
export interface TrueSolarTimeResult {
  originalTime: Date;
  trueSolarTime: Date;
  timeDifference: number; // 分鐘
  longitudeCorrection: number; // 經度校正（分鐘）
  equationOfTime: number; // 均時差（分鐘）
  description: string;
  hourBranchChanged: boolean; // 時辰是否改變
  originalHourBranch: string;
  correctedHourBranch: string;
}

/**
 * 主要城市經度資料（台灣、中國大陸）
 */
export const CITY_COORDINATES: CityData[] = [
  // 台灣
  { name: '台北', province: '台灣', longitude: 121.5654, latitude: 25.0330 },
  { name: '新北', province: '台灣', longitude: 121.4628, latitude: 25.0169 },
  { name: '桃園', province: '台灣', longitude: 121.3010, latitude: 24.9936 },
  { name: '台中', province: '台灣', longitude: 120.6736, latitude: 24.1477 },
  { name: '台南', province: '台灣', longitude: 120.2270, latitude: 22.9998 },
  { name: '高雄', province: '台灣', longitude: 120.3014, latitude: 22.6273 },
  { name: '新竹', province: '台灣', longitude: 120.9647, latitude: 24.8138 },
  { name: '嘉義', province: '台灣', longitude: 120.4473, latitude: 23.4800 },
  { name: '基隆', province: '台灣', longitude: 121.7419, latitude: 25.1276 },
  { name: '花蓮', province: '台灣', longitude: 121.6014, latitude: 23.9910 },
  { name: '宜蘭', province: '台灣', longitude: 121.7580, latitude: 24.7570 },
  { name: '屏東', province: '台灣', longitude: 120.4879, latitude: 22.6762 },
  { name: '台東', province: '台灣', longitude: 121.1467, latitude: 22.7583 },
  { name: '澎湖', province: '台灣', longitude: 119.5669, latitude: 23.5711 },
  { name: '金門', province: '台灣', longitude: 118.3171, latitude: 24.4493 },
  { name: '馬祖', province: '台灣', longitude: 119.9226, latitude: 26.1608 },

  // 中國大陸主要城市
  { name: '北京', province: '北京', longitude: 116.4074, latitude: 39.9042 },
  { name: '上海', province: '上海', longitude: 121.4737, latitude: 31.2304 },
  { name: '廣州', province: '廣東', longitude: 113.2644, latitude: 23.1291 },
  { name: '深圳', province: '廣東', longitude: 114.0579, latitude: 22.5431 },
  { name: '天津', province: '天津', longitude: 117.1906, latitude: 39.1256 },
  { name: '重慶', province: '重慶', longitude: 106.5516, latitude: 29.5630 },
  { name: '成都', province: '四川', longitude: 104.0665, latitude: 30.5723 },
  { name: '武漢', province: '湖北', longitude: 114.3054, latitude: 30.5931 },
  { name: '南京', province: '江蘇', longitude: 118.7969, latitude: 32.0603 },
  { name: '杭州', province: '浙江', longitude: 120.1551, latitude: 30.2741 },
  { name: '西安', province: '陝西', longitude: 108.9402, latitude: 34.3416 },
  { name: '蘇州', province: '江蘇', longitude: 120.6195, latitude: 31.2989 },
  { name: '鄭州', province: '河南', longitude: 113.6254, latitude: 34.7466 },
  { name: '長沙', province: '湖南', longitude: 112.9388, latitude: 28.2278 },
  { name: '青島', province: '山東', longitude: 120.3826, latitude: 36.0671 },
  { name: '大連', province: '遼寧', longitude: 121.6147, latitude: 38.9140 },
  { name: '瀋陽', province: '遼寧', longitude: 123.4315, latitude: 41.8057 },
  { name: '哈爾濱', province: '黑龍江', longitude: 126.5340, latitude: 45.8038 },
  { name: '長春', province: '吉林', longitude: 125.3235, latitude: 43.8171 },
  { name: '濟南', province: '山東', longitude: 117.1205, latitude: 36.6512 },
  { name: '福州', province: '福建', longitude: 119.3063, latitude: 26.0753 },
  { name: '廈門', province: '福建', longitude: 118.0894, latitude: 24.4798 },
  { name: '昆明', province: '雲南', longitude: 102.8329, latitude: 24.8801 },
  { name: '貴陽', province: '貴州', longitude: 106.6302, latitude: 26.6477 },
  { name: '南寧', province: '廣西', longitude: 108.3665, latitude: 22.8170 },
  { name: '蘭州', province: '甘肅', longitude: 103.8343, latitude: 36.0611 },
  { name: '烏魯木齊', province: '新疆', longitude: 87.6168, latitude: 43.8256 },
  { name: '拉薩', province: '西藏', longitude: 91.1322, latitude: 29.6600 },
  { name: '呼和浩特', province: '內蒙古', longitude: 111.7489, latitude: 40.8426 },
  { name: '香港', province: '香港', longitude: 114.1694, latitude: 22.3193 },
  { name: '澳門', province: '澳門', longitude: 113.5439, latitude: 22.1987 },
];

/**
 * 時區標準經度
 * 東八區（北京時間、台北時間）= 120°E
 */
const STANDARD_LONGITUDE = 120;

/**
 * 地支與時辰對照
 */
const HOUR_BRANCHES: Array<{ zhi: string; start: number; end: number }> = [
  { zhi: '子', start: 23, end: 1 },
  { zhi: '丑', start: 1, end: 3 },
  { zhi: '寅', start: 3, end: 5 },
  { zhi: '卯', start: 5, end: 7 },
  { zhi: '辰', start: 7, end: 9 },
  { zhi: '巳', start: 9, end: 11 },
  { zhi: '午', start: 11, end: 13 },
  { zhi: '未', start: 13, end: 15 },
  { zhi: '申', start: 15, end: 17 },
  { zhi: '酉', start: 17, end: 19 },
  { zhi: '戌', start: 19, end: 21 },
  { zhi: '亥', start: 21, end: 23 },
];

/**
 * 計算均時差（Equation of Time）
 * 這是真太陽時與平太陽時之間的差異，由地球橢圓軌道和地軸傾斜造成
 *
 * @param dayOfYear - 一年中的第幾天（1-365/366）
 * @returns 均時差（分鐘），正值表示真太陽時比平太陽時快
 */
export function calculateEquationOfTime(dayOfYear: number): number {
  // 使用近似公式計算均時差
  // B = 360/365 * (N - 81)，其中 N 是一年中的第幾天
  const B = (360 / 365) * (dayOfYear - 81);
  const BRad = B * Math.PI / 180;

  // 均時差公式（分鐘）
  // EoT = 9.87 * sin(2B) - 7.53 * cos(B) - 1.5 * sin(B)
  const eot = 9.87 * Math.sin(2 * BRad) - 7.53 * Math.cos(BRad) - 1.5 * Math.sin(BRad);

  return eot;
}

/**
 * 計算一年中的第幾天
 */
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * 計算經度校正（分鐘）
 * 每度經度差對應 4 分鐘時間差
 *
 * @param longitude - 當地經度
 * @param standardLongitude - 時區標準經度（東八區為120°）
 * @returns 經度校正值（分鐘），正值表示當地比標準時間早
 */
export function calculateLongitudeCorrection(
  longitude: number,
  standardLongitude: number = STANDARD_LONGITUDE
): number {
  return (longitude - standardLongitude) * 4;
}

/**
 * 根據小時獲取時辰地支
 */
export function getHourBranch(hour: number): string {
  if (hour >= 23 || hour < 1) return '子';
  if (hour >= 1 && hour < 3) return '丑';
  if (hour >= 3 && hour < 5) return '寅';
  if (hour >= 5 && hour < 7) return '卯';
  if (hour >= 7 && hour < 9) return '辰';
  if (hour >= 9 && hour < 11) return '巳';
  if (hour >= 11 && hour < 13) return '午';
  if (hour >= 13 && hour < 15) return '未';
  if (hour >= 15 && hour < 17) return '申';
  if (hour >= 17 && hour < 19) return '酉';
  if (hour >= 19 && hour < 21) return '戌';
  return '亥';
}

/**
 * 計算真太陽時
 *
 * @param date - 標準時間（北京時間/台北時間）
 * @param longitude - 出生地經度
 * @returns 真太陽時結果
 */
export function calculateTrueSolarTime(date: Date, longitude: number): TrueSolarTimeResult {
  // 1. 計算經度校正
  const longitudeCorrection = calculateLongitudeCorrection(longitude);

  // 2. 計算均時差
  const dayOfYear = getDayOfYear(date);
  const equationOfTime = calculateEquationOfTime(dayOfYear);

  // 3. 總校正時間（分鐘）
  // 真太陽時 = 標準時間 + 經度校正 + 均時差
  const totalCorrection = longitudeCorrection + equationOfTime;

  // 4. 計算真太陽時
  const trueSolarTime = new Date(date.getTime() + totalCorrection * 60 * 1000);

  // 5. 判斷時辰是否改變
  const originalHour = date.getHours() + date.getMinutes() / 60;
  const correctedHour = trueSolarTime.getHours() + trueSolarTime.getMinutes() / 60;

  const originalHourBranch = getHourBranch(Math.floor(originalHour));
  const correctedHourBranch = getHourBranch(Math.floor(correctedHour));

  const hourBranchChanged = originalHourBranch !== correctedHourBranch;

  // 6. 生成描述
  let description = '';
  if (Math.abs(totalCorrection) < 1) {
    description = '時間校正量極小，對時辰判定影響不大。';
  } else if (hourBranchChanged) {
    description = `經校正後，時辰由「${originalHourBranch}時」變為「${correctedHourBranch}時」，這會影響八字的時柱。`;
  } else {
    description = `雖有時間校正（${Math.round(totalCorrection)}分鐘），但時辰仍為「${correctedHourBranch}時」。`;
  }

  return {
    originalTime: date,
    trueSolarTime,
    timeDifference: totalCorrection,
    longitudeCorrection,
    equationOfTime,
    description,
    hourBranchChanged,
    originalHourBranch,
    correctedHourBranch,
  };
}

/**
 * 根據城市名稱查找城市資料
 */
export function findCityByName(cityName: string): CityData | undefined {
  return CITY_COORDINATES.find(city =>
    city.name === cityName ||
    city.name.includes(cityName) ||
    cityName.includes(city.name)
  );
}

/**
 * 根據省份獲取所有城市
 */
export function getCitiesByProvince(province: string): CityData[] {
  return CITY_COORDINATES.filter(city => city.province === province);
}

/**
 * 獲取所有省份列表
 */
export function getAllProvinces(): string[] {
  return [...new Set(CITY_COORDINATES.map(city => city.province))];
}

/**
 * 格式化時間差異
 */
export function formatTimeDifference(minutes: number): string {
  const absMinutes = Math.abs(minutes);
  const sign = minutes >= 0 ? '快' : '慢';

  if (absMinutes < 1) {
    return '幾乎無差異';
  } else if (absMinutes < 60) {
    return `${sign}${Math.round(absMinutes)}分鐘`;
  } else {
    const hours = Math.floor(absMinutes / 60);
    const mins = Math.round(absMinutes % 60);
    return `${sign}${hours}小時${mins}分鐘`;
  }
}

/**
 * 真太陽時校正結果的詳細說明
 */
export function getTrueSolarTimeExplanation(result: TrueSolarTimeResult): string[] {
  const explanations: string[] = [];

  explanations.push(`原始時間：${formatTime(result.originalTime)}`);
  explanations.push(`真太陽時：${formatTime(result.trueSolarTime)}`);

  const longSign = result.longitudeCorrection >= 0 ? '+' : '';
  explanations.push(`經度校正：${longSign}${result.longitudeCorrection.toFixed(1)}分鐘`);

  const eotSign = result.equationOfTime >= 0 ? '+' : '';
  explanations.push(`均時差校正：${eotSign}${result.equationOfTime.toFixed(1)}分鐘`);

  explanations.push(`總校正量：${formatTimeDifference(result.timeDifference)}`);

  if (result.hourBranchChanged) {
    explanations.push(`⚠️ 時辰改變：${result.originalHourBranch}時 → ${result.correctedHourBranch}時`);
    explanations.push('建議使用真太陽時排盤，以獲得更準確的命理分析。');
  } else {
    explanations.push(`時辰不變：${result.correctedHourBranch}時`);
  }

  return explanations;
}

/**
 * 格式化時間
 */
function formatTime(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${
    date.getHours().toString().padStart(2, '0')}:${
    date.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * 真太陽時校正建議
 */
export function getTrueSolarTimeAdvice(result: TrueSolarTimeResult): string[] {
  const advice: string[] = [];

  if (result.hourBranchChanged) {
    advice.push('真太陽時校正導致時辰改變，強烈建議使用校正後的時辰排盤。');
    advice.push('時柱的改變會影響十神關係、六親宮位等重要判斷。');
    advice.push('特別是在交界時刻（如凌晨、正午前後）出生者，務必注意真太陽時。');
  } else if (Math.abs(result.timeDifference) > 30) {
    advice.push('雖然時辰未改變，但校正量較大，建議仍以真太陽時為準。');
  } else {
    advice.push('校正量較小，對命理判斷影響不大。');
  }

  // 特殊情況提醒
  if (Math.abs(result.longitudeCorrection) > 30) {
    advice.push('您所在地區與標準時區經度差異較大，真太陽時校正尤為重要。');
  }

  return advice;
}

/**
 * 快速判斷是否需要真太陽時校正
 * 當出生時間接近時辰交界時，校正尤為重要
 */
export function needsTrueSolarTimeCorrection(
  hour: number,
  minute: number,
  longitude: number
): { needsCorrection: boolean; reason: string } {
  // 時辰交界點（奇數小時為交界）
  const isNearBoundary = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23].some(h => {
    const diff = Math.abs(hour - h) * 60 + minute;
    return diff <= 30; // 交界前後30分鐘
  });

  // 經度偏離較大
  const longitudeDiff = Math.abs(longitude - STANDARD_LONGITUDE);
  const hasLargeLongitudeDiff = longitudeDiff > 7.5; // 超過30分鐘時差

  if (isNearBoundary && hasLargeLongitudeDiff) {
    return {
      needsCorrection: true,
      reason: '出生時間接近時辰交界，且所在地經度偏離較大，強烈建議進行真太陽時校正。',
    };
  } else if (isNearBoundary) {
    return {
      needsCorrection: true,
      reason: '出生時間接近時辰交界，建議進行真太陽時校正以確保時柱準確。',
    };
  } else if (hasLargeLongitudeDiff) {
    return {
      needsCorrection: true,
      reason: '所在地經度與標準時區差異較大，建議進行真太陽時校正。',
    };
  }

  return {
    needsCorrection: false,
    reason: '時間未接近時辰交界，且經度偏離不大，真太陽時校正影響較小。',
  };
}
