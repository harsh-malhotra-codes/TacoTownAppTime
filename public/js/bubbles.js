// Delicious Menu Bubbles Physics System
class BubblesManager {
    constructor() {
        this.container = document.querySelector('.bubbles-container');
        this.bubbles = [];
        this.animationId = null;
        this.isRunning = false;

        // Physics constants
        this.repulsionRadius = 100;
        this.repulsionStrength = 0.8;
        this.boundaryDamping = 0.9;
        this.friction = 0.99;
        this.minSpeed = 0.3;
        this.maxSpeed = 1.5;

        this.init();
    }

    init() {
        if (!this.container) return;

        this.createBubbles();
        this.startAnimation();
        this.setupResponsive();
    }

    createBubbles() {
        // Clear existing bubbles
        this.bubbles = [];

        const bubbleElements = this.container.querySelectorAll('.bubble');
        const containerRect = this.container.getBoundingClientRect();
        const bubbleSize = this.getBubbleSize();

        bubbleElements.forEach((bubble, index) => {
            const imageSrc = bubble.getAttribute('data-image');
            bubble.style.backgroundImage = `url('${imageSrc}')`;
            bubble.style.width = `${bubbleSize}px`;
            bubble.style.height = `${bubbleSize}px`;

            // Random initial position
            let x, y, attempts = 0;
            do {
                x = Math.random() * (containerRect.width - bubbleSize);
                y = Math.random() * (containerRect.height - bubbleSize);
                attempts++;
            } while (this.checkOverlap(x, y, bubbleSize) && attempts < 50);

            bubble.style.left = `${x}px`;
            bubble.style.top = `${y}px`;

            // Create bubble physics object
            const bubbleObj = {
                element: bubble,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * this.maxSpeed,
                vy: (Math.random() - 0.5) * this.maxSpeed,
                size: bubbleSize,
                mass: 1,
            };

            this.bubbles.push(bubbleObj);
        });
    }

    checkOverlap(x, y, size) {
        return this.bubbles.some(bubble => {
            const dx = x - bubble.x;
            const dy = y - bubble.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < size;
        });
    }

    getBubbleSize() {
        const width = window.innerWidth;
        if (width <= 576) return 50;
        if (width <= 768) return 60;
        return 80;
    }

    startAnimation() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stopAnimation() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    animate = () => {
        if (!this.isRunning) return;

        this.updatePhysics();
        this.render();

        this.animationId = requestAnimationFrame(this.animate);
    }

    updatePhysics() {
        const containerRect = this.container.getBoundingClientRect();

        this.bubbles.forEach((bubble, index) => {
            // Apply repulsion forces from other bubbles
            let forceX = 0;
            let forceY = 0;

            this.bubbles.forEach((otherBubble, otherIndex) => {
                if (index === otherIndex) return;

                const dx = bubble.x - otherBubble.x;
                const dy = bubble.y - otherBubble.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.repulsionRadius && distance > 0) {
                    const force = (this.repulsionRadius - distance) / this.repulsionRadius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;

                    forceX += directionX * force * this.repulsionStrength;
                    forceY += directionY * force * this.repulsionStrength;
                }
            });

            // Update velocity with forces
            bubble.vx += forceX;
            bubble.vy += forceY;

            // Apply friction
            bubble.vx *= this.friction;
            bubble.vy *= this.friction;

            // Ensure minimum speed for continuous movement
            const speed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy);
            if (speed < this.minSpeed) {
                const angle = Math.random() * Math.PI * 2;
                bubble.vx = Math.cos(angle) * this.minSpeed;
                bubble.vy = Math.sin(angle) * this.minSpeed;
            }

            // Update position
            bubble.x += bubble.vx;
            bubble.y += bubble.vy;

            // Boundary collision with bounce
            if (bubble.x <= 0) {
                bubble.x = 0;
                bubble.vx = Math.abs(bubble.vx) * this.boundaryDamping;
            } else if (bubble.x >= containerRect.width - bubble.size) {
                bubble.x = containerRect.width - bubble.size;
                bubble.vx = -Math.abs(bubble.vx) * this.boundaryDamping;
            }

            if (bubble.y <= 0) {
                bubble.y = 0;
                bubble.vy = Math.abs(bubble.vy) * this.boundaryDamping;
            } else if (bubble.y >= containerRect.height - bubble.size) {
                bubble.y = containerRect.height - bubble.size;
                bubble.vy = -Math.abs(bubble.vy) * this.boundaryDamping;
            }
        });
    }

    render() {
        this.bubbles.forEach(bubble => {
            bubble.element.style.left = `${bubble.x}px`;
            bubble.element.style.top = `${bubble.y}px`;
        });
    }

    setupResponsive() {
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleResize() {
        const newSize = this.getBubbleSize();
        const containerRect = this.container.getBoundingClientRect();

        this.bubbles.forEach(bubble => {
            bubble.size = newSize;
            bubble.element.style.width = `${newSize}px`;
            bubble.element.style.height = `${newSize}px`;

            // Ensure bubbles stay within bounds after resize
            if (bubble.x + bubble.size > containerRect.width) {
                bubble.x = containerRect.width - bubble.size;
            }
            if (bubble.y + bubble.size > containerRect.height) {
                bubble.y = containerRect.height - bubble.size;
            }
        });
    }

    destroy() {
        this.stopAnimation();
        this.bubbles = [];
    }
}

// Initialize bubbles when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.bubbles-container')) {
        window.bubblesManager = new BubblesManager();
    }
});

// Export for potential use in other scripts
window.BubblesManager = BubblesManager;
