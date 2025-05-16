/**
 * EdPsych Connect - Performance Optimization
 * 
 * This file implements performance optimizations for the platform including:
 * - Lazy loading for content not immediately visible
 * - Image optimization with WebP format and responsive sizing
 * - Service worker for offline capabilities
 * - Code splitting for reduced initial load time
 * 
 * @author Manus Rocode
 * @version 1.0.0
 */

// Performance Configuration Object
const performanceConfig = {
  // Lazy loading settings
  lazyLoading: {
    enabled: true,
    threshold: 0.1, // How much of the element needs to be visible to trigger loading
    rootMargin: '200px', // Load elements when they're within 200px of viewport
  },
  
  // Image optimization settings
  imageOptimization: {
    useWebP: true, // Use WebP format when supported
    fallbackFormat: 'jpg', // Fallback format when WebP not supported
    qualityWebP: 80, // WebP quality (0-100)
    qualityJpg: 85, // JPG quality (0-100)
    sizes: [320, 640, 1024, 1600], // Responsive image sizes
  },
  
  // Service worker settings
  serviceWorker: {
    enabled: true,
    cacheName: 'edpsych-connect-cache-v1',
    offlinePageUrl: '/offline.html',
    assetsToCache: [
      '/css/',
      '/js/',
      '/images/icons/',
      '/fonts/',
    ],
  },
  
  // Code splitting settings
  codeSplitting: {
    enabled: true,
    chunkSizeLimit: 200000, // 200KB
  }
};

/**
 * Initializes performance optimizations
 */
function initializePerformanceOptimizations() {
  if (performanceConfig.lazyLoading.enabled) {
    setupLazyLoading();
  }
  
  if (performanceConfig.imageOptimization.useWebP) {
    setupImageOptimization();
  }
  
  if (performanceConfig.serviceWorker.enabled) {
    registerServiceWorker();
  }
  
  // Code splitting is handled at build time, but we can log its status
  if (performanceConfig.codeSplitting.enabled) {
    console.log('EdPsych Connect: Code splitting enabled with chunk size limit of', 
      performanceConfig.codeSplitting.chunkSizeLimit, 'bytes');
  }
}

/**
 * Sets up lazy loading for images, iframes, and other heavy content
 */
function setupLazyLoading() {
  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    console.warn('EdPsych Connect: IntersectionObserver not supported, lazy loading disabled');
    return;
  }
  
  // Create an observer instance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      
      const element = entry.target;
      
      // Handle different element types
      if (element.tagName === 'IMG') {
        loadLazyImage(element);
      } else if (element.tagName === 'IFRAME') {
        loadLazyIframe(element);
      } else if (element.classList.contains('lazy-component')) {
        loadLazyComponent(element);
      }
      
      // Stop observing the element after it's loaded
      observer.unobserve(element);
    });
  }, {
    root: null, // Use viewport as root
    rootMargin: performanceConfig.lazyLoading.rootMargin,
    threshold: performanceConfig.lazyLoading.threshold
  });
  
  // Observe all elements with data-src or data-lazy attributes
  document.querySelectorAll('img[data-src], iframe[data-src], .lazy-component').forEach(element => {
    observer.observe(element);
  });
  
  console.log('EdPsych Connect: Lazy loading initialized');
}

/**
 * Loads a lazy image when it enters the viewport
 * @param {HTMLImageElement} img - The image element to load
 */
function loadLazyImage(img) {
  const src = img.dataset.src;
  const srcset = img.dataset.srcset;
  const sizes = img.dataset.sizes;
  
  if (src) {
    img.src = src;
  }
  
  if (srcset) {
    img.srcset = srcset;
  }
  
  if (sizes) {
    img.sizes = sizes;
  }
  
  img.classList.add('loaded');
  img.removeAttribute('data-src');
  img.removeAttribute('data-srcset');
  img.removeAttribute('data-sizes');
}

/**
 * Loads a lazy iframe when it enters the viewport
 * @param {HTMLIFrameElement} iframe - The iframe element to load
 */
function loadLazyIframe(iframe) {
  const src = iframe.dataset.src;
  
  if (src) {
    iframe.src = src;
  }
  
  iframe.classList.add('loaded');
  iframe.removeAttribute('data-src');
}

