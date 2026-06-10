document.addEventListener('DOMContentLoaded', () => {
  // 1. INITIALIZE LUCIDE ICONS
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. THEME TOGGLER
  const themeBtn = document.getElementById('theme-btn');
  const themeIcon = document.getElementById('theme-icon');

  // Retrieve saved theme or default to dark
  const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'light') {
      themeIcon.setAttribute('data-lucide', 'moon');
    } else {
      themeIcon.setAttribute('data-lucide', 'sun');
    }
    // Re-create icons for the theme toggle button to swap sun/moon
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({
        attrs: {
          class: 'theme-icon'
        },
        nameAttr: 'data-lucide'
      });
    }
  }

  // 3. SMOOTH ANCHOR LINK NAVIGATION
  const navLinks = document.querySelectorAll('.nav-links a, .skill-tag-link, .footer-back-to-top, .hero-btn');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const navbarOffset = 100;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 4. SCROLLSPY (NAVBAR ACTIVE LINK HIGHLIGHT)
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');

  function updateActiveNavItem() {
    let currentSectionId = 'home';
    const scrollPosition = window.scrollY + 150; // offset for triggers

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      const itemAnchor = item.querySelector('a');
      if (itemAnchor && itemAnchor.getAttribute('href') === `#${currentSectionId}`) {
        item.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavItem);

  // 5. HERO STATS COUNTER ANIMATION
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsContainer = document.getElementById('stats-container');
  let countersAnimated = false;

  function runStatsCounters() {
    if (countersAnimated) return;

    statNumbers.forEach(stat => {
      const targetStr = stat.getAttribute('data-target');
      if (!targetStr) return; // skip items like 'IIIT Bhopal' that have no numeric target

      const target = parseInt(targetStr);
      let count = 0;
      const duration = 1500; // 1.5s animation
      const stepTime = Math.max(Math.floor(duration / target), 30);

      const timer = setInterval(() => {
        count++;
        stat.textContent = count + '+';
        if (count >= target) {
          stat.textContent = target + '+';
          clearInterval(timer);
        }
      }, stepTime);
    });

    countersAnimated = true;
  }

  // Use IntersectionObserver to animate stats when in viewport
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runStatsCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (statsContainer) {
    statsObserver.observe(statsContainer);
  } else {
    runStatsCounters(); // fallback if element not found
  }

  // 6. SCROLL REVEAL FOR TIMELINE ENTRIES
  const timelineItems = document.querySelectorAll('.timeline-item');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optionally unobserve if we only want entrance animations once
        // revealObserver.unobserve(entry.target);
      } else {
        // Remove revealed class if scrolled out, allowing nodes to un-glow
        entry.target.classList.remove('revealed');
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px' // offset so it triggers slightly before midpoint
  });

  timelineItems.forEach(item => {
    revealObserver.observe(item);
  });

  // 7. WATER WAVE TIMELINE SVG SCROLL FILL
  const wavePathBg = document.getElementById('timeline-path-bg');
  const wavePathActive = document.getElementById('timeline-path-active');
  const timelineWrapper = document.querySelector('.timeline-wrapper');

  if (wavePathActive && timelineWrapper) {
    const pathLength = wavePathActive.getTotalLength();

    // Set dasharray and dashoffset to make path drawable
    wavePathActive.style.strokeDasharray = `${pathLength} ${pathLength}`;
    wavePathActive.style.strokeDashoffset = pathLength;

    function animateWaveLine() {
      const rect = timelineWrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress relative to the timeline wrapper bounds
      // Starts filling when the top of the wrapper meets the vertical middle of the screen
      // Finishes when the bottom of the wrapper meets the vertical middle of the screen
      const triggerStart = windowHeight / 2;
      const totalScrollableHeight = rect.height;
      const scrolledPastStart = triggerStart - rect.top;

      let percentage = scrolledPastStart / totalScrollableHeight;
      percentage = Math.min(Math.max(percentage, 0), 1);

      // Update SVG path offset
      const drawLength = pathLength * (1 - percentage);
      wavePathActive.style.strokeDashoffset = drawLength;
    }

    window.addEventListener('scroll', animateWaveLine);
    window.addEventListener('resize', () => {
      // Re-fetch path length on resize to prevent scaling bugs
      const newPathLength = wavePathActive.getTotalLength();
      wavePathActive.style.strokeDasharray = `${newPathLength} ${newPathLength}`;
      animateWaveLine();
    });

    // Initial run
    animateWaveLine();
  }

  // 8. CONTACT FORM SUBMISSION WRAPPER (Prevents redirection if using placeholders)
  const contactForm = document.getElementById('contact-form-element');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const formAction = contactForm.getAttribute('action');
      if (formAction.includes('placeholder')) {
        e.preventDefault();
        alert('Thank you for reaching out! This is a placeholder action. In a live environment, Formspree or your API endpoint will receive this message.');
        contactForm.reset();
      }
    });
  }

  // 9. THREE.JS INTERACTIVE NODE BACKGROUND
  function initThreeBg() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    let renderer, scene, camera;
    let particlesGroup;
    let particlePositions, particleVelocities;
    let particlesData = [];
    let positions, colors;
    let pointsGeometry, lineGeometry;
    let pointCloud, linesMesh;

    // Bounds for particle movement (wider screen spread coordinates, dynamically updated on resize)
    let boundsX = window.innerWidth * 1.3;
    let boundsY = window.innerHeight * 1.3;
    const boundsZ = 800;

    let boundsXHalf = boundsX / 2;
    let boundsYHalf = boundsY / 2;
    const boundsZHalf = boundsZ / 2;

    // Limits / options
    const isMobile = window.innerWidth < 768;
    const maxParticleCount = isMobile ? 80 : 300;
    let particleCount = maxParticleCount;
    const minDistance = 180; // Larger distance connection threshold for wider spread

    // Animation loop controller
    let animationFrameId = null;
    let isPaused = false;

    // Mouse tracking for parallax
    let mouseX = 0, mouseY = 0;
    let targetCameraX = 0, targetCameraY = 0;

    // Cached colors to avoid garbage collection overhead in render loop
    const colorLight = new THREE.Color('#ff8fa3');
    const colorAccent = new THREE.Color();
    const colorBg = new THREE.Color();

    function updateAccentColor() {
      const computedStyle = getComputedStyle(document.documentElement);

      const colorStr = computedStyle.getPropertyValue('--accent').trim();
      colorAccent.set(colorStr);

      let bgStr = computedStyle.getPropertyValue('--bg-primary').trim();
      if (!bgStr) {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        bgStr = isLight ? '#edf2f4' : '#0a0a0a';
      }
      colorBg.set(bgStr);
    }

    function getLineColorHex() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      return isLight ? colorLight : colorAccent;
    }

    function init() {
      // Camera Setup
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
      camera.position.z = 800;

      // Scene Setup
      scene = new THREE.Scene();

      // Parent group that rotates
      particlesGroup = new THREE.Group();
      scene.add(particlesGroup);

      // Node Material
      updateAccentColor();
      const pMaterial = new THREE.PointsMaterial({
        color: colorAccent,
        size: 5,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: true,
        opacity: 0.8
      });

      // Nodes Geometry
      pointsGeometry = new THREE.BufferGeometry();
      particlePositions = new Float32Array(maxParticleCount * 3);
      particleVelocities = [];

      for (let i = 0; i < maxParticleCount; i++) {
        // Random positions scattered in wider dynamic 3D box
        const x = Math.random() * boundsX - boundsXHalf;
        const y = Math.random() * boundsY - boundsYHalf;
        const z = Math.random() * boundsZ - boundsZHalf;

        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;

        // Velocity drift vector
        particleVelocities.push({
          x: (Math.random() - 0.5) * 0.8,
          y: (Math.random() - 0.5) * 0.8,
          z: (Math.random() - 0.5) * 0.8
        });

        particlesData.push({
          numConnections: 0
        });
      }

      pointsGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage));

      // Create PointCloud
      pointCloud = new THREE.Points(pointsGeometry, pMaterial);
      particlesGroup.add(pointCloud);

      // Line Geometry & Material
      lineGeometry = new THREE.BufferGeometry();
      const segments = maxParticleCount * maxParticleCount;
      positions = new Float32Array(segments * 3);
      colors = new Float32Array(segments * 3);

      lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
      lineGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));

      const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        linewidth: 1
      });

      linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
      particlesGroup.add(linesMesh);

      // Renderer Setup
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Event listeners
      document.addEventListener('mousemove', onMouseMove);
      window.addEventListener('resize', onWindowResize);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Custom listener to update colors when theme changes
      const themeBtn = document.getElementById('theme-btn');
      if (themeBtn) {
        themeBtn.addEventListener('click', () => {
          // Wait a tiny bit for variables to toggle in DOM
          setTimeout(updateColors, 50);
        });
      }

      // Initialize correct colors & blending on load
      updateColors();
    }

    function onMouseMove(event) {
      // Normalize mouse coordinates between -1 and 1
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      // targetCamera parallax offset
      targetCameraX = mouseX * 80; // subtly drift camera x/y by ~2 units scaled for perspective
      targetCameraY = mouseY * 80;
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Dynamically scale particle limits on screen dimensions change
      boundsX = window.innerWidth * 2.2;
      boundsY = window.innerHeight * 2.2;
      boundsXHalf = boundsX / 2;
      boundsYHalf = boundsY / 2;
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        isPaused = true;
        cancelAnimationFrame(animationFrameId);
      } else {
        isPaused = false;
        animate();
      }
    }

    function updateColors() {
      updateAccentColor();
      pointCloud.material.color.copy(colorAccent);

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const targetBlending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;

      pointCloud.material.blending = targetBlending;
      linesMesh.material.blending = targetBlending;

      pointCloud.material.needsUpdate = true;
      linesMesh.material.needsUpdate = true;
    }

    function animate() {
      if (isPaused) return;
      animationFrameId = requestAnimationFrame(animate);
      render();
    }

    function render() {
      // Slow rotation on Group
      particlesGroup.rotation.y += 0.0006;
      particlesGroup.rotation.x += 0.0003;

      // Parallax camera lerp
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      let vertexIndex = 0;
      let colorIndex = 0;
      let numConnected = 0;

      for (let i = 0; i < particleCount; i++) {
        particlesData[i].numConnections = 0;
      }

      // Update positions & bounds wrap
      for (let i = 0; i < particleCount; i++) {
        // Update positions
        particlePositions[i * 3] += particleVelocities[i].x;
        particlePositions[i * 3 + 1] += particleVelocities[i].y;
        particlePositions[i * 3 + 2] += particleVelocities[i].z;

        // Wrap boundaries
        if (particlePositions[i * 3] < -boundsXHalf || particlePositions[i * 3] > boundsXHalf) {
          particlePositions[i * 3] = -particlePositions[i * 3];
        }
        if (particlePositions[i * 3 + 1] < -boundsYHalf || particlePositions[i * 3 + 1] > boundsYHalf) {
          particlePositions[i * 3 + 1] = -particlePositions[i * 3 + 1];
        }
        if (particlePositions[i * 3 + 2] < -boundsZHalf || particlePositions[i * 3 + 2] > boundsZHalf) {
          particlePositions[i * 3 + 2] = -particlePositions[i * 3 + 2];
        }

        // Check distance to other particles
        for (let j = i + 1; j < particleCount; j++) {
          const dx = particlePositions[i * 3] - particlePositions[j * 3];
          const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
          const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < minDistance) {
            particlesData[i].numConnections++;
            particlesData[j].numConnections++;

            // Draw line
            positions[vertexIndex++] = particlePositions[i * 3];
            positions[vertexIndex++] = particlePositions[i * 3 + 1];
            positions[vertexIndex++] = particlePositions[i * 3 + 2];

            positions[vertexIndex++] = particlePositions[j * 3];
            positions[vertexIndex++] = particlePositions[j * 3 + 1];
            positions[vertexIndex++] = particlePositions[j * 3 + 2];

            // Opacity fade based on proximity
            const alpha = 1.0 - (dist / minDistance);
            const activeColor = getLineColorHex();

            colors[colorIndex++] = colorBg.r + (activeColor.r - colorBg.r) * alpha;
            colors[colorIndex++] = colorBg.g + (activeColor.g - colorBg.g) * alpha;
            colors[colorIndex++] = colorBg.b + (activeColor.b - colorBg.b) * alpha;

            colors[colorIndex++] = colorBg.r + (activeColor.r - colorBg.r) * alpha;
            colors[colorIndex++] = colorBg.g + (activeColor.g - colorBg.g) * alpha;
            colors[colorIndex++] = colorBg.b + (activeColor.b - colorBg.b) * alpha;

            numConnected++;
          }
        }
      }

      pointCloud.geometry.attributes.position.needsUpdate = true;
      linesMesh.geometry.attributes.position.needsUpdate = true;
      linesMesh.geometry.attributes.color.needsUpdate = true;
      linesMesh.geometry.setDrawRange(0, numConnected * 2);

      renderer.render(scene, camera);
    }

    init();
    animate();
  }

  // Initialize Three.js particle canvas
  initThreeBg();

  // 10. PROJECTS CAROUSEL CONTROLLER
  function initProjectsCarousel() {
    const track = document.getElementById('projects-track');
    const prevBtn = document.getElementById('projects-prev');
    const nextBtn = document.getElementById('projects-next');
    if (!track || !prevBtn || !nextBtn) return;

    const cards = Array.from(track.children);
    if (cards.length === 0) return;

    let currentIndex = 0;

    function getVisibleCardsCount() {
      const width = window.innerWidth;
      if (width >= 1024) return 3;
      if (width >= 640) return 2;
      return 1;
    }

    function getCardWidth() {
      return (cards[0].offsetWidth || 310) + 30; // card width + gap
    }

    function updateCarousel() {
      const visibleCards = getVisibleCardsCount();
      const cardWidth = getCardWidth();
      const maxIndex = Math.max(0, cards.length - visibleCards);

      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }

      const translateAmount = -currentIndex * cardWidth;
      track.style.transform = `translateX(${translateAmount}px)`;

      // Update button disabled state
      if (currentIndex === 0) {
        prevBtn.classList.add('disabled');
      } else {
        prevBtn.classList.remove('disabled');
      }

      if (currentIndex >= maxIndex) {
        nextBtn.classList.add('disabled');
      } else {
        nextBtn.classList.remove('disabled');
      }
    }

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', () => {
      const visibleCards = getVisibleCardsCount();
      const maxIndex = Math.max(0, cards.length - visibleCards);
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });

    // Touch support for swiping
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const visibleCards = getVisibleCardsCount();
      const maxIndex = Math.max(0, cards.length - visibleCards);

      if (touchStartX - touchEndX > swipeThreshold) {
        if (currentIndex < maxIndex) {
          currentIndex++;
          updateCarousel();
        }
      } else if (touchEndX - touchStartX > swipeThreshold) {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      }
    }

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
    
    // Tiny delay to ensure layout is fully computed on load
    setTimeout(updateCarousel, 100);
  }

  initProjectsCarousel();
});

