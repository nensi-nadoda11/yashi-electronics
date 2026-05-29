import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { buttonStyles } from '../components/ui/button-styles'

export function NotFoundPage() {
  return (
    <Container className="py-16">
      <EmptyState
        icon={Compass}
        title="This page could not be found"
        description="The route exists in the customer app shell, but the requested page is not available. Head back to the storefront and continue exploring."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/" className={buttonStyles('secondary', 'md')}>
              Go to Home
            </Link>
            <Link to="/products" className={buttonStyles('outline', 'md')}>
              Browse Products
            </Link>
          </div>
        }
      />
    </Container>
  )
}
