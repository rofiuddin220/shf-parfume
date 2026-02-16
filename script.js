(function() {
  'use strict';

  // ===========================
  // DROPDOWN MENU TOGGLE
  // ===========================
  const initDropdown = () => {
    const allDropdowns = document.querySelectorAll('.dropdown');
    
    document.querySelectorAll('.dots').forEach(dots => {
      dots.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();

        // Close all other dropdowns
        allDropdowns.forEach(menu => {
          if (menu !== this.nextElementSibling) {
            menu.style.display = 'none';
          }
        });

        // Toggle current dropdown
        const dropdown = this.nextElementSibling;
        if (dropdown && dropdown.classList.contains('dropdown')) {
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function () {
      allDropdowns.forEach(menu => {
        menu.style.display = 'none';
      });
    });

    // Prevent dropdown close when clicking inside
    allDropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    });
  };

  // ===========================
  // COPY TO CLIPBOARD
  // ===========================
  window.copyText = function(text) {
    if (!text || typeof text !== 'string') {
      showNotification('❌ Tidak ada teks untuk disalin');
      return;
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          showNotification('✅ Berhasil disalin!');
        })
        .catch((err) => {
          console.error('Clipboard API gagal:', err);
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  // Fallback copy method
  function fallbackCopy(text) {
    try {
      const temp = document.createElement("textarea");
      temp.value = text;
      temp.style.cssText = 'position:fixed;left:-9999px;opacity:0;';
      temp.setAttribute('readonly', '');
      document.body.appendChild(temp);
      
      // Support iOS
      if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        temp.contentEditable = true;
        temp.readOnly = true;
        const range = document.createRange();
        range.selectNodeContents(temp);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        temp.setSelectionRange(0, 999999);
      } else {
        temp.select();
      }
      
      const success = document.execCommand("copy");
      document.body.removeChild(temp);
      
      if (success) {
        showNotification('✅ Berhasil disalin!');
      } else {
        showNotification('❌ Gagal menyalin');
      }
    } catch (err) {
      console.error('Fallback copy gagal:', err);
      showNotification('❌ Gagal menyalin');
    }
  }

  // ===========================
  // NOTIFICATION
  // ===========================
  let notificationTimeout;
  
  function showNotification(message) {
    // Sanitize message (prevent XSS)
    const sanitizedMessage = String(message).replace(/[<>]/g, '');
    
    // Remove existing notification
    const existingNotif = document.querySelector('.copy-notification');
    if (existingNotif) {
      existingNotif.remove();
      clearTimeout(notificationTimeout);
    }

    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = sanitizedMessage;
    
    // Use CSS class instead of inline styles (CSP friendly)
    notification.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #d4af37, #f4d03f);
      color: #000;
      padding: 14px 28px;
      border-radius: 30px;
      font-weight: 600;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
      animation: slideUp 0.3s ease;
      pointer-events: none;
    `;
    
    document.body.appendChild(notification);
    
    notificationTimeout = setTimeout(() => {
      notification.style.animation = 'slideDown 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 2000);
  }

  // ===========================
  // SMOOTH SCROLL
  // ===========================
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignore href="#" only
        if (!href || href === '#') {
          e.preventDefault();
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without page jump
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      });
    });
  };

  // ===========================
  // INJECT ANIMATION STYLES
  // ===========================
  const injectStyles = () => {
    // Check if styles already exist
    if (document.getElementById('notification-animations')) return;

    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
      @keyframes slideDown {
        from {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        to {
          opacity: 0;
          transform: translateX(-50%) translateY(20px);
        }
      }
    `;
    document.head.appendChild(style);
  };

  // ===========================
  // INITIALIZATION
  // ===========================
  const init = () => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initDropdown();
        initSmoothScroll();
        injectStyles();
      });
    } else {
      initDropdown();
      initSmoothScroll();
      injectStyles();
    }
  };

  init();

})();
/* ============================= */
/* REVIEW CAROUSEL */
/* ============================= */

const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.slide');

let index = 0;

function moveSlide() {
  index++;
  if (index >= slides.length) {
    index = 0;
  }
  track.style.transform = `translateX(-${index * 100}%)`;
}

setInterval(moveSlide, 3500);