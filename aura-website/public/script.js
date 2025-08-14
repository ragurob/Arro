// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Smooth scroll for anchor links
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
    
    // Add scroll effect to navigation
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.classList.add('shadow-lg');
        } else {
            nav.classList.remove('shadow-lg');
        }
    });
    
    // ROI Calculator functionality
    function calculateROI() {
        // Get input values
        const rooms = parseFloat(document.getElementById('rooms').value) || 0;
        const occupancy = parseFloat(document.getElementById('occupancy').value) || 0;
        const adr = parseFloat(document.getElementById('adr').value) || 0;
        const conciergeCount = parseFloat(document.getElementById('concierge-count').value) || 0;
        const conciergeSalary = parseFloat(document.getElementById('concierge-salary').value) || 0;
        
        // Calculate metrics
        const annualStays = Math.round(rooms * (occupancy / 100) * 365);
        const currentServiceCost = conciergeCount * conciergeSalary;
        const auraBaseCost = annualStays * 10; // Using Prime tier pricing
        const auraCost = Math.round(auraBaseCost * 0.8); // With volume discount
        const annualSavings = currentServiceCost - auraCost;
        const additionalRevenue = Math.round(annualStays * adr * 0.40 * 0.20); // 40% increase on 20% of stays
        const totalROI = annualSavings + additionalRevenue;
        const paybackPeriod = auraCost > 0 ? Math.round((auraCost / (totalROI / 12)) * 10) / 10 : 0;
        
        // Update display with animation
        animateValue('annual-stays', annualStays);
        animateValue('current-cost', currentServiceCost, true);
        animateValue('aura-cost', auraCost, true);
        animateValue('annual-savings', annualSavings, true);
        animateValue('additional-revenue', additionalRevenue, true);
        animateValue('total-roi', totalROI, true);
        document.getElementById('payback-period').textContent = paybackPeriod > 0 ? paybackPeriod + ' months' : 'Immediate';
        
        // Show results section
        document.getElementById('roi-results').classList.remove('hidden');
    }
    
    // Animate number changes
    function animateValue(id, end, currency = false) {
        const obj = document.getElementById(id);
        const start = parseInt(obj.textContent.replace(/[^0-9.-]+/g, '')) || 0;
        const duration = 1000;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.round(start + (end - start) * progress);
            
            if (currency) {
                obj.textContent = '$' + current.toLocaleString();
            } else {
                obj.textContent = current.toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Attach calculator to inputs
    const calculatorInputs = ['rooms', 'occupancy', 'adr', 'concierge-count', 'concierge-salary'];
    calculatorInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', calculateROI);
        }
    });
    
    // Pricing toggle functionality
    const pricingToggle = document.getElementById('pricing-toggle');
    const monthlyBtn = document.getElementById('monthly-btn');
    const annualBtn = document.getElementById('annual-btn');
    const priceElements = document.querySelectorAll('[data-price]');
    const periodElements = document.querySelectorAll('[data-period]');
    
    if (pricingToggle) {
        // Monthly button click
        monthlyBtn.addEventListener('click', function() {
            monthlyBtn.classList.add('bg-aura-gold', 'text-aura-dark');
            monthlyBtn.classList.remove('bg-transparent', 'text-gray-400');
            annualBtn.classList.remove('bg-aura-gold', 'text-aura-dark');
            annualBtn.classList.add('bg-transparent', 'text-gray-400');
            
            // Update prices to monthly
            priceElements.forEach(el => {
                const basePrice = parseFloat(el.getAttribute('data-price'));
                el.textContent = '$' + basePrice;
            });
            periodElements.forEach(el => {
                el.textContent = 'per guest stay';
            });
        });
        
        // Annual button click
        annualBtn.addEventListener('click', function() {
            annualBtn.classList.add('bg-aura-gold', 'text-aura-dark');
            annualBtn.classList.remove('bg-transparent', 'text-gray-400');
            monthlyBtn.classList.remove('bg-aura-gold', 'text-aura-dark');
            monthlyBtn.classList.add('bg-transparent', 'text-gray-400');
            
            // Update prices to annual (20% discount)
            priceElements.forEach(el => {
                const basePrice = parseFloat(el.getAttribute('data-price'));
                const annualPrice = Math.round(basePrice * 0.8);
                el.textContent = '$' + annualPrice;
            });
            periodElements.forEach(el => {
                el.textContent = 'per guest stay (annual)';
            });
        });
    }
    
    // Testimonial carousel
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((t, i) => {
            t.classList.toggle('hidden', i !== index);
        });
        testimonialDots.forEach((d, i) => {
            d.classList.toggle('bg-aura-gold', i === index);
            d.classList.toggle('bg-gray-600', i !== index);
        });
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
    
    // Auto-rotate testimonials
    if (testimonials.length > 0) {
        setInterval(nextTestimonial, 5000);
        
        // Allow manual navigation
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentTestimonial = index;
                showTestimonial(currentTestimonial);
            });
        });
    }
    
    // Animate metrics when in view
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const metricsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                const endValue = parseInt(entry.target.getAttribute('data-metric'));
                const suffix = entry.target.getAttribute('data-suffix') || '';
                animateMetric(entry.target, endValue, suffix);
                entry.target.setAttribute('data-animated', 'true');
            }
        });
    }, observerOptions);
    
    // Observe all metric elements
    document.querySelectorAll('[data-metric]').forEach(el => {
        metricsObserver.observe(el);
    });
    
    function animateMetric(element, endValue, suffix) {
        const duration = 2000;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.round(endValue * progress);
            
            element.textContent = current.toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Interactive Architecture Tabs
    const architectureTabs = document.querySelectorAll('.architecture-tab');
    const architecturePanels = document.querySelectorAll('.architecture-panel');
    
    architectureTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panels
            architectureTabs.forEach(t => t.classList.remove('bg-aura-gold', 'text-aura-dark'));
            architectureTabs.forEach(t => t.classList.add('bg-transparent', 'text-gray-400'));
            architecturePanels.forEach(p => p.classList.add('hidden'));
            
            // Add active class to clicked tab and corresponding panel
            tab.classList.remove('bg-transparent', 'text-gray-400');
            tab.classList.add('bg-aura-gold', 'text-aura-dark');
            architecturePanels[index].classList.remove('hidden');
        });
    });
    
    // Live Interaction Flow Animation
    const flowSteps = document.querySelectorAll('.flow-step');
    let currentStep = 0;
    
    function animateFlow() {
        // Reset all steps
        flowSteps.forEach(step => {
            step.classList.remove('border-aura-gold', 'bg-aura-gold/10');
            step.classList.add('border-gray-600');
        });
        
        // Highlight current step
        if (flowSteps[currentStep]) {
            flowSteps[currentStep].classList.remove('border-gray-600');
            flowSteps[currentStep].classList.add('border-aura-gold', 'bg-aura-gold/10');
        }
        
        // Move to next step
        currentStep = (currentStep + 1) % flowSteps.length;
    }
    
    // Start flow animation
    if (flowSteps.length > 0) {
        setInterval(animateFlow, 2000);
    }
    
    // Dashboard metrics animation
    const dashboardMetrics = document.querySelectorAll('.dashboard-metric');
    
    function updateDashboardMetrics() {
        dashboardMetrics.forEach(metric => {
            const min = parseInt(metric.getAttribute('data-min'));
            const max = parseInt(metric.getAttribute('data-max'));
            const suffix = metric.getAttribute('data-suffix') || '';
            const isDecimal = metric.hasAttribute('data-decimal');
            
            let value = Math.random() * (max - min) + min;
            if (isDecimal) {
                value = value.toFixed(1);
            } else {
                value = Math.round(value);
            }
            
            metric.textContent = value + suffix;
        });
    }
    
    // Update dashboard metrics periodically
    if (dashboardMetrics.length > 0) {
        setInterval(updateDashboardMetrics, 3000);
        updateDashboardMetrics(); // Initial update
    }
    
    // Hover effects for architecture components
    const architectureCards = document.querySelectorAll('.architecture-card');
    
    architectureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const details = card.querySelector('.architecture-details');
            if (details) {
                details.classList.remove('hidden');
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const details = card.querySelector('.architecture-details');
            if (details) {
                details.classList.add('hidden');
            }
        });
    });
});