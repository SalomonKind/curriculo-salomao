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

    /* === ANIMAÇÃO INTERESTELAR (SPACE WARP) === */
const canvas = document.getElementById('space-canvas');
const c = canvas.getContext('2d');

let width, height;
let stars = [];

// Configurações da Animação
const numStars = 800; // Quantidade de estrelas
const starSpeed = 0.5; // Velocidade base (quanto menor, mais lento)
const mouseSensitivity = 0.05; // Quanto o mouse afeta a direção

// Inicializa o tamanho do canvas
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

// Objeto Estrela
class Star {
    constructor() {
        this.reset(true); // true = inicialização aleatória na tela
    }

    reset(initial = false) {
        // Posição X e Y aleatórias
        this.x = (Math.random() - 0.5) * width * 2;
        this.y = (Math.random() - 0.5) * height * 2;
        
        // Z representa a profundidade (longe ou perto)
        // Se for inicial, espalha por todo o túnel. Se não, joga lá no fundo.
        this.z = initial ? Math.random() * width : width; 
        
        this.pz = this.z; // Posição Z anterior (para fazer o rastro/traço)
    }

    update(mouseX, mouseY) {
        // Move a estrela em direção à tela (diminui Z)
        this.z -= (10 * starSpeed);

        // Efeito de paralaxe com o mouse
        this.x -= (mouseX - width / 2) * mouseSensitivity;
        this.y -= (mouseY - height / 2) * mouseSensitivity;

        // Se a estrela passou da tela (ficou atrás do observador), reseta
        if (this.z <= 1) {
            this.reset();
            this.z = width;
            this.pz = this.z;
        }
    }

    draw() {
        // Matemática de projeção 3D para 2D
        let x = (this.x / this.z) * width + width / 2;
        let y = (this.y / this.z) * height + height / 2;

        // Calcula o tamanho baseado na proximidade (quanto mais perto, maior)
        let radius = (1 - this.z / width) * 3; // Tamanho máximo 3px

        // Calcula a posição anterior para fazer o efeito de "rastro" (warp)
        let px = (this.x / this.pz) * width + width / 2;
        let py = (this.y / this.pz) * height + height / 2;

        this.pz = this.z;

        // Desenha a estrela e o rastro
        c.beginPath();
        c.moveTo(px, py);
        c.lineTo(x, y);
        
        // Cor da estrela: Branca com leve brilho azulado
        // Opacidade aumenta conforme chega perto
        let opacity = (1 - this.z / width);
        c.strokeStyle = `rgba(200, 240, 255, ${opacity})`;
        c.lineWidth = radius;
        c.lineCap = 'round';
        c.stroke();
    }
}

// Cria as estrelas
for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
}

// Rastreamento do Mouse
let mouseX = width / 2;
let mouseY = height / 2;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Loop de Animação
function animateSpace() {
    // Limpa o canvas com um rastro suave (preto quase transparente)
    // Isso cria um efeito de motion blur natural
    c.fillStyle = 'rgba(5, 5, 10, 0.4)'; 
    c.fillRect(0, 0, width, height);

    stars.forEach(star => {
        star.update(mouseX, mouseY);
        star.draw();
    });

    requestAnimationFrame(animateSpace);
}

// Inicia
animateSpace();