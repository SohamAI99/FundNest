import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DemoVideoModal = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);
  const modalRef = useRef(null);

  // Mock video data - in real implementation, this would be actual video URLs
  const videoData = {
    title: "FundNest Platform Demo",
    description: "See how FundNest connects startups with investors through AI-powered matching",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop",
    duration: "3:45",
    views: "12.5K"
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef?.current && !modalRef?.current?.contains(e?.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset video state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [isOpen]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In real implementation, control actual video playback
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e?.target?.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      setVolume(0);
    } else {
      setVolume(1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  // Simulate video progress (in real implementation, this would come from video events)
  useEffect(() => {
    let interval;
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 225) { // 3:45 in seconds
            setIsPlaying(false);
            return 225;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOpen]);

  // Set duration on mount
  useEffect(() => {
    setDuration(225); // 3:45 in seconds
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-4xl bg-card rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h3 className="text-xl font-bold text-foreground">{videoData?.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{videoData?.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Video Container */}
          <div className="relative aspect-video bg-black">
            {/* Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <img
                src={videoData?.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              
              {/* Play Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button
                    variant="default"
                    size="lg"
                    onClick={handlePlayPause}
                    className="w-20 h-20 rounded-full bg-white/90 text-primary hover:bg-white"
                  >
                    <Icon name="Play" size={32} />
                  </Button>
                </div>
              )}

              {/* Playing State */}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-white text-lg font-medium">
                    Demo Video Playing...
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center space-x-4">
                {/* Play/Pause */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
                </Button>

                {/* Progress Bar */}
                <div className="flex-1 flex items-center space-x-2">
                  <span className="text-white text-sm font-mono">
                    {formatTime(currentTime)}
                  </span>
                  <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <span className="text-white text-sm font-mono">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Volume Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMuteToggle}
                    className="text-white hover:bg-white/20"
                  >
                    <Icon name={isMuted || volume === 0 ? "VolumeX" : "Volume2"} size={20} />
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{videoData?.views} views</span>
                <span>•</span>
                <span>{videoData?.duration} duration</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Icon name="Share" size={16} className="mr-2" />
                  Share
                </Button>
                <Button variant="default" size="sm" onClick={onClose}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DemoVideoModal;