/**
 * Loads a lazy component when it enters the viewport
 * @param {HTMLElement} component - The component element to load
 */
function loadLazyComponent(component) {
  const template = component.querySelector('template');
  
  if (template) {
    const content = template.content.cloneNode(true);
    component.appendChild(content);
    component.removeChild(template);
  }
  
  component.classList.add('loaded');
  component.classList.remove('lazy-component');
  
  // If the component has a data-callback attribute, call that function
  const callback = component.dataset.callback;
  if (callback && window[callback] && typeof window[callback] === 'function') {
    window[callback](component);
  }
}

/**
 * Sets up image optimization with WebP and responsive images
 */
function setupImageOptimization() {
  // Check if WebP is supported
  const webpSupported = checkWebPSupport();
  
  // Add webp class to document if supported
  if (webpSupported) {
    document.documentElement.classList.add('webp');
  } else {
    document.documentElement.classList.add('no-webp');
  }
  
  // Process all images with data-optimize attribute
  document.querySelectorAll('img[data-optimize]').forEach(img => {
    optimizeImage(img, webpSupported);
  });
  
  // Add CSS for optimized images
  const style = document.createElement('style');
  style.textContent = `
    img.optimized {
      transition: opacity 0.3s ease;
    }
    
    img.optimized:not(.loaded) {
      opacity: 0;
    }
    
    img.optimized.loaded {
      opacity: 1;
    }
    
    .webp .bg-image {
      background-image: var(--webp-bg-image);
    }
    
    .no-webp .bg-image {
      background-image: var(--fallback-bg-image);
    }
  `;
  
  document.head.appendChild(style);
  
  console.log('EdPsych Connect: Image optimization initialized, WebP support:', webpSupported);
}

/**
 * Checks if WebP format is supported by the browser
 * @returns {boolean} Whether WebP is supported
 */
