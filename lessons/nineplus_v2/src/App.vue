<template>
  <div class="course-container">
    <div class="course-header">
      <h1>8、7、6加几</h1>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <div class="course-content">
      <!-- 模块1：情境导入 -->
      <SituationIntro 
        v-if="currentModule === 1"
        @next="goToModule(2)"
      />

      <!-- 模块2：探究新知 -->
      <div v-if="currentModule === 2" class="module-2">
        <div class="module-tabs">
          <button 
            v-for="(tab, index) in tabs" 
            :key="index"
            :class="{ active: activeTab === index }"
            @click="activeTab = index"
          >
            {{ tab }}
          </button>
        </div>

        <StickAnimation v-if="activeTab === 0" @next="activeTab = 1" />
        <BranchDiagram 
          v-if="activeTab === 1" 
          :problem="{ num1: 8, num2: 5 }"
          @next="activeTab = 2"
        />
        <CircleExercise v-if="activeTab === 2" @next="goToModule(3)" />
      </div>

      <!-- 模块3：巩固练习 -->
      <Consolidation 
        v-if="currentModule === 3"
        @complete="handleComplete"
      />
    </div>

    <div class="course-footer">
      <button v-if="currentModule > 1" @click="goToModule(currentModule - 1)" class="btn-prev">
        上一节
      </button>
      <button v-if="currentModule < 3" @click="goToModule(currentModule + 1)" class="btn-next">
        下一节
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SituationIntro from './components/SituationIntro.vue'
import StickAnimation from './components/StickAnimation.vue'
import BranchDiagram from './components/BranchDiagram.vue'
import CircleExercise from './components/CircleExercise.vue'
import Consolidation from './components/Consolidation.vue'

const currentModule = ref(1)
const activeTab = ref(0)
const tabs = ['小棒图', '枝形图', '圈一圈']

const progress = computed(() => {
  if (currentModule.value === 1) return 33
  if (currentModule.value === 2) return 66
  return 100
})

const goToModule = (module) => {
  currentModule.value = module
  if (module === 2) activeTab.value = 0
}

const handleComplete = () => {
  alert('恭喜你完成了所有练习！')
}
</script>

<style scoped>
.course-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.course-header {
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.course-header h1 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 28px;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transition: width 0.3s ease;
}

.course-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.module-2 {
  background: white;
  border-radius: 15px;
  padding: 20px;
  min-height: 500px;
}

.module-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.module-tabs button {
  padding: 12px 24px;
  border: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.module-tabs button.active {
  color: #667eea;
  border-bottom-color: #667eea;
  font-weight: bold;
}

.course-footer {
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: space-between;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.btn-prev, .btn-next {
  padding: 12px 30px;
  font-size: 16px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-prev {
  background: #f0f0f0;
  color: #333;
}

.btn-prev:hover {
  background: #e0e0e0;
}

.btn-next {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-next:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>


