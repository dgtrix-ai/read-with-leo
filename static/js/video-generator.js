// This script generates canvas animations as substitutes for video files
class AnimatedCanvas {
    constructor(canvas, width = 300, height = 300) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        this.frame = 0;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPuppy(x, y, scale = 1) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        // Body
        ctx.fillStyle = '#D4A373';
        ctx.beginPath();
        ctx.arc(0, 0, 50, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-15, -10, 5, 0, Math.PI * 2);
        ctx.arc(15, -10, 5, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 5, 20, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        ctx.restore();
    }
}

class PettingAnimation extends AnimatedCanvas {
    animate() {
        this.clear();
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Draw puppy
        this.drawPuppy(centerX, centerY);

        // Draw hand
        const handY = centerY - 50 + Math.sin(this.frame * 0.1) * 10;
        this.ctx.fillStyle = '#FFC';
        this.ctx.beginPath();
        this.ctx.arc(centerX, handY, 20, 0, Math.PI * 2);
        this.ctx.fill();

        this.frame++;
        requestAnimationFrame(() => this.animate());
    }
}

class PlayingAnimation extends AnimatedCanvas {
    animate() {
        this.clear();
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Draw bouncing puppy
        const bounce = Math.sin(this.frame * 0.1) * 20;
        this.drawPuppy(centerX, centerY + bounce);

        // Draw ball
        this.ctx.fillStyle = '#F90';
        this.ctx.beginPath();
        this.ctx.arc(
            centerX + Math.cos(this.frame * 0.05) * 50,
            centerY + Math.sin(this.frame * 0.1) * 30,
            10, 0, Math.PI * 2
        );
        this.ctx.fill();

        this.frame++;
        requestAnimationFrame(() => this.animate());
    }
}

class TreatingAnimation extends AnimatedCanvas {
    animate() {
        this.clear();
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Draw puppy
        this.drawPuppy(centerX, centerY);

        // Draw treat
        const treatX = centerX + Math.cos(this.frame * 0.1) * 20;
        const treatY = centerY - 40 + Math.sin(this.frame * 0.1) * 10;
        
        this.ctx.fillStyle = '#8B4513';
        this.ctx.beginPath();
        this.ctx.arc(treatX, treatY, 8, 0, Math.PI * 2);
        this.ctx.fill();

        this.frame++;
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize animations when videos fail to load
document.addEventListener('DOMContentLoaded', () => {
    const videoElements = {
        'petVideo': PettingAnimation,
        'playVideo': PlayingAnimation,
        'treatVideo': TreatingAnimation
    };

    Object.entries(videoElements).forEach(([id, AnimationClass]) => {
        const video = document.getElementById(id);
        video.addEventListener('error', () => {
            // Create canvas replacement
            const canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            video.parentElement.appendChild(canvas);
            
            // Start animation
            const animation = new AnimationClass(canvas);
            animation.animate();
        });
    });
});
