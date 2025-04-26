import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
// Import types for FaceMesh
type FaceMesh = {
  setOptions: (options: any) => void;
  onResults: (callback: (results: any) => void) => void;
  send: (options: { image: HTMLVideoElement }) => Promise<void>;
  close: () => void;
};

type Results = {
  multiFaceLandmarks?: Array<Array<{x: number, y: number, z: number}>>;
  image?: CanvasImageSource;
};
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let faceMesh: FaceMesh | null = null;
    let animationId: number | null = null;
    let videoStream: MediaStream | null = null;

    // Only initialize face tracking if 3D mode is enabled
    if (threeDEnabled && videoRef.current) {
      const startFaceTracking = async () => {
        try {
          // Access user's camera
          videoStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = videoStream;
          }

          // Initialize Face Mesh
          faceMesh = new FaceMesh({
            locateFile: (file) => {
              return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            }
          });

          faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });

          faceMesh.onResults(onResults);

          // Start detection loop
          if (videoRef.current) {
            videoRef.current.play();
            const detectFace = async () => {
              if (videoRef.current && faceMesh) {
                await faceMesh.send({ image: videoRef.current });
              }
              animationId = requestAnimationFrame(detectFace);
            };
            detectFace();
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      };

      startFaceTracking();
    }

    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      if (faceMesh) {
        faceMesh.close();
      }
    };
  }, [threeDEnabled]);

  // Process face mesh results to update expressions
  const onResults = (results: Results) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;
    
    const landmarks = results.multiFaceLandmarks[0];
    
    // Extract facial features (simplified version)
    // In a production app, would use more sophisticated analysis
    
    // Check for smile (measure mouth corners elevation)
    const leftMouthCorner = landmarks[61];
    const rightMouthCorner = landmarks[291];
    const upperLip = landmarks[13];
    
    const smileValue = ((leftMouthCorner.y < upperLip.y && rightMouthCorner.y < upperLip.y) ? 1 : 0) * 0.8;
    
    // Check for raised eyebrows (surprise)
    const leftEyebrow = landmarks[66];
    const rightEyebrow = landmarks[296];
    const foreheadPoint = landmarks[10];
    
    const surpriseValue = ((leftEyebrow.y < foreheadPoint.y || rightEyebrow.y < foreheadPoint.y) ? 1 : 0) * 0.7;
    
    // Mouth opening detection for talking
    const upperLipBottom = landmarks[14];
    const lowerLipTop = landmarks[18];
    
    const talkingValue = (Math.abs(upperLipBottom.y - lowerLipTop.y) > 0.05) ? 0.5 : 0;
    
    // Simple sadness detection
    const mouthCenter = landmarks[14];
    const sideOfMouth = landmarks[78];
    
    const sadnessValue = ((mouthCenter.y > sideOfMouth.y) ? 1 : 0) * 0.6;
    
    // Set expressions and determine dominant expression
    setExpressions({
      smile: smileValue,
      sadness: sadnessValue,
      surprise: surpriseValue,
      talking: talkingValue
    });
    
    // Determine current expression based on highest value
    let dominant = 'neutral';
    let maxValue = 0.3; // Threshold
    
    if (smileValue > maxValue && smileValue > sadnessValue && smileValue > surpriseValue) {
      dominant = 'smile';
      maxValue = smileValue;
    } else if (sadnessValue > maxValue && sadnessValue > smileValue && sadnessValue > surpriseValue) {
      dominant = 'sadness';
      maxValue = sadnessValue;
    } else if (surpriseValue > maxValue && surpriseValue > smileValue && surpriseValue > sadnessValue) {
      dominant = 'surprise';
      maxValue = surpriseValue;
    }
    
    if (talkingValue > 0.2) {
      dominant += ' talking';
    }
    
    setCurrentExpression(dominant);
    
    // Debug visualization
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Display the video frame
        if (results.image && videoRef.current) {
          ctx.drawImage(
            results.image, 
            0, 0, 
            canvasRef.current.width, 
            canvasRef.current.height
          );
        }
        
        // Draw face landmarks (for debug)
        if (landmarks) {
          ctx.fillStyle = 'white';
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 1;
          
          for (const landmark of landmarks) {
            ctx.beginPath();
            ctx.arc(
              landmark.x * canvasRef.current.width,
              landmark.y * canvasRef.current.height,
              1, 0, 2 * Math.PI
            );
            ctx.fill();
          }
        }
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
      
      {/* Hidden video element for face tracking */}
      <video 
        ref={videoRef}
        style={{ display: 'none' }}
        width="640"
        height="480"
      />
      
      {/* Debug canvas - can be hidden in production */}
      <canvas 
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ThreeDimensionalAvatar;