import { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const trailRef = useRef(null);
    const rafRef = useRef(null);
    const posRef = useRef({ x: -200, y: -200 });
    const trailPos = useRef({ x: -200, y: -200 });
    const hasMovedRef = useRef(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const trail = trailRef.current;
        if (!cursor || !trail) return;

        // Start hidden — only show after first mouse movement
        cursor.style.opacity = '0';
        trail.style.opacity = '0';

        // Update cursor position instantly
        const onMove = (e) => {
            posRef.current = { x: e.clientX, y: e.clientY };

            // Immediately move the square cursor
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            // Reveal on first move
            if (!hasMovedRef.current) {
                hasMovedRef.current = true;
                cursor.style.opacity = '1';
                trail.style.opacity = '1';
                trailPos.current = { x: e.clientX, y: e.clientY };
            }

            // Drive the CSS custom property for the antigravity background aura
            document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
            document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
        };

        // Animate trailing circle with lerp
        const animateTrail = () => {
            const dx = posRef.current.x - trailPos.current.x;
            const dy = posRef.current.y - trailPos.current.y;
            trailPos.current.x += dx * 0.14;
            trailPos.current.y += dy * 0.14;
            trail.style.left = trailPos.current.x + 'px';
            trail.style.top = trailPos.current.y + 'px';
            rafRef.current = requestAnimationFrame(animateTrail);
        };

        rafRef.current = requestAnimationFrame(animateTrail);

        const addHover = () => { cursor.classList.add('hovering'); trail.classList.add('hovering'); };
        const removeHover = () => { cursor.classList.remove('hovering'); trail.classList.remove('hovering'); };

        window.addEventListener('mousemove', onMove);

        // Track hoverable elements
        const observer = new MutationObserver(() => {
            document.querySelectorAll(
                'a, button, .btn, input, select, textarea, .cert-card, .visual-item, .stat-card, .sidebar-link, .role-tab, .badge'
            ).forEach((el) => {
                el.removeEventListener('mouseenter', addHover);
                el.removeEventListener('mouseleave', removeHover);
                el.addEventListener('mouseenter', addHover);
                el.addEventListener('mouseleave', removeHover);
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Hide cursor when leaving window
        const onLeave = () => { cursor.style.opacity = '0'; trail.style.opacity = '0'; };
        const onEnter = () => {
            if (hasMovedRef.current) {
                cursor.style.opacity = '1';
                trail.style.opacity = '1';
            }
        };
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mouseenter', onEnter);

        return () => {
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseleave', onLeave);
            document.removeEventListener('mouseenter', onEnter);
            observer.disconnect();
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <>
            <div ref={cursorRef} className="custom-cursor" />
            <div ref={trailRef} className="cursor-trail" />
        </>
    );
}
