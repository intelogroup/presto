import React from 'react'
import './SlideDetails.css'

const SlideDetails = ({ slideData, onGenerate }) => {
  if (!slideData || !slideData.slides) {
    return null
  }

  const renderSlideContent = (slide) => {
    const { layout, textContent, imageAssets, designNotes } = slide

    return (
      <div className="slide-detail-card">
        <div className="slide-header">
          <h3>Slide {slide.slideNumber}: {slide.title}</h3>
          <span className="layout-badge">{layout}</span>
        </div>
        
        <div className="slide-content-grid">
          {/* Text Content Section */}
          <div className="text-content-section">
            <h4>📝 Text Content</h4>
            {textContent.mainText && (
              <div className="main-text">
                <strong>Main Text:</strong>
                <p>{textContent.mainText}</p>
              </div>
            )}
            
            {textContent.bullets && textContent.bullets.length > 0 && (
              <div className="bullets-section">
                <strong>Bullet Points:</strong>
                <ul>
                  {textContent.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {textContent.textBoxes && textContent.textBoxes.length > 0 && (
              <div className="text-boxes-section">
                <strong>Text Boxes:</strong>
                {textContent.textBoxes.map((box, idx) => (
                  <div key={idx} className="text-box">
                    <span className="box-number">Box {idx + 1}:</span> {box}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Image Assets Section */}
          <div className="image-assets-section">
            <h4>🖼️ Image Assets</h4>
            {imageAssets.mainImage && (
              <div className="asset-item">
                <strong>Main Image:</strong>
                <p>{imageAssets.mainImage}</p>
              </div>
            )}
            
            {imageAssets.stackedImages && imageAssets.stackedImages.length > 0 && (
              <div className="asset-item">
                <strong>Stacked Images:</strong>
                <ul>
                  {imageAssets.stackedImages.map((img, idx) => (
                    <li key={idx}>{img}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {imageAssets.icons && imageAssets.icons.length > 0 && (
              <div className="asset-item">
                <strong>Icons:</strong>
                <ul>
                  {imageAssets.icons.map((icon, idx) => (
                    <li key={idx}>{icon}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {designNotes && (
          <div className="design-notes">
            <h4>🎨 Design Notes</h4>
            <p>{designNotes}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="slide-details-container">
      <div className="slide-details-header">
        <h2>📋 Detailed Slide Content</h2>
        <p className="slide-details-subtitle">{slideData.title}</p>
      </div>
      
      <div className="slides-list">
        {slideData.slides.map((slide, index) => (
          <div key={index}>
            {renderSlideContent(slide)}
          </div>
        ))}
      </div>
      
      <div className="slide-details-actions">
        <button 
          className="generate-btn"
          onClick={onGenerate}
        >
          🚀 Generate Presentation with These Details
        </button>
      </div>
    </div>
  )
}

export default SlideDetails