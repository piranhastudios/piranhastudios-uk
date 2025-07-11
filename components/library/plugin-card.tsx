"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Download, ShoppingCart, Eye } from "lucide-react"

interface PluginCardProps {
  plugin: {
    id: number
    name: string
    description: string
    category: string
    icon: any
    price: string
    originalPrice: string | null
    downloads: string
    rating: number
    tags: string[]
    versions: string[]
    featured: boolean
    author: string
    lastUpdated: string
    version: string
    image?: string
  }
  onClick: () => void
  featured: boolean
}

export function PluginCard({ plugin, onClick, featured }: PluginCardProps) {
  const IconComponent = plugin.icon

  return (
    <div className="plugin-card group">
      {/* Image Container */}
      <div className="image-container" onClick={onClick}>
        {plugin.image ? (
          <img 
            src={plugin.image} 
            alt={plugin.name}
            className="plugin-image"
          />
        ) : (
          <div className="plugin-icon-wrapper">
            <IconComponent className="plugin-icon" />
          </div>
        )}
        {(featured || plugin.originalPrice) && (
          <div className="badge-wrapper">
            {featured && <Badge className="featured-badge">Featured</Badge>}
            {plugin.originalPrice && <Badge className="sale-badge">Sale</Badge>}
          </div>
        )}
      </div>

      {/* Title */}
      <div className="plugin-title">
        <span>{plugin.name}</span>
      </div>

      {/* Versions */}
      <div className="versions-section">
        <span className="versions-label">Versions</span>
        <ul className="versions-list">
          {plugin.versions.slice(0, 3).map((version, index) => (
            <li key={version} className="version-item">
              <button className={`version-button ${index === 0 ? "active" : ""}`}>{version}</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Action */}
      <div className="plugin-action">
        <div className="price-section">
          {plugin.originalPrice && <span className="original-price">{plugin.originalPrice}</span>}
          <span className="current-price">{plugin.price}</span>
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
      <div className="plugin-stats">
        <div className="stat-item">
          <Star className="stat-icon" />
          <span>{plugin.rating}</span>
        </div>
        <div className="stat-item">
          <Download className="stat-icon" />
          <span>{plugin.downloads}</span>
        </div>
      </div>

      <style jsx>{`
        .plugin-card {
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
          max-width: 16rem;
          background-color: var(--bg-card);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease-in-out;
          backdrop-filter: blur(10px);
        }

        .plugin-card:hover {
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
          height: 8rem;
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

        .plugin-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
        }

        .plugin-icon {
          width: 3rem;
          height: 3rem;
          color: var(--light);
          transition: all 0.3s ease-in-out;
        }

        .image-container:hover .plugin-icon {
          transform: scale(1.1);
        }

        .plugin-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0.5rem;
          transition: all 0.3s ease-in-out;
        }

        .image-container:hover .plugin-image {
          transform: scale(1.05);
        }

        .badge-wrapper {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          display: flex;
          gap: 0.25rem;
          z-index: 10;
        }

        .featured-badge,
        .sale-badge {
          background: rgba(185, 28, 28, 0.9);
          color: var(--light);
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .sale-badge {
          background: rgba(34, 197, 94, 0.9);
        }

        .plugin-title {
          overflow: hidden;
          width: 100%;
          font-size: 1rem;
          font-weight: 600;
          color: var(--light);
          text-transform: capitalize;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .versions-section {
          font-size: 0.75rem;
          color: var(--light);
        }

        .versions-label {
          opacity: 0.7;
        }

        .versions-list {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.25rem;
          flex-wrap: wrap;
        }

        .version-item {
          list-style: none;
        }

        .version-button {
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          background-color: var(--zinc-800);
          font-size: 0.625rem;
          color: var(--light);
          border: 2px solid var(--zinc-800);
          border-radius: 0.25rem;
          transition: all 0.3s ease-in-out;
          opacity: 0.7;
        }

        .version-button:hover {
          border: 2px solid rgba(252, 165, 165, 0.5);
          opacity: 1;
        }

        .version-button.active {
          background-color: var(--primary);
          border: 2px solid var(--primary-shadow);
          box-shadow: inset 0px 1px 4px var(--primary-shadow);
          opacity: 1;
        }

        .plugin-action {
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

        .plugin-stats {
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
