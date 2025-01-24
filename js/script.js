document.addEventListener('DOMContentLoaded', function() {
    // Mobile view notice
    if (window.innerWidth > 480) {
        const notice = document.createElement('div');
        notice.className = 'mobile-view-notice';
        notice.innerHTML = '<i class="fas fa-mobile-alt"></i> This is a mobile view. For best experience, use your mobile device.';
        document.body.appendChild(notice);

        setTimeout(() => {
            notice.remove();
        }, 6000);
    }

    // Modal functions
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.classList.add('modal-open');
            
            // Initialize collapsible menus when rules or amenities modal opens
            if (modalId === 'rules-modal' || modalId === 'amenities-modal') {
                initializeCollapsible(modal);
            }
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }

    // Button click handlers
    const buttonMappings = {
        'book-now-btn': 'book-now-modal',
        'book-now-footer-btn': 'book-now-modal',
        'reviews-btn': 'reviews-modal',
        'nearby-btn': 'nearby-modal',
        'emergency-btn': 'emergency-modal',
        'rules-btn': 'rules-modal',
        'specials-btn': 'specials-modal',
        'host-favorites': 'food-modal',
        'gallery-card': 'gallery-modal',
        'rooms-card': 'rooms-modal',
        'amenities-card': 'amenities-modal'
    };

    // Add click handlers for all buttons
    Object.entries(buttonMappings).forEach(([btnId, modalId]) => {
        const button = document.getElementById(btnId);
        if (button) {
            button.addEventListener('click', () => {
                console.log(`Button clicked: ${btnId} for modal: ${modalId}`);
                const modal = document.getElementById(modalId);
                if (modal) {
                    openModal(modalId);
                } else {
                    console.error(`Modal not found: ${modalId}`);
                }
            });
        } else {
            console.error(`Button not found: ${btnId}`);
        }
    });

    // Close button handlers
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });

    // Share button functionality
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: "Stonefield Farms - Digital Guidebook",
                        text: 'Check out this amazing property!',
                        url: window.location.href
                    });
                } catch (err) {
                    console.log('Error sharing:', err);
                    alert('Unable to share at this time');
                }
            } else {
                alert('Share via: [Copy URL functionality to be implemented]');
            }
        });
    }

    // Collapsible menu functionality
    function initializeCollapsible(modalElement) {
        const headers = modalElement.querySelectorAll('.category-header');
        
        headers.forEach(header => {
            // Remove existing event listeners
            header.replaceWith(header.cloneNode(true));
            const newHeader = modalElement.querySelector(`[data-category="${header.dataset.category}"]`);
            
            newHeader.addEventListener('click', function() {
                const category = this.parentElement;
                const content = category.querySelector('.category-content');
                const icon = this.querySelector('i');
                
                // Close other categories
                const otherCategories = modalElement.querySelectorAll('.rule-category.active, .amenity-category.active');
                otherCategories.forEach(otherCategory => {
                    if (otherCategory !== category) {
                        otherCategory.classList.remove('active');
                        otherCategory.querySelector('.category-content').style.display = 'none';
                        otherCategory.querySelector('i').style.transform = 'rotate(0deg)';
                    }
                });
                
                // Toggle current category
                category.classList.toggle('active');
                if (category.classList.contains('active')) {
                    content.style.display = 'block';
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    content.style.display = 'none';
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
    }

    // Gallery functionality
    function initializeGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                
                const lightboxImg = document.createElement('img');
                lightboxImg.src = img.src;
                
                const closeBtn = document.createElement('span');
                closeBtn.className = 'lightbox-close';
                closeBtn.innerHTML = '&times;';
                
                lightbox.appendChild(lightboxImg);
                lightbox.appendChild(closeBtn);
                document.body.appendChild(lightbox);
                
                setTimeout(() => lightbox.classList.add('active'), 10);
                
                const closeLightbox = () => {
                    lightbox.classList.remove('active');
                    setTimeout(() => lightbox.remove(), 300);
                };
                
                closeBtn.addEventListener('click', closeLightbox);
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) closeLightbox();
                });
            });
        });
    }

    // Initialize gallery when gallery card is clicked
    const galleryCard = document.getElementById('gallery-card');
    if (galleryCard) {
        galleryCard.addEventListener('click', () => {
            setTimeout(initializeGallery, 100);
            // Open gallery modal
            const galleryModal = document.getElementById('gallery-modal');
            if (galleryModal) {
                galleryModal.style.display = 'block';
            }
        });

        // Close gallery modal
        const galleryModal = document.getElementById('gallery-modal');
        if (galleryModal) {
            const galleryCloseBtn = galleryModal.querySelector('.close');
            if (galleryCloseBtn) {
                galleryCloseBtn.addEventListener('click', () => {
                    galleryModal.style.display = 'none';
                });
            }

            // Close gallery modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === galleryModal) {
                    galleryModal.style.display = 'none';
                }
            });
        }
    }

    // Gallery Filtering
    function initializeGalleryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        // Show all items initially
        galleryItems.forEach(item => item.classList.add('show'));

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.classList.add('show');
                    } else {
                        item.classList.remove('show');
                    }
                });
            });
        });
    }

    // Initialize filters when gallery modal opens
    document.getElementById('gallery-card').addEventListener('click', () => {
        setTimeout(() => {
            initializeGalleryFilters();
            // Show all items initially
            document.querySelectorAll('.gallery-item').forEach(item => item.classList.add('show'));
        }, 100);
    });

    // Add this with your other event listeners
    document.getElementById('rooms-card').addEventListener('click', function() {
        document.getElementById('events-modal').style.display = 'block';
    });

    // Room Gallery functionality
    function initializeRoomGalleries() {
        const galleries = document.querySelectorAll('.room-image-gallery');
        
        galleries.forEach(gallery => {
            const images = gallery.querySelectorAll('img');
            const dots = gallery.querySelectorAll('.dot');
            const prevBtn = gallery.querySelector('.prev');
            const nextBtn = gallery.querySelector('.next');
            let currentIndex = 0;

            function showImage(index) {
                images.forEach(img => img.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                images[index].classList.add('active');
                dots[index].classList.add('active');
            }

            function nextImage() {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            }

            function prevImage() {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(currentIndex);
            }

            prevBtn.addEventListener('click', e => {
                e.stopPropagation();
                prevImage();
            });

            nextBtn.addEventListener('click', e => {
                e.stopPropagation();
                nextImage();
            });

            dots.forEach((dot, index) => {
                dot.addEventListener('click', e => {
                    e.stopPropagation();
                    currentIndex = index;
                    showImage(currentIndex);
                });
            });
        });
    }

    // Initialize galleries when rooms modal opens
    document.getElementById('rooms-card').addEventListener('click', () => {
        setTimeout(initializeRoomGalleries, 100);
    });

    // Add all 18 event images dynamically
    function loadEventImages() {
        const eventsGrid = document.querySelector('.events-grid');
        eventsGrid.innerHTML = ''; // Clear existing content
        
        // Add all 18 images
        for (let i = 1; i <= 18; i++) {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            
            const img = document.createElement('img');
            img.src = `assets/gallery/events/${i}.jpg`;
            img.alt = `Event at Stone Field Farms ${i}`;
            img.loading = 'lazy';
            
            eventItem.appendChild(img);
            eventsGrid.appendChild(eventItem);
        }
    }

    // Call this when the events modal is opened
    document.getElementById('rooms-card').addEventListener('click', loadEventImages);

    // Gallery Filter Functionality
    function initGalleryFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all') {
                        item.style.display = 'block';
                    } else {
                        if (item.classList.contains(filterValue)) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    }
                });
            });
        });
    }

    // Initialize gallery filter when gallery modal opens
    document.getElementById('gallery-card').addEventListener('click', () => {
        setTimeout(initGalleryFilter, 100); // Small delay to ensure DOM is ready
    });

    // Add WhatsApp link to Events CTA button
    document.getElementById('event-enquiry-btn').addEventListener('click', function() {
        window.open('https://wa.me/919319821414', '_blank');
    });
}); 