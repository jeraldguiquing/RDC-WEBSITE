/**
 * RDC Website - MCNP & ISAP
 * JavaScript Core Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      mobileToggle.innerHTML = isExpanded ? '&#10005;' : '&#9776;';
    });
  }

  // 2. Mobile Dropdown Toggle (Accordeon on small screens)
  const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

  dropdownItems.forEach((item) => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        // If on small screens, toggle dropdown open/close
        if (window.innerWidth <= 860) {
          e.preventDefault();
          item.classList.toggle('open');
          
          // Close other open dropdowns
          dropdownItems.forEach((other) => {
            if (other !== item) {
              other.classList.remove('open');
            }
          });
        }
      });
    }
  });

  // 3. Highlight Active Nav Item based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
      // If it's a dropdown link, highlight the parent nav-link too
      const parentDropdown = link.closest('.nav-item.dropdown');
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector('.nav-link');
        if (parentLink) parentLink.classList.add('active');
      }
    }
  });

  // 4. Counter Animation for Metrics
  const metricNumbers = document.querySelectorAll('.metric-number[data-target]');
  if (metricNumbers.length > 0) {
    const animateCounters = () => {
      metricNumbers.forEach((counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace(/[^0-9]/g, '') || 0;
        const increment = Math.ceil(target / 40);

        if (count < target) {
          const nextVal = Math.min(count + increment, target);
          const suffix = counter.getAttribute('data-suffix') || '';
          counter.innerText = nextVal + suffix;
          setTimeout(animateCounters, 30);
        } else {
          const suffix = counter.getAttribute('data-suffix') || '';
          counter.innerText = target + suffix;
        }
      });
    };

    // Trigger on scroll or view
    let triggered = false;
    window.addEventListener('scroll', () => {
      const metricsSection = document.querySelector('.metrics-section');
      if (metricsSection && !triggered) {
        const rect = metricsSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.9) {
          animateCounters();
          triggered = true;
        }
      }
    });

    // Also trigger if already in view on load
    setTimeout(() => {
      if (!triggered) {
        animateCounters();
        triggered = true;
      }
    }, 400);
  }

  // 5. Journal Tabs Filtering
  const tabBtns = document.querySelectorAll('.tab-btn[data-filter]');
  const articleCards = document.querySelectorAll('.article-card[data-journal]');

  if (tabBtns.length > 0 && articleCards.length > 0) {
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active', 'isap-active'));
        btn.classList.add(btn.dataset.filter === 'isap' ? 'isap-active' : 'active');

        const filter = btn.getAttribute('data-filter');
        articleCards.forEach((card) => {
          if (filter === 'all' || card.getAttribute('data-journal') === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Generic Modal Open / Close Handler
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalClosers = document.querySelectorAll('[data-modal-close]');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalClosers.forEach((closer) => {
    closer.addEventListener('click', () => {
      const modal = closer.closest('.modal-backdrop');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  modalBackdrops.forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // 7. Toast Notification Utility
  window.showToast = function (message, type = 'success') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      toastContainer.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? '#0d5c3a' : type === 'info' ? '#0b3c5d' : '#e11d48';
    toast.style.cssText = `
      background: ${bgColor};
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
      border-left: 4px solid #d4af37;
    `;
    toast.innerHTML = `<span>&#10003;</span> <div>${message}</div>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  document.querySelectorAll('[data-gallery-slider]').forEach((slider) => {
    const slides = slider.querySelectorAll('.event-gallery-slide');
    let currentSlide = 0;

    const showSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === currentSlide);
      });
    };

    slider.querySelector('[data-gallery-prev]').addEventListener('click', () => showSlide(currentSlide - 1));
    slider.querySelector('[data-gallery-next]').addEventListener('click', () => showSlide(currentSlide + 1));
  });

  const sdgDetails = {
    1: ['SDG 1: No Poverty', [['Community Health Caravans', 'Free consultations, diagnostic tests, and medicines bring essential services to underserved communities.'], ['Barangay Outreach Partnerships', 'Community partners help identify families who need health, education, and social support.']]],
    2: ['SDG 2: Zero Hunger', [['Nutrition and Food Security Outreach', 'Research and community activities promote nutrition awareness and practical food-security solutions.'], ['Community Nutrition Education', 'Students and faculty share food planning and healthy-living practices with families.']]],
    3: ['SDG 3: Good Health and Well-Being', [['Alagang Dr. Guzman Health Caravans', 'MCNP health teams provide medical consultations, laboratory services, screenings, and medicines.'], ['Community Health Worker Training', 'Frontline volunteers receive training in vital signs monitoring, triage, and health reporting.'], ['Maternal and Child Health Outreach', 'Health education supports safer care for mothers, children, and vulnerable residents.']]],
    4: ['SDG 4: Quality Education', [['Research Skills and Continuing Education', 'Faculty and students build research capacity through mentoring, training, and community learning activities.'], ['Student Statistics Competitions', 'MCNP and ISAP students develop analytical and critical-thinking skills through statistics competitions.']]],
    5: ['SDG 5: Gender Equality', [['Legal Literacy and Safe Communities', 'Community workshops support gender sensitivity, rights awareness, and access to appropriate assistance.'], ['Gender Sensitivity Education', 'Research and student activities encourage respectful, inclusive, and equitable communities.']]],
    6: ['SDG 6: Clean Water and Sanitation', [['Cagayan River Water Quality Assessment', 'Research and outreach activities promote water-quality monitoring and sanitation practices.'], ['Community Waste and Sanitation Seminars', 'Residents learn practical ways to protect water sources and improve local sanitation.']]],
    7: ['SDG 7: Affordable and Clean Energy', [['Sustainable Campus Practices', 'Research encourages practical resource conservation and responsible facilities management.'], ['Energy-Efficient Learning Spaces', 'Applied projects explore responsible energy use in classrooms, laboratories, and offices.']]],
    8: ['SDG 8: Decent Work and Economic Growth', [['Skills Enhancement for Community Workers', 'Training and applied research strengthen community livelihoods and professional capabilities.'], ['Alumni Employability Research', 'Institutional research examines graduate employment, workplace readiness, and career development.']]],
    9: ['SDG 9: Industry, Innovation and Infrastructure', [['Applied Research and Technology Solutions', 'MCNP and ISAP develop evidence-based tools, systems, and innovations for institutional and community needs.'], ['Digital Infographics and Technology Projects', 'Students apply design and technology skills to communicate research and solve practical problems.']]],
    10: ['SDG 10: Reduced Inequalities', [['Inclusive Community Extension', 'Outreach programs prioritize underserved communities and broaden access to education, health, and support services.'], ['Accessible Research Communication', 'The RDC shares findings in formats that communities, students, and partner organizations can use.']]],
    11: ['SDG 11: Sustainable Cities and Communities', [['Community Development Partnerships', 'RDC collaborations support safer, healthier, and more resilient communities across Cagayan Valley.'], ['Public Safety and Barangay Research', 'Research helps partners understand community needs and strengthen local responses.']]],
    12: ['SDG 12: Responsible Consumption and Production', [['Waste Reduction and Resource Stewardship', 'Community education encourages responsible consumption, waste segregation, and sustainable practices.'], ['Laboratory Safety and Resource Management', 'Research facilities promote careful use, handling, and disposal of materials.']]],
    13: ['SDG 13: Climate Action', [['River Basin Eco-Resilience', 'Tree planting, environmental monitoring, and disaster-risk research help communities respond to climate hazards.'], ['Disaster Risk Management Education', 'Students and communities study preparedness for floods, typhoons, earthquakes, and other hazards.']]],
    14: ['SDG 14: Life Below Water', [['Waterway Protection Activities', 'Environmental stewardship supports the protection of waterways and aquatic ecosystems.'], ['River Monitoring and Community Awareness', 'Local monitoring and education encourage communities to reduce pollution entering rivers.']]],
    15: ['SDG 15: Life on Land', [['Cagayan Riverbank Reforestation', 'Faculty and students participate in native tree planting and local ecological conservation.'], ['Biodiversity and Local Land-Use Research', 'Research supports the protection of habitats and responsible development in Cagayan.']]],
    16: ['SDG 16: Peace, Justice and Strong Institutions', [['Legal Literacy and Crime Prevention Clinics', 'ISAP-led activities promote public safety, rights awareness, dispute mediation, and community trust.'], ['Research and Institutional Ethics', 'Evidence-based research and ethical review strengthen responsible institutions and public confidence.']]],
    17: ['SDG 17: Partnerships for the Goals', [['MCNP-ISAP Research Collaborations', 'The RDC works with schools, government offices, communities, and partner organizations to expand research impact.'], ['CBCP-UST Collaborative Project', 'The RDC participated in a collaborative research project with the Catholic Bishops’ Conference of the Philippines and UST.'], ['Regional Data Festival Participation', 'Faculty and students share research, statistics, and innovation with partner institutions.']]]
  };

  const initCardSlider = (slider) => {
    const slides = Array.from(slider.querySelectorAll('.sdg-card-slide'));
    const prevButton = slider.querySelector('.sdg-card-prev');
    const nextButton = slider.querySelector('.sdg-card-next');

    if (!slides.length) return;

    let currentIndex = 0;
    const showSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === currentIndex);
      });
    };

    prevButton?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      showSlide(currentIndex - 1);
    });

    nextButton?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      showSlide(currentIndex + 1);
    });

    showSlide(0);
  };

  const sdgModal = document.querySelector('[data-sdg-modal]');
  if (sdgModal) {
    const modalGallery = sdgModal.querySelector('[data-sdg-modal-gallery]');
    const modalLink = sdgModal.querySelector('[data-sdg-modal-link]');
    const modalEvents = sdgModal.querySelector('[data-sdg-modal-events]');
    const closeModal = () => {
      sdgModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('[data-sdg-card]').forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;

        const goal = card.getAttribute('data-goal');
        const detail = sdgDetails[goal];
        const imageClone = card.querySelector('.sdg-card-static-image')?.cloneNode(true);

        modalGallery.innerHTML = '';
        if (imageClone) {
          modalGallery.appendChild(imageClone);
        }

        modalLink.textContent = detail[0];
        modalEvents.innerHTML = detail[1].map(([eventTitle, description]) => `
          <article class="sdg-event-item">
            <h4><a href="news-events.html#sdg-advocacy-stories">${eventTitle}</a></h4>
            <p>${description}</p>
          </article>
        `).join('');

        sdgModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    sdgModal.querySelector('[data-sdg-close]').addEventListener('click', closeModal);
    sdgModal.addEventListener('click', (event) => {
      if (event.target === sdgModal) closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && sdgModal.classList.contains('active')) closeModal();
    });
  }

  // 8. Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.showToast('Thank you for your message. The RDC secretariat will respond shortly.', 'info');
      contactForm.reset();
    });
  }
});
