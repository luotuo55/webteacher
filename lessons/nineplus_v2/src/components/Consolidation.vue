<template>
  <div class="consolidation">
    <h3>巩固练习 - 发现算理联系</h3>
    <div class="instruction">
      <p>完成下面的题目，看看你能发现什么规律？</p>
    </div>

    <div class="exercises">
      <div 
        v-for="(exercise, index) in exercises" 
        :key="index"
        class="exercise-group"
      >
        <div class="exercise-pair">
          <div class="formula">
            <span class="formula-text">{{ exercise.formula1 }}</span>
            <input 
              v-model.number="exercise.answer1" 
              type="number"
              class="answer-input"
              placeholder="?"
            />
          </div>
          <div class="formula">
            <span class="formula-text">{{ exercise.formula2 }}</span>
            <input 
              v-model.number="exercise.answer2" 
              type="number"
              class="answer-input"
              placeholder="?"
            />
          </div>
        </div>
        <div 
          v-if="exercise.answer1 && exercise.answer2"
          class="comparison"
          :class="{ 'match': exercise.answer1 === exercise.answer2 }"
        >
          <span v-if="exercise.answer1 === exercise.answer2" class="match-icon">✓</span>
          <span v-else class="no-match-icon">✗</span>
          <span>{{ exercise.answer1 === exercise.answer2 ? '结果相同' : '结果不同' }}</span>
        </div>
      </div>
    </div>

    <div v-if="allCompleted" class="discovery-section">
      <button @click="showDiscovery = true" class="btn-discover">
        点击发现规律
      </button>
      
      <div v-if="showDiscovery" class="discovery-box">
        <h4>你发现了什么？</h4>
        <p class="discovery-text">
          两道题的结果相同！上面的加法式子其实就是下面凑十的过程。
        </p>
        <div class="examples">
          <div class="example">
            <span>7 + 3 + 3 = 13</span>
            <span class="arrow">→</span>
            <span>7 + 6 = 13</span>
            <span class="explain">（7需要3凑成10，再加3）</span>
          </div>
          <div class="example">
            <span>6 + 4 + 2 = 12</span>
            <span class="arrow">→</span>
            <span>6 + 6 = 12</span>
            <span class="explain">（6需要4凑成10，再加2）</span>
          </div>
          <div class="example">
            <span>8 + 2 + 2 = 12</span>
            <span class="arrow">→</span>
            <span>8 + 4 = 12</span>
            <span class="explain">（8需要2凑成10，再加2）</span>
          </div>
        </div>
        <button @click="handleComplete" class="btn-complete">
          完成练习 ✓
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['complete'])

const exercises = ref([
  { formula1: '7 + 3 + 3 =', formula2: '7 + 6 =', answer1: null, answer2: null, correct1: 13, correct2: 13 },
  { formula1: '6 + 4 + 2 =', formula2: '6 + 6 =', answer1: null, answer2: null, correct1: 12, correct2: 12 },
  { formula1: '8 + 2 + 2 =', formula2: '8 + 4 =', answer1: null, answer2: null, correct1: 12, correct2: 12 }
])

const showDiscovery = ref(false)

const allCompleted = computed(() => {
  return exercises.value.every(ex => ex.answer1 && ex.answer2)
})

const handleComplete = () => {
  emit('complete')
}
</script>

<style scoped>
.consolidation {
  padding: 20px;
  background: white;
  border-radius: 15px;
  min-height: 500px;
}

.consolidation h3 {
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

.exercises {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.exercise-group {
  padding: 25px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px solid #e9ecef;
}

.exercise-pair {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
}

.formula {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.answer-input {
  width: 80px;
  height: 50px;
  font-size: 24px;
  text-align: center;
  border: 3px solid #667eea;
  border-radius: 8px;
  outline: none;
}

.formula-text {
  color: #333;
  font-weight: bold;
}

.comparison {
  padding: 10px 15px;
  border-radius: 8px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  animation: fadeIn 0.5s;
}

.comparison.match {
  background: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
}

.comparison:not(.match) {
  background: #f8d7da;
  color: #721c24;
  border: 2px solid #f5c6cb;
}

.match-icon {
  color: #28a745;
  font-size: 24px;
  margin-right: 8px;
}

.no-match-icon {
  color: #dc3545;
  font-size: 24px;
  margin-right: 8px;
}

.discovery-section {
  margin-top: 40px;
  text-align: center;
}

.btn-discover {
  padding: 15px 40px;
  font-size: 18px;
  background: linear-gradient(135deg, #ffc107, #ff9800);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4);
}

.btn-discover:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.6);
}

.discovery-box {
  margin-top: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border-radius: 15px;
  border: 3px solid #2196f3;
  animation: slideUp 0.5s ease-out;
}

.discovery-box h4 {
  color: #1976d2;
  font-size: 24px;
  margin-bottom: 20px;
}

.discovery-text {
  font-size: 20px;
  color: #333;
  font-weight: bold;
  margin-bottom: 25px;
  line-height: 1.6;
}

.examples {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 25px 0;
}

.example {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  font-size: 18px;
  color: #333;
  flex-wrap: wrap;
}

.arrow {
  font-size: 24px;
  color: #2196f3;
  font-weight: bold;
}

.explain {
  color: #666;
  font-size: 14px;
  font-style: italic;
}

.btn-complete {
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

.btn-complete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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


