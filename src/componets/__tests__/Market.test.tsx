import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Market from '../Market'
import { clearCachedProducts } from '../../utils/marketCache'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

vi.mock('../../assets/market/marketTitle.png', () => ({ default: 'marketTitle.png' }))
vi.mock('../../assets/market/descriptBox.png', () => ({ default: 'descriptBox.png' }))
vi.mock('../../assets/market/viewCart.png', () => ({ default: 'viewCart.png' }))
vi.mock('../../assets/market/sold-badge.webp', () => ({ default: 'sold-badge.webp' }))
vi.mock('../../assets/market/addToCart2.png', () => ({ default: 'addToCart2.png' }))

import axios from 'axios'

const mockProducts = [
  { id: '1', title: 'Ring A', price: 50, image: 'https://test.com/a.webp', size: '7', sku: 'SKU-A', available: true },
  { id: '2', title: 'Ring B', price: 75, image: 'https://test.com/b.webp', size: '9', sku: 'SKU-B', available: false },
]

const renderMarket = () =>
  render(
    <MemoryRouter>
      <Market />
    </MemoryRouter>
  )

describe('Market', () => {
  beforeEach(() => {
    clearCachedProducts()
    vi.clearAllMocks()
  })

  it('shows loading message initially', () => {
    axios.get.mockReturnValue(new Promise(() => {}))
    renderMarket()
    expect(screen.getByText('Loading, please wait...')).toBeInTheDocument()
  })

  it('renders products after fetch', async () => {
    axios.get.mockResolvedValue({ data: mockProducts })
    renderMarket()
    await waitFor(() => {
      expect(screen.getByText('Ring A')).toBeInTheDocument()
    })
    expect(screen.getByText('Ring B')).toBeInTheDocument()
  })

  it('renders correct number of item cards', async () => {
    axios.get.mockResolvedValue({ data: mockProducts })
    renderMarket()
    await waitFor(() => {
      expect(screen.getAllByRole('link').length).toBeGreaterThanOrEqual(2)
    })
  })

  it('calls the correct API endpoint', async () => {
    axios.get.mockResolvedValue({ data: mockProducts })
    renderMarket()
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/products'))
    })
  })

  it('shows loading then products disappear', async () => {
    axios.get.mockResolvedValue({ data: mockProducts })
    renderMarket()
    expect(screen.getByText('Loading, please wait...')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Loading, please wait...')).not.toBeInTheDocument()
    })
  })

  it('renders view cart button', async () => {
    axios.get.mockResolvedValue({ data: [] })
    renderMarket()
    await waitFor(() => {
      expect(screen.queryByText('Loading, please wait...')).not.toBeInTheDocument()
    })
    expect(document.querySelector('.view-cart')).toBeInTheDocument()
  })
})
