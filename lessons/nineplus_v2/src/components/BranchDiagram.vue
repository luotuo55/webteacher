<template>
  <div class="branch-diagram">
    <h3>分解填充 - 枝形图</h3>
    <div class="instruction">
      <p>拖拽数字填入枝形图的方框中</p>
    </div>

    <div class="diagram-container">
      <div class="diagram">
        <div class="top-formula">
          <span class="num">{{ problem.num1 }}</span>
          <span class="operator">+</span>
          <span class="num">{{ problem.num2 }}</span>
          <span class="equals">=</span>
          <span class="box result-box">{{ result || '□' }}</span>
        </div>

        <div class="branch">
          <div class="branch-line"></div>
          <div class="branch-content">
            <div 
              class="drop-zone"
              :class="{ 'drag-over': dragOver1, 'filled': filled1 }"
              @dragover.prevent="dragOver1 = true"
              @dragleave="dragOver1 = false"
              @drop="handleDrop($event, 1)"
            >
              <span class="box">{{ filled1 || '□' }}</span>
            </div>
            <span class="operator">+</span>
            <div 
              class="drop-zone"
              :class="{ 'drag-over': dragOver2, 'filled': filled2 }"
              @dragover.prevent="dragOver2 = true"
              @dragleave="dragOver2 = false"
              @drop="handleDrop($event, 2)"
            >
              <span class="box">{{ filled2 || '□' }}</span>
            </div>
          </div>
          <div v-if="showTen" class="ten-label">10</div>
        </div>
      </div>

      <div class="number-pool">
        <div 
          v-for="num in availableNumbers" 
          :key="num"
          class="number-chip"
          :class="{ 'used': usedNumbers.includes(num) }"
          draggable="true"
          @dragstart="handleDragStart($event, num)"
          @dragend="handleDragEnd"
        >
          {{ num }}
        </div>
      </div>
    </div>

    <div v-if="showFeedback" class="feedback">
      <div v-if="isCorrect" class="feedback-correct">
        ✓ 正确！{{ problem.num1 }} + {{ filled1 }} = 10，10 + {{ filled2 }} = {{ result }}
      </div>
      <div v-else class="feedback-error">
        ✗ 再想想，{{ problem.num1 }}需要几才能变成10呢？
        <button @click="playHint" class="btn-hint">💡 提示</button>
      </div>
    </div>

    <div v-if="showTransform" class="transform-box">
      <p class="transform-text">转化：</p>
      <div class="transform-formula">
        <span>{{ problem.num1 }} + {{ problem.num2 }} = {{ result }}</span>
        <span class="arrow">→</span>
        <span>10 + {{ filled2 }} = {{ result }}</span>
      </div>
      <button @click="handleNext" class="btn-next">继续</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  problem: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['next'])

const filled1 = ref(null)
const filled2 = ref(null)
const usedNumbers = ref([])
const dragOver1 = ref(false)
const dragOver2 = ref(false)
const showFeedback = ref(false)
const showTen = ref(false)
const showTransform = ref(false)

const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const result = computed(() => {
  if (filled1.value && filled2.value) {
    return props.problem.num1 + props.problem.num2
  }
  return null
})

const isCorrect = computed(() => {
  const expected1 = 10 - props.problem.num1
  const expected2 = props.problem.num2 - expected1
  return filled1.value === expected1 && filled2.value === expected2
})

watch([filled1, filled2], () => {
  if (filled1.value && filled2.value) {
    showFeedback.value = true
    
    if (isCorrect.value) {
      showTen.value = true
      setTimeout(() => {
        showTransform.value = true
      }, 1000)
    } else {
      setTimeout(() => {
        showFeedback.value = false
      }, 3000)
    }
  }
})

const handleDragStart = (event, num) => {
  if (usedNumbers.value.includes(num)) {
    event.preventDefault()
    return
  }
  event.dataTransfer.setData('number', num)
}

const handleDragEnd = () => {
  dragOver1.value = false
  dragOver2.value = false
}

