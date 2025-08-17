// Create animated background particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// PDF Generation functionality
document.getElementById('pdfForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const filename = document.getElementById('filename').value;
    const content = document.getElementById('content').value;
    const fontSize = parseInt(document.getElementById('fontSize').value);
    const pageFormat = document.getElementById('pageFormat').value;
    
    // Show loading state
    const loadingEl = document.getElementById('loading');
    const generateBtn = document.querySelector('.btn-generate');
    const successMsg = document.getElementById('successMessage');
    const previewSection = document.getElementById('previewSection');
    
    loadingEl.style.display = 'block';
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    successMsg.style.display = 'none';
    previewSection.style.display = 'none';
    
    // Simulate processing time for better UX
    setTimeout(() => {
        generatePDF(filename, content, fontSize, pageFormat);
        
        // Show success state
        loadingEl.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate PDF Document';
        successMsg.style.display = 'block';
        
        // Show preview
        showPreview(filename, content);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);
        
    }, 1500);
});

function generatePDF(filename, content, fontSize, pageFormat) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', pageFormat);
    
    // Get page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margins = { top: 20, bottom: 20, left: 20, right: 20 };
    const contentWidth = pageWidth - margins.left - margins.right;
    
    // Set font for title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fontSize + 6);
    doc.text(filename, margins.left, 30);
    
    // Add a line under title
    doc.setLineWidth(0.5);
    doc.line(margins.left, 35, pageWidth - margins.right, 35);
    
    // Reset font for content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);
    
    // Calculate line height based on font size
    const lineHeight = fontSize * 0.35; // Convert pt to mm approximately
    const linesPerPage = Math.floor((pageHeight - 60 - margins.bottom) / lineHeight); // 60mm for title area
    
    // Split content into lines that fit the page width
    const lines = doc.splitTextToSize(content, contentWidth);
    
    let currentLine = 0;
    let currentPage = 1;
    let yPosition = 50; // Start position after title
    
    // Process each line and handle page breaks
    while (currentLine < lines.length) {
        // Check if we need a new page
        if (yPosition + lineHeight > pageHeight - margins.bottom) {
            // Add footer to current page
            addPageFooter(doc, currentPage, pageWidth, pageHeight, margins);
            
            // Create new page
            doc.addPage();
            currentPage++;
            yPosition = margins.top + 10; // Reset Y position for new page
        }
        
        // Add the line to current page
        doc.text(lines[currentLine], margins.left, yPosition);
        yPosition += lineHeight;
        currentLine++;
    }
    
    // Add footer to the last page and update all page numbers
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addPageFooter(doc, i, pageWidth, pageHeight, margins, totalPages);
    }
    
    // Save the PDF
    doc.save(filename + '.pdf');
}

function addPageFooter(doc, pageNum, pageWidth, pageHeight, margins, totalPages = null) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Add page number
    const pageText = totalPages ? `Page ${pageNum} of ${totalPages}` : `Page ${pageNum}`;
    doc.text(pageText, margins.left, pageHeight - margins.bottom + 5);
    
    // Add date on the right
    const dateText = new Date().toLocaleDateString();
    const dateWidth = doc.getTextWidth(dateText);
    doc.text(dateText, pageWidth - margins.right - dateWidth, pageHeight - margins.bottom + 5);
    
    // Add a subtle line above footer
    doc.setLineWidth(0.2);
    doc.setDrawColor(200, 200, 200);
    doc.line(margins.left, pageHeight - margins.bottom - 2, pageWidth - margins.right, pageHeight - margins.bottom - 2);
}

function showPreview(title, content) {
    const previewSection = document.getElementById('previewSection');
    const previewContent = document.getElementById('previewContent');
    
    previewContent.innerHTML = `
        <h2 style="color: #333; margin-bottom: 20px; font-size: 1.5rem;">${title}</h2>
        <hr style="margin-bottom: 20px; border: none; border-top: 2px solid #eee;">
        <div style="white-space: pre-wrap; font-size: 1rem; line-height: 1.8;">${content}</div>
    `;
    
    previewSection.style.display = 'block';
}

// Add some interactive effects
document.querySelectorAll('input, textarea, select').forEach(element => {
    element.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    element.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});