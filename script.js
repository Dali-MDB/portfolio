// Portfolio Navigation and Animation Script

class PortfolioApp {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.topNav = document.getElementById('topNav');
        this.navItems = document.querySelectorAll('.nav-item');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.animateSkillBars();
        this.setupFloatingElements();
    }

    setupEventListeners() {
        // Sidebar toggle
        this.sidebarToggle.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Sidebar close button
        const sidebarClose = document.getElementById('sidebarClose');
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.sidebar.contains(e.target) && !this.sidebarToggle.contains(e.target)) {
                this.closeSidebar();
            }
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSidebar();
            }
        });
    }

    setupScrollEffects() {
        let lastScrollTop = 0;
        const navContainer = this.topNav.querySelector('.nav-container');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class for transparency effect
            if (scrollTop > 50) {
                navContainer.classList.add('scrolled');
            } else {
                navContainer.classList.remove('scrolled');
            }
            
            // Update active navigation link based on scroll position
            this.updateActiveNavLink();
            
            lastScrollTop = scrollTop;
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset for navbar height
            const sectionHeight = section.offsetHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section's nav link
        if (currentSection) {
            const activeLink = document.querySelector(`.nav-links a[href="#${currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('active');
        this.sidebarToggle.classList.toggle('active');
        document.body.style.overflow = this.sidebar.classList.contains('active') ? 'hidden' : '';
    }

    closeSidebar() {
        this.sidebar.classList.remove('active');
        this.sidebarToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    animateSkillBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        const skillCategories = document.querySelectorAll('.skill-category');

        skillCategories.forEach((category, index) => {
            setTimeout(() => {
                category.style.opacity = '1';
                category.style.transform = 'translateY(0)';
            }, index * 200);
        });

        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = `${progress}%`;
            }, 400 + (index * 200));
        });
    }

    setupFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        const heroVisual = document.querySelector('.hero-visual');
        
        if (!heroVisual) return;
        
        let mouseX = 0;
        let mouseY = 0;
        let heroRect = heroVisual.getBoundingClientRect();
        let isMouseInHero = false;
        
        // Update mouse position
        heroVisual.addEventListener('mousemove', (e) => {
            mouseX = e.clientX - heroRect.left;
            mouseY = e.clientY - heroRect.top;
            isMouseInHero = true;
            
            // Update hero rect on mouse move to handle window resize
            heroRect = heroVisual.getBoundingClientRect();
        });
        
        heroVisual.addEventListener('mouseenter', () => {
            isMouseInHero = true;
        });
        
        heroVisual.addEventListener('mouseleave', () => {
            isMouseInHero = false;
            floatingElements.forEach(element => {
                element.style.transform = '';
            });
        });
        
        // Animate floating elements to follow cursor
        const animateElements = () => {
            floatingElements.forEach((element, index) => {
                if (!isMouseInHero) {
                    element.style.transform = '';
                    return;
                }
                
                const elementRect = element.getBoundingClientRect();
                const elementCenterX = elementRect.left + elementRect.width / 2;
                const elementCenterY = elementRect.top + elementRect.height / 2;
                
                // Calculate distance from cursor
                const deltaX = mouseX - (elementCenterX - heroRect.left);
                const deltaY = mouseY - (elementCenterY - heroRect.top);
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                // Only move elements if cursor is within a certain range
                if (distance < 150) {
                    const moveX = (deltaX / distance) * 15 * (1 - distance / 150);
                    const moveY = (deltaY / distance) * 15 * (1 - distance / 150);
                    
                    // Directly set transform to move towards cursor
                    element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                } else {
                    element.style.transform = '';
                }
            });
            
            requestAnimationFrame(animateElements);
        };
        
        animateElements();
    }
}

// Initialize the portfolio app
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    
    // Initialize projects
    renderProjects();
    
    // Pagination controls
    document.getElementById("prevPage").addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (currentPage > 1) {
            currentPage--;
            renderProjects();
            // Scroll to top of projects section
            document.getElementById("section-projects").scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
    
    document.getElementById("nextPage").addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (currentPage * itemsPerPage < projects.length) {
            currentPage++;
            renderProjects();
            // Scroll to top of projects section
            document.getElementById("section-projects").scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
    
    // Update pagination numbers
    function updatePaginationNumbers() {
        const totalPages = Math.ceil(projects.length / itemsPerPage);
        const paginationControls = document.querySelector('.pagination-controls');
        
        // Remove existing page numbers if any
        const existingNumbers = paginationControls.querySelector('.page-numbers');
        if (existingNumbers) {
            existingNumbers.remove();
        }
        
        // Create page numbers container
        const pageNumbers = document.createElement("div");
        pageNumbers.className = "page-numbers";
        
        // Create individual page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.className = "page-number";
            pageButton.innerHTML = i;
            
            // Highlight current page
            if (i === currentPage) {
                pageButton.classList.add("active");
            }
            
            // Add click event
            pageButton.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (i !== currentPage) {
                    currentPage = i;
                    renderProjects();
                    // Scroll to top of projects section
                    document.getElementById("section-projects").scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            
            pageNumbers.appendChild(pageButton);
        }
        
        // Insert page numbers between prev and next buttons
        const nextButton = paginationControls.querySelector('#nextPage');
        paginationControls.insertBefore(pageNumbers, nextButton);
    }
    
    // Call updatePaginationNumbers after rendering projects
    const originalRenderProjects = renderProjects;
    renderProjects = function() {
        originalRenderProjects();
        updatePaginationNumbers();
    };
    
    // Initial call to set up pagination numbers
    updatePaginationNumbers();
});

const placeholderImage = "./images/my_placeholder.png";

const projects = [
    {
      title: "Travel Agency Platform",
      technologies: ["Python", "Django", "DRF", "PostgreSQL", "Hybrid Recommendation System"],
      description: "Led a team of 6 to build a complete travel agency web platform. Designed and optimized a PostgreSQL database schema for scalability and data integrity, reducing redundant queries by 35%. Developed efficient RESTful APIs with Django REST Framework, achieving sub-200ms average response times through query optimization and caching strategies. Integrated a hybrid recommendation system (content-based + collaborative filtering), improving suggestion accuracy by 40%.",
      images: [placeholderImage, placeholderImage, placeholderImage],
      github: "https://github.com/Dali-M"
    },
    {
        title: "Freelance Delivery System Web Application",
        technologies: ["FastAPI", "Python", "SQLAlchemy", "JWT", "Email Services"],
        description: "Developed a secure, high-performance backend for a delivery system web application using FastAPI. Implemented RESTful APIs with JWT-based authentication, role management, and email notification services. Designed ORM models and optimized SQLAlchemy queries to support order tracking, user management, and real-time status updates. Delivered a clean, scalable API structure supporting frontend integration and deployment.",
        images: [placeholderImage],
        github: "https://github.com/Dali-M"
    },
    {
      title: "Internal Tools for Club Scientifique de l'ESI (CSE)",
      technologies: ["Django", "FastAPI", "PostgreSQL"],
      description: "Contributed to the development and maintenance of 3+ internal web tools, including backend APIs and management dashboards. Collaborated with team members on backend development using Django and FastAPI. Oversaw project management tasks and mentored new developers in API optimization and backend workflows.",
      images: [placeholderImage],
      github: "https://github.com/Dali-M"
    },
    {
      title: "Stock Management System",
      technologies: ["Python", "PyQt6", "Pandas", "Data sheet based storage"],
      description: "Developed a modern, user-friendly stock management system for a local retail store using PyQt6 for the desktop application interface. Designed an efficient data storage mechanism leveraging structured spreadsheet files as a lightweight, portable database alternative for inventory tracking, sales records, and supplier management. Delivered a reliable, intuitive system enabling store staff to easily manage stock levels, generate reports, and optimize inventory operations without the need for a full-fledged database server.",
      images: [placeholderImage],
      github: "https://github.com/Dali-M"
    },
    {
      title: "Fitness Web App",
      technologies: ["Python", "Django", "DRF", "PostgreSQL", "Hybrid Recommendation System"],
      description: "Django-based fitness app with user auth, workout logs, and progress tracking.",
      images: [placeholderImage],
      github: "https://github.com/Dali-M"
    },
    {
        title: "Inventory Demand Predictor",
        technologies: ["Python", "Scikit-learn", "Pandas", "Matplotlib", "Seaborn"],
        description: "Developed a predictive analytics tool designed to forecast product demand for retail inventory management. Leveraged historical sales data and seasonal trends to train a regression model using scikit-learn, accurately predicting future stock requirements. Built automated data preprocessing pipelines with Pandas, performed exploratory data analysis, and visualized key insights through Matplotlib. This tool enables store managers to optimize inventory restocking schedules, reduce overstocking and shortages, and improve operational efficiency.",
        images: [placeholderImage],
        github: "https://github.com/Dali-M"
    }
  ];
  
  const projectsContainer = document.getElementById("projects-container");
  const itemsPerPage = 3;
  let currentPage = 1;
  
  function renderProjects() {
    if (!projectsContainer) {
      console.error("Projects container not found!");
      return;
    }
    
    projectsContainer.innerHTML = "";
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProjects = projects.slice(start, end);
  
    pageProjects.forEach((project, index) => {
      const card = document.createElement("div");
      card.className = "project-card";
  
      const content = document.createElement("div");
      content.className = "project-content";
      content.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.technologies.join(", ")}</p>
        <p>${project.description}</p>
        <a href="${project.github}" target="_blank" class="project-link">View on GitHub</a>
      `;
  
      const imageContainer = document.createElement("div");
      imageContainer.className = "project-image";
  
      let currentImg = 0;
      const imgElement = document.createElement("img");
      imgElement.src = project.images[currentImg] || placeholderImage;
      imgElement.alt = `${project.title} screenshot`;
      
      // Add error handling for image loading
      imgElement.onerror = function() {
        this.src = "./images/my_placeholder.png";
      };
      
      imgElement.onload = function() {
        // Add the 'loaded' class to make the image visible
        this.classList.add('loaded');
      };
      
      imageContainer.appendChild(imgElement);
      
      // Add image counter if multiple images
      if (project.images.length > 1) {
        const imageCounter = document.createElement("div");
        imageCounter.className = "image-counter";
        imageCounter.innerHTML = `${currentImg + 1} / ${project.images.length}`;
        imageContainer.appendChild(imageCounter);
        
        // Add left arrow button
        const leftArrow = document.createElement("button");
        leftArrow.className = "carousel-arrow left-arrow";
        leftArrow.innerHTML = "‹";
        leftArrow.addEventListener("click", (e) => {
          e.stopPropagation();
          currentImg = (currentImg - 1 + project.images.length) % project.images.length;
          imgElement.src = project.images[currentImg];
          
          // Update counter
          const counter = imageContainer.querySelector('.image-counter');
          if (counter) {
            counter.innerHTML = `${currentImg + 1} / ${project.images.length}`;
          }
          
          // Update active dot
          const dotsContainer = imageContainer.querySelector('.carousel-dots');
          if (dotsContainer) {
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, index) => {
              dot.classList.toggle('active', index === currentImg);
            });
          }
        });
        imageContainer.appendChild(leftArrow);
        
        // Add right arrow button
        const rightArrow = document.createElement("button");
        rightArrow.className = "carousel-arrow right-arrow";
        rightArrow.innerHTML = "›";
        rightArrow.addEventListener("click", (e) => {
          e.stopPropagation();
          currentImg = (currentImg + 1) % project.images.length;
          imgElement.src = project.images[currentImg];
          
          // Update counter
          const counter = imageContainer.querySelector('.image-counter');
          if (counter) {
            counter.innerHTML = `${currentImg + 1} / ${project.images.length}`;
          }
          
          // Update active dot
          const dotsContainer = imageContainer.querySelector('.carousel-dots');
          if (dotsContainer) {
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, index) => {
              dot.classList.toggle('active', index === currentImg);
            });
          }
        });
        
        // Add carousel dots
        const dotsContainer = document.createElement("div");
        dotsContainer.className = "carousel-dots";
        
        // Create dots for each image
        for (let i = 0; i < project.images.length; i++) {
          const dot = document.createElement("button");
          dot.className = "carousel-dot";
          dot.setAttribute("data-index", i);
          
          // Set first dot as active
          if (i === 0) {
            dot.classList.add("active");
          }
          
          dot.addEventListener("click", (e) => {
            e.stopPropagation();
            currentImg = i;
            imgElement.src = project.images[currentImg];
            
            // Update counter
            const counter = imageContainer.querySelector('.image-counter');
            if (counter) {
              counter.innerHTML = `${currentImg + 1} / ${project.images.length}`;
            }
            
            // Update active dot
            dotsContainer.querySelectorAll('.carousel-dot').forEach((d, index) => {
              d.classList.toggle('active', index === i);
            });
          });
          
          dotsContainer.appendChild(dot);
        }
        
        imageContainer.appendChild(dotsContainer);
        imageContainer.appendChild(rightArrow);
      }
  
      card.appendChild(content);
      card.appendChild(imageContainer);
      projectsContainer.appendChild(card);
    });
  }
  
  renderProjects();
  