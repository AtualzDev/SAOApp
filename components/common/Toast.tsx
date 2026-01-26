import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 3000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="text-green-500" size={20} />,
        error: <XCircle className="text-red-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
        warning: <AlertTriangle className="text-yellow-500" size={20} />
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
        warning: 'bg-yellow-50 border-yellow-200'
    };

    const textColors = {
        success: 'text-green-800',
        error: 'text-red-800',
        info: 'text-blue-800',
        warning: 'text-yellow-800'
    };

    return (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 fade-in duration-300">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${bgColors[type]} min-w-[300px] max-w-md`}>
                {icons[type]}
                <p className={`flex-1 text-sm font-medium ${textColors[type]}`}>
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className={`p-1 rounded hover:bg-white/50 transition-colors ${textColors[type]}`}
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
