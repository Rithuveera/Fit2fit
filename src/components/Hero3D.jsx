import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

function Dumbbell({ theme, ...props }) {
    const group = useRef();
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        group.current.rotation.x += delta * 0.5;
        group.current.rotation.y += delta * 0.3;
    });

    const isDark = theme === 'dark';
    const baseColor = isDark ? "#1a1a1a" : "#000000";
    const activeColor = "#39ff14";

    const materialProps = {
        color: hovered ? activeColor : baseColor,
        emissive: activeColor,
        emissiveIntensity: hovered ? 0.8 : (isDark ? 0.2 : 0),
        wireframe: true
    };

    return (
        <group
            ref={group}
            {...props}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            scale={hovered ? 1.1 : 1}
        >
            {/* Bar */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.15, 0.15, 4, 8]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>

            {/* Left Weights */}
            <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.8, 0.8, 0.3, 12]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[-1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.6, 0.6, 0.3, 12]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>

            {/* Right Weights */}
            <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.8, 0.8, 0.3, 12]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.6, 0.6, 0.3, 12]} />
                <meshStandardMaterial {...materialProps} />
            </mesh>
        </group>
    );
}

function ParticleField({ theme }) {
    const count = 200;
    const mesh = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state, delta) => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            // Update dummy object position
            const dummy = new THREE.Object3D();
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    const isDark = theme === 'dark';
    const color = isDark ? "#39ff14" : "#000000";

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshBasicMaterial color={color} wireframe />
        </instancedMesh>
    );
}

const Hero3D = () => {
    const { theme } = useTheme();

    return (
        <section className="relative h-screen w-full bg-gray-100 dark:bg-gray-950 overflow-hidden transition-colors duration-300">
            {/* 3D Scene */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 8] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    {theme === 'dark' && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
                    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                        <Dumbbell position={[0, 0, 0]} theme={theme} />
                    </Float>
                    <ParticleField theme={theme} />
                </Canvas>
            </div>

            {/* Overlay Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 transition-colors duration-300">
                        UNLEASH YOUR <span className="text-neon-green">POTENTIAL</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors duration-300">
                        Experience the future of fitness with state-of-the-art equipment, expert trainers, and a community that drives you forward.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#membership"
                            className="bg-neon-green text-black font-bold py-3 px-8 rounded-full text-lg hover:bg-green-400 transition transform hover:scale-105 duration-300 shadow-[0_0_20px_rgba(57,255,20,0.5)]"
                        >
                            Start Your Journey
                        </a>
                        <a
                            href="#classes"
                            className="bg-transparent border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition transform hover:scale-105 duration-300"
                        >
                            View Classes
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Gradient Overlay for smooth transition */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-black to-transparent z-0 transition-colors duration-300"></div>
        </section>
    );
};

export default Hero3D;
