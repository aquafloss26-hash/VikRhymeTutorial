
// ISOTOPE FILTER
jQuery(document).ready(function($){

  if ( $('.iso-box-wrapper').length > 0 ) { 

      var $container  = $('.iso-box-wrapper'), 
        $imgs     = $('.iso-box img');

      $container.imagesLoaded(function () {

        $container.isotope({
        layoutMode: 'fitRows',
        itemSelector: '.iso-box'
        });

        $imgs.load(function(){
          $container.isotope('reLayout');
        })

      });

      //filter items on button click

      $('.filter-wrapper li a').click(function(){

          var $this = $(this), filterValue = $this.attr('data-filter');

      $container.isotope({ 
        filter: filterValue,
        animationOptions: { 
            duration: 750, 
            easing: 'linear', 
            queue: false, 
        }                
      });             

      // don't proceed if already selected 

      if ( $this.hasClass('selected') ) { 
        return false; 
      }

      var filter_wrapper = $this.closest('.filter-wrapper');
      filter_wrapper.find('.selected').removeClass('selected');
      $this.addClass('selected');

        return false;
      }); 

  }

});


// PRELOADER JS
$(window).load(function(){
    $('.preloader').fadeOut(1000); // set duration in brackets    
});


// jQuery to collapse the navbar on scroll //
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});


/* HTML document is loaded. DOM is ready. 
-------------------------------------------*/
$(function(){

  // ------- WOW ANIMATED ------ //
  wow = new WOW(
  {
    mobile: false
  });
  wow.init();


  // HIDE MOBILE MENU AFTER CLIKING ON A LINK
  $('.navbar-collapse a').click(function(){
        $(".navbar-collapse").collapse('hide');
    });


  // NIVO LIGHTBOX
  $('.iso-box-section a').nivoLightbox({
        effect: 'fadeScale',
    });


  // HOME BACKGROUND SLIDESHOW
  $(function(){
    jQuery(document).ready(function() {
    $('#home').backstretch([
       "images/scratch.gif", 
       "images/piano1.gif",
       "images/guitar.gif",
       "images/voice.gif",
       "images/js6.gif",
       "images/webdevelopment.gif",
       "images/piano.gif",
       "images/js5.gif",
       "images/webdevelopment2.gif",
       "images/piano.gif",
       "images/drum.gif",
       "images/saxophone.gif",
        ],  {duration: 2000, fade: 750});
    });
  })

});



// Enhanced Testimonial Carousel with Auto-play and Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel with enhanced options
    const testimonialCarousel = new bootstrap.Carousel(document.getElementById('testimonialIndicator'), {
        interval: 5000, // Auto-slide every 5 seconds
        wrap: true,
        pause: 'hover' // Pause on hover
    });

    // Add active class animation to carousel items
    const carouselItems = document.querySelectorAll('.carousel-item');
    carouselItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Partner logos animation on scroll
    const partnerCards = document.querySelectorAll('.shadow-hover');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);

    // Initialize partner cards with staggered animation
    partnerCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Enhanced navigation button clicks with feedback
    const prevBtn = document.querySelector('.carousel-control-prev');
    const nextBtn = document.querySelector('.carousel-control-next');
    
    function addClickFeedback(button) {
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => addClickFeedback(prevBtn));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => addClickFeedback(nextBtn));
    }

    // Indicator click effect
    const indicators = document.querySelectorAll('.carousel-indicators button');
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            indicators.forEach(ind => ind.classList.remove('active'));
            this.classList.add('active');
            
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = rect.left + rect.width / 2 - size / 2;
            const y = rect.top + rect.height / 2 - size / 2;
            
            ripple.style.cssText = `
                position: fixed;
                border-radius: 50%;
                background: rgba(102, 126, 234, 0.4);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
                z-index: 9999;
            `;
            
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Checkout button
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty. Add some items first!');
        return;
    }
    
    // Ask for confirmation
    const confirmCheckout = confirm(`Proceed to checkout with total: $${cartTotal.textContent}?\nYou will be redirected to the payment page.`);
    
    if (!confirmCheckout) {
        return; // User cancelled
    }
    
    // Save cart data to localStorage for payment page
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartTotal', cartTotal.textContent);
    
    // Optional: Clear cart after checkout starts
    // cart = [];
    // localStorage.setItem('cart', JSON.stringify(cart));
    // updateCartDisplay();
    
    // Show loading message
    showNotification('Redirecting to payment page...');
    
    // Small delay for better UX
    setTimeout(() => {
        window.location.href = 'payment.html';
    }, 1000);
});