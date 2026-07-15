import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import * as THREE from 'three';

export default function QuantumLatticeBg() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x0052ff, 2, 50);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const qGroup = new THREE.Group();
        scene.add(qGroup);

        const geometry = new THREE.IcosahedronGeometry(2, 1);
        const material = new THREE.MeshPhongMaterial({
            color: 0x0052ff,
            wireframe: true,
            transparent: true,
            opacity: 0.8,
            emissive: 0x0052ff,
            emissiveIntensity: 0.5
        });
        const coreMesh = new THREE.Mesh(geometry, material);
        qGroup.add(coreMesh);

        const ringGeom = new THREE.TorusGeometry(3, 0.02, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x0052ff, transparent: true, opacity: 0.3 });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 2;
        qGroup.add(ring);

        const particlesCount = 50;
        const positions = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 6;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
        }
        const pGeom = new THREE.BufferGeometry();
        pGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const pMat = new THREE.PointsMaterial({ color: 0x0052ff, size: 0.06, transparent: true, opacity: 0.8 });
        const particleSystem = new THREE.Points(pGeom, pMat);
        qGroup.add(particleSystem);

        let mouseX = 0;
        let mouseY = 0;
        
        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        };

        const handleMouseLeave = () => {
            mouseX = 0;
            mouseY = 0;
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        let animationFrameId: number;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            qGroup.rotation.y += 0.005;
            qGroup.rotation.x += 0.002;

            qGroup.position.x += (mouseX * 1.2 - qGroup.position.x) * 0.05;
            qGroup.position.y += (mouseY * 1.2 - qGroup.position.y) * 0.05;

            renderer.render(scene, camera);
        };
        
        animate();

        const handleResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
            
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            ringGeom.dispose();
            ringMat.dispose();
            pGeom.dispose();
            pMat.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <Box 
            ref={containerRef} 
            sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                zIndex: 1, 
                pointerEvents: 'auto', 
                '& canvas': {
                    width: '100% !important',
                    height: '100% !important',
                    display: 'block'
                }
            }} 
        />
    );
}