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
        'assets/images/hero/hero1.jpg',
        'assets/images/hero/hero2.jpg',
        'assets/images/hero/hero3.jpg'
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

    heroSteps.forEach((step) => {
        step.addEventListener('click', () => {
            setSlide(Number(step.dataset.slide));
        });
    });

    heroIndicators.forEach((num) => {
        num.addEventListener('click', () => {
            setSlide(Number(num.dataset.slide));
        });
    });

    heroProgressBar?.addEventListener('click', (event) => {
        const rect = heroProgressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickedRatio = clickX / rect.width;

        let nextSlide = Math.floor(clickedRatio * heroImages.length);
        nextSlide = Math.max(0, Math.min(heroImages.length - 1, nextSlide));

        setSlide(nextSlide);
    });

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
           Header / Navigation, Smooth Scroll & Scrollspy
           ========================================= */

    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    let isClickScrolling = false;
    let scrollTimeout = null;

    const setActiveLink = (targetId) => {
        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === targetId);
        });
    };

    // Custom Smooth Scroll Engine
    const smoothScrollTo = (targetPosition, duration = 600, callback) => {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const easeInOutQuad = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
        };

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);

            window.scrollTo(0, run);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                window.scrollTo(0, targetPosition);
                if (callback) callback();
            }
        };

        requestAnimationFrame(animation);
    };

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                event.preventDefault();

                isClickScrolling = true;

                setActiveLink(targetId);

                nav?.classList.remove('is-open');
                toggle?.setAttribute('aria-expanded', 'false');

                const headerOffset = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                if (scrollTimeout) clearTimeout(scrollTimeout);

                smoothScrollTo(offsetPosition, 600, () => {
                    scrollTimeout = setTimeout(() => {
                        isClickScrolling = false;
                    }, 100);
                });
            }
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '-25% 0px -65% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        if (isClickScrolling) return;

        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = `#${entry.target.getAttribute('id')}`;
                setActiveLink(id);
            }
        });
    }, observerOptions);

    sections.forEach((sec) => sectionObserver.observe(sec));

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
            tall: 'assets/images/houses/tall2.jpg',
            top: 'assets/images/houses/top2.jpg',
            bottom: 'assets/images/houses/bottom3.jpg'
        },

        3: {
            tall: 'assets/images/houses/tall3.jpg',
            top: 'assets/images/houses/top3.jpg',
            bottom: 'assets/images/houses/bottom3.jpg'
        }
    };

    const section = document.querySelector('#market') || document.querySelector('.properties-section');

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