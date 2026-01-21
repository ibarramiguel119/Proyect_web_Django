import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

test('renders app', () => {
  render(<App />);
});
