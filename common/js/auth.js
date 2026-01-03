/**
 * H5 课件认证系统
 * 自动检测课程解锁状态，未解锁时显示付费浮层
 */

(function() {
  'use strict';

  // 获取课程ID
  const COURSE_ID = window.COURSE_ID;
  if (!COURSE_ID) {
    console.warn('未设置 COURSE_ID，认证功能将不会生效');
    return;
  }

  // localStorage 键名
  const STORAGE_KEY = `course_unlocked_${COURSE_ID}`;
  const ORDER_NO_KEY = 'verified_order_no'; // 保存已验证的订单号
  
  // 获取爱发电链接（可以从 window.AFDIAN_URL 配置，或使用默认值）
  // 默认链接：如果课程没有配置专属链接，使用这个默认链接
  const AFDIAN_URL = window.AFDIAN_URL || 'https://afdian.com/p/9c65d9cc617011ed81c352540025c377';

  /**
   * 检查课程是否已解锁
   */
  function isUnlocked() {
    const unlocked = localStorage.getItem(STORAGE_KEY);
    return unlocked === 'true';
  }

  /**
   * 标记课程为已解锁
   */
  function unlockCourse() {
    localStorage.setItem(STORAGE_KEY, 'true');
  }

  /**
   * 保存已验证的订单号
   * @param {string} orderNo - 订单号
   */
  function saveOrderNo(orderNo) {
    if (orderNo) {
      localStorage.setItem(ORDER_NO_KEY, orderNo);
    }
  }

  /**
   * 获取已保存的订单号
   * @returns {string|null}
   */
  function getSavedOrderNo() {
    return localStorage.getItem(ORDER_NO_KEY);
  }

  /**
   * 创建解锁浮层
   */
  function createUnlockOverlay() {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.id = 'course-unlock-overlay';
    overlay.className = 'unlock-overlay';

    // 创建弹窗容器
    const modal = document.createElement('div');
    modal.className = 'unlock-modal';

    // 弹窗内容
    modal.innerHTML = `
      <div class="unlock-header">
        <h2>🔒 课程已锁定</h2>
        <p class="unlock-subtitle">请完成付费解锁后继续学习</p>
      </div>
      
      <div class="unlock-content">
        <div class="afdian-info">
          <p class="info-title">💡 解锁方式</p>
          <p class="info-text">点击下方按钮前往爱发电完成购买，支付完成后返回页面输入订单号验证</p>
        </div>

        <div class="purchase-section">
          <a href="${AFDIAN_URL}" target="_blank" rel="noopener" class="purchase-btn" id="purchase-link-btn">
            <span class="btn-icon">💳</span>
            <span class="btn-text">立即购买解锁</span>
          </a>
          <p class="purchase-tip">支付完成后，请返回此页面点击下方按钮自动检测</p>
        </div>

        <div class="auto-verify-section">
          <button id="auto-verify-btn" class="auto-verify-btn">
            <span class="btn-icon">✅</span>
            <span class="btn-text">我已支付，自动检测</span>
            <span class="btn-loading-auto" style="display: none;">检测中...</span>
          </button>
          <p class="auto-verify-tip">系统将自动检测您的订单并解锁课程</p>
        </div>

        <div class="verify-section">
          <div class="verify-divider">
            <span>或手动输入订单号</span>
          </div>
          <label for="order-no-input" class="input-label">订单号</label>
          <input 
            type="text" 
            id="order-no-input" 
            class="order-input" 
            placeholder="请输入您的订单号"
            autocomplete="off"
          />
          <div class="error-message" id="error-message"></div>
          <button id="verify-btn" class="verify-btn">
            <span class="btn-text">验证解锁</span>
            <span class="btn-loading" style="display: none;">验证中...</span>
          </button>
        </div>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // 绑定验证按钮事件
    const verifyBtn = document.getElementById('verify-btn');
    const orderInput = document.getElementById('order-no-input');
    const errorMsg = document.getElementById('error-message');
    const autoVerifyBtn = document.getElementById('auto-verify-btn');
    const purchaseLinkBtn = document.getElementById('purchase-link-btn');

    // 记录购买按钮点击时间
    if (purchaseLinkBtn) {
      purchaseLinkBtn.addEventListener('click', function() {
        // 记录点击时间，用于检测用户是否从支付页面返回
        sessionStorage.setItem('purchase_click_time', Date.now().toString());
        sessionStorage.setItem('purchase_course_id', COURSE_ID);
      });
    }

    // 自动检测按钮点击事件
    if (autoVerifyBtn) {
      autoVerifyBtn.addEventListener('click', function() {
        setAutoVerifying(true);
        hideError();
        
        // 自动检测订单
        autoDetectAndVerify()
          .then(function(success) {
            if (success) {
              // 检测成功，已自动解锁，浮层会自动消失
              return;
            } else {
              // 检测失败，提示用户手动输入
              setAutoVerifying(false);
              showError('自动检测失败，请手动输入订单号');
              // 显示输入框区域
              const verifySection = document.querySelector('.verify-section');
              if (verifySection) {
                verifySection.style.display = 'block';
              }
              // 聚焦到输入框
              setTimeout(function() {
                orderInput.focus();
              }, 100);
            }
          })
          .catch(function(error) {
            setAutoVerifying(false);
            showError('检测出错，请手动输入订单号');
            console.error('自动检测错误:', error);
            // 显示输入框区域
            const verifySection = document.querySelector('.verify-section');
            if (verifySection) {
              verifySection.style.display = 'block';
            }
            orderInput.focus();
          });
      });
    }

    // 回车键触发验证
    orderInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        verifyBtn.click();
      }
    });

    // 验证按钮点击事件
    verifyBtn.addEventListener('click', function() {
      const orderNo = orderInput.value.trim();
      
      if (!orderNo) {
        showError('请输入订单号');
        return;
      }

      // 开始验证
      setLoading(true);
      hideError();

      verifyOrder(orderNo, COURSE_ID)
        .then(function(success) {
          if (success) {
            // 保存订单号到 localStorage
            saveOrderNo(orderNo);
            unlockCourse();
            removeOverlay();
            // 触发自定义事件，通知页面已解锁
            window.dispatchEvent(new CustomEvent('courseUnlocked', { 
              detail: { courseId: COURSE_ID, orderNo: orderNo } 
            }));
          } else {
            setLoading(false);
            showError('验证失败，请检查订单号是否正确');
          }
        })
        .catch(function(error) {
          setLoading(false);
          showError('验证出错，请稍后重试');
          console.error('验证错误:', error);
        });
    });

    /**
     * 设置加载状态
     */
    function setLoading(loading) {
      const btnText = verifyBtn.querySelector('.btn-text');
      const btnLoading = verifyBtn.querySelector('.btn-loading');
      
      if (loading) {
        verifyBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
      } else {
        verifyBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
      }
    }

    /**
     * 设置自动检测状态
     */
    function setAutoVerifying(verifying) {
      if (!autoVerifyBtn) return;
      
      const btnText = autoVerifyBtn.querySelector('.btn-text');
      const btnLoading = autoVerifyBtn.querySelector('.btn-loading-auto');
      
      if (verifying) {
        autoVerifyBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline';
      } else {
        autoVerifyBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
      }
    }

    /**
     * 自动检测并验证订单
     * @returns {Promise<boolean>}
     */
    function autoDetectAndVerify() {
      return new Promise(function(resolve) {
        // 1. 先检查 URL 参数中是否有订单号
        const urlParams = new URLSearchParams(window.location.search);
        const orderNoFromUrl = urlParams.get('orderNo');
        
        if (orderNoFromUrl) {
          // 从 URL 参数中获取到订单号，自动验证
          verifyOrder(orderNoFromUrl, COURSE_ID)
            .then(function(success) {
              if (success) {
                saveOrderNo(orderNoFromUrl);
                unlockCourse();
                removeOverlay();
                // 清除 URL 参数
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
                // 触发解锁事件
                window.dispatchEvent(new CustomEvent('courseUnlocked', { 
                  detail: { courseId: COURSE_ID, orderNo: orderNoFromUrl, auto: true } 
                }));
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch(function() {
              resolve(false);
            });
          return;
        }

        // 2. 检查是否有已保存的订单号（可能是其他课程验证过的）
        const savedOrderNo = getSavedOrderNo();
        if (savedOrderNo) {
          // 尝试用已保存的订单号验证当前课程
          verifyOrder(savedOrderNo, COURSE_ID, true)
            .then(function(success) {
              if (success) {
                unlockCourse();
                removeOverlay();
                window.dispatchEvent(new CustomEvent('courseUnlocked', { 
                  detail: { courseId: COURSE_ID, orderNo: savedOrderNo, auto: true } 
                }));
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch(function() {
              resolve(false);
            });
          return;
        }

        // 3. 检查是否刚刚从支付页面返回
        const purchaseTime = sessionStorage.getItem('purchase_click_time');
        const purchaseCourseId = sessionStorage.getItem('purchase_course_id');
        
        if (purchaseTime && purchaseCourseId === COURSE_ID) {
          const timeSincePurchase = Date.now() - parseInt(purchaseTime);
          // 如果是在5分钟内点击的购买，延迟检测（给订单处理时间）
          if (timeSincePurchase < 300000) { // 5分钟
            // 延迟一下再检测，给订单处理一些时间
            setTimeout(function() {
              // 再次检查 URL 参数（可能用户是通过回调返回的）
              const newUrlParams = new URLSearchParams(window.location.search);
              const newOrderNo = newUrlParams.get('orderNo');
              
              if (newOrderNo) {
                verifyOrder(newOrderNo, COURSE_ID)
                  .then(function(success) {
                    if (success) {
                      saveOrderNo(newOrderNo);
                      unlockCourse();
                      removeOverlay();
                      window.history.replaceState({}, '', window.location.pathname);
                      window.dispatchEvent(new CustomEvent('courseUnlocked', { 
                        detail: { courseId: COURSE_ID, orderNo: newOrderNo, auto: true } 
                      }));
                      resolve(true);
                    } else {
                      resolve(false);
                    }
                  })
                  .catch(function() {
                    resolve(false);
                  });
              } else {
                resolve(false);
              }
            }, 2000); // 延迟2秒检测
            return;
          }
        }

        // 4. 如果都没有，返回 false，让用户手动输入
        resolve(false);
      });
    }

    /**
     * 显示错误信息
     */
    function showError(message) {
      errorMsg.textContent = message;
      errorMsg.style.display = 'block';
    }

    /**
     * 隐藏错误信息
     */
    function hideError() {
      errorMsg.style.display = 'none';
    }
  }

  /**
   * 移除浮层
   */
  function removeOverlay() {
    const overlay = document.getElementById('course-unlock-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(function() {
        overlay.remove();
      }, 300);
    }
  }

  /**
   * 验证订单号
   * @param {string} orderNo - 订单号
   * @param {string} courseId - 课程ID
   * @param {boolean} silent - 是否为静默校验（不显示错误）
   * @returns {Promise<boolean>}
   */
  function verifyOrder(orderNo, courseId, silent) {
    silent = silent || false;
    return fetch('/.netlify/functions/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderNo: orderNo,
        courseId: courseId
      })
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('网络请求失败');
      }
      return response.json();
    })
    .then(function(data) {
      return data.success === true;
    })
    .catch(function(error) {
      if (!silent) {
        console.error('验证订单失败:', error);
      }
      return false;
    });
  }

  /**
   * 静默校验订单号
   * 使用已保存的订单号自动校验当前课程
   * @returns {Promise<boolean>}
   */
  function silentVerify() {
    const savedOrderNo = getSavedOrderNo();
    if (!savedOrderNo) {
      return Promise.resolve(false);
    }

    // 静默校验，不显示错误信息
    return verifyOrder(savedOrderNo, COURSE_ID, true)
      .then(function(success) {
        if (success) {
          // 校验成功，自动解锁
          unlockCourse();
          // 触发解锁事件
          window.dispatchEvent(new CustomEvent('courseUnlocked', { 
            detail: { courseId: COURSE_ID, orderNo: savedOrderNo, silent: true } 
          }));
          return true;
        }
        return false;
      });
  }

  /**
   * 从 URL 参数中获取订单号并自动验证
   */
  function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderNoFromUrl = urlParams.get('orderNo');
    
    if (orderNoFromUrl) {
      // 从 URL 参数中获取到订单号，自动验证
      verifyOrder(orderNoFromUrl, COURSE_ID)
        .then(function(success) {
          if (success) {
            // 验证成功
            saveOrderNo(orderNoFromUrl);
            unlockCourse();
            // 移除浮层（如果存在）
            removeOverlay();
            // 清除 URL 参数
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
            // 触发解锁事件
            window.dispatchEvent(new CustomEvent('courseUnlocked', { 
              detail: { courseId: COURSE_ID, orderNo: orderNoFromUrl, fromUrl: true } 
            }));
          } else {
            // 验证失败，显示浮层并预填订单号
            setTimeout(function() {
              createUnlockOverlay();
              const orderInput = document.getElementById('order-no-input');
              if (orderInput) {
                orderInput.value = orderNoFromUrl;
                // 自动触发验证
                setTimeout(function() {
                  document.getElementById('verify-btn')?.click();
                }, 500);
              }
            }, 100);
          }
        })
        .catch(function(error) {
          console.error('URL 参数验证出错:', error);
          setTimeout(function() {
            createUnlockOverlay();
          }, 100);
        });
      return true; // 表示已处理 URL 参数
    }
    return false; // 没有 URL 参数
  }

  /**
   * 页面焦点检测：当用户从支付页面返回时自动提示
   */
  function setupFocusDetection() {
    window.addEventListener('focus', function() {
      // 检查是否刚刚从支付页面返回
      const purchaseTime = sessionStorage.getItem('purchase_click_time');
      const purchaseCourseId = sessionStorage.getItem('purchase_course_id');
      
      if (purchaseTime && purchaseCourseId === COURSE_ID) {
        const timeSincePurchase = Date.now() - parseInt(purchaseTime);
        // 如果是在5分钟内，且课程未解锁，自动触发检测
        if (timeSincePurchase < 300000 && !isUnlocked()) {
          const overlay = document.getElementById('course-unlock-overlay');
          if (overlay) {
            // 如果浮层已显示，自动点击"我已支付"按钮
            const autoVerifyBtn = document.getElementById('auto-verify-btn');
            if (autoVerifyBtn && !autoVerifyBtn.disabled) {
              // 延迟一下，确保页面已完全加载
              setTimeout(function() {
                autoVerifyBtn.click();
              }, 500);
            }
          }
        }
      }
    });
  }

  /**
   * 初始化
   */
  function init() {
    // 设置页面焦点检测
    setupFocusDetection();
    
    // 如果课程已解锁，直接返回
    if (isUnlocked()) {
      return;
    }

    // 先检查 URL 参数中是否有订单号
    if (checkUrlParams()) {
      return; // 如果处理了 URL 参数，直接返回
    }

    // 尝试静默校验
    const savedOrderNo = getSavedOrderNo();
    if (savedOrderNo) {
      // 有保存的订单号，先进行静默校验
      silentVerify()
        .then(function(verified) {
          if (!verified) {
            // 静默校验失败，显示解锁浮层
            setTimeout(function() {
              createUnlockOverlay();
            }, 100);
          }
          // 如果静默校验成功，silentVerify 已经自动解锁了
        })
        .catch(function(error) {
          console.error('静默校验出错:', error);
          // 出错时也显示解锁浮层
          setTimeout(function() {
            createUnlockOverlay();
          }, 100);
        });
    } else {
      // 没有保存的订单号，直接显示解锁浮层
      setTimeout(function() {
        createUnlockOverlay();
      }, 100);
    }
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 暴露解锁方法（可选，用于手动解锁）
  window.unlockCourse = unlockCourse;
  window.isCourseUnlocked = isUnlocked;
  
  // 暴露显示解锁浮层的方法
  window.showUnlockOverlay = function() {
    if (!isUnlocked()) {
      createUnlockOverlay();
    }
  };

})();