const handleDrop = (event, position) => {
  event.preventDefault()
  const num = parseInt(event.dataTransfer.getData('number'))
  
  if (position === 1 && !filled1.value) {
    filled1.value = num
    if (!usedNumbers.value.includes(num)) {
      usedNumbers.value.push(num)
    }
  } else if (position === 2 && !filled2.value) {
    filled2.value = num
    if (!usedNumbers.value.includes(num)) {
      usedNumbers.value.push(num)
    }
  }
  
  dragOver1.value = false
  dragOver2.value = false
}

const playHint = () => {
  const hint = `${props.problem.num1}需要${10 - props.problem.num1}才能变成10呢？看左边的图找找答案吧！`
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(hint)
    utterance.lang = 'zh-CN'
    speechSynthesis.speak(utterance)
  } else {
    alert(hint)
  }
}

const handleNext = () => {
  emit('next')
}
</script>

<style scoped>
.branch-diagram {
  padding: 20px;
}

.branch-diagram h3 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 22px;
}

.instruction {
  text-align: center;
  margin-bottom: 30px;
  color: #666;
  font-size: 16px;
}

.diagram-container {
  position: relative;
  min-height: 400px;
}

.diagram {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.top-formula {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 32px;
  margin-bottom: 30px;
}

.num {
  font-weight: bold;
  color: #333;
}

.operator, .equals {
  color: #666;
  font-weight: bold;
}

.box {
  display: inline-block;
  width: 60px;
  height: 60px;
  border: 3px solid #667eea;
  border-radius: 10px;
  text-align: center;
  line-height: 54px;
  font-size: 28px;
  font-weight: bold;
  color: #667eea;
  background: white;
}

.result-box {
  min-width: 60px;
}

.branch {
  position: relative;
  margin-top: 20px;
}

.branch-line {
  width: 2px;
  height: 40px;
  background: #667eea;
  margin: 0 auto;
}

.branch-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
  font-size: 28px;
}

.drop-zone {
  display: inline-block;
  padding: 5px;
  border-radius: 10px;
  transition: all 0.3s;
}

.drop-zone.drag-over {
  background: #e3f2fd;
  transform: scale(1.1);
}

.drop-zone.filled .box {
  background: #e3f2fd;
  color: #1976d2;
  border-color: #1976d2;
}

.ten-label {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffc107;
  color: #333;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 18px;
  animation: popIn 0.5s ease-out;
}

.number-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
}

.number-chip {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  cursor: move;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}

.number-chip:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(102, 126, 234, 0.5);
}

.number-chip.used {
  opacity: 0.3;
  cursor: not-allowed;
}

.feedback {
  margin-top: 20px;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  font-size: 18px;
  animation: slideDown 0.3s ease-out;
}

.feedback-correct {
  background: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
}

.feedback-error {
  background: #f8d7da;
  color: #721c24;
  border: 2px solid #f5c6cb;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-hint {
  padding: 5px 15px;
  font-size: 14px;
  background: #ffc107;
  color: #333;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-hint:hover {
  background: #ffb300;
  transform: scale(1.05);
}

.transform-box {
  margin-top: 30px;
  padding: 25px;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border-radius: 15px;
  text-align: center;
  animation: slideUp 0.5s ease-out;
  border: 3px solid #2196f3;
}

.transform-text {
  font-size: 18px;
  color: #1976d2;
  font-weight: bold;
  margin-bottom: 15px;
}

.transform-formula {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 24px;
  color: #333;
  margin: 15px 0;
  flex-wrap: wrap;
}

.arrow {
  font-size: 32px;
  color: #2196f3;
  font-weight: bold;
}

.btn-next {
  margin-top: 15px;
  padding: 10px 30px;
  font-size: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-next:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@keyframes popIn {
  0% {
    transform: translateX(-50%) scale(0);
  }
  50% {
    transform: translateX(-50%) scale(1.2);
  }
  100% {
    transform: translateX(-50%) scale(1);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


