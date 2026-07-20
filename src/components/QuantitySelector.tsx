'use client'

interface QuantitySelectorProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  min?: number
  max?: number
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-gray-200">
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-etoi-primary hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <span className="w-10 h-9 flex items-center justify-center text-sm text-etoi-primary font-medium border-x border-gray-200">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-etoi-primary hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  )
}
