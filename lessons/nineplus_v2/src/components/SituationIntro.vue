<template>
  <div class="situation-intro">
    <div class="intro-content">
      <h2>情境导入</h2>
      <div class="image-container">
        <img 
          src="/主题图.png" 
          alt="跑步场景"
          class="theme-image"
          @click="handleImageClick"
        />
        <div v-if="showInfo" class="info-bubble" :class="{ show: showInfo }">
          <p>前面有 <span class="highlight">8</span> 人</p>
          <p>后面有 <span class="highlight">5</span> 人</p>
        </div>
      </div>
      
      <div class="formula-input" v-if="showInfo">
        <p>请列出算式：</p>
        <div class="input-group">
          <input 
            v-model.number="num1" 
            type="number" 
            class="number-input"
            placeholder="8"
          />
          <span class="operator">+</span>
          <input 
            v-model.number="num2" 
            type="number" 
            class="number-input"
            placeholder="5"
          />
          <span class="equals">=</span>
          <span class="result">{{ num1 + num2 || '?' }}</span>
        </div>
        <button 
          v-if="num1 === 8 && num2 === 5" 
          @click="handleNext"
          class="btn-confirm"
        >
          确认 ✓
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['next'])

const showInfo = ref(false)
const num1 = ref(8)
const num2 = ref(5)

const handleImageClick = () => {
  showInfo.value = true
}

const handleNext = () => {
  emit('next')
}
</script>

<style scoped>
.situation-intro {
  background: white;
  border-radius: 15px;
  padding: 30px;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-content {
  text-align: center;
  width: 100%;
}

.intro-content h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.image-container {
  position: relative;
  margin: 20px 0;
}

.theme-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.theme-image:hover {
  transform: scale(1.05);
}

.info-bubble {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  background: rgba(255, 255, 255, 0.95);
  padding: 20px 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: all 0.3s;
}

.info-bubble.show {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.info-bubble p {
  margin: 10px 0;
  font-size: 18px;
  color: #333;
}

.highlight {
  color: #667eea;
  font-weight: bold;
  font-size: 24px;
}

.formula-input {
  margin-top: 30px;
  animation: fadeIn 0.5s;
}

.formula-input p {
  font-size: 18px;
  color: #666;
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
}

.number-input {
  width: 80px;
  height: 60px;
  font-size: 32px;
  text-align: center;
  border: 3px solid #667eea;
  border-radius: 10px;
  outline: none;
}

.operator, .equals {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.result {
  font-size: 32px;
  font-weight: bold;
  color: #667eea;
  min-width: 60px;
}

.btn-confirm {
  margin-top: 20px;
  padding: 12px 40px;
  font-size: 18px;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


