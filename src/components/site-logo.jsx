import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function SiteLogo({ domain, size = 32, alt = 'Website logo' }) {
    const [imageError, setImageError] = useState(false);
    const [currentSourceIndex, setCurrentSourceIndex] = useState(0);

    const logoSources = [
        `https://${domain}/favicon.ico`,
        `https://${domain}/favicon.png`,
        `https://unavatar.io/${domain}?size=${size}`,
    ];

    const currentUrl = logoSources[currentSourceIndex];

    const handleError = () => {
        if (currentSourceIndex < logoSources.length - 1) {
            setCurrentSourceIndex(currentSourceIndex + 1);
        } else {
            setImageError(true);
        }
    };

    return (
        <div className="flex items-center justify-center bg-secondary shrink-0" style={{ width: size, height: size }}>
            {!imageError ? (
                <img
                    src={currentUrl}
                    alt={alt}
                    className="w-full h-full object-cover"
                    onError={handleError}
                />
            ) : (
                <Globe size={size * 0.6} className="text-muted-foreground" strokeWidth={1.5} />
            )}
        </div>
    );
}