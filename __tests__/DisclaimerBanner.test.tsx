import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import DisclaimerBanner from '../src/components/DisclaimerBanner'

describe('DisclaimerBanner', () => {
  it('renders the disclaimer text', () => {
    render(<DisclaimerBanner />)
    expect(screen.getByText(/informational purposes only/i)).toBeInTheDocument()
  })

  it('can be dismissed', () => {
    render(<DisclaimerBanner />)
    const button = screen.getByRole('button', { name: /close disclaimer/i })
    fireEvent.click(button)
    expect(screen.queryByText(/informational purposes only/i)).not.toBeInTheDocument()
  })
})
