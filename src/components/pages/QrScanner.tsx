import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faSync, 
  faCheckCircle, 
  faTimesCircle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { scanQrCode } from '../../services/adminService';
import { logger } from '../../utils/logger';
import '../../styles/QrScanner.css';

const QrScanner = (): React.ReactElement => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    name?: string;
    email?: string;
    applicationId?: string;
    attendeeType?: string;
  } | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  
  const scannerInterval = useRef<number | null>(null);
  
  // Start camera when component mounts
  useEffect(() => {
    startCamera();
    
    return () => {
      // Clean up camera and scanning when unmounting
      stopScanning();
      stopCamera();
    };
  }, []);
  
  // Start the camera
  const startCamera = async () => {
    setError(null);
    
    try {
      logger.info('📸 Starting camera');
      const constraints = {
        video: { facingMode: 'environment' }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      logger.error('❌ Error starting camera:', err);
      setError('Unable to access camera. Please make sure you have granted camera permissions.');
      setCameraActive(false);
    }
  };
  
  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      logger.info('🛑 Stopping camera');
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };
  
  // Start scanning for QR codes
  const startScanning = () => {
    if (!cameraActive) {
      startCamera();
      return;
    }
    
    if (scannerInterval.current !== null) {
      stopScanning();
    }
    
    logger.info('🔍 Starting QR code scanning');
    setScanning(true);
    setScanResult(null);
    
    // Set up scanning interval
    scannerInterval.current = window.setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data for QR code detection
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Send frame to backend for QR code detection
      // In a real implementation, we'd use a client-side QR code library
      // For this prototype, we'll simulate a scan after a delay
      simulateQrScan();
    }, 500);
  };
  
  // Simulate a QR code scan (in a real app, we would use a library like jsQR)
  const simulateQrScan = () => {
    // This is just a placeholder for the QR scanning logic
    // In a real implementation, we would analyze the image data for QR codes
    // For demonstration, we'll add a "Scan" button to manually trigger a scan
  };
  
  // Stop scanning for QR codes
  const stopScanning = () => {
    if (scannerInterval.current !== null) {
      logger.info('🛑 Stopping QR code scanning');
      clearInterval(scannerInterval.current);
      scannerInterval.current = null;
      setScanning(false);
    }
  };
  
  // Process a detected QR code
  const processQrCode = async (qrValue: string) => {
    setProcessing(true);
    setError(null);
    stopScanning();
    
    try {
      logger.info('🎟️ Processing QR code:', qrValue);
      
      const result = await scanQrCode(qrValue);
      
      setScanResult(result);
    } catch (err) {
      logger.error('❌ Error processing QR code:', err);
      setError('Failed to process QR code. Please try scanning again.');
      setScanResult(null);
    } finally {
      setProcessing(false);
    }
  };
  
  // Manually scan a code for demo purposes
  const demoScan = () => {
    if (processing || scanning) return;
    
    // Generate a random application ID for demo purposes
    const demoApplicationId = `app-${Math.random().toString(36).substring(2, 10)}`;
    processQrCode(demoApplicationId);
  };
  
  // Reset the scanner
  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    startScanning();
  };
  
  return (
    <div className="qr-scanner-page">
      <div className="scanner-header" style={{ marginTop: '4rem' }}>
        <Link to="/admin" className="back-link">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Admin Dashboard
        </Link>
        <h1>QR Code Scanner</h1>
      </div>
      
      <div className="scanner-container">
        <div className="video-container">
          <video
            ref={videoRef}
            className="scanner-video"
            playsInline
            muted
            style={{ display: cameraActive && !scanResult ? 'block' : 'none' }}
          ></video>
          
          {cameraActive && !scanResult && (
            <div className="scanner-overlay">
              <div className="scanner-target"></div>
            </div>
          )}
          
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }} // Hidden canvas for processing
          ></canvas>
          
          {!cameraActive && !error && (
            <div className="camera-initializing">
              <FontAwesomeIcon icon={faSpinner} className="spin" size="2x" />
              <p>Initializing camera...</p>
            </div>
          )}
          
          {error && (
            <div className="scanner-error">
              <FontAwesomeIcon icon={faTimesCircle} size="2x" />
              <p>{error}</p>
              <button className="retry-button" onClick={startCamera}>
                Retry
              </button>
            </div>
          )}
          
          {scanResult && (
            <div className={`scan-result ${scanResult.success ? 'success' : 'error'}`}>
              <div className="result-icon">
                {scanResult.success ? (
                  <FontAwesomeIcon icon={faCheckCircle} size="3x" />
                ) : (
                  <FontAwesomeIcon icon={faTimesCircle} size="3x" />
                )}
              </div>
              <h2>{scanResult.success ? 'Check-In Successful' : 'Check-In Failed'}</h2>
              <p>{scanResult.message}</p>
              
              {scanResult.success && (
                <div className="attendee-details">
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{scanResult.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{scanResult.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">
                      {scanResult.attendeeType === 'single' ? 'Single Attendee' : 'Couple'}
                    </span>
                  </div>
                </div>
              )}
              
              <button className="reset-button" onClick={resetScanner}>
                <FontAwesomeIcon icon={faSync} /> Scan Another Code
              </button>
            </div>
          )}
        </div>
        
        <div className="scanner-controls">
          {!scanResult && (
            <>
              {!scanning ? (
                <button 
                  className="scan-button"
                  onClick={startScanning}
                  disabled={!cameraActive || processing}
                >
                  Start Scanning
                </button>
              ) : (
                <button 
                  className="stop-button"
                  onClick={stopScanning}
                  disabled={processing}
                >
                  Pause Scanning
                </button>
              )}
              
              <button 
                className="demo-scan-button"
                onClick={demoScan}
                disabled={processing || !cameraActive}
              >
                {processing ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="spin" /> Processing...
                  </>
                ) : (
                  'Demo Scan (Simulate)'
                )}
              </button>
            </>
          )}
        </div>
        
        <div className="scanner-instructions">
          <h3>Instructions</h3>
          <ol>
            <li>Click "Start Scanning" to activate the scanner</li>
            <li>Hold the QR code within the frame</li>
            <li>Hold steady until the code is recognized</li>
            <li>The system will verify the code and display the result</li>
          </ol>
          <p className="note">Note: For this demo, use the "Demo Scan" button to simulate scanning a QR code</p>
        </div>
      </div>
    </div>
  );
};

export default QrScanner;