function checkWebPSupport() {
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    // Check for WebP support
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

/**
 * Optimizes an image with responsive sizes and WebP format
 * @param {HTMLImageElement} img - The image element to optimize
 * @param {boolean} webpSupported - Whether WebP is supported
 */
function optimizeImage(img, webpSupported) {
  const basePath = img.dataset.optimize;
  const alt = img.alt || '';
  
  if (!basePath) return;
  
  // Create responsive srcset
  const sizes = performanceConfig.imageOptimization.sizes;
  const format = webpSupported ? 'webp' : performanceConfig.imageOptimization.fallbackFormat;
  const quality = webpSupported ? 
    performanceConfig.imageOptimization.qualityWebP : 
    performanceConfig.imageOptimization.qualityJpg;
  
  let srcset = '';
  
  sizes.forEach(size => {
    const url = `${basePath}-${size}.${format}?q=${quality}`;
    srcset += `${url} ${size}w, `;
  });
  
  // Remove trailing comma and space
  srcset = srcset.slice(0, -2);
  
  // Set default src to the middle size
  const defaultSize = sizes[Math.floor(sizes.length / 2)];
  const src = `${basePath}-${defaultSize}.${format}?q=${quality}`;
  
  // Apply optimizations
  img.classList.add('optimized');
  img.src = src;
  img.srcset = srcset;
  img.sizes = img.sizes || 'auto'; // Use existing sizes attribute if present
  img.alt = alt;
  
  // Mark as loaded when the image loads
  img.onload = () => {
    img.classList.add('loaded');
  };
  
  // Remove the data-optimize attribute
  img.removeAttribute('data-optimize');
}

/**
 * Registers a service worker for offline capabilities
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('EdPsych Connect: Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('EdPsych Connect: Service Worker registration failed:', error);
        });
    });
    
    // Create the service worker file if it doesn't exist
    createServiceWorkerFile();
  } else {
    console.warn('EdPsych Connect: Service Workers not supported, offline capabilities disabled');
  }
}

/**
 * Creates the service worker file with caching strategy
 */
function createServiceWorkerFile() {
  // This would typically be done at build time, but we'll simulate it here
  const serviceWorkerContent = `
    // EdPsych Connect Service Worker
    const CACHE_NAME = '${performanceConfig.serviceWorker.cacheName}';
    const OFFLINE_PAGE = '${performanceConfig.serviceWorker.offlinePageUrl}';
    
    const ASSETS_TO_CACHE = [
      OFFLINE_PAGE,
      ${performanceConfig.serviceWorker.assetsToCache.map(asset => `'${asset}'`).join(',\n      ')}
    ];
    
    // Install event - cache assets
    self.addEventListener('install', event => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then(cache => {
            console.log('Opened cache');
            return cache.addAll(ASSETS_TO_CACHE);
          })
      );
    });
    
    // Activate event - clean up old caches
    self.addEventListener('activate', event => {
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.filter(cacheName => {
              return cacheName !== CACHE_NAME;
            }).map(cacheName => {
              return caches.delete(cacheName);
            })
          );
        })
      );
    });
    
    // Fetch event - serve from cache or network
    self.addEventListener('fetch', event => {
      event.respondWith(
        caches.match(event.request)
          .then(response => {
            // Cache hit - return response
            if (response) {
              return response;
            }
            
            return fetch(event.request).then(
              response => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }
                
                // Clone the response
                const responseToCache = response.clone();
                
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseToCache);
                  });
                
                return response;
              }
            ).catch(() => {
              // If fetch fails (offline), show offline page
              if (event.request.mode === 'navigate') {
                return caches.match(OFFLINE_PAGE);
              }
            });
          })
      );
    });
  `;
  
  console.log('EdPsych Connect: Service Worker content prepared');
  
  // In a real implementation, we would write this to a file
  // For now, we'll just log it
  console.log('Service Worker content would be written to /service-worker.js');
}

/**
 * Creates a simple offline page
 */
function createOfflinePage() {
  // This would typically be done at build time, but we'll simulate it here
  const offlinePageContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>EdPsych Connect - Offline</title>
      <style>
        body {
          font-family: 'Roboto', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }
        
        h1 {
          color: #1976D2;
        }
        
        .offline-icon {
          font-size: 64px;
          margin: 20px 0;
        }
        
        .message {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        
        .retry-button {
          background-color: #1976D2;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .retry-button:hover {
          background-color: #1565C0;
        }
      </style>
    </head>
    <body>
      <h1>EdPsych Connect</h1>
      <div class="offline-icon">📶</div>
      <div class="message">
        <h2>You're currently offline</h2>
        <p>The content you're trying to access requires an internet connection.</p>
        <p>Please check your connection and try again.</p>
      </div>
      <button class="retry-button" onclick="window.location.reload()">Retry</button>
      
      <script>
        // Check if we're back online
        window.addEventListener('online', () => {
          window.location.reload();
        });
      </script>
    </body>
    </html>
  `;
  
  console.log('EdPsych Connect: Offline page content prepared');
  
  // In a real implementation, we would write this to a file
  // For now, we'll just log it
  console.log('Offline page content would be written to /offline.html');
}

/**
 * Adds skeleton screens for content that's loading
 */
function addSkeletonScreens() {
  // Add CSS for skeleton screens
  const style = document.createElement('style');
  style.textContent = `
    .skeleton-loader {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
      border-radius: 4px;
      height: 100%;
      width: 100%;
    }
    
    @keyframes skeleton-loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
    
    .skeleton-text {
      height: 1em;
      margin-bottom: 0.5em;
    }
    
    .skeleton-image {
      aspect-ratio: 16/9;
    }
    
    .skeleton-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    
    .skeleton-button {
      height: 36px;
      width: 120px;
      border-radius: 4px;
    }
    
    .skeleton-card {
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `;
  
  document.head.appendChild(style);
  
  // Replace loading elements with skeletons
  document.querySelectorAll('[data-skeleton]').forEach(element => {
    const type = element.dataset.skeleton;
    const count = parseInt(element.dataset.skeletonCount, 10) || 1;
    
    // Clear the element
    element.innerHTML = '';
    
    // Add the appropriate number of skeleton elements
    for (let i = 0; i < count; i++) {
      const skeleton = document.createElement('div');
      skeleton.classList.add('skeleton-loader', `skeleton-${type}`);
      element.appendChild(skeleton);
    }
  });
}

// Initialize performance optimizations when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initializePerformanceOptimizations();
  addSkeletonScreens();
  createOfflinePage();
  
  // Log performance initialization
  console.log('EdPsych Connect: Performance optimizations initialized');
});

// Export functions for use in other modules
export {
  performanceConfig,
  checkWebPSupport,
  optimizeImage,
  loadLazyComponent
};
