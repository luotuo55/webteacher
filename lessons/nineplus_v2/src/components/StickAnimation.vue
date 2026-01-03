<template>
  <div class="stick-animation">
    <h3>虚拟搬运 - 小棒图</h3>
    <div class="instruction">
      <p>点击右侧的2根小棒，移动到左侧凑成10根</p>
    </div>
    
    <div class="sticks-container">
      <div class="sticks-left">
        <div 
          v-for="i in leftSticks" 
          :key="i"
          class="stick"
          :class="{ 'new-stick': i > 8 }"
        ></div>
        <div class="label">8根</div>
      </div>
      
      <div class="sticks-right">
        <div 
          v-for="i in rightSticks" 
          :key="i"
          class="stick"
          :class="{ 
            'clickable': !hasMoved && i <= 2,
            'moving': isMoving && i <= 2,
            'hidden': hasMoved && i <= 2
          }"
          @click="moveSticks"
        ></div>
        <div class="label">5根</div>
      </div>
    </div>

    <div v-if="showTip" class="tip-box">
      <p class="tip-text">想：8加2得10，10加3得13</p>
      <div class="result-display">
        <span class="formula">8 + 5 = 13</span>
      </div>
      <button @click="handleNext" class="btn-next">继续</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['next'])

const leftSticks = ref(8)
const rightSticks = ref(5)
const hasMoved = ref(false)
const isMoving = ref(false)
const showTip = ref(false)

const moveSticks = () => {
  if (hasMoved.value) return
  
  isMoving.value = true
  
  setTimeout(() => {
    leftSticks.value = 10
    rightSticks.value = 3
    hasMoved.value = true
    isMoving.value = false
    
    setTimeout(() => {
      showTip.value = true
    }, 500)
  }, 800)
}

const handleNext = () => {
  emit('next')
}
</script>

<style scoped>
.stick-animation {
  padding: 20px;
}

.stick-animation h3 {
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

.sticks-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 300px;
  margin: 40px 0;
}

.sticks-left, .sticks-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  max-width: 200px;
  min-height: 250px;
}

.stick {
  width: 8px;
  height: 60px;
  background: linear-gradient(180deg, #8B4513, #654321);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.stick.clickable {
  cursor: pointer;
  animation: pulse 1.5s infinite;
}

.stick.clickable:hover {
  transform: scale(1.2);
  background: linear-gradient(180deg, #A0522D, #8B4513);
}

.stick.moving {
  animation: moveToLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.stick.hidden {
  opacity: 0;
  transform: scale(0);
}

.stick.new-stick {
  animation: appear 0.5s ease-out;
}

.label {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.tip-box {
  margin-top: 40px;
  padding: 25px;
  background: linear-gradient(135deg, #fff3cd, #ffe69c);
  border-radius: 15px;
  text-align: center;
  animation: slideUp 0.5s ease-out;
  border: 3px solid #ffc107;
}

.tip-text {
  font-size: 20px;
  color: #856404;
  margin-bottom: 15px;
  font-weight: bold;
}

.result-display {
  margin: 20px 0;
}

.formula {
  font-size: 32px;
  color: #667eea;
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

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

@keyframes moveToLeft {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-300px) translateY(0);
    opacity: 0;
  }
}

@keyframes appear {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
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


