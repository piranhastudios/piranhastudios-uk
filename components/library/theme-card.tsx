"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Download, ShoppingCart, Eye, Smartphone } from "lucide-react"

interface ThemeCardProps {
  theme: {
    id: number
    name: string
    description: string
    category: string
    icon: any
    price: string
    originalPrice?: string | null
    downloads: string
    rating: number
    tags: string[]
    featured: boolean
    author: string
    lastUpdated: string
    version: string
    pages?: string[] // made optional
    components?: number // made optional
    responsive?: boolean // made optional
    darkMode?: boolean // made optional
  }
  onClick: () => void
  featured: boolean
}

export function ThemeCard({ theme, onClick, featured }: ThemeCardProps) {
  const IconComponent = theme.icon

  return (
    <div className="theme-card group">
      {/* Image Container */}
      <div className="image-container" onClick={onClick}>
        <div className="theme-icon-wrapper">
          <IconComponent className="theme-icon" />
        </div>
        {featured && <Badge className="featured-badge">Featured</Badge>}
        {theme.originalPrice && <Badge className="sale-badge">Sale</Badge>}
      </div>

      {/* Title */}
      <div className="theme-title">
        <span>{theme.name}</span>
      </div>

      {/* Theme Info */}
      <div className="theme-info">
        <div className="info-row">
          <span className="info-label">Pages:</span>
          <span className="info-value">{theme.pages?.length ?? 0}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Components:</span>
          <span className="info-value">{theme.components ?? 0}</span>
        </div>
      </div>

      {/* Features */}
      <div className="theme-features">
        <div className="feature-badges">
          {theme.responsive && (
            <Badge variant="outline" className="feature-badge">
              <Smartphone className="h-3 w-3 mr-1" />
              Responsive
            </Badge>
          )}
          {theme.darkMode && (
            <Badge variant="outline" className="feature-badge">
              Dark Mode
            </Badge>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="theme-action">
        <div className="price-section">
          {theme.originalPrice && <span className="original-price">{theme.originalPrice}</span>}
          <span className="current-price">{theme.price}</span>
        </div>
        <div className="action-buttons">
          <Button className="preview-button bg-transparent" variant="outline" size="sm" onClick={onClick}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button className="cart-button">
            <ShoppingCart className="cart-icon" />
            <span>Add to cart</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="theme-stats">
        <div className="stat-item">
          <Star className="stat-icon" />
          <span>{theme.rating}</span>
        </div>
        <div className="stat-item">
          <Download className="stat-icon" />
          <span>{theme.downloads}</span>
        </div>
      </div>

      <style jsx>{`
        .theme-card {
          --bg-card: #27272a;
          --primary: #b91c1c;
          --primary-800: #7f1d1d;
          --primary-shadow: #450a0a;
          --light: #e5e7eb;
          --zinc-800: #18181b;
          --bg-linear: linear-gradient(135deg, var(--primary) 0%, #dc2626 100%);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1rem;
          width: 100%;
          background-color: var(--bg-card);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease-in-out;
          backdrop-filter: blur(10px);
        }

        .theme-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(185, 28, 28, 0.2);
          border-color: rgba(252, 165, 165, 0.3);
        }

        .image-container {
          overflow: hidden;
          cursor: pointer;
          position: relative;
          z-index: 5;
          width: 100%;
          height: 10rem;
          background: linear-gradient(135deg, var(--primary-800) 0%, var(--primary) 100%);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease-in-out;
        }

        .image-container:hover {
          background: linear-gradient(135deg, var(--primary) 0%, #dc2626 100%);
        }

        .theme-icon-wrapper {
          position: relative;
          z-index: 2;
        }

        .theme-icon {
          width: 4rem;
          height: 4rem;
          color: var(--light);
          transition: all 0.3s ease-in-out;
        }

        .image-container:hover .theme-icon {
          transform: scale(1.1);
        }

        .featured-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(185, 28, 28, 0.9);
          color: var(--light);
          border: 1px solid rgba(252, 165, 165, 0.3);
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          z-index: 3;
        }

        .sale-badge {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          background: rgba(34, 197, 94, 0.9);
          color: white;
          border: 1px solid rgba(34, 197, 94, 0.3);
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          z-index: 3;
        }

        .theme-title {
          overflow: hidden;
          width: 100%;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--light);
          text-transform: capitalize;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .theme-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--light);
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .info-label {
          opacity: 0.7;
        }

        .info-value {
          font-weight: 500;
        }

        .theme-features {
          margin: 0.25rem 0;
        }

        .feature-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .feature-badge {
          font-size: 0.625rem;
          padding: 0.125rem 0.375rem;
          height: auto;
          border-color: rgba(252, 165, 165, 0.3);
          color: rgba(252, 165, 165, 0.8);
        }

        .theme-action {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .price-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .original-price {
          font-size: 1rem;
          font-weight: 500;
          color: #9ca3af;
          text-decoration: line-through;
        }

        .current-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--light);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .preview-button {
          flex-shrink: 0;
          width: 2.5rem;
          height: 2.5rem;
          padding: 0;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(252, 165, 165, 0.3);
          color: var(--light);
        }

        .preview-button:hover {
          background: rgba(252, 165, 165, 0.2);
          border-color: rgba(252, 165, 165, 0.5);
        }

        .cart-button {
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          width: 100%;
          background-image: var(--bg-linear);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--light);
          white-space: nowrap;
          border: 2px solid rgba(185, 28, 28, 0.5);
          border-radius: 0.5rem;
          box-shadow: inset 0 0 0.25rem 1px rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease-in-out;
        }

        .cart-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(185, 28, 28, 0.4), inset 0 0 0.25rem 1px rgba(255, 255, 255, 0.2);
        }

        .cart-icon {
          width: 1rem;
          height: 1rem;
        }

        .theme-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .stat-icon {
          width: 0.875rem;
          height: 0.875rem;
        }

        .stat-item:first-child .stat-icon {
          color: #fbbf24;
          fill: currentColor;
        }
      `}</style>
    </div>
  )
}
