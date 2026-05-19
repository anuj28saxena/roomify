// import { CheckCircle2, ImageIcon, UploadIcon } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';
// import type { ChangeEvent, DragEvent } from 'react';
// import { useOutletContext } from 'react-router';
// import {
//      PROGRESS_INCREMENT,
//      PROGRESS_INTERVAL_MS,
//      REDIRECT_DELAY_MS,
// } from '../lib/constants';

// type UploadProps = {
//      onComplete?: (base64Data: string) => void;
// };

// const Upload = ({ onComplete = () => {} }: UploadProps) => {
//      const [file, setFile] = useState<File | null>(null);   
//      const [isDragging, setIsDragging] = useState(false);  
//      const [progress, setProgress] = useState(0);
//      const intervalRef = useRef<number | null>(null);
//      const redirectTimeoutRef = useRef<number | null>(null);

//      const { isSignedIn }  = useOutletContext<AuthContext>();       

//      useEffect(() => {
//           return () => {
//                if (intervalRef.current) {
//                     window.clearInterval(intervalRef.current);
//                }

//                if (redirectTimeoutRef.current) {
//                     window.clearTimeout(redirectTimeoutRef.current);
//                }
//           };
//      }, []);

//      const processFile = (selectedFile: File) => {
//           if (!isSignedIn) {
//                return;
//           }

//           if (intervalRef.current) {
//                window.clearInterval(intervalRef.current);
//           }

//           if (redirectTimeoutRef.current) {
//                window.clearTimeout(redirectTimeoutRef.current);
//           }

//           const reader = new FileReader();

//           reader.onload = () => {
//                const base64Data = String(reader.result);

//                setFile(selectedFile);
//                setProgress(0);

//                intervalRef.current = window.setInterval(() => {
//                     setProgress((currentProgress) => {
//                          const nextProgress = Math.min(
//                               currentProgress + PROGRESS_INCREMENT,
//                               100
//                          );

//                          if (nextProgress === 100 && intervalRef.current) {
//                               window.clearInterval(intervalRef.current);
//                               intervalRef.current = null;

//                               redirectTimeoutRef.current = window.setTimeout(() => {
//                                    onComplete(base64Data);
//                               }, REDIRECT_DELAY_MS);
//                          }

//                          return nextProgress;
//                     });
//                }, PROGRESS_INTERVAL_MS);
//           };

//           reader.readAsDataURL(selectedFile);
//      };

//      const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//           if (!isSignedIn) {
//                return;
//           }

//           const selectedFile = event.target.files?.[0];

//           if (selectedFile) {
//                processFile(selectedFile);
//           }
//      };

//      const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
//           event.preventDefault();
//           event.stopPropagation();

//           if (!isSignedIn) {
//                return;
//           }

//           setIsDragging(true);
//      };

//      const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
//           event.preventDefault();
//           event.stopPropagation();

//           if (!isSignedIn) {
//                return;
//           }

//           setIsDragging(true);
//      };

//      const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
//           event.preventDefault();
//           event.stopPropagation();

//           if (!isSignedIn) {
//                return;
//           }

//           setIsDragging(false);
//      };

//      const handleDrop = (event: DragEvent<HTMLDivElement>) => {
//           event.preventDefault();
//           event.stopPropagation();
//           setIsDragging(false);

//           if (!isSignedIn) {
//                return;
//           }

//           const droppedFile = event.dataTransfer.files?.[0];

//           if (droppedFile) {
//                processFile(droppedFile);
//           }
//      };

//   return (
//     <div className='upload'>
//           {!file ? (
//                <div
//                     className={`dropzone ${isDragging ? 'is-dragging' : '' }`}
//                     onDragEnter={handleDragEnter}
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     onDrop={handleDrop}
//                >
//                     <input
//                          type="file"
//                          className='drop-input'
//                          accept='.jpg,.jpeg,.png'
//                          disabled={!isSignedIn}
//                          onChange={handleFileChange}
//                     />
//                     <div className='drop-content'>
//                          <div className='drop-icon'>
//                               <UploadIcon size={20} />
//                          </div>
//                          <p>
//                               {isSignedIn ? (
//                                    "Click to upload or drag and drop your floor plan here"
//                               ) : (
//                                    "Please sign in to upload your floor plan"
//                               )}
//                          </p>
//                          <p className='help'> Maximum file size: 50MB</p>
//                     </div>
//                </div>
//           ): (
//                <div className='upload-status'>
//                     <div className='status-content'>
//                          <div className='status-icon'>
//                               {progress === 100 ? (
//                                    <CheckCircle2 className="check" />
//                               ): (
//                                    <ImageIcon className="image" />
//                               ) }
//                          </div>

//                          <h3>{file.name}</h3>

//                          <div className='progress'>
//                               <div className='bar' style={{width: `${progress}%` }} />

//                               <p className='status-text'>
//                                    {progress < 100 ? `Analyzing Floor Plan...` : "Redirecting"}
//                               </p>

//                          </div>     

//                     </div>
//                </div>
//           )}
//     </div>
//   )
// }

// export default Upload


import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useOutletContext} from "react-router";
import {CheckCircle2, ImageIcon, UploadIcon} from "lucide-react";
import {PROGRESS_INCREMENT, REDIRECT_DELAY_MS, PROGRESS_INTERVAL_MS} from "../lib/constants";

interface UploadProps {
    onComplete?: (base64Data: string) => void;
}

const Upload = ({ onComplete }: UploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { isSignedIn } = useOutletContext<AuthContext>();

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, []);

    const processFile = useCallback((file: File) => {
        if (!isSignedIn) return;

        setFile(file);
        setProgress(0);

        const reader = new FileReader();
        reader.onerror = () => {
            setFile(null);
            setProgress(0);
        };
        reader.onloadend = () => {
            const base64Data = reader.result as string;

            intervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    const next = prev + PROGRESS_INCREMENT;
                    if (next >= 100) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        timeoutRef.current = setTimeout(() => {
                            onComplete?.(base64Data);
                            timeoutRef.current = null;
                        }, REDIRECT_DELAY_MS);
                        return 100;
                    }
                    return next;
                });
            }, PROGRESS_INTERVAL_MS);
        };
        reader.readAsDataURL(file);
    }, [isSignedIn, onComplete]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!isSignedIn) return;
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (!isSignedIn) return;

        const droppedFile = e.dataTransfer.files[0];
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (droppedFile && allowedTypes.includes(droppedFile.type)) {
            processFile(droppedFile);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isSignedIn) return;

        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    return (
        <div className="upload">
            {!file ? (
                <div
                    className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="drop-input"
                        accept=".jpg,.jpeg,.png,.webp"
                        disabled={!isSignedIn}
                        onChange={handleChange}
                    />

                    <div className="drop-content">
                        <div className="drop-icon">
                            <UploadIcon size={20} />
                        </div>
                        <p>
                            {isSignedIn ? (
                                "Click to upload or just drag and drop"
                            ): ("Sign in or sign up with Puter to upload")}
                        </p>
                        <p className="help">Maximum file size 50 MB.</p>
                    </div>
                </div>
            ) : (
                <div className="upload-status">
                    <div className="status-content">
                        <div className="status-icon">
                            {progress === 100 ? (
                                <CheckCircle2 className="check" />
                            ): (
                                <ImageIcon className="image" />
                            )}
                        </div>

                        <h3>{file.name}</h3>

                        <div className='progress'>
                            <div className="bar" style={{ width: `${progress}%` }} />

                            <p className="status-text">
                                {progress < 100 ? 'Analyzing Floor Plan...' : 'Redirecting...'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Upload