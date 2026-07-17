import { useEffect, useRef } from 'react';

const FlightAnimation = () => {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const stateRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        console.log('FlightAnimation component mounted');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // --- Resize ---
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // --- Stars ---
        const NUM_STARS = 80;
        const stars = Array.from({ length: NUM_STARS }, () => ({
            x: Math.random(),
            y: Math.random() * 0.5,
            r: Math.random() * 1.5 + 0.3,
            alpha: Math.random(),
            speed: Math.random() * 0.005 + 0.002,
            phase: Math.random() * Math.PI * 2,
        }));

        // --- Clouds ---
        const cloudShapes = [
            [0, 0, 50], [40, -15, 40], [80, 0, 45], [120, -10, 35], [55, 15, 38],
        ];
        const NUM_CLOUDS = 6;
        const clouds = Array.from({ length: NUM_CLOUDS }, (_, i) => ({
            x: Math.random(),
            y: 0.08 + Math.random() * 0.35,
            scale: 0.5 + Math.random() * 0.9,
            speed: 0.00005 + Math.random() * 0.00008,
            alpha: 0.12 + Math.random() * 0.22,
            layer: i < 3 ? 0 : 1, // 0 = back, 1 = front
        }));

        const drawCloud = (ctx, cx, cy, scale, alpha) => {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            cloudShapes.forEach(([ox, oy, r]) => {
                ctx.beginPath();
                ctx.arc(cx + ox * scale, cy + oy * scale, r * scale, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.restore();
        };

        // --- Planes ---
        const PLANE_SVG_PATH = new Path2D(
            'M0,-7 L18,0 L0,4 L3,0 Z M-2,0 L-14,-5 L-16,0 L-14,5 Z M0,2 L-5,6 L-6,4 Z'
        );

        const planeColors = [
            { body: '#ffffff', wing: '#e0eaff', trail: 'rgba(200,225,255,' },
            { body: '#ffe5b4', wing: '#fff6e0', trail: 'rgba(255,240,200,' },
            { body: '#b4e8ff', wing: '#e0f7ff', trail: 'rgba(180,232,255,' },
        ];

        const NUM_PLANES = 4;
        const makePlane = (i) => {
            const fromLeft = Math.random() > 0.3;
            const ci = i % planeColors.length;
            return {
                x: fromLeft ? -0.08 : 1.08,
                y: 0.1 + Math.random() * 0.55,
                speed: (0.00015 + Math.random() * 0.00025) * (fromLeft ? 1 : -1),
                size: 0.7 + Math.random() * 0.9,
                color: planeColors[ci],
                fromLeft,
                trail: [], // { x, y, alpha }
                delay: i * 6000 + Math.random() * 4000,
                active: false,
                startTime: null,
            };
        };

        const planes = Array.from({ length: NUM_PLANES }, (_, i) => makePlane(i));

        const drawPlane = (ctx, plane, W, H) => {
            const px = plane.x * W;
            const py = plane.y * H;
            const s = plane.size;
            const dir = plane.fromLeft ? 1 : -1;

            // Draw trail
            if (plane.trail.length > 1) {
                for (let i = 1; i < plane.trail.length; i++) {
                    const t0 = plane.trail[i - 1];
                    const t1 = plane.trail[i];
                    const trailAlpha = t1.alpha * 0.7;
                    ctx.save();
                    ctx.strokeStyle = plane.color.trail + trailAlpha + ')';
                    ctx.lineWidth = s * 1.5 * t1.alpha;
                    ctx.lineCap = 'round';
                    ctx.shadowColor = plane.color.trail + '0.5)';
                    ctx.shadowBlur = 6;
                    ctx.beginPath();
                    ctx.moveTo(t0.x * W, t0.y * H);
                    ctx.lineTo(t1.x * W, t1.y * H);
                    ctx.stroke();
                    ctx.restore();
                }
            }

            // Glow halo
            ctx.save();
            ctx.translate(px, py);
            ctx.scale(dir, 1);
            const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, 24 * s);
            grd.addColorStop(0, 'rgba(180,220,255,0.22)');
            grd.addColorStop(1, 'rgba(180,220,255,0)');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(0, 0, 24 * s, 0, Math.PI * 2);
            ctx.fill();

            // Plane body
            ctx.scale(s, s);
            ctx.shadowColor = 'rgba(100,180,255,0.7)';
            ctx.shadowBlur = 12;
            ctx.fillStyle = plane.color.body;
            ctx.fill(PLANE_SVG_PATH);
            // Wing highlight
            ctx.fillStyle = plane.color.wing;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.ellipse(-4, 0, 12, 4, 0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };

        // --- Gradient sky ---
        const drawSky = (ctx, W, H, t) => {
            const shift = Math.sin(t * 0.0002) * 0.5 + 0.5; // 0..1
            const top = lerpColor([10, 20, 60], [15, 60, 120], shift);
            const mid = lerpColor([25, 80, 160], [40, 120, 200], shift);
            const bot = lerpColor([60, 130, 210], [100, 180, 240], shift);

            const grd = ctx.createLinearGradient(0, 0, 0, H);
            grd.addColorStop(0, `rgb(${top.join(',')})`);
            grd.addColorStop(0.5, `rgb(${mid.join(',')})`);
            grd.addColorStop(1, `rgb(${bot.join(',')})`);
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, W, H);
        };

        const lerpColor = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

        // --- Main loop ---
        let lastTime = null;
        let elapsed = 0;

        const animate = (ts) => {
            if (!lastTime) lastTime = ts;
            const dt = ts - lastTime;
            lastTime = ts;
            elapsed += dt;

            const W = canvas.width;
            const H = canvas.height;

            // Sky
            drawSky(ctx, W, H, elapsed);

            // Back clouds
            clouds.filter(c => c.layer === 0).forEach(c => {
                c.x += c.speed;
                if (c.x > 1.2) c.x = -0.2;
                drawCloud(ctx, c.x * W, c.y * H, c.scale * 0.7, c.alpha * 0.7);
            });

            // Stars (twinkle)
            stars.forEach(s => {
                const tw = 0.4 + 0.6 * Math.abs(Math.sin(elapsed * s.speed + s.phase));
                ctx.save();
                ctx.globalAlpha = tw;
                const grd = ctx.createRadialGradient(s.x * W, s.y * H, 0, s.x * W, s.y * H, s.r * 2.5);
                grd.addColorStop(0, '#ffffff');
                grd.addColorStop(1, 'rgba(180,220,255,0)');
                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(s.x * W, s.y * H, s.r * 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            // Planes
            planes.forEach((plane, i) => {
                if (!plane.active) {
                    if (elapsed >= plane.delay) {
                        plane.active = true;
                        plane.startTime = elapsed;
                    } else return;
                }

                // Move
                plane.x += plane.speed;
                // Gentle vertical sine
                plane.y += Math.sin(elapsed * 0.001 + i * 1.7) * 0.00005;

                // Trail
                plane.trail.push({ x: plane.x, y: plane.y, alpha: 1 });
                if (plane.trail.length > 80) plane.trail.shift();
                plane.trail.forEach((p, idx) => {
                    p.alpha = (idx / plane.trail.length) * 0.85;
                });

                // Off screen — reset
                if ((plane.fromLeft && plane.x > 1.12) || (!plane.fromLeft && plane.x < -0.12)) {
                    Object.assign(plane, makePlane(i));
                    plane.delay = elapsed + 2000 + Math.random() * 5000;
                    plane.active = false;
                }

                drawPlane(ctx, plane, W, H);
            });

            // Front clouds
            clouds.filter(c => c.layer === 1).forEach(c => {
                c.x += c.speed * 1.4;
                if (c.x > 1.2) c.x = -0.2;
                drawCloud(ctx, c.x * W, c.y * H, c.scale, c.alpha);
            });

            // Horizon glow
            const hGrd = ctx.createLinearGradient(0, H * 0.65, 0, H);
            hGrd.addColorStop(0, 'rgba(255,180,80,0)');
            hGrd.addColorStop(0.6, 'rgba(255,120,40,0.07)');
            hGrd.addColorStop(1, 'rgba(255,80,20,0.13)');
            ctx.fillStyle = hGrd;
            ctx.fillRect(0, H * 0.65, W, H * 0.35);

            animRef.current = requestAnimationFrame(animate);
        };

        animRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                display: 'block',
                zIndex: 2,
                pointerEvents: 'none',
            }}
        />
    );
};

export default FlightAnimation;
