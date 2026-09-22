document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       DOM Elements
       ========================================= */

    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav-links');
    const tabs = [...document.querySelectorAll('.house-tab')];
    const hero = document.querySelector('.hero-img-placeholder');
    const propertyTabs = [...document.querySelectorAll('.prop-tab')];

/* =========================================
   Hero Slider
   ========================================= */

    const heroImages = [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85'
    ];

    const heroSteps = [...document.querySelectorAll('.hero-house-steps .house-step')];
    const heroIndicators = [...document.querySelectorAll('.hero-step-indicators .num')];
    const heroProgressFill = document.querySelector('#heroProgressFill');
    const heroProgressBar = document.querySelector('#heroProgressBar');

    const setSlide = (index) => {
        slide = Number(index);
        const totalSlides = heroImages.length;

        // 1. Dynamic Step Heights and Active State
        heroSteps.forEach((step, i) => {
            const stepNum = i + 1;
            const currentHouse = slide + 1;

            step.classList.toggle('active', i === slide);
            step.setAttribute('aria-selected', i === slide);
            step.classList.remove('step-high', 'step-mid', 'step-low');

            if (currentHouse === 1) {
                if (stepNum === 1) step.classList.add('step-high');
                else if (stepNum === 2) step.classList.add('step-mid');
                else if (stepNum === 3) step.classList.add('step-low');
            } else if (currentHouse === 2) {
                if (stepNum === 1) step.classList.add('step-mid');
                else if (stepNum === 2) step.classList.add('step-high');
                else if (stepNum === 3) step.classList.add('step-mid');
            } else if (currentHouse === 3) {
                if (stepNum === 1) step.classList.add('step-low');
                else if (stepNum === 2) step.classList.add('step-mid');
                else if (stepNum === 3) step.classList.add('step-high');
            }
        });

        // 2. Active Number Indicators
        heroIndicators.forEach((num, i) => {
            num.classList.toggle('active', i === slide);
        });

        // 3. Progress Bar Fill
        if (heroProgressFill) {
            const progressPercentage = ((slide + 1) / totalSlides) * 100;
            heroProgressFill.style.width = `${progressPercentage}%`;
        }

        // 4. Hero Background Image
        if (hero) {
            hero.style.backgroundImage = `url("${heroImages[slide]}")`;
        }
    };

    // Event Listeners for Steps
    heroSteps.forEach((step) => {
        step.addEventListener('click', () => {
            setSlide(Number(step.dataset.slide));
        });
    });

    // Event Listeners for Number Indicators
    heroIndicators.forEach((num) => {
        num.addEventListener('click', () => {
            setSlide(Number(num.dataset.slide));
        });
    });

    // Progress Bar Click Selection
    heroProgressBar?.addEventListener('click', (event) => {
        const rect = heroProgressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickedRatio = clickX / rect.width;
        
        let nextSlide = Math.floor(clickedRatio * heroImages.length);
        nextSlide = Math.max(0, Math.min(heroImages.length - 1, nextSlide));
        
        setSlide(nextSlide);
    });

    // Timer Initialization
    let slide = 0;
    if (heroSteps.length > 0) {
        setSlide(slide);

        window.setInterval(() => {
            slide = (slide + 1) % heroImages.length;
            setSlide(slide);
        }, 6000);
    }

    /* =========================================
       Property Category Tabs
       ========================================= */

    propertyTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            propertyTabs.forEach((item) => {
                item.classList.toggle('active', item === tab);
            });

            document.querySelectorAll('.property-card').forEach((card, index) => {
                card.style.opacity =
                    tab.dataset.category === 'Land' && index === 0
                        ? '.45'
                        : '1';
            });
        });
    });

    /* =========================================
       Header / Mobile Navigation
       ========================================= */

    window.addEventListener(
        'scroll',
        () => {
            header?.classList.toggle(
                'is-scrolled',
                window.scrollY > 8
            );
        },
        { passive: true }
    );

    toggle?.addEventListener('click', () => {
        const open = nav?.classList.toggle('is-open');

        toggle.setAttribute('aria-expanded', open);
    });

    document.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', () => {
            nav?.classList.remove('is-open');
        });
    });

    /* =========================================
       Contact Form
       ========================================= */

    document
        .querySelector('#contact-form')
        ?.addEventListener('submit', (event) => {
            event.preventDefault();

            const button = event.currentTarget.querySelector('button');

            if (button) {
                button.textContent = 'Message sent ✓';
                button.disabled = true;
            }
        });

    /* =========================================
       Today Sells Properties
       ========================================= */

    const houseData = {
        1: {
            tall: 'assets/images/houses/tall1.jpg',
            top: 'assets/images/houses/top1.jpg',
            bottom: 'assets/images/houses/bottom1.jpg'
        },

        2: {
            tall: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85',
            top: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=700&q=85',
            bottom: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=700&q=85'
        },

        3: {
            tall: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=85',
            top: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=700&q=85',
            bottom: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=700&q=85'
        }
    };

    const section = document.querySelector('#properties');

    if (section) {
        let currentHouse = 1;
        const totalHouses = 3;

        const houseSteps = section.querySelectorAll('.house-step');
        const numIndicators = section.querySelectorAll(
            '.step-indicators .num'
        );

        const progressFill = section.querySelector('#progressFill');
        const progressBar = section.querySelector('#progressBar');

        const imgTall = section.querySelector('#imgTall');
        const imgTop = section.querySelector('#imgTop');
        const imgBottom = section.querySelector('#imgBottom');

        const switchHouse = (houseIndex) => {
            currentHouse = Number(houseIndex);

            /* Dynamic height adjustments for steps */
            houseSteps.forEach((step) => {
                const stepNum = Number(step.dataset.house);
                step.classList.toggle('active', stepNum === currentHouse);

                // Remove existing height level classes
                step.classList.remove('step-high', 'step-mid', 'step-low');

                // Assign height dynamically based on active house
                if (currentHouse === 1) {
                    if (stepNum === 1) step.classList.add('step-high');
                    else if (stepNum === 2) step.classList.add('step-mid');
                    else if (stepNum === 3) step.classList.add('step-low');
                } else if (currentHouse === 2) {
                    if (stepNum === 1) step.classList.add('step-mid');
                    else if (stepNum === 2) step.classList.add('step-high');
                    else if (stepNum === 3) step.classList.add('step-mid');
                } else if (currentHouse === 3) {
                    if (stepNum === 1) step.classList.add('step-low');
                    else if (stepNum === 2) step.classList.add('step-mid');
                    else if (stepNum === 3) step.classList.add('step-high');
                }
            });

            /* Active number indicators */
            numIndicators.forEach((num) => {
                num.classList.toggle(
                    'active',
                    Number(num.dataset.house) === currentHouse
                );
            });

            /* Progress bar */
            if (progressFill) {
                const progressPercentage =
                    (currentHouse / totalHouses) * 100;

                progressFill.style.width = `${progressPercentage}%`;
            }

            /* Images */
            const currentData = houseData[currentHouse];

            if (!currentData) return;

            if (imgTall) {
                imgTall.style.backgroundImage =
                    `url("${currentData.tall}")`;
            }

            if (imgTop) {
                imgTop.style.backgroundImage =
                    `url("${currentData.top}")`;
            }

            if (imgBottom) {
                imgBottom.style.backgroundImage =
                    `url("${currentData.bottom}")`;
            }
        };

        /* House buttons */
        houseSteps.forEach((step) => {
            step.addEventListener('click', () => {
                if (step.dataset.house) {
                    switchHouse(step.dataset.house);
                }
            });
        });

        /* Number indicators */
        numIndicators.forEach((num) => {
            num.addEventListener('click', () => {
                if (num.dataset.house) {
                    switchHouse(num.dataset.house);
                }
            });
        });

        /* Progress bar */
        progressBar?.addEventListener('click', (event) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = event.clientX - rect.left;

            const clickedRatio = clickX / rect.width;

            let nextHouse = Math.ceil(
                clickedRatio * totalHouses
            );

            nextHouse = Math.max(
                1,
                Math.min(totalHouses, nextHouse)
            );

            switchHouse(nextHouse);
        });

        /* Initialize */
        switchHouse(1);
    }
});