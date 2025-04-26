import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from './ui/button';
import { CompanionData } from '@/lib/openai';

interface AvatarProps {
  url: string;
  expressions: Expressions;
}

// Basic set of facial expressions
interface Expressions {
  smile: number;
  sadness: number;
  surprise: number;
  talking: number;
}

const defaultExpressions: Expressions = {
  smile: 0,
  sadness: 0,
  surprise: 0,
  talking: 0
};

function Head({ url, expressions }: AvatarProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useTexture(url);
  
  // Use expressions to modify the avatar mesh
  useFrame(() => {
    if (mesh.current) {
      // Simple implementation of expressions - in a production app, would use more detailed morphs
      if (expressions.smile > 0) {
        mesh.current.morphTargetInfluences![0] = expressions.smile;
      }
      if (expressions.sadness > 0) {
        mesh.current.morphTargetInfluences![1] = expressions.sadness;
      }
      if (expressions.surprise > 0) {
        mesh.current.morphTargetInfluences![2] = expressions.surprise;
      }
      if (expressions.talking > 0) {
        mesh.current.rotation.y = Math.sin(Date.now() * 0.003) * 0.1;
      }
    }
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function Environment() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </>
  );
}

interface ThreeDimensionalAvatarProps {
  companion: CompanionData;
  isActive?: boolean;
}

const ThreeDimensionalAvatar: React.FC<ThreeDimensionalAvatarProps> = ({ 
  companion,
  isActive = false
}) => {
  const [threeDEnabled, setThreeDEnabled] = useState(false);
  const [expressions, setExpressions] = useState<Expressions>(defaultExpressions);
  const [currentExpression, setCurrentExpression] = useState<string>('neutral');

  // Simple animation effect for the 3D avatar
  useEffect(() => {
    let animationId: number | null = null;
    
    // Only start animation if 3D mode is enabled
    if (threeDEnabled) {
      // Create an animation loop for subtle movements
      const animate = () => {
        // Update expressions occasionally to simulate subtle movements
        if (Math.random() < 0.05) {
          // Random slight expressions
          setExpressions({
            smile: Math.random() * 0.2,
            sadness: 0,
            surprise: Math.random() * 0.1,
            talking: isActive ? 0.5 : 0
          });
        }
        
        animationId = requestAnimationFrame(animate);
      };
      
      animate();
    }
    
    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [threeDEnabled, isActive]);

  // Update expression based on companion state
  const updateExpression = (isActive: boolean) => {
    // Set a basic expression based on if the companion is "talking"
    if (isActive) {
      setExpressions({
        smile: 0.2,
        sadness: 0,
        surprise: 0,
        talking: 0.5
      });
      setCurrentExpression('talking');
    } else {
      // Default neutral expression with occasional subtle movements
      const randomExpression = Math.random();
      if (randomExpression > 0.7) {
        setExpressions({
          smile: 0.3,
          sadness: 0,
          surprise: 0,
          talking: 0
        });
        setCurrentExpression('smile');
      } else if (randomExpression > 0.4) {
        setExpressions({
          smile: 0,
          sadness: 0,
          surprise: 0.2,
          talking: 0
        });
        setCurrentExpression('neutral');
      } else {
        setExpressions({
          smile: 0.1,
          sadness: 0,
          surprise: 0,
          talking: 0
        });
        setCurrentExpression('neutral');
      }
    }
  };

  const handleToggle3D = () => {
    setThreeDEnabled(prev => !prev);
  };

  // Animation for talking when messages come in
  useEffect(() => {
    if (isActive && !threeDEnabled) {
      // Simulate talking animation when not in 3D mode but the avatar is "speaking"
      const talkingInterval = setInterval(() => {
        setExpressions(prev => ({
          ...prev,
          talking: prev.talking > 0 ? 0 : 0.5
        }));
      }, 300);

      return () => clearInterval(talkingInterval);
    }
  }, [isActive, threeDEnabled]);

  return (
    <div className="relative">
      <div className={`aspect-square overflow-hidden rounded-2xl border-4 border-lavender shadow-lg ${threeDEnabled ? 'bg-gradient-to-br from-blue-900 to-purple-900' : ''}`}>
        {threeDEnabled ? (
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Environment />
            <Head url={companion.avatarUrl} expressions={expressions} />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        ) : (
          <img 
            src={companion.avatarUrl} 
            alt={companion.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      {/* Expression indicator */}
      {threeDEnabled && (
        <div className="absolute top-3 left-3 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
          {currentExpression}
        </div>
      )}
      
      {/* 3D toggle button */}
      <Button
        onClick={handleToggle3D}
        className="absolute bottom-3 right-3 bg-lavender hover:bg-lavender-dark text-white text-xs px-3 py-1 rounded-full"
      >
        {threeDEnabled ? '2D View' : '3D View'}
      </Button>
      
      {/* No video or canvas elements needed since we're not doing camera tracking */}
    </div>
  );
};

export default ThreeDimensionalAvatar;