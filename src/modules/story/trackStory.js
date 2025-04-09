import { getModule } from '../get-module'
import { log, uniqueStoryId } from '../../utils/index'
import transCover from '../../utils/transCoverHtml'
import { getTextTrans, getSelectTrans } from './utils'
import config from '../../config'

let storyMap = null
let commMap = null
let newStory = true
let getId = null

export function setStoryMap(val1, val2) {
  storyMap = val1
  commMap = val2
}

// --- 配置你的通知函数 ---
function handleTrackChange(instance, newValue, oldValue) {
  log('%cTrack changed!', 'color: green; font-weight: bold;');
  log('  New Value:', newValue);
  // 在这里添加你自己的通知逻辑
  if (!storyMap || !newValue) return
  if (newStory) {
    getId = uniqueStoryId()
    newStory = false
  }
  if (newValue.label === 'end') {
    newStory = true
    transCover('')
  }
  if (newValue.text) {
    const trans = getTextTrans(getId, storyMap, commMap, newValue)
    transCover(trans)
  }
  if (newValue.textFrame === 'off') {
    transCover('')
  }
}

// 使用 WeakMap 来存储每个实例最后一次读取到的 track 值
// WeakMap 的好处是当实例被垃圾回收时，对应的键值对也会自动移除，不会造成内存泄漏
const lastTrackValues = new WeakMap();

function start() {
  const checkInterval = setInterval(async () => {
    try {
      const TrackManager = await getModule('TRACK_MANAGER');

      if (TrackManager && TrackManager.prototype) {
        clearInterval(checkInterval); // 找到对象，停止轮询
        log("TrackManager found. Proceeding to modify getter.");

        const proto = TrackManager.prototype;
        const propertyName = 'currentTrack';

        const originalDescriptor = Object.getOwnPropertyDescriptor(proto, propertyName);

        if (!originalDescriptor || typeof originalDescriptor.get !== 'function') {
          console.error(`Property '${propertyName}' or its getter not found on TrackManager prototype.`);
          // 如果连 getter 都没有，这种监控方式也行不通
          return;
        }

        log(`Original descriptor for '${propertyName}':`, originalDescriptor);
        const originalGetter = originalDescriptor.get;

        Object.defineProperty(proto, propertyName, {
          get: function () {
            // 1. 调用原始 getter 获取当前值
            let currentValue;
            try {
              currentValue = originalGetter.call(this);
            } catch (e) {
              log(`Error calling original getter for ${propertyName}:`, e);
              // 根据情况决定如何处理错误，是返回 undefined 还是抛出异常
              // 这里我们假设 getter 失败意味着值不可用
              currentValue = undefined;
            }

            // 2. 从 WeakMap 获取上次记录的值
            const oldValue = lastTrackValues.get(this);

            // 3. 比较当前值和上次记录的值
            if (currentValue !== oldValue) {
              // 值发生了变化 (包括第一次从 undefined 变为初始值)
              handleTrackChange(this, currentValue, oldValue);

              // 4. 更新 WeakMap 中该实例的值
              lastTrackValues.set(this, currentValue);
            }

            // 5. 返回当前值
            return currentValue;
          },
          // 我们只重写 getter。如果原始描述符有 setter，保留它，否则不添加。
          // 如果需要确保原始 setter 行为不变（虽然上次测试表明它可能不被直接使用），
          // 可以像这样包含它：
          set: originalDescriptor.set, // 直接引用原始 setter (如果存在)

          enumerable: originalDescriptor.enumerable, // 保持原始的可枚举性
          configurable: true // 保持可配置
        });

        log(`Successfully redefined getter for '${propertyName}' on TrackManager.prototype.`);

        // --- 可选：移除之前的方法包装 (如果不再需要) ---
        // 如果你不再需要基于特定方法调用的日志，可以移除之前的 forEach 循环
        // 否则，你可以保留它，但 handleTrackChange 可能会被触发两次（一次通过 getter，一次通过方法包装）
        // 建议只保留一种策略，Getter 包装通常更全面。
        // ------------------------------------------------

      } else {
        log("TrackManager or its prototype not found yet, waiting...");
      }
    } catch (error) {
      log("Error during TrackManager check/modification:", error);
    }
  }, 500);

  // 设置一个超时
  setTimeout(() => {
    if (checkInterval) {
      clearInterval(checkInterval);
      log("Stopped checking for TrackManager after timeout.");
    }
  }, 30000);
}

if (config.transCover === 'on') {
  start()
}