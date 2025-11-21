document.addEventListener('DOMContentLoaded', () => {
    
    // 1. PRELOADER
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hide');
        }, 800);
    });

    // 2. CUSTOM CURSOR
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    
    // Verificação para não quebrar se for mobile (onde cursor não existe mousemove)
    if(window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
        });
    }

    // Efeito Hover
    document.querySelectorAll('.hover-trigger').forEach(trigger => {
        trigger.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        trigger.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // 3. NAVBAR SCROLL
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // 4. SCROLL ANIMATIONS
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    // 5. TYPING EFFECT (Alternando entre suas áreas)
    const textElement = document.querySelector('.typing-effect');
    // Frases que definem seu momento profissional
    const phrases = ["Ciência da Computação Student", "Product Assistant", "Tech Enthusiast"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pausa ao terminar de digitar
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 2000); // Começa após animações iniciais

    // 6. STATS COUNTER
    const statsSection = document.querySelector('.stats-container');
    const counters = document.querySelectorAll('.counter');
    let started = false;

    if(statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    let current = 0;
                    const increment = target / 100;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
                started = true;
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }
});

// ... (código anterior do preloader e cursor) ...

    // === BARRA DE PROGRESSO DE SCROLL ===
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    });

    // === OBSERVER AVANÇADO (Animação de Entrada) ===
    const observerOptions = {
        root: null,
        rootMargin: '0px', 
        threshold: 0.15 // Só anima quando 15% do elemento aparecer
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe que reseta a posição e opacidade
                entry.target.classList.add('is-visible');
                
                // Opcional: Parar de observar para não animar de novo ao subir
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Seleciona todos os elementos que têm a classe base de animação
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .reveal-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // ... (código restante do typing effect, etc) ...