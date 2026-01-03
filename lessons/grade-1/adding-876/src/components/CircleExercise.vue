<template>
  <div class="circle-exercise">
    <h3>圈一圈，算一算</h3>

    <!-- 练习1：7加几 -->
    <div v-if="currentExercise === 1" class="exercise">
      <div class="exercise-title">练习1：7 + 4</div>
      <div class="instruction-text">
        <p>将7个圆点和右侧的3个圆点圈在一起凑成10</p>
      </div>
      <div class="dots-container">
        <div class="dots-group">
          <div 
            v-for="i in 7" 
            :key="i"
            class="dot brown"
            :class="{ 'circled': isCircled(i, 1) }"
            @click="toggleCircle(i, 1)"
          ></div>
        </div>
        <div class="dots-group">
          <div 
            v-for="i in 4" 
            :key="i + 7"
            class="dot brown"
            :class="{ 'circled': isCircled(i + 7, 1) }"
            @click="toggleCircle(i + 7, 1)"
          ></div>
        </div>
      </div>

      <div v-if="checkCircleComplete(1)" class="branch-exercise">
        <p class="next-instruction">现在完成枝形图：</p>
        <BranchDiagram 
          :problem="{ num1: 7, num2: 4 }"
          @next="currentExercise = 2"
        />
      </div>
    </div>

    <!-- 练习2：6加几 -->
    <div v-if="currentExercise === 2" class="exercise">
      <div class="exercise-title">练习2：6 + 5</div>
      <div class="instruction-text">
        <p>将6瓶和右侧的4瓶圈在一起凑成10</p>
      </div>
      <div class="bottles-container">
        <div class="bottles-group">
          <div 
            v-for="i in 6" 
            :key="i"
            class="bottle"
            :class="{ 'circled': isCircled(i, 2) }"
            @click="toggleCircle(i, 2)"
          ></div>
        </div>
        <div class="bottles-group">
          <div 
            v-for="i in 5" 
            :key="i + 6"
            class="bottle"
            :class="{ 'circled': isCircled(i + 6, 2) }"
            @click="toggleCircle(i + 6, 2)"
          ></div>
        </div>
      </div>

      <div v-if="checkCircleComplete(2)" class="branch-exercise">
        <p class="next-instruction">现在完成枝形图：</p>
        <BranchDiagram 
          :problem="{ num1: 6, num2: 5 }"
          @next="handleComplete"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BranchDiagram from './BranchDiagram.vue'

const emit = defineEmits(['next'])

const currentExercise = ref(1)
const circledItems = ref({
  1: [],
  2: []
})

const isCircled = (index, exercise) => {
  return circledItems.value[exercise].includes(index)
}

const toggleCircle = (index, exercise) => {
  const items = circledItems.value[exercise]
  const idx = items.indexOf(index)
  if (idx > -1) {
    items.splice(idx, 1)
  } else {
    items.push(index)
  }
}

const checkCircleComplete = (exercise) => {
  if (exercise === 1) {
    // 7个圆点 + 右侧3个圆点 = 10个
    const leftCircled = circledItems.value[1].filter(i => i <= 7).length
    const rightCircled = circledItems.value[1].filter(i => i > 7).length
    return leftCircled === 7 && rightCircled === 3
  } else if (exercise === 2) {
    // 6瓶 + 右侧4瓶 = 10瓶
    const leftCircled = circledItems.value[2].filter(i => i <= 6).length
    const rightCircled = circledItems.value[2].filter(i => i > 6).length
    return leftCircled === 6 && rightCircled === 4
  }
  return false
}

const handleComplete = () => {
  emit('next')
}
</script>

<style scoped>
.circle-exercise {
  padding: 20px;
}

.circle-exercise h3 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 22px;
}

.exercise {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.exercise-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 15px;
}

.instruction-text {
  text-align: center;
  margin-bottom: 20px;
  color: #666;
  font-size: 16px;
}

.dots-container, .bottles-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.dots-group, .bottles-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  max-width: 400px;
}

.dot {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.dot.brown {
  background: #8B4513;
  box-shadow: 0 2px 8px rgba(139, 69, 19, 0.3);
}

.dot.circled {
  border: 4px solid #ffc107;
  box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.3);
  animation: circlePulse 1s infinite;
}

.bottle {
  width: 40px;
  height: 60px;
  background: linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%);
  border-radius: 5px 5px 0 0;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.bottle::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 8px;
  background: #2E7D32;
  border-radius: 3px 3px 0 0;
}

.bottle.circled {
  border: 4px solid #ffc107;
  box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.3);
  animation: circlePulse 1s infinite;
}

.branch-exercise {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px dashed #e0e0e0;
}

.next-instruction {
  text-align: center;
  font-size: 18px;
  color: #667eea;
  font-weight: bold;
  margin-bottom: 20px;
}

@keyframes circlePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>


