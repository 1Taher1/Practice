
/**
 * Ikay Engineering Solutions
 * Main JavaScript File
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 50,
      delay: 100
    });
  
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
  
    // Navigation functionality
    initNavigation();
    
    // Parallax effect for hero section
    initParallax();
    
    // Initialize tabs in Projects section
    initProjectTabs();
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Initialize project modals
    initProjectModals();
    
    // Initialize form submission
    initContactForm();
  });
  
  /**
   * Initialize header and navigation functionality
   */
  function initNavigation() {
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    // Fixed header on scroll
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      
      // Toggle icon between bars and X
      const icon = mobileMenuBtn.querySelector('i');
      if (mobileMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    
    // Close mobile menu when clicking a link
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
    
    // Smooth scrolling for all navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Get header height for proper offset
          const headerHeight = header.offsetHeight;
          const elementPosition = targetElement.offsetTop;
          const offsetPosition = elementPosition - headerHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  /**
   * Initialize parallax effect on hero section
   */
  function initParallax() {
    const heroBackground = document.querySelector('.hero-bg');
    
    if (heroBackground) {
      window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;
        const scale = 1 + scrollY * 0.0005;
        const translateY = scrollY * 0.15;
        
        heroBackground.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      });
    }
  }
  
  /**
   * Initialize project tabs filtering
   */
  function initProjectTabs() {
    const tabs = document.querySelectorAll('.project-tab');
    const projectCards = document.querySelectorAll('.project-card');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Get selected category
        const selectedCategory = this.getAttribute('data-category');
        
        // Show/hide projects based on category
        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          // Apply fade in animation to visible cards
          if (selectedCategory === 'All' || selectedCategory === cardCategory) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
    
    // Fade in projects on load with staggered delay
    projectCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.animation = 'fadeIn 0.5s forwards';
      }, index * 100 + 300);
    });
  }
  
  /**
   * Initialize testimonial slider
   */
  function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.testimonial-prev');
    const nextButton = document.querySelector('.testimonial-next');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (!track || slides.length === 0) return;
    
    let currentSlide = 0;
    const slideWidth = 100; // 100% width for each slide
    let autoplayInterval;
    
    // Set initial position
    updateSliderPosition();
    
    // Previous button click
    prevButton.addEventListener('click', function() {
      currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
      updateSliderPosition();
      resetAutoplay();
    });
    
    // Next button click
    nextButton.addEventListener('click', function() {
      currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
      updateSliderPosition();
      resetAutoplay();
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', function() {
        currentSlide = index;
        updateSliderPosition();
        resetAutoplay();
      });
    });
    
    // Start autoplay
    startAutoplay();
    
    // Update slider position based on currentSlide
    function updateSliderPosition() {
      track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
      
      // Update active dot
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }
    
    // Autoplay functions
    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
        updateSliderPosition();
      }, 6000);
    }
    
    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }
    
    // Pause autoplay when mouse enters slider
    track.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    
    // Resume autoplay when mouse leaves slider
    track.addEventListener('mouseleave', startAutoplay);
    
    // Handle touch events for swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    function handleSwipe() {
      // Detect swipe direction
      if (touchEndX < touchStartX - 50) {
        // Swipe left - go to next slide
        currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
      } else if (touchEndX > touchStartX + 50) {
        // Swipe right - go to previous slide
        currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
      }
      
      updateSliderPosition();
      resetAutoplay();
    }
  }
  
  /**
   * Initialize project modals
   */
  function initProjectModals() {
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalLocation = document.getElementById('modal-location');
    const modalDescription = document.getElementById('modal-description');
    
    // Project details data
    const projectDetails = [
      {
        title: 'Corporate Office HVAC Upgrade',
        category: 'Commercial',
        description: 'Complete redesign and installation of energy-efficient VRF system for a 15-floor corporate headquarters. The project involved replacing the outdated system while maintaining operations in the fully occupied building, resulting in a 40% reduction in energy consumption and improved comfort for over 2,000 employees.',
        image: src="./Images/corporate office.jpg",
        location: 'Hyderabad, India'
      },
      {
        title: 'Hospital Ventilation System',
        category: 'Healthcare',
        description: 'Design and implementation of specialized ventilation system with HEPA filtration for a 200-bed hospital. This state-of-the-art solution ensures optimal air quality in operating theaters, ICUs, and isolation rooms, meeting the strictest healthcare air quality standards and infection control protocols.',
        image: src="./Images/hospital ventilation.png",
        location: 'Hyderabad, India'
      },
      {
        title: 'Manufacturing Plant MEP Installation',
        category: 'Industrial',
        description: 'Comprehensive MEP services for a new manufacturing facility including industrial-grade HVAC systems. The project included advanced ventilation systems for process areas, precise temperature control for product storage, and energy-efficient solutions throughout the 50,000 sq ft facility.',
        image: src="./Images/manufacturing.jpg",
        location: 'Hyderabad, India'
      },
      {
        title: 'Villa Climate Control',
        category: 'Residential',
        description: 'Installation of integrated climate control systems for a premium residential villa. This project featured smart home integration, multi-zone climate control, and energy-efficient VRF systems, providing precise temperature and humidity control while maintaining architectural aesthetics.',
        image: src="./Images/luxury villa.jpg",
        location: 'Hyderabad, India'
      },
      {
        title: 'Retail Mall HVAC System',
        category: 'Commercial',
        description: 'Design and implementation of central HVAC system for a 500,000 sq ft shopping mall. This high-capacity solution efficiently manages climate control across diverse retail environments, food courts, and common areas, balancing comfort with energy efficiency in this massive commercial space.',
        image: src="./Images/retail mall.webp" ,
        location: 'Hyderabad, India'
      },
      {
        title: 'Diagnostic Center MEP Services',
        category: 'Healthcare',
        description: 'Specialized MEP installations for a state-of-the-art diagnostic center with precision temperature control. This project included dedicated systems for MRI, CT scanning, and laboratory areas, with redundant backup systems ensuring uninterrupted operation for critical diagnostic equipment.',
        image: src="./Images/diagnostic centre.jpg",
        location: 'Hyderabad, India'
      }
    ];
    
    projectCards.forEach((card, index) => {
      card.addEventListener('click', function() {
        const project = projectDetails[index];
        
        // Populate modal with project data
        modalImage.src = project.image;
        modalImage.alt = project.title;
        modalTitle.textContent = project.title;
        modalCategory.textContent = project.category;
        modalLocation.textContent = project.location;
        modalDescription.textContent = project.description;
        
        // Show modal with fade-in effect
        modal.style.display = 'block';
        setTimeout(() => {
          modal.style.opacity = '1';
        }, 10);
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
      });
    });
    
    // Close modal when clicking X button
    closeModal.addEventListener('click', function() {
      closeProjectModal();
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeProjectModal();
      }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modal.style.display === 'block') {
        closeProjectModal();
      }
    });
    
    function closeProjectModal() {
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 300);
    }
  }
  
  /**
   * Initialize contact form submission end khatam
   */



  window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
