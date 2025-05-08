document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const qrContent = document.getElementById('qr-content');
    const qrColor = document.getElementById('qr-color');
    const qrBg = document.getElementById('qr-bg');
    const qrSize = document.getElementById('qr-size');
    const sizeValue = document.getElementById('size-value');
    const qrError = document.getElementById('qr-error');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const qrCanvas = document.getElementById('qr-canvas');
    
    // QR Details
    const qrType = document.getElementById('qr-type');
    const qrDetailSize = document.getElementById('qr-detail-size');
    const qrData = document.getElementById('qr-data');
    const qrErrorLevel = document.getElementById('qr-error-level');
    
    // Update size value display
    qrSize.addEventListener('input', function() {
        sizeValue.textContent = this.value;
    });
    
    // Generate QR code
    function generateQR() {
        const content = qrContent.value.trim();
        if (!content) {
            alert('Please enter content for the QR code');
            return;
        }
        
        const options = {
            color: {
                dark: qrColor.value,
                light: qrBg.value
            },
            width: parseInt(qrSize.value),
            height: parseInt(qrSize.value),
            errorCorrectionLevel: qrError.value
        };
        
        QRCode.toCanvas(qrCanvas, content, options, function(error) {
            if (error) {
                console.error(error);
                alert('Error generating QR code');
            } else {
                // Update QR details
                qrType.textContent = content.startsWith('http') ? 'URL' : 'Text';
                qrDetailSize.textContent = `${qrSize.value}x${qrSize.value} px`;
                qrData.textContent = content;
                
                const errorLevels = {
                    'L': 'Low (7%)',
                    'M': 'Medium (15%)',
                    'Q': 'Quartile (25%)',
                    'H': 'High (30%)'
                };
                qrErrorLevel.textContent = errorLevels[qrError.value];
                
                // Enable download button
                downloadBtn.disabled = false;
            }
        });
    }
    
    // Download QR code
    function downloadQR() {

        const link = document.createElement('a');
        link.download = 'quantumqr-code.png';
        link.href = qrCanvas.toDataURL('image/png');
        link.click();
    }
    
    // Share QR code
    async function shareQR() {
        try {
            const dataUrl = qrCanvas.toDataURL('image/png');
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'quantumqr-code.png', { type: 'image/png' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Check out this QR code',
                    text: 'Generated with QuantumQR',
                    files: [file]
                });
            } else {
                // Fallback for browsers that don't support sharing files
                const shareData = {
                    title: 'QuantumQR Code',
                    text: 'Check out this QR code I created with QuantumQR',
                    url: dataUrl
                };
                
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    // Final fallback
                    alert('Sharing not supported in your browser. Download the QR code instead.');
                }
            }
        } catch (err) {
            console.error('Error sharing:', err);
            alert('Error sharing QR code');
        }
    }
    
    // Event listeners
    generateBtn.addEventListener('click', generateQR);
    downloadBtn.addEventListener('click', downloadQR);
    shareBtn.addEventListener('click', shareQR);
    
    // Generate initial QR code
    generateQR();
    
    // Responsive adjustments
    function handleResize() {
        if (window.innerWidth < 768) {
            const newSize = Math.min(250, window.innerWidth - 40);
            qrSize.value = newSize;
            sizeValue.textContent = newSize;
            generateQR();
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
});