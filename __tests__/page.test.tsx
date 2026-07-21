import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

// Mock the useChat hook from ai-sdk
jest.mock('@ai-sdk/react', () => ({
  useChat: () => ({
    messages: [],
    input: '',
    handleInputChange: jest.fn(),
    handleSubmit: jest.fn(),
    setInput: jest.fn(),
    error: undefined,
    isLoading: false,
  }),
}))

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/NEXUS AI HEALTH INFORMATION ASSISTANT/i)
  })

  it('renders quick select buttons', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /Explain a symptom/i })
    expect(button).toBeInTheDocument()
  })
})
