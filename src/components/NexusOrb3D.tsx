import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function NexusOrb3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Nexus Orb Group
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // Outer Glow Shell
    const shellGeom = new THREE.SphereGeometry(1.5, 64, 64);
    const shellMat = new THREE.MeshPhongMaterial({
      color: 0x2563EB,
      emissive: 0x7C3AED,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.2,
      wireframe: true
    });
    const shell = new THREE.Mesh(shellGeom, shellMat);
    orbGroup.add(shell);

    // Inner Core
    const coreGeom = new THREE.SphereGeometry(0.8, 32, 32);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x06B6D4,
      emissive: 0x2563EB,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.9
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    orbGroup.add(core);

    // Floating Symbols (represented as small particles/shards)
    const shards: THREE.Mesh[] = [];
    const shardGeom = new THREE.TetrahedronGeometry(0.1);
    for (let i = 0; i < 30; i++) {
      const shardMat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
      const shard = new THREE.Mesh(shardGeom, shardMat);
      
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.0 + Math.random() * 1.0;
      shard.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 4,
        Math.sin(angle) * radius
      );
      
      shard.userData = {
        angle: angle,
        speed: 0.005 + Math.random() * 0.01,
        radius: radius,
        rotSpeed: Math.random() * 0.02
      };
      
      shards.push(shard);
      orbGroup.add(shard);
    }

    const light = new THREE.PointLight(0x2563EB, 2, 20);
    light.position.set(5, 5, 5);
    scene.add(light);
    
    const light2 = new THREE.PointLight(0x7C3AED, 2, 20);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambLight);

    let animationFrameId: number;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      
      orbGroup.rotation.y += 0.005;
      shell.rotation.x += 0.002;
      
      const time = Date.now() * 0.002;
      core.scale.setScalar(1 + Math.sin(time) * 0.05);
      shell.scale.setScalar(1 + Math.cos(time * 0.5) * 0.03);

      shards.forEach(s => {
        s.userData.angle += s.userData.speed;
        s.position.x = Math.cos(s.userData.angle) * s.userData.radius;
        s.position.z = Math.sin(s.userData.angle) * s.userData.radius;
        s.rotation.x += s.userData.rotSpeed;
        s.rotation.y += s.userData.rotSpeed;
      });

      renderer.render(scene, camera);
    }

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
